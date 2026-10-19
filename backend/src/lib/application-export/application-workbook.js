import ExcelJS from "exceljs";
import JSZip from "jszip";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const directory = path.dirname(fileURLToPath(import.meta.url));
export const OFFICE_HEADER = [
  "Republic of the Philippines",
  "DEPARTMENT OF ENVIRONMENT AND NATURAL RESOURCES",
  "PROVINCIAL ENVIRONMENT AND NATURAL RESOURCES OFFICE",
  "San Antonio, Guagua, Pampanga",
];
const ink = { argb: "FF000000" };
const font = (bold = false, size = 10) => ({
  name: "Arial",
  size,
  bold,
  color: ink,
});
const text = (value) =>
  value === null || value === undefined || value === ""
    ? "Not provided"
    : typeof value === "boolean"
      ? value
        ? "Yes"
        : "No"
      : String(value);
function lineCount(value, width) {
  return String(value)
    .split("\n")
    .reduce(
      (sum, line) => sum + Math.max(1, Math.ceil(line.length / width)),
      0,
    );
}
function cellWidth(sheet, cell) {
  const merge = sheet.model.merges.find((range) => {
    const first = range.split(":")[0];
    return first === cell.address;
  });
  const end = merge ? sheet.getCell(merge.split(":")[1]).col : cell.col;
  let points = 0;
  for (let column = cell.col; column <= end; column++)
    points += ((sheet.getColumn(column).width || 8.43) * 7 + 5) * 0.75;
  return Math.max(8, points - 12);
}
function linesInCell(sheet, cell, raw) {
  const available = cellWidth(sheet, cell),
    size = cell.font?.size || 11;
  let lines = 1,
    used = 0;
  for (const character of raw) {
    if (character === "\n") {
      lines++;
      used = 0;
      continue;
    }
    const factor = /[MW@%]/.test(character)
      ? 0.95
      : /[ilI.,:;'!| ]/.test(character)
        ? 0.3
        : /[A-Z]/.test(character)
          ? 0.72
          : /[^\x00-\x7F]/.test(character)
            ? 1
            : 0.58;
    const points = size * factor * (cell.font?.bold ? 1.04 : 1);
    if (used && used + points > available) {
      lines++;
      used = 0;
    }
    used += points;
  }
  return lines;
}
function textChunks(raw, width, maxLines) {
  const chunks = [];
  let buffer = "",
    column = 0,
    lines = 1;
  for (const character of raw) {
    const newLine = character === "\n" || column >= width;
    if (newLine && lines >= maxLines && buffer) {
      chunks.push(buffer);
      buffer = "";
      column = 0;
      lines = 1;
    } else if (newLine) {
      lines++;
      column = 0;
    }
    buffer += character;
    if (character !== "\n") column++;
  }
  if (buffer) chunks.push(buffer);
  return chunks;
}
function writeValue(cell, field) {
  cell.value = text(field.value);
  cell.numFmt = "@";
  if (field.value === null || field.value === undefined || field.value === "")
    return;
  if (["decimal", "integer"].includes(field.type)) {
    cell.value = Number(field.value);
    cell.numFmt = field.type === "decimal" ? "#,##0.00" : "#,##0";
  } else if (["date", "datetime"].includes(field.type)) {
    cell.value = new Date(
      new Date(field.value).getTime() +
        (field.type === "datetime" ? 8 * 3600000 : 0),
    );
    cell.numFmt =
      field.type === "date" ? "mmm d, yyyy" : "mmm d, yyyy h:mm AM/PM";
  }
}
function applicationFields(copy) {
  const submitted = copy.sections.flatMap((section) => section.fields);
  const applicantName = ["firstName", "middleName", "lastName", "extensionName"]
    .map((key) => submitted.find((field) => field.key === key)?.value)
    .filter((value) => typeof value === "string" && value.trim())
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return [
    { key: "referenceNo", label: "Reference number", value: copy.referenceNo },
    { key: "status", label: "Status", value: copy.status },
    {
      key: "submittedAt",
      label: "Submitted (Asia/Manila)",
      type: "datetime",
      value: copy.submittedAt,
    },
    {
      key: "reviewedAt",
      label: "Reviewed (Asia/Manila)",
      type: "datetime",
      value: copy.reviewedAt,
    },
    ...submitted,
    { key: "remarks", label: "Remarks", value: copy.remarks },
    {
      key: "applicantName",
      label: "Applicant name",
      value: applicantName || null,
    },
  ];
}
function mappedCell(sheet, address, key) {
  if (
    typeof address !== "string" ||
    !/^[A-Z]{1,3}[1-9][0-9]{0,6}$/.test(address)
  )
    throw new Error("Invalid XLSX cell mapping for " + key + ".");
  const cell = sheet.getCell(address);
  if (cell.row > 1048576 || cell.col > 16384 || cell.master.address !== address)
    throw new Error("Map " + key + " to the top-left cell of its merged box.");
  return cell;
}
function continuationSheet(workbook, source, copy, overflow, signing) {
  const sheet = workbook.addWorksheet("Additional information", {
    views: [{ showGridLines: false }],
  });
  sheet.columns = Array.from({ length: 12 }, () => ({ width: 8.5 }));
  sheet.pageSetup = structuredClone(source.pageSetup);
  sheet.pageSetup.printTitlesRow = "1:7";
  sheet.pageSetup.firstPageNumber = undefined;
  sheet.pageSetup.useFirstPageNumber = false;
  sheet.headerFooter = structuredClone(source.headerFooter);
  for (let row = 1; row <= 7; row++) {
    sheet.mergeCells(row, 1, row, 12);
    sheet.getCell(row, 1).value = source.getCell(row, 1).value;
    sheet.getCell(row, 1).style = structuredClone(source.getCell(row, 1).style);
    sheet.getRow(row).height = source.getRow(row).height;
  }
  let row = 9,
    used = 0;
  const budget = 560;
  function reserve(points) {
    if (used && used + points > budget) {
      sheet.getRow(row - 1).addPageBreak();
      used = 0;
    }
    used += points;
  }
  for (const field of overflow) {
    const raw = text(field.value),
      width = 50;
    const chunks = textChunks(raw, width, 10);
    for (let part = 0; part < chunks.length; part++) {
      const chunk = chunks[part];
      const height = Math.max(24, lineCount(chunk, width) * 13 + 8);
      reserve(height + 23);
      sheet.mergeCells(row, 1, row, 12);
      const label = sheet.getCell(row, 1);
      label.value =
        field.label + (part ? " (continued)" : "") + " — " + copy.referenceNo;
      label.font = font(true);
      label.alignment = { wrapText: true, vertical: "middle" };
      sheet.getRow(row++).height = 23;
      sheet.mergeCells(row, 1, row, 12);
      const entry = sheet.getCell(row, 1);
      entry.value = chunk;
      entry.numFmt = "@";
      entry.font = font(false, 11);
      entry.alignment = { wrapText: true, vertical: "top" };
      sheet.getRow(row++).height = height;
    }
  }
  reserve(30 + signing.height + 16);
  sheet.getRow(row++).height = 30;
  sheet.mergeCells(row, 7, row, 12);
  const name = sheet.getCell(row, 7);
  name.value = signing.name.value;
  Object.assign(name.style, structuredClone(signing.name.style));
  sheet.getRow(row++).height = signing.height;
  sheet.mergeCells(row, 7, row, 12);
  const caption = sheet.getCell(row, 7);
  caption.value = signing.caption.value;
  Object.assign(caption.style, structuredClone(signing.caption.style));
  sheet.getRow(row++).height = 16;
  sheet.pageSetup.printArea = "A1:L" + (row - 1);
  return sheet;
}
// Public helper also allows validating a remapped copy without editing real files.
export function fillApplicationWorkbook(workbook, copy, mapping) {
  if (!mapping?.fields)
    throw new Error("XLSX cell mappings are missing for " + copy.type + ".");
  const sheet = workbook.getWorksheet(mapping.worksheet);
  if (!sheet)
    throw new Error("Mapped XLSX worksheet is missing: " + mapping.worksheet);
  if (sheet.pageSetup.fitToPage) sheet.pageSetup.scale = undefined;
  const fields = applicationFields(copy),
    occupied = new Set();
  const destinations = fields.map((field) => {
    if (!field.key || !Object.hasOwn(mapping.fields, field.key))
      throw new Error(
        "Missing XLSX mapping for " + (field.key || field.label) + ".",
      );
    const cell = mappedCell(sheet, mapping.fields[field.key], field.key);
    if (occupied.has(cell.address))
      throw new Error("Duplicate XLSX destination: " + cell.address);
    if (cell.value !== null && cell.value !== undefined && cell.value !== "")
      throw new Error(
        "XLSX mapping destination must be blank: " +
          field.key +
          " at " +
          cell.address,
      );
    occupied.add(cell.address);
    return { field, cell };
  });
  const caption = mappedCell(
    sheet,
    mapping.signature?.captionCell,
    "signature caption",
  );
  if (occupied.has(caption.address))
    throw new Error("Signature caption overlaps a field mapping.");
  const maxLines = mapping.maxCellLines ?? 8;
  if (!Number.isInteger(maxLines) || maxLines < 1 || maxLines > 20)
    throw new Error("maxCellLines must be between 1 and 20.");
  const overflow = [];
  for (const { field, cell } of destinations) {
    const raw = text(field.value),
      count = linesInCell(sheet, cell, raw);
    if (
      !["date", "datetime", "integer", "decimal", "boolean"].includes(
        field.type,
      ) &&
      count > maxLines &&
      field.key !== "applicantName"
    ) {
      cell.value = "See Additional information";
      cell.numFmt = "@";
      overflow.push(field);
    } else writeValue(cell, field);
    cell.alignment = { ...cell.alignment, wrapText: true };
    const shownLines = linesInCell(
      sheet,
      cell,
      typeof cell.value === "string" ? cell.value : raw,
    );
    const needed = shownLines * ((cell.font?.size || 11) + 2) + 4;
    sheet.getRow(cell.row).height = Math.min(
      400,
      Math.max(sheet.getRow(cell.row).height || 20, needed),
    );
  }
  if (overflow.length) {
    const name = mappedCell(
      sheet,
      mapping.fields.applicantName,
      "applicantName",
    );
    const signing = {
      name: { value: name.value, style: structuredClone(name.style) },
      caption: { value: caption.value, style: structuredClone(caption.style) },
      height: sheet.getRow(name.row).height,
    };
    name.value = null;
    name.border = {};
    caption.value = null;
    continuationSheet(workbook, sheet, copy, overflow, signing);
  }
  workbook.creator = "PENRO Application System";
  workbook.created = new Date();
  return workbook;
}
export async function applicationWorkbook(copy) {
  const mappings = JSON.parse(
    await readFile(path.join(directory, "cell-mappings.json"), "utf8"),
  );
  if (!Object.hasOwn(mappings, copy.type) || !/^[a-z-]+$/.test(copy.type))
    throw new Error("Unsupported application template.");
  const workbook = new ExcelJS.Workbook();
  const bytes = await readFile(
    path.join(directory, "templates", copy.type + ".xlsx"),
  );
  await workbook.xlsx.load(bytes);
  // ExcelJS does not restore manual row breaks on read. Preserve the template's breaks.
  const archive = await JSZip.loadAsync(bytes);
  const bookXml = await archive.file("xl/workbook.xml").async("string");
  const relationXml = await archive
    .file("xl/_rels/workbook.xml.rels")
    .async("string");
  const escapedName = mappings[copy.type].worksheet
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const sheetTag = [...bookXml.matchAll(/<sheet\b[^>]*>/g)]
    .map((match) => match[0])
    .find((tag) => tag.includes('name="' + escapedName + '"'));
  const id = sheetTag?.match(/r:id="([^"]+)"/)?.[1];
  const relation = [...relationXml.matchAll(/<Relationship\b[^>]*>/g)]
    .map((match) => match[0])
    .find((tag) => tag.includes('Id="' + id + '"'));
  const target = relation?.match(/Target="([^"]+)"/)?.[1];
  if (target) {
    const xmlPath = target.startsWith("/")
      ? target.slice(1)
      : path.posix.normalize("xl/" + target);
    const xml = await archive.file(xmlPath)?.async("string");
    const breaks =
      xml?.match(/<rowBreaks\b[^>]*>([\s\S]*?)<\/rowBreaks>/)?.[1] || "";
    for (const match of breaks.matchAll(/<brk\b[^>]*\bid="(\d+)"/g))
      workbook
        .getWorksheet(mappings[copy.type].worksheet)
        .getRow(Number(match[1]))
        .addPageBreak();
  }
  return fillApplicationWorkbook(workbook, copy, mappings[copy.type]);
}
export function safeApplicationFilename(copy) {
  const safe =
    String(copy.referenceNo)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 100) || "application";
  return copy.type + "-" + safe + ".xlsx";
}
