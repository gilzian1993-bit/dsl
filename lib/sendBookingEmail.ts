"use server";

import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import BookingEmailTemplate from "@/components/emails/BookingEmailTemplate";

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
  distance?: number;

  rear_seats?: number;
  booster_seats?: number;
  infantSeat?: number;
  return_rear_seats?: number;
  return_booster_seats?: number;
  return_infantSeat?: number;

  meetGreet?: boolean;
  returnMeetGreet?: boolean;

  payment_id: string;
  base_price: number;
  gratuity?: number;
  tax?: number;
  discount?: number;
  isMeetGreetPrice?: number;
  rearSeatPrice?: number;
  infantSeatPrice?: number;
  boosterSeatPrice?: number;
  returnPrice?: number;
  isReturnMeetGreetPrice?: number;
  returnRearSeatPrice?: number;
  returnInfantSeatPrice?: number;
  returnBoosterSeatPrice?: number;
  totalPrice: number;

  isAirportPickup?: boolean;
  isFlightTrack?: boolean;
  category: "trip" | "hourly";
}
const emailConfig = {
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "info@dsllimoservice.com",
    pass: process.env.EMAIL_PASS || "Dsllimo12$",
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
}

export async function sendBookingEmail(booking: BookingData) {
  try {
    const stopsForDb = booking.stops ?? [];

    const insertResult = await db.insert(bookings).values({
      payment_id: booking.payment_id,
      name: booking.name,
      email: booking.email,
      phone_number: booking.phone_number,
      from_location: booking.from_location,
      to_location: booking.to_location,
      stops: stopsForDb,
      pickup_date: booking.pickup_date,
      pickup_time: booking.pickup_time,
      return_date: booking.return_date,
      return_time: booking.return_time,
      passengers: booking.passengers,
      luggage: booking.luggage,
      flight_number: booking.flight_number,
      airline_code: booking.airline_code,
      return_flight_number: booking.return_flight_number,
      return_airline_code: booking.return_airline_code,
      car_type: booking.car_type,
      return_trip: booking.returnTrip,
      trip_type: booking.tripType,
      hours: booking.hours,
      distance: String(booking.distance),
      rear_seats: booking.rear_seats,
      booster_seats: booking.booster_seats,
      infant_seat: booking.infantSeat,
      return_rear_seats: booking.return_rear_seats,
      return_booster_seats: booking.return_booster_seats,
      return_infant_seat: booking.return_infantSeat,
      meet_greet: booking.meetGreet,
      return_meet_greet: booking.returnMeetGreet,
      base_price: String(booking.base_price),
      gratuity: String(booking.gratuity),
      tax: String(booking.tax),
      discount: String(booking.discount),
      is_meet_greet_price: String(booking.isMeetGreetPrice),
      rear_seat_price: String(booking.rearSeatPrice),
      infant_seat_price: String(booking.infantSeatPrice),
      booster_seat_price: String(booking.boosterSeatPrice),
      return_price: String(booking.returnPrice),
      is_return_meet_greet_price: String(booking.isReturnMeetGreetPrice),
      return_rear_seat_price: String(booking.returnRearSeatPrice),
      return_infant_seat_price: String(booking.returnInfantSeatPrice),
      return_booster_seat_price: String(booking.returnBoosterSeatPrice),
      total_price: String(booking.totalPrice),
      is_airport_pickup: booking.isAirportPickup,
      is_flight_track: booking.isFlightTrack
    }).returning();

    const insertedId = insertResult[0]?.id;

    const emailHtml = await render(
      BookingEmailTemplate(booking,)
    );

    const transporter = nodemailer.createTransport(emailConfig);

    const emailResponse = await transporter.sendMail({
      from: `info@dsllimoservice.com`,
      to:[ booking.email, 'info@dsllimoservice.com'],
      subject: `Booking Confirmation - DSL Limo Service`,
      html: emailHtml,
    });
    console.log("emailResponse ",emailResponse)

    return {
      success: true,
      message: "Email sent successfully.",
      id: insertedId ?? null,
    };
  } catch (error) {
    console.error("❌ Error sending booking email:", error);
    return {
      success: false,
      message: `Failed to send booking email: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
