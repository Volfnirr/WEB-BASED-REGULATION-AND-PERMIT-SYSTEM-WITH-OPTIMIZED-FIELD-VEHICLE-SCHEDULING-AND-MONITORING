import { z } from "zod";

export const chainsawFormSchema = z.object({
  registrationType: z.enum(["New", "Renewal"], {
    errorMap: () => ({ message: "Please select a registration type" }),
  }),
  
  // Applicant Details
  lastname: z.string().min(1, { message: "Last name is required" }),
  firstname: z.string().min(1, { message: "First name is required" }),
  middlename: z.string().min(1, { message: "Middle name is required" }),
  extension: z.string().optional(),
  
  province: z.string().min(1, { message: "Province is required" }),
  municipality: z.string().min(1, { message: "Municipality is required" }),
  barangay: z.string().min(1, { message: "Barangay is required" }),
  completeAddress: z.string().min(5, { message: "Complete address must be at least 5 characters" }),
  
  email: z.email({ message: "Invalid email address" }),
  contactNumber: z
    .string()
    .min(1, { message: "Contact number is required" })
    .regex(/^09\d{9}$/, { message: "Must be a valid 11-digit PH mobile number (e.g., 09123456789)" }),

  // Chainsaw Specifications
  brand: z.string().min(1, { message: "Brand is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  dateAcquisition: z
    .string()
    .min(1, { message: "Date of acquisition is required" })
    .regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, {
      message: "Please use MM/DD/YYYY format",
    }),
  serialNumber: z.string().min(1, { message: "Serial number is required" }),
  horsePower: z.string().min(1, { message: "Horse power is required" }),
  guideBarLength: z.string().min(1, { message: "Guide bar length is required" }),

  // Data Privacy Consent
  privacyConsent: z.literal(true, "Please check this box to proceed"),
});