"use server";

import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { BookingData } from "@/app/actions/send-booking";
import { NewBookingEmailTemplate } from "@/components/emails/NewBookingEmailTemplate";


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
    let stopsForDb = booking.stops ?? [];

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
    
    console.log("insertResult[0] : ",insertResult[0])
    stopsForDb= [booking.from_location , ...stopsForDb ]
    if(booking.category==='trip'){
      stopsForDb= [...stopsForDb, booking.to_location ]  
    }else{
      stopsForDb= [...stopsForDb, String(booking.hours + ' hours') ]  
    }

    const insertedId = insertResult[0]?.id;
    const orderLink = `https://dsllimoservice.com/order/${insertedId}`;
    const carImage = `https://dsllimoservice.com/order/${booking.carImage}`;
    const stops = stopsForDb.map((item,index)=>({label:index===0? 'Pickup Location' : stopsForDb.length-1 === index ? booking.category==='hourly' ? 'Duration' : 'Dropoff Location'  : 'Stop ' + index  , value:stopsForDb.length-1 === index && booking.category==='hourly' ? item + ' hours' : item}))
    const htmEmail = await render(NewBookingEmailTemplate({carImage, stops, viewOrderLink:orderLink}))

    const transporter = nodemailer.createTransport(emailConfig);

    const emailResponse = await transporter.sendMail({
      from: `info@dsllimoservice.com`,
      to:[ booking.email, 'info@dsllimoservice.com'],
      subject: `Booking Confirmation - DSL Limo Service`,
      html: htmEmail,
    });
    console.log("emailResponse ",emailResponse)

    return {
      success: true,
      message: "Email sent successfully.",
      id: insertedId ,
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
