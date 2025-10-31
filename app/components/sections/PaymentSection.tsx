"use client";

import {
    ArrowLeft,
    ArrowRight,
    MapPin,
    Info,
    Edit,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import PaymentCard from "../PaymentCard";
import Image from "next/image";
interface PaymentSectionProps {
    step: number;
    vehicle: VehicleOption;
    pickupLocation: string;
    dropLocation: string;
    pickupDate: string;
    pickupTime: string;
    passengers: number;
    luggage: number;
    fullName: string;
    email: string;
    phone: string;
    tripType: string;
    selectedVehicle: VehicleOption;
    ReturnMeetGreetYes: boolean;
    // Toggles
    meetGreetYes: boolean;
    airportPickup: boolean;
    carSeats: boolean;
    returnTrip: boolean;
    returnPickupLocation: string,
    // Extra fields
    rearFacingSeat: number;
    boosterSeat: number;
    airlineCode?: string;
    flightNumber?: string;
    returnDate?: string;
    returnTime?: string;

    totalPrice: number;
    onBack: () => void;
    onNext: () => void;
}

interface UserInfo {
    fullName: string;
    email: string;
    phone: string;
}
interface Price {
    basePrice: number;
    gratuity: number;
    tollFee: number;
    airportFee: number;
    tax: number;
    total: number;
}

interface VehicleOption {
    id: number;
    name: string;
    type: string;
    image: string;
    passengers: number;
    bags: number;
    hourly?: number;
    features?: string[];
    price: number | Price;   // 👈 can be number OR object
    tripType?: string;
    vehicleTitle?: string;
    basePrice?: number;
    //  base: number;
}
interface UserInformationProps {
    vehicle: VehicleOption;
    pickupLocation: string;
    dropLocation: string;
    pickupDate: string;
    pickupTime: string;
    onNext: (info: UserInfo) => void;
    onBack: () => void;
    step: number;
    meetGreetYes: boolean;
}
if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
    throw new Error("Key not defined")
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')
interface PaymentSectionProps {
    step: number;
    vehicle: VehicleOption;
    pickupLocation: string;
    dropLocation: string;
    pickupDate: string;
    pickupTime: string;
    passengers: number;
    luggage: number;
    fullName: string;
    email: string;
    phone: string;
    tripType: string;
    ReturnMeetGreetYes: boolean,
    returnPickupLocation: string,
    // Toggles
    meetGreetYes: boolean;
    airportPickup: boolean;
    returnCarSeats:boolean;
    carSeats: boolean;
    returnTrip: boolean;
    hours: number;
    distance: number;
    // Extra fields
    returnRearFacingSeat: number;
    returnBoosterSeat: number;
    rearFacingSeat: number;
    boosterSeat: number;
    returnflightNumber?: string;
    returnAirlineCode?: string;
    returnStop1?: string,
    returnStop2?: string,
    returnStop3?: string,
    returnStop4?: string,
    returnStopsCount?: string,
    airlineCode?: string;
    flightNumber?: string;
    returnDate?: string;
    returnTime?: string;
    infantSeat: string;
    returnInfantSeat: string;
    finalTotal: number;
    totalPrice: number;
    onBack: () => void;
    onNext: () => void;
}

export default function PaymentSection({
    vehicle,
    onBack,
    onNext,
    step,
    fullName,
    email,
    phone,
    tripType,

    pickupLocation,
    dropLocation,
    pickupDate,
    pickupTime,
    passengers,
    luggage,
    returnBoosterSeat,
    returnRearFacingSeat,
    rearFacingSeat,
    boosterSeat,
    meetGreetYes,
    airportPickup,
    returnCarSeats,
    carSeats,
    returnTrip,
    totalPrice,
    hours,
    distance,
    returnflightNumber,
    returnAirlineCode,

    // 👇 add these missing ones
    airlineCode,
    flightNumber,
    finalTotal,
    returnDate,
    returnTime,
    selectedVehicle,
    ReturnMeetGreetYes,
    returnPickupLocation,
    returnStop1,
    returnStop2, returnStop3, returnStop4, returnStopsCount, infantSeat, returnInfantSeat

}: PaymentSectionProps) {
    useEffect(() => {
        console.log("=== PAYMENT SECTION PROPS ===");
        console.log("returnStop1:", returnStop1);
        console.log("returnStop2:", returnStop2);
        console.log("returnStop3:", returnStop3);
        console.log("returnStop4:", returnStop4);
        console.log("returnStopsCount:", returnStopsCount);
        console.log("Step:", step);
        console.log("Selected:", selectedVehicle);
        console.log("Vehicle:", vehicle);
        console.log("Pickup Location:", pickupLocation);
        console.log("Drop Location:", dropLocation);
        console.log("Pickup Date:", pickupDate);
        console.log("Pickup Time:", pickupTime);
        console.log("Passengers:", passengers);
        console.log("Luggage:", luggage);
        console.log("Full Name:", fullName);
        console.log("Email:", email);
        console.log("Phone:", phone);
        console.log("Trip Type:", tripType);
        console.log("Meet & Greet:", meetGreetYes);
        console.log("Airport Pickup:", airportPickup);
        console.log("Car Seats:", carSeats);
        console.log("Return Trip:", returnTrip);
        console.log("Rear Facing Seats:", rearFacingSeat);
        console.log("Booster Seats:", boosterSeat);
        console.log("Airline Code:", airlineCode);
        console.log("Flight Number:", flightNumber);
        console.log("Return Date:", returnDate);
        console.log("Return Time:", returnTime);
        console.log("Total Price:", totalPrice);
        console.log("Final Total:", finalTotal);
        console.log("Hours:", hours);
        console.log("Distance:", distance);
        console.log("=============================");
    }, [
        step, vehicle, pickupLocation, dropLocation, pickupDate, pickupTime,
        passengers, luggage, fullName, email, phone, tripType, meetGreetYes,
        airportPickup, carSeats, returnTrip, rearFacingSeat, boosterSeat,
        airlineCode, flightNumber, returnDate, returnTime, totalPrice,
        finalTotal, hours, distance
    ]);

    const meetGreetCost = meetGreetYes ? 25 : 0;

    const getVehiclePrice = (vehicle: VehicleOption): number => {
        if (typeof vehicle.price === "number") {
            return vehicle.price;
        }
        return vehicle.price.total;
    };

    const basePrice = getVehiclePrice(vehicle);
    // const finalTotal = totalPrice ?? basePrice + meetGreetCost;
    console.log("finalTotal:", finalTotal);



    return (
        <>
            <div className="bg-[#DDDDDD] md:block hidden px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center font-semibold text-gray-700 hover:text-black">
                        <ArrowLeft className="h-4 w-4" />
                        BACK
                    </button>
                    <h1 className="text-lg font-semibold">{step} - Select Your Vehicle</h1>
                </div>
            </div>

            {/* Layout */}
            <div className="min-h-screen max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row">


                    {/* Left Panel (Trip details) */}
                    <div className="w-full md:w-80 p-4">

                        {/* Mobile: Trip Details */}
                        {/* <div className="md:hidden block mb-3">
                            <button
                                onClick={() => setShowTripDetailsMobile(!showTripDetailsMobile)}
                                className="w-full bg-[#008492] p-5 text-white rounded-md flex justify-between items-center"
                            >
                                <span>Pickup Trip Details</span>
                                <ChevronDown className={`transition-transform ${showTripDetailsMobile ? "rotate-180" : ""}`} />
                            </button>

                            {showTripDetailsMobile && (
                                <div className="space-y-4 mt-7">
                                  
                                    <div className="relative flex flex-col space-y-6">
                                        <div className="flex items-start gap-3 relative">
                                            <div className="bg-black rounded-full p-2 flex items-center justify-center z-10">
                                                <MapPin className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    Chicago O'Hare International Airport
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    West O'Hare Avenue, Chicago, IL, USA
                                                </p>
                                            </div>
                                            <div className="absolute left-[14px] top-8 w-0.5 h-16 bg-gray-300"></div>
                                        </div>
                                    </div>

                              
                                    <div className="flex items-start gap-3">
                                        <div className="bg-[#008492] rounded-full p-2 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                Chicago Midway International Airport
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                South Cicero Avenue, Chicago, IL, USA
                                            </p>
                                        </div>
                                    </div>

                              
                                    <div className="ml-3 pt-3">
                                        <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
                                            <img src="/calendar.svg" alt="Calendar" className="w-4 h-4" />
                                            <span className="font-medium">Tue, Sep 2nd, 2025</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <img src="/clock--.svg" alt="Clock" className="w-4 h-4" />
                                            <span className="font-medium">12:00 AM</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <img src="/clock--.svg" alt="Clock" className="w-4 h-4" />
                                            <span className="font-medium">2 Passengers</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <img src="/clock--.svg" alt="Clock" className="w-4 h-4" />
                                            <span className="font-medium">2 Luggages</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {
                                showTripDetailsMobile && (<div
                                    className="bg-white md:hidden block rounded-lg p-6 mt-6 md:mt-10 "
                                    style={{
                                        boxShadow: "0 6px 12px 0 rgba(0, 0, 0, 0.05)",
                                    }}
                                >
                                 
                                    <div className="flex items-center justify-between mb-4">

                                        <h2 className="font-bold text-base text-gray-800">Price Breakdown</h2>

                                        <button className="flex items-center gap-2 px-4  py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="bg-[#008492] p-1.5 rounded-md flex items-center justify-center">
                                            <ArrowRight className="w-4 h-4 text-white" />
                                        </div>
                                        <h2 className="font-bold text-gray-800">Pickup </h2>
                                        <span className="ml-auto text-sm font-bold text-gray-600">$148.48</span>
                                    </div>

                                    <hr className="border-black mb-4" />
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className=" flex items-center justify-center">
                                            <img src="/meet.svg" alt="Clock" className="w-6 h-6" />
                                        </div>
                                        <h2 className="font-light text-gray-800">Meet & Greet </h2>
                                        <span className="ml-auto text-base font-light text-gray-600">$30.00</span>
                                    </div>
                                    <hr className="border-black border-dotted mb-4" />
                                    <div className="flex items-center gap-2 mb-3">

                                        <h2 className="font-light text-gray-800">Total Price</h2>
                                        <span className="ml-auto text-base font-bold text-gray-600">$178.48</span>
                                    </div>
                                    <hr className="border-black border-dotted mb-3" />
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-3">
                                            <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm font-semibold whitespace-nowrap text-gray-700">Tolls will be additional if applicable.</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">Tip – Standard gratuity 20%.</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">Airport Fee – $5 per trip.</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">Tax – 5% applied to total fare.</span>
                                        </div>
                                    </div>
                                </div>)
                            }

                        </div> */}

                        <div className="rounded-2xl  md:block hidden bg-white shadow-[0_6px_12px_0_rgba(0,0,0,0.1)] p-5 w-full max-w-md">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-[#008492] p-1.5 rounded-md flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="font-semibold text-gray-800">Pickup Trip Details</h2>
                            </div>

                            <hr className="border-black mb-4" />

                            <div className="space-y-4">
                                {/* From Location */}
                                <div className="relative flex flex-col space-y-6">
                                    <div className="flex items-start gap-3 relative">
                                        <div className="bg-black rounded-full p-2 flex items-center justify-center z-10">
                                            <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {pickupLocation}
                                            </p>

                                        </div>
                                        <div className="absolute left-[14px] top-8 w-0.5 h-16 bg-gray-300"></div>
                                    </div>
                                </div>

                                {/* To Location */}
                                <div className="flex items-start gap-3">
                                    <div className="bg-[#008492] rounded-full p-2 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {dropLocation}
                                        </p>

                                    </div>
                                </div>

                                {/* Date & Time */}
                                <div className="ml-3 pt-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
                                        <span className="font-medium">  {pickupDate
                                            ? new Date(pickupDate).toLocaleDateString("en-US", {
                                                weekday: "short",   // e.g. Mon
                                                month: "short",     // e.g. Sep
                                                day: "numeric",     // e.g. 12
                                                year: "numeric",    // e.g. 2025
                                            })
                                            : ""}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
                                        <img src="/clock--.svg" alt="Clock" className="w-4 h-4" />
                                        <span className="font-medium">{pickupTime}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
                                        <img src="/passengers.svg" alt="Clock" className="w-4 h-4" />
                                        <span className="font-medium">{vehicle.passengers} Passengers</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
                                        <img src="/luggage.svg" alt="Clock" className="w-4 h-4" />
                                        <span className="font-medium">{vehicle.bags} Lugagge</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl mt-6 md:block hidden bg-white shadow-[0_6px_12px_0_rgba(0,0,0,0.1)] p-5 w-full max-w-md">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-[#008492] p-1.5 rounded-md flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="font-semibold text-gray-800">Return Trip Details</h2>
                            </div>

                            <hr className="border-black mb-4" />

                            <div className="space-y-4">
                                {/* From Location */}
                                <div className="relative flex flex-col space-y-6">
                                    <div className="flex items-start gap-3 relative">
                                        <div className="bg-black rounded-full p-2 flex items-center justify-center z-10">
                                            <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {dropLocation}
                                            </p>

                                        </div>
                                        <div className="absolute left-[14px] top-8 w-0.5 h-16 bg-gray-300"></div>
                                    </div>
                                </div>

                                {/* To Location */}
                                <div className="flex items-start gap-3">
                                    <div className="bg-[#008492] rounded-full p-2 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {pickupLocation}
                                        </p>

                                    </div>
                                </div>

                                {/* Date & Time */}
                                <div className="ml-3 pt-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
                                        <Image src="/calendar.svg" alt="Calendar" width={16} height={16} />
                                        <span className="font-medium">  {returnDate
                                            ? new Date(returnDate).toLocaleDateString("en-US", {
                                                weekday: "short",   // e.g. Mon
                                                month: "short",     // e.g. Sep
                                                day: "numeric",     // e.g. 12
                                                year: "numeric",    // e.g. 2025
                                            })
                                            : ""}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
                                        <img src="/clock--.svg" alt="Clock" className="w-4 h-4" />
                                        <span className="font-medium">{returnTime}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
                                        <img src="/passengers.svg" alt="Clock" className="w-4 h-4" />
                                        <span className="font-medium">{vehicle.passengers} Passengers</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
                                        <img src="/luggage.svg" alt="Clock" className="w-4 h-4" />
                                        <span className="font-medium">{vehicle.bags} Lugagge</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-white md:block hidden rounded-lg p-6 mt-6 md:mt-10 "
                            style={{
                                boxShadow: "0 6px 12px 0 rgba(0, 0, 0, 0.05)",
                            }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">

                                <h2 className="font-bold text-base text-gray-800">Price Breakdown</h2>


                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-[#008492] p-1.5 rounded-md flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="font-bold text-gray-800">Pickup </h2>
                                <span className="ml-auto text-sm font-bold text-gray-600"> ${typeof vehicle.price === "number"
                                    ? vehicle.price.toFixed(2)
                                    : Number(vehicle.price.total).toFixed(2)}
                                </span>
                            </div>

                            <hr className="border-black mb-4" />
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center justify-center">
                                    <img src="/meet.svg" alt="Clock" className="w-6 h-6" />
                                </div>
                                <h2 className="font-light text-gray-800">Meet & Greet </h2>
                                <span className="ml-auto text-base font-light text-gray-600">
                                    ${meetGreetCost.toFixed(2)}
                                </span>
                            </div>
                            <hr className="border-black border-dotted mb-4" />

                            <div className="flex items-center gap-2 mb-3">
                                <h2 className="font-light text-gray-800">Total Price</h2>
                                <span className="ml-auto text-base font-bold text-gray-600">
                                    ${(finalTotal).toFixed(2)}
                                </span>
                            </div>

                            <hr className="border-black border-dotted mb-3" />
                            <div className="space-y-2">
                                <div className="flex items-start gap-3">
                                    <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm font-semibold whitespace-nowrap text-gray-700">Tolls will be additional if applicable.</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">Tip – Standard gratuity 20%.</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">Airport Fee – $5 per trip.</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">Tax – 5% applied to total fare.</span>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* RIGHT PANEL - Stripe Payment */}
                    <div className="flex-1 p-4">
                        <Elements
                            stripe={stripePromise}
                            options={{
                                mode: "payment",          // ✅ must specify mode when using amount/currency
                                amount: Math.round(totalPrice * 100), // ✅ number in cents
                                currency: "usd",
                            }}
                        >


                            <PaymentCard
                                amount={Math.round(totalPrice * 100)}
                                selectedVehicle={selectedVehicle}
                                vehicle={vehicle}
                                hours={hours}

                                finalTotal={finalTotal}
                                pickupLocation={pickupLocation}
                                dropLocation={dropLocation}
                                pickupDate={pickupDate}
                                pickupTime={pickupTime}
                                passengers={passengers}
                                luggage={luggage}
                                returnBoosterSeat={returnBoosterSeat}
                                returnRearFacingSeat={returnRearFacingSeat}
                                rearFacingSeat={rearFacingSeat}
                                boosterSeat={boosterSeat}
                                meetGreetYes={meetGreetYes}
                                airportPickup={airportPickup}
                                returnCarSeats={returnCarSeats}
                                carSeats={carSeats}
                                fullName={fullName}
                                email={email}
                                tripType={tripType}
                                phone={phone}
                                distance={distance}
                                returnTrip={returnTrip}
                                ReturnMeetGreetYes={ReturnMeetGreetYes}
                                returnAirlineCode={returnAirlineCode}
                                returnflightNumber={returnflightNumber}
                                airlineCode={airlineCode}   // ✅ now uses props
                                flightNumber={flightNumber} // ✅ now uses props
                                returnDate={returnDate}
                                returnTime={returnTime}
                                returnPickupLocation={returnPickupLocation}
                                returnStop1={returnStop1}
                                returnStop2={returnStop2}
                                returnStop3={returnStop3}
                                returnStop4={returnStop4}
                                returnStopsCount={returnStopsCount}
                                infantSeat={infantSeat}
                                returnInfantSeat={returnInfantSeat}

                            />



                        </Elements>
                    </div>


                </div >
            </div >
        </>
    );
}
