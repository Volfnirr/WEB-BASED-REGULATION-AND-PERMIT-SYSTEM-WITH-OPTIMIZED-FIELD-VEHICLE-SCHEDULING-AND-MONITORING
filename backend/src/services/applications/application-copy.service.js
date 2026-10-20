import { FORM_DEFINITIONS } from "../../lib/application-export/form-definitions.js";
export class ApplicationCopyError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export function parseApplicationIds(input) {
  if (
    !Array.isArray(input) ||
    input.length < 1 ||
    input.length > 20 ||
    input.some(
      (id) =>
        !(
          typeof id === "number" ||
          (typeof id === "string" && /^[1-9]\d*$/.test(id))
        ) ||
        !Number.isSafeInteger(Number(id)) ||
        Number(id) < 1,
    )
  )
    throw new ApplicationCopyError(
      400,
      "Select between 1 and 20 valid applications.",
    );
  return [...new Set(input.map(Number))];
}
export function requireApplicationAccess(application, user) {
  if (!user?.id) throw new ApplicationCopyError(401, "Login required.");
  if (!["USER", "APPLICATION_ADMIN"].includes(user.role))
    throw new ApplicationCopyError(403, "You cannot access this application.");
  if (!application)
    throw new ApplicationCopyError(404, "Application not found.");
  const permitted =
    user.role === "USER"
      ? application.userId === user.id
      : application.assignedToId === user.id;
  if (!permitted)
    throw new ApplicationCopyError(403, "You cannot access this application.");
}
function serializeValue(value, type) {
  if (value === null || value === undefined) return null;
  if (type === "date") return new Date(value).toISOString().slice(0, 10);
  if (type === "decimal" || type === "integer") return Number(value);
  if (type === "boolean") return Boolean(value);
  return String(value);
}
function ageAt(dateOfBirth, date) {
  if (!dateOfBirth || !date) return null;
  const birth = new Date(dateOfBirth);
  const at = new Date(date);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(at.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(at);
  const part = (type) =>
    Number(parts.find((entry) => entry.type === type).value);
  let age = part("year") - birth.getUTCFullYear();
  const month = part("month") - (birth.getUTCMonth() + 1);
  if (month < 0 || (month === 0 && part("day") < birth.getUTCDate())) age--;
  return age >= 0 ? age : null;
}
export function toApplicationCopy(application) {
  const definition = FORM_DEFINITIONS.find(
    (d) => d.serviceId === application.serviceId,
  );
  if (!definition || !application[definition.relation])
    throw new ApplicationCopyError(
      422,
      "The submitted form is unavailable. Contact your assigned administrator.",
    );
  const form = application[definition.relation],
    sections = [];
  for (const field of definition.fields) {
    let value = form[field.key];
    if (field.key === "inspectorName")
      value = form.inspectors
        ? [
            form.inspectors.firstName,
            form.inspectors.middleName,
            form.inspectors.lastName,
            form.inspectors.extensionName,
          ]
            .filter(Boolean)
            .join(" ")
        : null;
    if (field.derived === "ageAtSubmission")
      value = ageAt(form.dateOfBirth, application.submittedAt);
    if (
      field.omitIfEmpty &&
      (value === null || value === undefined || value === "")
    )
      continue;
    let group = sections.find((s) => s.title === field.section);
    if (!group) {
      group = {
        title: field.section,
        fields: [],
      };
      sections.push(group);
    }
    group.fields.push({
      key: field.key,
      label: field.label,
      type: field.type,
      value: serializeValue(value, field.type),
    });
  }
  sections.push({
    title: "Consent",
    fields: [
      {
        key: "dataPrivacyConsent",
        label: "Data privacy consent",
        type: "boolean",
        value: application.dataPrivacyConsent,
      },
    ],
  });
  return {
    id: application.id,
    referenceNo: application.referenceNo,
    type: definition.slug,
    title: definition.title,
    status: application.status,
    submittedAt: application.submittedAt,
    reviewedAt: application.reviewedAt,
    remarks: application.remarks,
    canExport: true,
    sections,
  };
}
const select = {
  id: true,
  userId: true,
  assignedToId: true,
  serviceId: true,
  referenceNo: true,
  status: true,
  submittedAt: true,
  reviewedAt: true,
  remarks: true,
  dataPrivacyConsent: true,
};
for (const definition of FORM_DEFINITIONS) {
  const formSelect = Object.fromEntries(
    definition.fields
      .filter((f) => f.key !== "inspectorName" && !f.derived)
      .map((f) => [f.key, true]),
  );
  if (definition.fields.some((f) => f.key === "inspectorName"))
    formSelect.inspectors = {
      select: {
        firstName: true,
        middleName: true,
        lastName: true,
        extensionName: true,
      },
    };
  select[definition.relation] = {
    select: formSelect,
  };
}
export function createApplicationCopyService(db) {
  async function load(client, ids, user) {
    const applications = await client.application.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select,
    });
    return ids.map((id) => {
      const app = applications.find((a) => a.id === id);
      requireApplicationAccess(app, user);
      return toApplicationCopy(app);
    });
  }
  return {
    async detail(id, user) {
      const [copy] = await load(db, parseApplicationIds([id]), user);
      return copy;
    },
    async exportCopies(input, user, build) {
      const ids = parseApplicationIds(input);
      if (!user?.id) throw new ApplicationCopyError(401, "Login required.");
      if (!["USER", "APPLICATION_ADMIN"].includes(user.role))
        throw new ApplicationCopyError(
          403,
          "Export is unavailable for this account.",
        );
      const copies = await db.$transaction(
        async (tx) => {
          for (const id of [...ids].sort((a, b) => a - b))
            await tx.$queryRaw`SELECT id FROM application WHERE id = ${id} FOR SHARE`;
          return load(tx, ids, user);
        },
        {
          maxWait: 5000,
          timeout: 30000,
        },
      );
      // Build private downloads after the authorized database snapshot is read.
      return build(copies);
    },
  };
}
