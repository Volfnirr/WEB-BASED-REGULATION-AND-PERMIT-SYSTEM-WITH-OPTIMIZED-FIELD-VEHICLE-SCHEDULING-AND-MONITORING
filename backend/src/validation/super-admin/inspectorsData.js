import z from "zod";

export const createInspectorSchema = z.object({
  lastName: z.string().trim().min(1, "Last name is required"),
  firstName: z.string().trim().min(1, "First name is required"),
  middleName: z.string().trim().optional(),
  extensionName: z.string().trim().optional(),
  email: z.email("Invalid email"),
});
