import JSZip from "jszip";
import {
  ApplicationCopyError,
  parseApplicationIds,
} from "../../services/applications/application-copy.service.js";
import {
  applicationDocument,
  safeApplicationFilename,
} from "../../lib/application-export/application-document.js";
export async function buildApplicationDownload(copies) {
  if (copies.length === 1) {
    const buffer = await applicationDocument(copies[0]);
    return {
      buffer,
      filename: safeApplicationFilename(copies[0]),
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  }
  const zip = new JSZip();
  for (const copy of copies) {
    zip.file(safeApplicationFilename(copy), await applicationDocument(copy));
  }
  return {
    buffer: await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
    }),
    filename: "approved-applications.zip",
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
  async function download(ids, req, res) {
    try {
      const file = await service.exportCopies(ids, req.user, build);
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
      return download([req.params.id], req, res);
    },
    bulk(req, res) {
      try {
        return download(parseApplicationIds(req.body?.ids), req, res);
      } catch (error) {
        return failure(error, res);
      }
    },
  };
}
