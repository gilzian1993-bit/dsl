// schemas/bookingSchema.ts
import { z } from "zod";

export const bookingSchema = z.object({
  tripType: z.enum(["pointToPoint", "hourlyRate"]),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  dropLocation: z.string().optional(), // conditionally validated
 pickupDate: z
    .date()
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "Invalid date",
    }),
  selectedTime: z.string().min(1, "Time is required"),
  hours: z.number().min(1, "Please select duration"),
});
