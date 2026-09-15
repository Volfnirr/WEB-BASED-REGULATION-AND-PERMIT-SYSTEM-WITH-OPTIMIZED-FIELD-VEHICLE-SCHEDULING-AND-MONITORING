import { z } from "zod";

export const residentialFormSchema = z
  .object({
    // APPLICANT INFORMATION
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(100, "Last name is too long"),
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(100, "First name is too long"),
    middleName: z
      .string()
      .trim()
      .max(100, "Middle name is too long")
      .optional(),
    extensionName: z
      .string()
      .trim()
      .max(20, "Extension name is too long")
      .optional(),
    email: z.email("Invalid email address"),
    fullAddress: z
      .string()
      .trim()
      .min(1, "Complete address is required")
      .max(255, "Address is too long"),
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
      ["SINGLE", "MARRIED", "WIDOWED", "ANNULLED"],
      "Please select a civil status",
    ),
    dateOfBirth: z.coerce.date("Date of birth is required"),
    placeOfBirth: z
      .string()
      .trim()
      .min(1, "Place of birth is required")
      .max(150, "Place of birth is too long"),
    spouseName: z
      .string()
      .trim()
      .max(100, "Spouse name is too long")
      .optional(),

    // LAND INFORMATION
    province: z.string().trim().min(1, "Province is required").max(100),
    municipality: z.string().trim().min(1, "Municipality is required").max(100),
    barangay: z.string().trim().min(1, "Barangay is required").max(100),

    specificLocation: z
      .string()
      .trim()
      .min(1, "Specific Location / Sitio is required")
      .max(255),
    lotNo: z.string().trim().min(1, "Lot No. is required").max(50),

    landAreaSqm: z.coerce
      .number("Land area is required")
      .positive("Land area must be greater than 0")
      .max(99999999.99, "Land area cannot exceed 99,999,999.99 sqm")
      .refine(
        (val) => Math.round(val * 100) === val * 100,
        "Land area can only have up to 2 decimal places",
      ),

    // AFFIDAVIT
    affidavitProvince: z
      .string()
      .trim()
      .min(1, "Province is required")
      .max(50, "Province is too long"),
    affidavitCity: z
      .string()
      .trim()
      .min(1, "City/Municipality is required")
      .max(50, "City/Municipality  is too long"),
    affiantName: z
      .string()
      .trim()
      .min(1, "Affiant's name is required")
      .max(100, "Affiant's name is too long"),
    affiantAddress: z
      .string()
      .trim()
      .min(1, "Affiant's address is required")
      .max(200, "Affiant's address is too long"),
    applicantFullName: z
      .string()
      .trim()
      .min(1, "Applicant fullname is required")
      .max(100, "Applicant fullname is too long"),
    affidavitLandLocation: z
      .string()
      .trim()
      .min(1, "Land location is required")
      .max(100, "Land location is too long"),
    yearsOfOccupation: z.coerce
      .number("Years in possession is required")
      .int("Years must be a whole number")
      .nonnegative("Years in possession cannot be negative")
      .max(999999, "Years in possession is too long"),
    purposeOfUse: z
      .string()
      .trim()
      .min(1, "Purpose of use is required")
      .max(255, "Purpose of use is too long"),
    affidavitDate: z.coerce.date("Affidavit date is required"),
    affidavitLocation: z
      .string()
      .trim()
      .min(1, "Affidavit location is required")
      .max(100, "Affidavit location is too long"),
    signatureAffiantName: z
      .string()
      .trim()
      .min(1, "Full name signature is required")
      .max(150, "Full name signature  is too long")
      .regex(/^[a-zA-Z\s.'-]+$/, "Full name signature can only contain letters")
      .max(100, "Full name signature  is too long"),
    //Inspector
    assignedInspector: z
      .number({ error: "Please assign an inspector" })
      .int("Invalid inspector")
      .positive("Invalid inspector")
      .max(9999, "Invalid inspector"),
  })
  .refine(
    (data) => {
      if (data.civilStatus === "MARRIED") return !!data.spouseName?.trim();
      return true;
    },
    {
      path: ["spouseName"],
      message: "Spouse name is required for married applicants",
    },
  )
  .refine(
    (data) => {
      if (data.civilStatus !== "MARRIED") return !data.spouseName?.trim();
      return true;
    },
    {
      path: ["spouseName"],
      message: "Spouse name should only be set if civil status is Married",
    },
  );
