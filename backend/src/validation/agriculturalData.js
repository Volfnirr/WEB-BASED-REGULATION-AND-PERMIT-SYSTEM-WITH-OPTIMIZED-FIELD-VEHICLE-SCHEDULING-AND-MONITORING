import { z } from "zod";

export const agriculturalFormSchema = z.object({
    lastName: z.string().trim().min(1, "Last name is required").max(255, "Maximum 255 characters allowed"),
    firstName: z.string().trim().min(1, "First name is required").max(255, "Maximum 255 characters allowed"),
    middleName: z.string().trim().max(255, "Maximum 255 characters allowed").optional(),
    extension: z.string().trim().max(50, "Maximum 50 characters allowed").optional(),

    contactNumber: z
      .string()
      .trim()
      .regex(/^09\d{9}$/, "Enter a valid 11-digit mobile number")
      .max(11, "Maximum 11 characters allowed"),
    email: z.email("Invalid email").max(255, "Maximum 255 characters allowed"),
    
    birthday: z.coerce.date({
      required_error: "Date of birth is required",
      invalid_type_error: "Please enter a valid date",
    }),

    sex: z.enum(["Male", "Female"], {
      errorMap: () => ({ message: "Please select a sex" }),
    }),
    citizenship: z.string().trim().min(1, "Citizenship is required").max(100, "Maximum 100 characters allowed"),
    naturalBorn: z.enum(["Yes", "No"], {
      errorMap: () => ({ message: "Please select an option" }),
    }),
    civilStatus: z.enum(["Single", "Married", "Widowed", "Anulled"], {
      errorMap: () => ({ message: "Please select civil status" }),
    }),

    spouse: z.string().trim().max(255, "Maximum 255 characters allowed").optional(),
    mailingAddress: z
      .string()
      .trim()
      .min(5, "Complete mailing address is required")
      .max(1000, "Maximum 1000 characters allowed"),

    province: z.string().trim().min(1, "Province is required").max(255, "Maximum 255 characters allowed"),
    municipality: z.string().trim().min(1, "Municipality is required").max(255, "Maximum 255 characters allowed"),
    barangay: z.string().trim().min(1, "Barangay is required").max(255, "Maximum 255 characters allowed"),
    location: z.string().trim().max(500, "Maximum 500 characters allowed").optional(),
    lotNo: z.string().trim().min(1, "Lot number is required").max(255, "Maximum 255 characters allowed"),
    surveyNo: z.string().trim().max(255, "Maximum 255 characters allowed").optional(),
    landAreaSqm: z.coerce
      .number({ required_error: "Land area is required" })
      .positive("Land area must be greater than 0")
      .max(99999999.99, "Value is too large for the database")
      .refine(
        (val) => Math.round(val * 100) === val * 100,
        "Land area can only have up to 2 decimal places"
      ),
      
    cultivationDate: z.string().trim().max(255, "Maximum 255 characters allowed").optional(),
    improvements: z.string().trim().max(1000, "Maximum 1000 characters allowed").optional(),
    transferee_info: z.string().trim().max(1000, "Maximum 1000 characters allowed").optional(),
    heir_info: z.string().trim().max(1000, "Maximum 1000 characters allowed").optional(),
    evidence: z.string().trim().max(1000, "Maximum 1000 characters allowed").optional(),

    heir1_name: z.string().trim().max(255, "Maximum 255 characters allowed").optional(),
    heir1_address: z.string().trim().max(1000, "Maximum 1000 characters allowed").optional(),
    heir2_name: z.string().trim().max(255, "Maximum 255 characters allowed").optional(),
    heir2_address: z.string().trim().max(1000, "Maximum 1000 characters allowed").optional(),
    heir_rep_name: z.string().trim().max(255, "Maximum 255 characters allowed").optional(),
    heirs_of: z.string().trim().max(255, "Maximum 255 characters allowed").optional(),

    witness1_name: z.string().trim().min(1, "Witness 1 name is required").max(255, "Maximum 255 characters allowed"),
    witness1_address: z.string().trim().min(1, "Witness 1 address is required").max(1000, "Maximum 1000 characters allowed"),
    witness2_name: z.string().trim().min(1, "Witness 2 name is required").max(255, "Maximum 255 characters allowed"),
    witness2_address: z.string().trim().min(1, "Witness 2 address is required").max(1000, "Maximum 1000 characters allowed"),

    date_filed: z.coerce.date({
      required_error: "Date filed is required",
      invalid_type_error: "Please enter a valid date",
    }),
    applicant_signature: z
      .string()
      .trim()
      .min(1, "Digital signature is required")
      .max(255, "Maximum 255 characters allowed"),

    privacyConsent: z.literal(true, {
      errorMap: () => ({ message: "Please check this box to proceed" }),
    }),
  })
  .refine(
    (data) => {
      if (data.civilStatus === "Married") return !!data.spouse?.trim();
      return true;
    },
    {
      path: ["spouse"],
      message: "Spouse name is required for married applicants",
    }
  )
  .refine(
    (data) => {
      if (data.civilStatus !== "Married") return !data.spouse?.trim();
      return true;
    },
    {
      path: ["spouse"],
      message: "Spouse name should only be set if civil status is Married",
    }
  );