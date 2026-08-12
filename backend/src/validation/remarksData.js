import { z } from "zod";
export const remarks = z.object({
  remarks: z.string().trim().min(1, "Remarks is required"),
});
