"use client";

import {
    ArrowLeft,
    ArrowRight,
    MapPin,
    Info,
    Edit,
} from "lucide-react";
import { useState } from "react";
import { CardElement, useStripe, useElements, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import PaymentCard from "../PaymentCard";

interface UserInfo {
    fullName: string;
    email: string;
    phone: string;
}
interface VehicleOption {
    id: number;
    name: string;
    type: string;
    image: string;
    price: number;
    passengers: number;
    bags: number;
    features: string[];
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
if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("Key not defined")
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? '')

export default function PaymentSection({
    vehicle,
    onBack,
    step,
    pickupLocation,
    dropLocation,
    pickupDate,
    pickupTime,
    meetGreetYes,
}: UserInformationProps) {
    const [loading, setLoading] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    const meetGreetCost = meetGreetYes === true ? 25 : 0;
    const totalPrice = vehicle.price + meetGreetCost;



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
            <div className="min-h-screen max-w-5xl mx-auto">
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
                                        <img src="/calendar.svg" alt="Calendar" className="w-4 h-4" />
                                        <span className="font-medium">{pickupDate}</span>
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
                        <div
                            className="bg-white md:block hidden rounded-lg p-6 mt-6 md:mt-10 "
                            style={{
                                boxShadow: "0 6px 12px 0 rgba(0, 0, 0, 0.05)",
                            }}
                        >
                            {/* Header */}
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
                                <span className="ml-auto text-sm font-bold text-gray-600"> ${vehicle.price.toFixed(2)}</span>
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
                                    ${totalPrice.toFixed(2)}
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
                                amount: Math.round(vehicle.price * 100), // ✅ number in cents
                                currency: "usd",
                            }}
                        >


                            <PaymentCard  amount={Math.round(totalPrice * 100)} />

                        </Elements>
                    </div>


                </div >
            </div >
        </>
    );
}
