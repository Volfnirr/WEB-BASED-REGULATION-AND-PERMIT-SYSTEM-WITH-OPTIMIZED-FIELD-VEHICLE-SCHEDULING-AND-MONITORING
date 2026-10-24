import { z } from "zod";

export const inspectorAssignment = z
  .object({
    assignedInspector: z.number().int().positive().max(2147483647),
  })
  .strict();
