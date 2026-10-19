import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FORM_DEFINITIONS } from "./form-definitions.js";
import { ApplicationCopyError } from "../../services/applications/application-copy.service.js";

const directory = path.dirname(fileURLToPath(import.meta.url));
const filenames = Object.freeze({
  agricultural: "agricultural.docx",
  residential: "residential.docx",
  chainsaw: "chainsaw.docx",
  "tree-cutting": "tree-cutting.docx",
});
const missing = "N/A";
const wordNamespace =
  "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

function templateError(type, message) {
  return new ApplicationCopyError(
    422,
    `${filenames[type] || "Application template"}: ${message}`,
  );
}

function displayDate(value, withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime()))
    throw new Error("An application date is invalid.");
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: withTime ? "Asia/Manila" : "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: true } : {}),
  }).format(date);
}

function displayValue(field) {
  const value = field.value;
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && !value.trim())
  )
    return missing;
  if (field.type === "boolean") return value ? "Yes" : "No";
  if (field.type === "date" || field.type === "datetime")
    return displayDate(value, field.type === "datetime");
  if (
    field.key === "cultivationDate" &&
    /^\d{4}-\d{2}-\d{2}$/.test(String(value))
  )
    return displayDate(value);
  if (field.type === "integer" || field.type === "decimal") {
    const number = Number(value);
    if (!Number.isFinite(number))
      throw new Error(`Invalid number for ${field.key}.`);
    return new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: field.type === "decimal" ? 2 : 0,
      maximumFractionDigits: field.type === "decimal" ? 2 : 0,
    }).format(number);
  }
  const labels = {
    civilStatus: {
      SINGLE: "Single",
      MARRIED: "Married",
      DIVORCED: "Divorced",
      SEPARATED: "Separated",
      WIDOWED: "Widowed",
      ANNULLED: "Annulled",
    },
    sex: { MALE: "Male", FEMALE: "Female" },
    registrationType: { NEW: "New", RENEWAL: "Renewal" },
    transferAction: {
      SOLD: "sold",
      DONATED: "donated",
      TRANSFERRED: "transferred",
      ASSIGNED: "assigned",
    },
  };
  return labels[field.key]?.[String(value).toUpperCase()] || String(value);
}

function ageAtSubmission(dateOfBirth, submittedAt) {
  if (!dateOfBirth || !submittedAt) return null;
  const birth = new Date(dateOfBirth);
  const submitted = new Date(submittedAt);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(submitted.getTime()))
    return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(submitted);
  const part = (name) => Number(parts.find((item) => item.type === name).value);
  let age = part("year") - birth.getUTCFullYear();
  if (
    part("month") < birth.getUTCMonth() + 1 ||
    (part("month") === birth.getUTCMonth() + 1 &&
      part("day") < birth.getUTCDate())
  )
    age--;
  return age >= 0 ? age : null;
}

export function applicationTemplateData(copy) {
  const definition = FORM_DEFINITIONS.find((item) => item.slug === copy.type);
  if (!definition)
    throw templateError(copy.type, "Unsupported application type.");
  const submitted = new Map(
    copy.sections
      .flatMap((section) => section.fields)
      .map((field) => [field.key, field]),
  );
  const data = Object.create(null);
  for (const field of [
    ...definition.fields,
    { key: "dataPrivacyConsent", type: "boolean" },
  ]) {
    data[field.key] = displayValue({
      ...field,
      value: submitted.get(field.key)?.value,
    });
  }
  for (const [key, type] of [
    ["referenceNo", "text"],
    ["status", "text"],
    ["submittedAt", "datetime"],
    ["reviewedAt", "datetime"],
    ["remarks", "text"],
  ]) {
    data[key] = displayValue({ key, type, value: copy[key] });
  }
  data.applicantName =
    ["firstName", "middleName", "lastName", "extensionName"]
      .map((key) => submitted.get(key)?.value)
      .filter((value) => typeof value === "string" && value.trim())
      .map((value) => value.trim())
      .join(" ")
      .replace(/\s+/g, " ")
      .trim() || missing;
  data.age = displayValue({
    key: "age",
    type: "integer",
    value: ageAtSubmission(
      submitted.get("dateOfBirth")?.value,
      copy.submittedAt,
    ),
  });
  return data;
}

function ownTextNodes(paragraph) {
  return Array.from(
    paragraph.getElementsByTagNameNS(wordNamespace, "t"),
  ).filter((node) => {
    let parent = node.parentNode;
    while (
      parent &&
      !(parent.namespaceURI === wordNamespace && parent.localName === "p")
    )
      parent = parent.parentNode;
    return parent === paragraph;
  });
}

function markChoices(nodes, labels, selected, type, fieldName) {
  const text = nodes.map((node) => node.textContent).join("");
  const expression = new RegExp("\\b(" + labels.join("|") + ")\\b", "gi");
  const choices = Array.from(text.matchAll(expression));
  if (choices.length !== labels.length)
    throw templateError(
      type,
      `Cannot identify the ${fieldName} checkbox labels.`,
    );
  const selectedLabel = selected === missing ? null : selected.toLowerCase();
  if (
    selectedLabel &&
    !labels.some((label) => label.toLowerCase() === selectedLabel)
  ) {
    throw templateError(
      type,
      `The recorded ${fieldName} (${selected}) has no checkbox in this template.`,
    );
  }
  const prefix = /[□☐☑☒]/.test(text.slice(0, choices[0].index));
  const changes = new Map();
  choices.forEach((choice, index) => {
    const start = prefix
      ? index
        ? choices[index - 1].index + choices[index - 1][0].length
        : 0
      : choice.index + choice[0].length;
    const end = prefix
      ? choice.index
      : (choices[index + 1]?.index ?? text.length);
    const boxes = Array.from(text.slice(start, end).matchAll(/[□☐☑☒]/g));
    if (boxes.length !== 1)
      throw templateError(
        type,
        `Cannot identify the checkbox for ${choice[0]}.`,
      );
    changes.set(
      start + boxes[0].index,
      choice[0].toLowerCase() === selectedLabel ? "⧄" : "□",
    );
  });
  let offset = 0;
  for (const node of nodes) {
    const value = node.textContent;
    node.textContent = Array.from(
      value,
      (character, index) => changes.get(offset + index) || character,
    ).join("");
    offset += value.length;
  }
}

function fillCheckboxes(zip, copy, data) {
  if (!["agricultural", "residential"].includes(copy.type)) return;
  const { str2xml, xml2str } = Docxtemplater.DocUtils;
  const xml = str2xml(zip.file("word/document.xml").asText());
  const found = new Set();
  for (const paragraph of Array.from(
    xml.getElementsByTagNameNS(wordNamespace, "p"),
  )) {
    const nodes = ownTextNodes(paragraph);
    const text = nodes.map((node) => node.textContent).join("");
    if (!/[□☐☑☒]/.test(text)) continue;
    if (/\bSex\s*:/i.test(text)) {
      markChoices(nodes, ["Male", "Female"], data.sex, copy.type, "sex");
      found.add("sex");
    } else if (/Civil\s+Status\s*:/i.test(text)) {
      markChoices(
        nodes,
        ["Single", "Married", "Divorced", "Separated", "Widowed"],
        data.civilStatus,
        copy.type,
        "civil status",
      );
      found.add("civilStatus");
    } else if (/Natural[-\s]*born\s+Citizen\s*:/i.test(text)) {
      markChoices(
        nodes,
        ["Yes", "No"],
        data.naturalBorn,
        copy.type,
        "natural-born citizenship",
      );
      found.add("naturalBorn");
    }
  }
  const source = zip.file("word/document.xml").asText();
  for (const key of copy.type === "agricultural"
    ? ["sex", "civilStatus", "naturalBorn"]
    : ["sex", "civilStatus"]) {
    if (!found.has(key) && !source.includes(key))
      throw templateError(
        copy.type,
        `The ${key} answer has no placeholder or checkbox group.`,
      );
  }
  zip.file("word/document.xml", xml2str(xml));
}

function detailOf(error) {
  const nested = error?.properties?.errors;
  if (Array.isArray(nested))
    return [...new Set(nested.map(detailOf).filter(Boolean))].join(" ");
  if (error?.properties?.rootError) return detailOf(error.properties.rootError);
  return (
    error?.properties?.explanation || error?.message || "Invalid DOCX template."
  );
}

export function renderApplicationDocument(copy, bytes) {
  const used = new Set();
  try {
    const data = applicationTemplateData(copy);
    const zip = new PizZip(bytes);
    if (!zip.file("word/document.xml"))
      throw new Error("Use a valid DOCX Word document.");
    fillCheckboxes(zip, copy, data);
    const document = new Docxtemplater(zip, {
      paragraphLoop: false,
      linebreaks: true,
      errorLogging: false,
      parser(tag, meta) {
        const key = tag.trim();
        if (meta?.tag?.module || !/^[A-Za-z][A-Za-z0-9_]*$/.test(key))
          throw new Error(
            "Use simple placeholders such as {applicantName}; expressions and loops are not supported.",
          );
        if (!Object.hasOwn(data, key))
          throw new Error(`Unknown placeholder {${key}} for ${copy.type}.`);
        used.add(key);
        return { get: () => data[key] };
      },
      nullGetter: () => missing,
    });
    if (!used.size)
      throw new Error("No supported placeholders found in the template.");
    document.render(data);
    return document
      .getZip()
      .generate({ type: "nodebuffer", compression: "DEFLATE" });
  } catch (error) {
    if (error instanceof ApplicationCopyError) throw error;
    throw templateError(copy.type, detailOf(error).slice(0, 1200));
  }
}

export async function applicationDocument(copy) {
  if (!Object.hasOwn(filenames, copy.type))
    throw templateError(copy.type, "Unsupported application type.");
  let bytes;
  try {
    bytes = await readFile(
      path.join(directory, "templates", filenames[copy.type]),
    );
  } catch (error) {
    if (error.code === "ENOENT")
      throw templateError(
        copy.type,
        "The DOCX template is missing from application-export/templates.",
      );
    throw error;
  }
  return renderApplicationDocument(copy, bytes);
}

export function safeApplicationFilename(copy) {
  const reference =
    String(copy.referenceNo)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 100) || "application";
  return `${copy.type}-${reference}.docx`;
}
