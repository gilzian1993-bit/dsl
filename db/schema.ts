import {  serial, varchar, integer, boolean, jsonb, numeric, timestamp, pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => name);

export const bookings = createTable("dsl_booking", {
  id: serial("id").primaryKey(),

  // Basic Info
  payment_id: varchar("payment_id", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone_number: varchar("phone_number", { length: 50 }).notNull(),

  // Route Info
  from_location: varchar("from_location", { length: 500 }).notNull(),
  to_location: varchar("to_location", { length: 500 }).notNull(),
  stops: jsonb("stops").$type<string[]>(),
  pickup_date: varchar("pickup_date", { length: 50 }),
  pickup_time: varchar("pickup_time", { length: 50 }),
  return_date: varchar("return_date", { length: 50 }),
  return_time: varchar("return_time", { length: 50 }),

  // Passenger Info
  passengers: integer("passengers"),
  luggage: integer("luggage"),

  // Flight Info
  flight_number: varchar("flight_number", { length: 255 }),
  airline_code: varchar("airline_code", { length: 255 }),
  return_flight_number: varchar("return_flight_number", { length: 255 }),
  return_airline_code: varchar("return_airline_code", { length: 255 }),

  // Car & Trip Info
  car_type: varchar("car_type", { length: 255 }),
  return_trip: boolean("return_trip").default(false),
  trip_type: varchar("trip_type", { length: 50 }),
  hours: varchar("hours", { length: 50 }),
  distance: numeric("distance", { precision: 10, scale: 2 }),

  // Seats
  rear_seats: integer("rear_seats"),
  booster_seats: integer("booster_seats"),
  infant_seat: integer("infant_seat"),
  return_rear_seats: integer("return_rear_seats"),
  return_booster_seats: integer("return_booster_seats"),
  return_infant_seat: integer("return_infant_seat"),

  // Meet & Greet
  meet_greet: boolean("meet_greet").default(false),
  return_meet_greet: boolean("return_meet_greet").default(false),

  // Pricing
  base_price: numeric("base_price", { precision: 10, scale: 2 }),
  gratuity: numeric("gratuity", { precision: 10, scale: 2 }),
  tax: numeric("tax", { precision: 10, scale: 2 }),
  discount: numeric("discount", { precision: 10, scale: 2 }),
  is_meet_greet_price: numeric("is_meet_greet_price", { precision: 10, scale: 2 }),
  rear_seat_price: numeric("rear_seat_price", { precision: 10, scale: 2 }),
  infant_seat_price: numeric("infant_seat_price", { precision: 10, scale: 2 }),
  booster_seat_price: numeric("booster_seat_price", { precision: 10, scale: 2 }),
  return_price: numeric("return_price", { precision: 10, scale: 2 }),
  is_return_meet_greet_price: numeric("is_return_meet_greet_price", { precision: 10, scale: 2 }),
  return_rear_seat_price: numeric("return_rear_seat_price", { precision: 10, scale: 2 }),
  return_infant_seat_price: numeric("return_infant_seat_price", { precision: 10, scale: 2 }),
  return_booster_seat_price: numeric("return_booster_seat_price", { precision: 10, scale: 2 }),
  total_price: numeric("total_price", { precision: 10, scale: 2 }),

  // Optional flags
  is_airport_pickup: boolean("is_airport_pickup").default(false),
  is_flight_track: boolean("is_flight_track").default(false),

  // Timestamp
  created_at: timestamp("created_at").defaultNow().notNull(),
});
