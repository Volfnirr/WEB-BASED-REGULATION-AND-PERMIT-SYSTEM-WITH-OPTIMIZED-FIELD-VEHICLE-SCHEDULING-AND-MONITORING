import JSZip from "jszip";
import {
  ApplicationCopyError,
  parseApplicationIds,
} from "../../services/applications/application-copy.service.js";
import {
  applicationDocument,
  safeApplicationFilename,
} from "../../lib/application-export/application-document.js";
import { applicationPdf } from "../../lib/application-export/application-pdf.js";

export function parseExportFormat(value = "pdf") {
  if (
    typeof value !== "string" ||
    !["docx", "pdf"].includes(value.toLowerCase())
  ) {
    throw new ApplicationCopyError(400, "Choose Word (docx) or PDF (pdf).");
  }
  return value.toLowerCase();
}

export async function buildApplicationDownload(
  copies,
  requestedFormat = "pdf",
) {
  const format = parseExportFormat(requestedFormat);
  const documents = [];
  for (const copy of copies)
    documents.push(
      await (format === "pdf"
        ? applicationPdf(copy)
        : applicationDocument(copy)),
    );
  const buffers = documents;
  const filename = (copy) =>
    safeApplicationFilename(copy).replace(/\.docx$/, "." + format);
  if (copies.length === 1) {
    return {
      buffer: buffers[0],
      filename: filename(copies[0]),
      mime:
        format === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  }
  const zip = new JSZip();
  copies.forEach((copy, index) => zip.file(filename(copy), buffers[index]));
  return {
    buffer: await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
    }),
    filename: `applications-${format}.zip`,
    mime: "application/zip",
  };
}
export function createApplicationCopyController(
  service,
  build = buildApplicationDownload,
) {
  function failure(error, res) {
    if (error instanceof ApplicationCopyError)
      return res.status(error.status).json({
        message: error.message,
      });
    console.error("Application copy failed:", error.code || error.name);
    return res.status(500).json({
      message: "Could not prepare your application. Please try again.",
    });
  }
  async function download(ids, req, res, requestedFormat) {
    try {
      const format = parseExportFormat(requestedFormat);
      const file = await service.exportCopies(ids, req.user, (copies) =>
        build(copies, format),
      );
      res.setHeader("Content-Type", file.mime);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.filename}"`,
      );
      return res.send(file.buffer);
    } catch (error) {
      return failure(error, res);
    }
  }
  return {
    async detail(req, res) {
      try {
        return res.json({
          application: await service.detail(req.params.id, req.user),
        });
      } catch (error) {
        return failure(error, res);
      }
    },
    single(req, res) {
      return download([req.params.id], req, res, req.query?.format);
    },
    bulk(req, res) {
      try {
        return download(
          parseApplicationIds(req.body?.ids),
          req,
          res,
          req.body?.format,
        );
      } catch (error) {
        return failure(error, res);
      }
    },
  };
}
