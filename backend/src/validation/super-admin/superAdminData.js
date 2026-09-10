import { z } from "zod";
export const assignServicesSchema = z.array(
  z.object({
    userId: z.string(),
    serviceId: z.number().int().min(1).max(4),
  }),
);
