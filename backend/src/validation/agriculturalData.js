import { z } from "zod";

export const agriculturalFormSchema = z.object({
     lastName: z.string().trim().min(1, "Last name is required"),
    firstName: z.string().trim().min(1, "First name is required"),
    middleName: z.string().trim().optional(),
    extension: z.string().trim().optional(),

    contactNumber: z
      .string()
      .trim()
      .regex(/^09\d{9}$/, "Enter a valid 11-digit mobile number"),
    email: z.email("Invalid email"),
    
    birthday: z.coerce.date({
      required_error: "Date of birth is required",
      invalid_type_error: "Please enter a valid date",
    }),

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
      .number({ required_error: "Land area is required" })
      .positive("Land area must be greater than 0")
      .refine(
        (val) => Math.round(val * 100) === val * 100,
        "Land area can only have up to 2 decimal places"
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

    date_filed: z.coerce.date({
      required_error: "Date filed is required",
      invalid_type_error: "Please enter a valid date",
    }),
    applicant_signature: z
      .string()
      .trim()
      .min(1, "Digital signature is required"),

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