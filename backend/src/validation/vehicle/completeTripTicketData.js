import { z } from "zod";

const driverTripTicketSchema = z.object({
  selectedTripTicketId: z.string().min(1, "Please select an available trip ticket"),
  timeOfDeparture: z.coerce.date({
    required_error: "Departure time is required",
    invalid_type_error: "Departure time is required",
  }),
  placesVisited: z
    .array(
      z.object({
        place: z.string().trim().min(1, "Place name is required"),
        timeOfArrival: z.coerce.date().optional().nullable(),
        timeOfDeparture: z.coerce.date().optional().nullable(),
      })
    )
    .min(1, "At least one place log is required"),
  timeOfArrivalBack: z.coerce.date({
    required_error: "Arrival time is required",
    invalid_type_error: "Arrival time is required",
  }),
  approxDistance: z.coerce
    .number({
      required_error: "Distance is required",
      invalid_type_error: "Must be a valid number",
    })
    .min(0, "Cannot be negative")
    .max(500, "Distance exceeds typical provincial routes"),
  fuelBalance: z.coerce
    .number({ required_error: "Required", invalid_type_error: "Required" })
    .min(0, "Min 0")
    .max(100, "Exceeds standard tank capacity"),
  fuelIssued: z.coerce
    .number({ required_error: "Required", invalid_type_error: "Required" })
    .min(0, "Min 0")
    .max(100, "Exceeds standard tank capacity"),
  fuelPurchased: z.coerce
    .number({ required_error: "Required", invalid_type_error: "Required" })
    .min(0, "Min 0")
    .max(100, "Exceeds standard tank capacity"),
  gearOilIssued: z.coerce
    .number({ required_error: "Required", invalid_type_error: "Required" })
    .min(0, "Min 0")
    .max(10, "Amount too high"),
  lubOilIssued: z.coerce
    .number({ required_error: "Required", invalid_type_error: "Required" })
    .min(0, "Min 0")
    .max(10, "Amount too high"),
  greaseIssued: z.coerce
    .number({ required_error: "Required", invalid_type_error: "Required" })
    .min(0, "Min 0")
    .max(10, "Amount too high"),
  speedometerStart: z.coerce.number().optional().nullable(),
  speedometerEnd: z.coerce.number().optional().nullable(),
  remarks: z.string().trim().min(1, "Remarks are required"),

  driverSignature: z.string().trim().optional(),
  passengers: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Passenger name is required"),
        signature: z.string().trim().optional(),
      })
    )
    .optional(),
  recommendingApproval: z.string().trim().optional(),
  approvedBy: z.string().trim().optional(),

  totalFuel: z.coerce.number().optional(),
  computedDistance: z.coerce.number().optional(),
});

export const completeTripTicketSchema = z.object({
  id: z.string().min(1, "Trip Ticket ID is required"),
  data: driverTripTicketSchema,
});

export const updateCompleteTripTicketSchema = driverTripTicketSchema.omit({
  selectedTripTicketId: true,
});