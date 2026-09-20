import z from "zod";

export const createInspectorSchema = z.object({
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
});

export const updatetripInspectorSchema = createInspectorSchema.partial();
