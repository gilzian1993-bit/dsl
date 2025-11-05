"use server";

import { sendBookingEmail } from "@/lib/sendBookingEmail";

export interface BookingData {
  name: string;
  email: string;
  phone_number: string;

  from_location: string;
  to_location: string;
  stops: string[];

  pickup_date?: string;
  pickup_time?: string;
  return_date?: string;
  return_time?: string;

  passengers?: number;
  luggage?: number;

  flight_number?: string;
  airline_code?: string;
  return_flight_number?: string;
  return_airline_code?: string;

  car_type?: string;
  returnTrip: boolean;
  tripType: "oneway" | "return";
  hours?: string;
  distance?: string;

  rear_seats?: number;
  booster_seats?: number;
  infantSeat?: number;
  return_rear_seats?: number;
  return_booster_seats?: number;
  return_infantSeat?: number;

  meetGreet?: boolean;
  returnMeetGreet?: boolean;

  payment_id: string;
  base_price: string;
  gratuity?: string;
  tax?: string;
  discount?: string;
  isMeetGreetPrice?: string;
  rearSeatPrice?: string;
  infantSeatPrice?: string;
  boosterSeatPrice?: string;
  returnPrice?: string;
  isReturnMeetGreetPrice?: string;
  returnRearSeatPrice?: string;
  returnInfantSeatPrice?: string;
  returnBoosterSeatPrice?: string;
  totalPrice: string;
  carImage: string;

  isAirportPickup?: boolean;
  isFlightTrack?: boolean;
  category: "trip" | "hourly";
}

export interface BookingResult {
  success: boolean;
  message: string;
}

export async function SendBookingAction(booking: BookingData): Promise<BookingResult> {
  try {
    // ✅ Validate input
    if (!booking.name || !booking.email || !booking.payment_id) {
      return { success: false, message: "Missing required fields." };
    }

    // ✅ Call your email sender function (must be a server-side function)
    const result = await sendBookingEmail(booking);

    if (!result?.success) {
      return {
        success: false,
        message: result?.message ?? "Failed to send booking email.",
      };
    }

    return { success: true, message: "Booking email sent successfully." };
  } catch (error) {
    console.error("❌ Error in sendBookingAction:", error);
    return {
      success: false,
      message: `Internal server error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
