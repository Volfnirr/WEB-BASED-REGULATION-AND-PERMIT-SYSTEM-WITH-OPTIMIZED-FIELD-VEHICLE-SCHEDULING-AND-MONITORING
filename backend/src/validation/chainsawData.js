import { z } from "zod";
import { getBarangays } from "../lib/ph-pampanga/ph-address.js";

export const chainsawFormSchema = z
  .object({
    registrationType: z.enum(["New", "Renewal"], {
      errorMap: () => ({ message: "Please select a registration type" }),
    }),
    lastname: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(255, "Maximum 255 characters allowed"),
    firstname: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(255, "Maximum 255 characters allowed"),
    middlename: z
      .string()
      .trim()
      .min(1, "Middle name is required")
      .max(255, "Maximum 255 characters allowed"),
    extension: z
      .string()
      .trim()
      .max(50, "Maximum 50 characters allowed")
      .optional(),

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
    completeAddress: z
      .string()
      .trim()
      .min(5, "Complete address is required")
      .max(1000, "Maximum 1000 characters allowed"),
    contactNumber: z
      .string()
      .trim()
      .regex(/^09\d{9}$/, "Enter a valid 11-digit Philippine mobile number")
      .max(11, "Maximum 11 characters allowed"),

    brand: z
      .string()
      .trim()
      .min(1, "Brand is required")
      .max(255, "Maximum 255 characters allowed"),
    model: z
      .string()
      .trim()
      .min(1, "Model is required")
      .max(255, "Maximum 255 characters allowed"),
    dateAcquisition: z
      .string()
      .trim()
      .regex(
        /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/,
        "Please use MM/DD/YYYY format",
      )
      .max(20, "Maximum 20 characters allowed"),
    serialNumber: z
      .string()
      .trim()
      .min(1, "Serial number is required")
      .max(255, "Maximum 255 characters allowed"),
    horsePower: z
      .string()
      .trim()
      .min(1, "Horse power is required")
      .max(100, "Maximum 100 characters allowed"),
    guideBarLength: z
      .string()
      .trim()
      .min(1, "Guide bar length is required")
      .max(100, "Maximum 100 characters allowed"),

    privacyConsent: z.literal(true, {
      errorMap: () => ({ message: "Please check this box to proceed" }),
    }),
  })
  .refine(
    (data) =>
      getBarangays(data.province, data.municipality).includes(data.barangay),
    {
      path: ["barangay"],
      message: "Selected barangay does not belong to the selected municipality",
    },
  );
