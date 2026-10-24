import { z } from "zod";
import { getBarangays } from "../lib/ph-pampanga/ph-address.js";

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";
const optionalText = (max = 1000) =>
  z.preprocess(
    (value) => (typeof value === "string" && !value.trim() ? undefined : value),
    z.string().trim().max(max, "This value is too long").optional(),
  );
const requiredText = (label, max = 255) =>
  z
    .string(label + " is required")
    .trim()
    .min(1, label + " is required")
    .max(max, label + " is too long");
const personName = (label) =>
  requiredText(label).regex(
    /^[\p{L}\p{M} .'-]+$/u,
    "Use letters, spaces, apostrophes, periods, or hyphens",
  );
function todayInManila() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type) => parts.find((entry) => entry.type === type).value;
  return part("year") + "-" + part("month") + "-" + part("day");
}
function isRealDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00.000Z");
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
const dateField = (label) =>
  requiredText(label, 10)
    .refine(isRealDate, "Choose a valid full date")
    .refine(
      (value) => !isRealDate(value) || value <= todayInManila(),
      label + " cannot be in the future",
    );
const optionalDate = (label) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    dateField(label).optional(),
  );

export const agriculturalFormSchema = z
  .object({
    lastName: personName("Last name"),
    firstName: personName("First name"),
    middleName: optionalText(255),
    contactNumber: requiredText("Contact number", 11).regex(
      /^09\d{9}$/,
      "Enter a valid 11-digit mobile number starting with 09",
    ),
    birthday: dateField("Date of birth"),
    sex: z.enum(["Male", "Female"], "Please select a sex"),
    citizenship: requiredText("Citizenship", 100),
    naturalBorn: z.boolean("Please select Yes or No"),
    civilStatus: z.enum(
      ["SINGLE", "MARRIED", "DIVORCED", "SEPARATED", "WIDOWED"],
      "Please select a civil status",
    ),
    spouse: optionalText(255),
    mailingAddress: requiredText("Mailing address", 1000),
    province: requiredText("Province"),
    municipality: requiredText("Municipality"),
    barangay: requiredText("Barangay"),
    location: requiredText("Specific location", 500),
    lotNo: requiredText("Lot number"),
    surveyNo: requiredText("Survey number"),
    landAreaSqm: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.coerce
        .number("Enter a valid land area")
        .positive("Land area must be greater than 0")
        .max(99999999.99, "Land area is too large")
        .refine(
          (value) => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001,
          "Use at most 2 decimal places",
        ),
    ),
    cultivationDate: dateField("Cultivation date"),
    improvements: optionalText(),
    firstCultivatorName: optionalText(255),
    firstCultivationDate: optionalDate("First cultivation date"),
    previousCultivatorName: optionalText(255),
    previousCultivatorDeathDate: optionalDate("Date of death"),
    heirImprovements: optionalText(),
    evidence: optionalText(),
    heir1_name: optionalText(255),
    heir1_address: optionalText(),
    heir2_name: optionalText(255),
    heir2_address: optionalText(),
    heir3_name: optionalText(255),
    heir3_address: optionalText(),
    unoccupiedPeriodAndReason: optionalText(),
    witness1_name: personName("Witness 1 name"),
    witness1_address: requiredText("Witness 1 address", 1000),
    witness2_name: personName("Witness 2 name"),
    witness2_address: requiredText("Witness 2 address", 1000),
    privacyConsent: z.literal(true, "Please agree to the Data Privacy Consent"),
  })
  .superRefine((data, context) => {
    const requireField = (key, message) => {
      if (!hasValue(data[key]))
        context.addIssue({ code: "custom", path: [key], message });
    };
    if (data.civilStatus === "MARRIED")
      requireField("spouse", "Spouse name is required when Married");
    if (data.civilStatus !== "MARRIED" && hasValue(data.spouse)) {
      context.addIssue({
        code: "custom",
        path: ["spouse"],
        message: "Spouse name applies only when Married",
      });
    }
    if (
      !getBarangays(data.province, data.municipality).includes(data.barangay)
    ) {
      context.addIssue({
        code: "custom",
        path: ["barangay"],
        message: "Select a barangay belonging to the selected municipality",
      });
    }
    const transferee = ["firstCultivatorName", "firstCultivationDate"];
    if (transferee.some((key) => hasValue(data[key]))) {
      transferee.forEach((key) =>
        requireField(
          key,
          "Complete both transferee fields or leave both blank",
        ),
      );
    }
    const heirCore = [
      "previousCultivatorName",
      "previousCultivatorDeathDate",
      "heirImprovements",
      "evidence",
    ];
    const heirRows = [1, 2, 3].flatMap((row) => [
      "heir" + row + "_name",
      "heir" + row + "_address",
    ]);
    if ([...heirCore, ...heirRows].some((key) => hasValue(data[key]))) {
      heirCore.forEach((key) =>
        requireField(
          key,
          "Complete this field when using the heir section (enter None for no improvements)",
        ),
      );
    }
    for (const row of [1, 2, 3]) {
      const pair = ["heir" + row + "_name", "heir" + row + "_address"];
      if (pair.some((key) => hasValue(data[key]))) {
        pair.forEach((key) =>
          requireField(
            key,
            "Enter both the heir name and address, or leave this row blank",
          ),
        );
      }
    }
  });
