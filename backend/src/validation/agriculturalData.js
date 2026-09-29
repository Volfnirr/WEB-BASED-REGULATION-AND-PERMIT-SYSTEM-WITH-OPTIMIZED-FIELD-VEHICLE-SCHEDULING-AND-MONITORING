import { z } from "zod";
import { getBarangays } from "../lib/ph-pampanga/ph-address.js";

export const agriculturalFormSchema = z
  .object({
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(255, "Maximum 255 characters allowed"),
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(255, "Maximum 255 characters allowed"),
    middleName: z
      .string()
      .trim()
      .max(255, "Maximum 255 characters allowed")
      .optional(),
    extension: z
      .string()
      .trim()
      .max(50, "Maximum 50 characters allowed")
      .optional(),
    contactNumber: z
      .string()
      .trim()
      .regex(/^09\d{9}$/, "Enter a valid 11-digit mobile number")
      .max(11, "Maximum 11 characters allowed"),
    birthday: z.coerce.date({
      required_error: "Date of birth is required",
      invalid_type_error: "Please enter a valid date",
    }),
    sex: z.enum(["Male", "Female"], {
      errorMap: () => ({ message: "Please select a sex" }),
    }),
    citizenship: z
      .string()
      .trim()
      .min(1, "Citizenship is required")
      .max(100, "Maximum 100 characters allowed"),
    naturalBorn: z.boolean({
      error: "Please select an option",
    }),
    civilStatus: z.enum(["SINGLE", "MARRIED", "WIDOWED", "ANNULLED"], {
      errorMap: () => ({ message: "Please select civil status" }),
    }),
    spouse: z
      .string()
      .trim()
      .max(255, "Maximum 255 characters allowed")
      .optional(),
    mailingAddress: z
      .string()
      .trim()
      .min(1, "Complete mailing address is required")
      .max(1000, "Maximum 1000 characters allowed"),
    province: z
      .string()
      .trim()
      .min(1, "Province is required")
      .max(255, "Maximum 255 characters allowed"),
    municipality: z
      .string()
      .trim()
      .min(1, "Municipality is required")
      .max(255, "Maximum 255 characters allowed"),
    barangay: z
      .string()
      .trim()
      .min(1, "Barangay is required")
      .max(255, "Maximum 255 characters allowed"),
    location: z
      .string()
      .trim()
      .min(1, "Specific locations is required")
      .max(500, "Maximum 500 characters allowed"),
    lotNo: z
      .string()
      .trim()
      .min(1, "Lot number is required")
      .max(255, "Maximum 255 characters allowed"),
    surveyNo: z
      .string()
      .trim()
      .max(255, "Maximum 255 characters allowed")
      .optional(),
    landAreaSqm: z.coerce
      .number({ required_error: "Land area is required" })
      .positive("Land area must be greater than 0")
      .max(99999999.99, "Value is too large for the database")
      .refine(
        (val) => Math.round(val * 100) === val * 100,
        "Land area can only have up to 2 decimal places",
      ),
    cultivationDate: z
      .string()
      .trim()
      .refine(
        (val) =>
          /^(\d{4}|(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4})$/.test(val),
        { message: "Enter a date as MM/DD/YYYY or just YYYY" },
      ),
    improvements: z
      .string()
      .trim()
      .max(1000, "Maximum 1000 characters allowed")
      .optional(),
    transferee_info: z
      .string()
      .trim()
      .max(1000, "Maximum 1000 characters allowed")
      .optional(),
    heir_info: z
      .string()
      .trim()
      .max(1000, "Maximum 1000 characters allowed")
      .optional(),
    evidence: z
      .string()
      .trim()
      .max(1000, "Maximum 1000 characters allowed")
      .optional(),
    heir1_name: z
      .string()
      .trim()
      .min(1, "Heir 1 name is required")
      .max(255, "Maximum 255 characters allowed"),
    heir1_address: z
      .string()
      .trim()
      .min(1, "Heir 1 adaress is required")
      .max(1000, "Maximum 1000 characters allowed"),
    heir2_name: z
      .string()
      .trim()
      .min(1, "Heir 2 name is required")
      .max(255, "Maximum 255 characters allowed"),
    heir2_address: z
      .string()
      .trim()
      .min(1, "Heir 2 name is required")
      .max(1000, "Maximum 1000 characters allowed"),
    heir_rep_name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(255, "Maximum 255 characters allowed"),
    heirs_of: z
      .string()
      .trim()
      .min(1, "Ancestor name is required")
      .max(255, "Maximum 255 characters allowed"),
    witness1_name: z
      .string()
      .trim()
      .min(1, "Witness 1 name is required")
      .max(255, "Maximum 255 characters allowed"),
    witness1_address: z
      .string()
      .trim()
      .min(1, "Witness 1 address is required")
      .max(1000, "Maximum 1000 characters allowed"),
    witness2_name: z
      .string()
      .trim()
      .min(1, "Witness 2 name is required")
      .max(255, "Maximum 255 characters allowed"),
    witness2_address: z
      .string()
      .trim()
      .min(1, "Witness 2 address is required")
      .max(1000, "Maximum 1000 characters allowed"),
    date_filed: z.coerce.date({
      required_error: "Date filed is required",
      invalid_type_error: "Please enter a valid date",
    }),
    privacyConsent: z.literal(true, {
      errorMap: () => ({ message: "Please check this box to proceed" }),
    }),
    assignedInspector: z
      .number({ error: "Please assign an inspector" })
      .int("Invalid inspector")
      .positive("Invalid inspector")
      .max(9999, "Invalid inspector"),
  })
  .refine(
    (data) => {
      if (data.civilStatus === "MARRIED") return !!data.spouse?.trim();
      return true;
    },
    {
      path: ["spouse"],
      message: "Spouse name is required for married applicants",
    },
  )
  .refine(
    (data) => {
      if (data.civilStatus !== "MARRIED") return !data.spouse?.trim();
      return true;
    },
    {
      path: ["spouse"],
      message: "Spouse name should only be set if civil status is Married",
    },
  )
  .refine(
    (data) =>
      getBarangays(data.province, data.municipality).includes(data.barangay),
    {
      path: ["barangay"],
      message: "Selected barangay does not belong to the selected municipality",
    },
  );
