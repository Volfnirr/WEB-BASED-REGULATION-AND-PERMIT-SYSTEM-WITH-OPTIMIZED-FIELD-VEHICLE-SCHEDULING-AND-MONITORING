import { z } from "zod";

export const chainsawFormSchema = z.object({
  registrationType: z.enum(["New", "Renewal"], {
    errorMap: () => ({ message: "Please select a registration type" }),
  }),
  
  // Applicant Details
  lastname: z.string().min(1, { message: "Last name is required" }).max(255, { message: "Maximum 255 characters allowed" }),
  firstname: z.string().min(1, { message: "First name is required" }).max(255, { message: "Maximum 255 characters allowed" }),
  middlename: z.string().min(1, { message: "Middle name is required" }).max(255, { message: "Maximum 255 characters allowed" }),
  extension: z.string().max(50, { message: "Maximum 50 characters allowed" }).optional(),
  
  province: z.string().min(1, { message: "Province is required" }).max(255, { message: "Maximum 255 characters allowed" }),
  municipality: z.string().min(1, { message: "Municipality is required" }).max(255, { message: "Maximum 255 characters allowed" }),
  barangay: z.string().min(1, { message: "Barangay is required" }).max(255, { message: "Maximum 255 characters allowed" }),
  completeAddress: z.string().min(5, { message: "Complete address must be at least 5 characters" }).max(1000, { message: "Maximum 1000 characters allowed" }),
  
  email: z.string().email({ message: "Invalid email address" }).max(255, { message: "Maximum 255 characters allowed" }),
  contactNumber: z
    .string()
    .min(1, { message: "Contact number is required" })
    .regex(/^09\d{9}$/, { message: "Must be a valid 11-digit PH mobile number (e.g., 09123456789)" })
    .max(11, { message: "Maximum 11 characters allowed" }),

  // Chainsaw Specifications
  brand: z.string().min(1, { message: "Brand is required" }).max(255, { message: "Maximum 255 characters allowed" }),
  model: z.string().min(1, { message: "Model is required" }).max(255, { message: "Maximum 255 characters allowed" }),
  dateAcquisition: z
    .string()
    .min(1, { message: "Date of acquisition is required" })
    .regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, {
      message: "Please use MM/DD/YYYY format",
    })
    .max(20, { message: "Maximum 20 characters allowed" }),
  serialNumber: z.string().min(1, { message: "Serial number is required" }).max(255, { message: "Maximum 255 characters allowed" }),
  horsePower: z.string().min(1, { message: "Horse power is required" }).max(100, { message: "Maximum 100 characters allowed" }),
  guideBarLength: z.string().min(1, { message: "Guide bar length is required" }).max(100, { message: "Maximum 100 characters allowed" }),

  // Data Privacy Consent
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "Please check this box to proceed" })
  }),
});