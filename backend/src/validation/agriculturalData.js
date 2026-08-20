import { z } from "zod";

export const agriculturalFormSchema = z.object({
  lastName: z.string().trim().min(1, "Last name is required"),
  firstName: z.string().trim().min(1, "First name is required"),
  middleName: z.string().trim().min(1, "Middle name is required"),
  extension: z.string().trim().optional(),

  contactNumber: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "Enter a valid 11-digit mobile number"),
  email: z.email("Invalid email"),
  birthday: z
    .string()
    .trim()
    .regex(
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/,
      "Please use MM/DD/YYYY format",
    ),

  sex: z.enum(["Male", "Female"], {
    errorMap: () => ({ message: "Please select a sex" }),
  }),
  citizenship: z.string().trim().min(1, "Citizenship is required"),
  naturalBorn: z.enum(["Yes", "No"], {
    errorMap: () => ({ message: "Please select an option" }),
  }),
  civilStatus: z.enum(["Single", "Married", "Widowed", "Anulled"], {
    errorMap: () => ({ message: "Please select civil status" }),
  }),

  spouse: z.string().trim().optional(),
  mailingAddress: z
    .string()
    .trim()
    .min(5, "Complete mailing address is required"),

  province: z.string().trim().min(1, "Province is required"),
  municipality: z.string().trim().min(1, "Municipality is required"),
  barangay: z.string().trim().min(1, "Barangay is required"),
  location: z.string().trim().optional(),
  lotNo: z.string().trim().min(1, "Lot number is required"),
  surveyNo: z.string().trim().optional(),
  landAreaSqm: z.coerce
    .number("Land area is required")
    .positive("Land area must be greater than 0")
    .refine(
      (val) => Math.round(val * 100) === val * 100,
      "Land area can only have up to 2 decimal places",
    ),

  cultivationDate: z.string().trim().optional(),
  improvements: z.string().trim().optional(),
  transferee_info: z.string().trim().optional(),
  heir_info: z.string().trim().optional(),
  evidence: z.string().trim().optional(),

  heir1_name: z.string().trim().optional(),
  heir1_address: z.string().trim().optional(),
  heir2_name: z.string().trim().optional(),
  heir2_address: z.string().trim().optional(),
  heir_rep_name: z.string().trim().optional(),
  heirs_of: z.string().trim().optional(),

  witness1_name: z.string().trim().min(1, "Witness 1 name is required"),
  witness1_address: z.string().trim().min(1, "Witness 1 address is required"),
  witness2_name: z.string().trim().min(1, "Witness 2 name is required"),
  witness2_address: z.string().trim().min(1, "Witness 2 address is required"),

  date_filed: z
    .string()
    .trim()
    .regex(
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/,
      "Please use MM/DD/YYYY format",
    ),
  applicant_signature: z
    .string()
    .trim()
    .min(1, "Digital signature is required"),

  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "Please check this box to proceed" }),
  }),
});
