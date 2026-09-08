import { z } from "zod";
export const tripTicketFormSchema = z.object({
  tripTicketNo: z.string().trim().min(1, "Trip Ticket is Required"),
  startDate: z.coerce.date({ message: "Departure date is required" }),
  endDate: z.coerce.date({ message: "Return date is required" }),
  driverName: z.string().trim().min(1, "Driver name is Required"),
  authorizedPassengers: z
    .string()
    .trim()
    .min(1, "Authorized Passengers is Required"),
  placesToVisit: z.string().trim().min(1, "Place to visit is Required"),
  purpose: z.string().trim().min(1, "Purpose is Required"),
  vehicleId: z.coerce
    .number({ message: "Plate Number is Required" })
    .positive(), //2. Government vehicle to be used, Plate No.
});

export const updatetripTicketFormSchema = tripTicketFormSchema.partial();
