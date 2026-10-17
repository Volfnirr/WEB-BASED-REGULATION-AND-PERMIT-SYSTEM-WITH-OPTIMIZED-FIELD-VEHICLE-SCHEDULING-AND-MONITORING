import { z } from "zod";

const name = (label) =>
  z.string().trim().min(1, `${label} is required`).max(100);
export const driverSchema = z.object({
  firstName: name("First name"),
  lastName: name("Last name"),
  middleName: z.string().trim().max(100).optional(),
  extensionName: z.string().trim().max(10).optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(255)
    .pipe(z.email("Enter a valid email")),
});

export const updateDriverSchema = driverSchema
  .partial()
  .extend({ isActive: z.boolean().optional() })
  .refine((value) => Object.keys(value).length > 0, "No changes supplied");

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  .refine(
    (value) =>
      !Number.isNaN(Date.parse(value)) &&
      new Date(value).toISOString().slice(0, 10) === value,
    "Invalid date",
  );

export const scheduleRangeSchema = z
  .object({ startDate: dateOnly, endDate: dateOnly })
  .refine(
    (value) => value.endDate >= value.startDate,
    "End date cannot be before start date",
  );

export const availabilitySchema = scheduleRangeSchema.safeExtend({
  excludeTripTicketId: z.coerce.number().int().positive().optional(),
});

export const blockedDatesSchema = scheduleRangeSchema.safeExtend({
  driverId: z.coerce.number().int().positive(),
  reason: z.string().trim().min(1, "A reason is required").max(500),
});
