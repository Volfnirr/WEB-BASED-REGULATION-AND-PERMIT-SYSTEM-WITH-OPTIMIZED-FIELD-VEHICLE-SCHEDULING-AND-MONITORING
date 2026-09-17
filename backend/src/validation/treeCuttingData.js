import { z } from "zod";
export const treeCuttingFormSchema = z.object({
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
  middleName: z.string().trim().max(100, "Middle name is too long").optional(),
  extensionName: z
    .string()
    .trim()
    .max(100, "Extension name is too long")
    .optional(),
  email: z.email("Invalid email"),
  fullAddress: z
    .string()
    .trim()
    .min(1, "Full address is required")
    .max(255, "Full address is too long"),
  treeCuttingAddress: z
    .string()
    .trim()
    .min(1, "Tree Cutting Address is required")
    .max(255, "Tree Cutting Address is too long"),
  noTreesToBeRemoved: z.coerce
    .number()
    .min(1, "Must remove at least one tree")
    .max(1000, "Number of trees cannot exceed 1,000"),
  signatureName: z
    .string()
    .trim()
    .min(1, "Signature name is required")
    .max(100, "Signature name is too long"),
  privacyConsent: z.literal(true, "Please check this box to proceed"),
  contactNo: z
    .string()
    .regex(/^09\d{9}$/, "Enter a valid Philippine mobile number")
    .min(11, "Phone number must be 11 digits.")
    .max(11, "Phone number must be 11 digits."),
});
