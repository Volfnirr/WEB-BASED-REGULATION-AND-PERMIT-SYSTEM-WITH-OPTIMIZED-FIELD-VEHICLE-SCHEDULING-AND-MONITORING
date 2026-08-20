import { z } from "zod";

export const residentialFormSchema = z
  .object({
    // APPLICANT INFORMATION
    lastName: z.string().trim().min(1, "Last name is required"),
    firstName: z.string().trim().min(1, "First name is required"),
    middleName: z.string().trim().optional(),
    extensionName: z.string().trim().optional(),
    email: z.email("Invalid email address"),
    fullAddress: z.string().trim().min(1, "Complete address is required"),
    contactNo: z
      .string()
      .regex(/^09\d{9}$/, "Enter a valid Philippine mobile number"),
    privacyConsent: z.literal(true, "Please check this box to proceed"),
    citizenship: z.string().trim().min(1, "Citizenship is required"),
    civilStatus: z.enum(
      ["SINGLE", "MARRIED", "WIDOWED", "ANNULLED"],
      "Please select a civil status",
    ),
    dateOfBirth: z.coerce.date("Date of birth is required"),
    placeOfBirth: z.string().trim().min(1, "Place of birth is required"),
    spouseName: z.string().trim().optional(),

    // LAND INFORMATION
    province: z.string().trim().min(1, "Province is required"),
    municipality: z.string().trim().min(1, "Municipality is required"),
    barangay: z.string().trim().min(1, "Barangay is required"),
    specificLocation: z
      .string()
      .trim()
      .min(1, "Specific Location / Sitio is required"),
    lotNo: z.string().trim().min(1, "Lot No. is required"),
    landAreaSqm: z.coerce
      .number("Land area is required")
      .positive("Land area must be greater than 0")
      .refine(
        (val) => Math.round(val * 100) === val * 100,
        "Land area can only have up to 2 decimal places",
      ),

    // AFFIDAVIT
    affidavitProvince: z.string().trim().min(1, "Province is required"),
    affidavitCity: z.string().trim().min(1, "City/Municipality is required"),
    affiantName: z.string().trim().min(1, "Affiant's name is required"),
    affiantAddress: z.string().trim().min(1, "Affiant's address is required"),
    applicantFullName: z
      .string()
      .trim()
      .min(1, "Applicant fullname is required"),
    affidavitLandLocation: z
      .string()
      .trim()
      .min(1, "Land location is required"),
    yearsOfOccupation: z.coerce
      .number("Years in possession is required")
      .int("Years must be a whole number")
      .nonnegative("Years in possession cannot be negative"),
    purposeOfUse: z.string().trim().min(1, "Purpose of use is required"),
    affidavitDate: z.coerce.date("Affidavit date is required"),
    affidavitLocation: z
      .string()
      .trim()
      .min(1, "Affidavit location is required"),
    signatureAffiantName: z
      .string()
      .trim()
      .min(1, "Full name signature is required"),
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
