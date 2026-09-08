import { z } from "zod";
export const vehicleSchema = z.object({
  brand: z.string().trim().min(1, "Brand name is required"),
  model: z.string().trim().min(1, "Modela name is required"),
  plateNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}\s?\d{3,4}$/, "Invalid Philippine plate number"),
  fuelType: z.enum(
    ["DIESEL", "GASOLINE", "ELECTRIC"],
    "Please select a fuel type",
  ),
  seatCapacity: z.coerce.number(),
  color: z.string().trim(),
  isUsable: z
    .preprocess((val) => val === "true" || val === true, z.boolean())
    .optional(),
  lastMaintenanceDate: z.coerce.date().optional(),
  lastRegistrationDate: z.coerce.date().optional(),
  registrationExpiration: z.coerce.date().optional(),
  imageUrl: z
    .object({
      buffer: z.instanceof(Buffer),
      originalname: z.string(),
      mimetype: z.enum(["image/jpeg", "image/png", "image/webp"]),
      size: z.number().max(5 * 1024 * 1024, "File size must not exceed 5MB"),
    })
    .optional(),
});

export const updateVehicleSchema = vehicleSchema.partial();
