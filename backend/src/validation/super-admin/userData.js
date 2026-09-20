import { z } from "zod";
export const editUser = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),
});
