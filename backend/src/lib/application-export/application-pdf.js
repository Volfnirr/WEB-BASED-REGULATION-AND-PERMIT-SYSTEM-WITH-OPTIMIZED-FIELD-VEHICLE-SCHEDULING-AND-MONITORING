import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, PDFName, rgb } from "pdf-lib";
import { applicationTemplateData } from "./application-document.js";
import { PDF_LAYOUTS, pdfFieldName, pdfChoiceName } from "./pdf-layouts.js";
import { PDF_ALIGNMENT } from "./pdf-alignment.js";
import { ApplicationCopyError } from "../../services/applications/application-copy.service.js";

const directory = path.dirname(fileURLToPath(import.meta.url));
const templates = new Map();
const MAX_TEXT_LENGTH = 20000;
const nameCenters = {
  agricultural: { lastName: 182.38, firstName: 316.54, middleName: 492.71 },
  residential: { lastName: 134.64, firstName: 300.04, middleName: 493.88 },
};

function cleanText(value) {
  return String(value ?? "N/A")
    .normalize("NFC")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fitAnswer(value, boxes, font, key) {
  const text = cleanText(value);
  if (text.length > MAX_TEXT_LENGTH)
    throw new ApplicationCopyError(
      422,
      `The ${key} answer is too long for PDF export. Use Word instead.`,
    );
  try {
    font.encodeText(text);
  } catch {
    throw new ApplicationCopyError(
      422,
      `The ${key} answer contains characters unsupported by the PDF font. Use Word instead.`,
    );
  }
  for (let size = 10; size >= 8; size -= 0.25) {
    let rest = text;
    const lines = [];
    for (const [, , , width] of boxes) {
      if (font.widthOfTextAtSize(rest, size) <= width - 4) {
        lines.push(rest);
        rest = "";
        continue;
      }
      let split = rest.lastIndexOf(" ");
      while (
        split > 0 &&
        font.widthOfTextAtSize(rest.slice(0, split), size) > width - 4
      )
        split = rest.lastIndexOf(" ", split - 1);
      if (split <= 0) break;
      lines.push(rest.slice(0, split));
      rest = rest.slice(split + 1).trim();
    }
    if (!rest && lines.length === boxes.length) return { lines, size };
  }
  throw new ApplicationCopyError(
    422,
    `The ${key} answer does not fit the unchanged PDF layout. Use Word instead.`,
  );
}

export async function applicationPdf(copy) {
  if (!Object.hasOwn(PDF_LAYOUTS, copy.type))
    throw new ApplicationCopyError(
      422,
      "PDF export is unavailable for this application type.",
    );
  const layout = PDF_LAYOUTS[copy.type];
  const alignment = PDF_ALIGNMENT[copy.type];
  if (!alignment || alignment.text.length !== layout.fields.length)
    throw new ApplicationCopyError(
      503,
      "The PDF alignment does not match its field mapping.",
    );
  let bytes = templates.get(copy.type);
  if (!bytes) {
    try {
      bytes = await readFile(
        path.join(directory, "pdf-templates", `${copy.type}.pdf`),
      );
    } catch {
      throw new ApplicationCopyError(
        503,
        "The PDF template is unavailable. Contact your administrator.",
      );
    }
    templates.set(copy.type, bytes);
  }
  const document = await PDFDocument.load(bytes);
  if (document.getPageCount() !== layout.pages)
    throw new ApplicationCopyError(
      503,
      "The PDF template does not match its field mapping.",
    );
  const form = document.getForm();
  const font = await document.embedFont(
    copy.type === "agricultural"
      ? StandardFonts.Helvetica
      : StandardFonts.TimesRoman,
  );
  const data = applicationTemplateData(copy);
  data.completeAddress =
    ["fullAddress", "barangay", "municipality", "province"]
      .map((key) => data[key])
      .filter((value) => value && value !== "N/A")
      .join(", ") || "N/A";
  try {
    const answers = [];
    const marks = [];
    layout.fields.forEach(({ key, boxes }, index) => {
      const { lines, size } = fitAnswer(data[key], boxes, font, key);
      boxes.forEach(([page, x, , width], boxIndex) => {
        const baseline = alignment.text[index]?.[boxIndex];
        if (!Number.isFinite(baseline))
          throw new Error("Missing PDF baseline.");
        const field = form.getTextField(pdfFieldName(index, boxIndex));
        field.setText("");
        field.updateAppearances(font);
        const text = lines[boxIndex];
        const center = nameCenters[copy.type]?.[key];
        let answerX = x + 1;
        if (center !== undefined) {
          const textWidth = font.widthOfTextAtSize(text, size);
          answerX = Math.max(
            x + 1,
            Math.min(center - textWidth / 2, x + width - 1 - textWidth),
          );
        }
        answers.push({ page, x: answerX, baseline, text, size });
      });
    });
    for (const choice of layout.choices) {
      const selected = data[choice.key];
      if (selected !== "N/A" && !Object.hasOwn(choice.labels, selected))
        throw new ApplicationCopyError(
          422,
          `The recorded ${choice.key} has no choice in this PDF. Use Word or contact your administrator.`,
        );
      for (const label of Object.keys(choice.labels)) {
        const field = form.getTextField(pdfChoiceName(choice.key, label));
        field.setText("");
        field.updateAppearances(font);
        if (selected === label) {
          const bounds = alignment.choices[choice.key]?.[label];
          if (!bounds || bounds.length !== 4)
            throw new Error("Missing checkbox bounds.");
          marks.push({ page: choice.page, bounds });
        }
      }
    }
    form.flatten({ updateFieldAppearances: false });
    for (const page of document.getPages()) {
      const annotations = page.node.Annots();
      if (!annotations) continue;
      for (let i = annotations.size() - 1; i >= 0; i--) {
        const annotation = document.context.lookup(annotations.get(i));
        if (
          !annotation ||
          annotation.get(PDFName.of("Subtype"))?.toString() === "/Widget"
        )
          annotations.remove(i);
      }
    }
    document.catalog.delete(PDFName.of("AcroForm"));
    for (const answer of answers) {
      if (!answer.text) continue;
      const page = document.getPage(answer.page);
      page.drawText(answer.text, {
        x: answer.x,
        y: page.getHeight() - answer.baseline,
        font,
        size: answer.size,
        color: rgb(0, 0, 0),
      });
    }
    for (const mark of marks) {
      const page = document.getPage(mark.page);
      const [x, top, width, height] = mark.bounds;
      page.drawLine({
        start: {
          x: x + width * 0.22,
          y: page.getHeight() - top - height * 0.78,
        },
        end: { x: x + width * 0.78, y: page.getHeight() - top - height * 0.22 },
        thickness: 0.65,
        color: rgb(0, 0, 0),
      });
    }
    return Buffer.from(await document.save());
  } catch (error) {
    if (error instanceof ApplicationCopyError) throw error;
    throw new ApplicationCopyError(
      503,
      "The PDF template could not be filled. Contact your administrator.",
    );
  }
}
