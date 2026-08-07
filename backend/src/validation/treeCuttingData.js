import { z } from "zod";
export const treeCuttingFormSchema = z.object({
  lastName: z.string().min(1, "Last name is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  extensionName: z.string().optional(),
  email: z.email("Invalid email"),
  fullAddress: z.string().min(1, "More than 1 character is required"),
  treeCuttingAddress: z.string().min(1),
  noTreesToBeRemoved: z.coerce.number().min(1, "Must remove at least one tree"),
  signatureName: z.string().min(1),
  privacyConsent: z.literal(true),
  contactNo: z
    .string()
    .regex(/^09\d{9}$/, "Enter a valid Philippine mobile number")
    .min(11, "Phone number must be 11 digits.")
    .max(11, "Phone number must be 11 digits."),
});
