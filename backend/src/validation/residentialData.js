import { z } from "zod";
import { getBarangays } from "../lib/ph-pampanga/ph-address.js";

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

const optionalText = (max, message) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(max, message).optional(),
  );

const requiredPastOrTodayDate = (requiredMessage, futureMessage) =>
  z.coerce
    .date(requiredMessage)
    .refine((value) => value <= new Date(), futureMessage);

const optionalPastOrTodayDate = (futureMessage) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce
      .date()
      .refine((date) => date <= new Date(), futureMessage)
      .optional(),
  );

const optionalTransferAction = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.enum(["SOLD", "DONATED", "TRANSFERRED", "ASSIGNED"]).optional(),
);

export const residentialFormSchema = z
  .object({
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(100, "Last name is too long")
      .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(100, "First name is too long")
      .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
    middleName: optionalText(100, "Middle name is too long"),
    fullAddress: z
      .string()
      .trim()
      .min(1, "Mailing address is required")
      .max(255, "Mailing address is too long"),
    contactNo: z
      .string()
      .regex(/^09\d{9}$/, "Enter a valid Philippine mobile number"),
    privacyConsent: z.literal(true, "Please check this box to proceed"),
    citizenship: z
      .string()
      .trim()
      .min(1, "Citizenship is required")
      .max(50, "Citizenship is too long"),
    civilStatus: z.enum(
      ["SINGLE", "MARRIED", "DIVORCED", "SEPARATED", "WIDOWED"],
      "Please select a civil status",
    ),
    dateOfBirth: requiredPastOrTodayDate(
      "Date of birth is required",
      "Date of birth cannot be in the future",
    ),
    sex: z.enum(["MALE", "FEMALE"], "Please select a sex"),
    spouseName: optionalText(100, "Spouse name is too long"),

    province: z
      .string("Please select a province")
      .trim()
      .min(1, "Please select a province")
      .max(100),
    municipality: z
      .string("Please select a municipality/city")
      .trim()
      .min(1, "Please select a municipality/city")
      .max(100),
    barangay: z
      .string("Please select a barangay")
      .trim()
      .min(1, "Please select a barangay")
      .max(100),
    specificLocation: z
      .string()
      .trim()
      .min(1, "Location is required")
      .max(255, "Location is too long"),
    lotNo: z.string().trim().min(1, "Lot No. is required").max(50),
    surveyNo: z.string().trim().min(1, "Survey No. is required").max(100),
    landAreaSqm: z.coerce
      .number("Land area is required")
      .positive("Land area must be greater than 0")
      .max(99999999.99, "Land area cannot exceed 99,999,999.99 sqm")
      .refine(
        (value) => Math.round(value * 100) === value * 100,
        "Land area can only have up to 2 decimal places",
      ),

    occupationDate: requiredPastOrTodayDate(
      "Date of occupation is required",
      "Date of occupation cannot be in the future",
    ),
    heirPredecessorName: optionalText(150, "Predecessor name is too long"),
    heirRelationship: optionalText(100, "Relationship is too long"),
    heirDateOfDeath: optionalPastOrTodayDate(
      "Date of death cannot be in the future",
    ),
    transfereePredecessorName: optionalText(
      150,
      "Predecessor name is too long",
    ),
    transferAction: optionalTransferAction,
    transactionDate: optionalPastOrTodayDate(
      "Transaction date cannot be in the future",
    ),
    employmentMarriageOccupationDate: optionalPastOrTodayDate(
      "Date of occupation cannot be in the future",
    ),
    marriageWithName: optionalText(150, "Name is too long"),
    forceAbsenceOccupationDate: optionalPastOrTodayDate(
      "Date of occupation cannot be in the future",
    ),
    motherLotOccupationDate: optionalPastOrTodayDate(
      "Date of occupation cannot be in the future",
    ),

    assignedInspector: z
      .number({ error: "Please assign an inspector" })
      .int("Invalid inspector")
      .positive("Invalid inspector")
      .max(9999, "Invalid inspector"),
  })
  .strict()
  .superRefine((data, context) => {
    if (data.civilStatus === "MARRIED" && !hasValue(data.spouseName)) {
      context.addIssue({
        code: "custom",
        path: ["spouseName"],
        message: "Spouse name is required for married applicants",
      });
    }

    if (data.civilStatus !== "MARRIED" && hasValue(data.spouseName)) {
      context.addIssue({
        code: "custom",
        path: ["spouseName"],
        message: "Spouse name should only be set if civil status is Married",
      });
    }

    if (
      hasValue(data.barangay) &&
      hasValue(data.municipality) &&
      !getBarangays(data.province, data.municipality).includes(data.barangay)
    ) {
      context.addIssue({
        code: "custom",
        path: ["barangay"],
        message:
          "Selected barangay does not belong to the selected municipality",
      });
    }

    const requireCompleteGroup = (fields, message) => {
      const populated = fields.filter(([key]) => hasValue(data[key]));
      if (populated.length === 0 || populated.length === fields.length) return;
      for (const [key, label] of fields) {
        if (!hasValue(data[key])) {
          context.addIssue({
            code: "custom",
            path: [key],
            message: `${label} is required ${message}`,
          });
        }
      }
    };

    requireCompleteGroup(
      [
        ["heirPredecessorName", "Predecessor name"],
        ["heirRelationship", "Relationship"],
        ["heirDateOfDeath", "Date of death"],
      ],
      "when completing the heir section",
    );

    requireCompleteGroup(
      [
        ["transfereePredecessorName", "Predecessor name"],
        ["transferAction", "Transfer action"],
        ["transactionDate", "Transaction date"],
      ],
      "when completing the transferee section",
    );

    requireCompleteGroup(
      [
        ["employmentMarriageOccupationDate", "Date of occupation"],
        ["marriageWithName", "Name after marriage with"],
      ],
      "when completing the employment and/or marriage section",
    );
  });
