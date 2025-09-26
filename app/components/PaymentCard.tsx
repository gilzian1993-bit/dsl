// PaymentCardCustom.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { v4 as uuidv4 } from "uuid";
import { Check, Info } from "lucide-react";

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
    price: number | Price;
    tripType?: string;
    vehicleTitle?: string;
}

interface PaymentCardProps {
    amount: number;
    vehicle: VehicleOption;
    pickupLocation: string;
    dropLocation: string;
    pickupDate: string;
    pickupTime: string;
    fullName: string;
    email: string;
    phone: string;
    tripType: string;
    passengers: number;
    luggage: number;
    rearFacingSeat: number;
    boosterSeat: number;
    meetGreetYes: boolean;
    airportPickup: boolean;
    carSeats: boolean;
    returnTrip: boolean;
    airlineCode?: string;
    flightNumber?: string;
    returnDate?: string;
    returnTime?: string;
    hours: number;
    distance: number;
    finalTotal: number;
}

const ElementStyles = {
    base: {
        fontSize: "14px",
        color: "#111827",
        "::placeholder": { color: "#9CA3AF" },
        fontSmoothing: "antialiased",
    },
    invalid: {
        color: "#ef4444",
    },
};

export default function PaymentCard({
    amount,
    vehicle,
    pickupLocation,
    dropLocation,
    pickupDate,
    pickupTime,
    passengers,
    luggage,
    fullName,
    email,
    phone,
    tripType,
    rearFacingSeat,
    boosterSeat,
    meetGreetYes,
    airportPickup,
    carSeats,
    returnTrip,
    airlineCode,
    flightNumber,
    returnDate,
    hours,
    distance,
    returnTime,
    finalTotal
}: PaymentCardProps) {

    const basePrice = typeof vehicle.price === "object" ? vehicle.price.basePrice : vehicle.price;
    const tollFee = typeof vehicle.price === "object" ? vehicle.price.tollFee : 0;
    const airportFee = typeof vehicle.price === "object" ? vehicle.price.airportFee : 0;
    const gratuity = typeof vehicle.price === "object" ? vehicle.price.gratuity : 0;
    const total = typeof vehicle.price === "object" ? vehicle.price.total : vehicle.price;
    const stripe = useStripe();
    const elements = useElements();

    // 🔥 Debug log
    console.log("💰 Pricing Breakdown:", {
        basePrice,
        tollFee,
        airportFee,
        gratuity,
        vehicle,
        total,
        vehiclePrice: vehicle.price
    });

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [cardHolder, setCardHolder] = useState("");
    const [billingAddress, setBillingAddress] = useState("");
    const [maskedNumberPreview, setMaskedNumberPreview] = useState("•••• •••• •••• ••••");
    const [expiryPreview, setExpiryPreview] = useState("••/••");

    function formatIsoDate(isoDate: string | undefined) {
        if (!isoDate) return "";
        const d = new Date(isoDate);
        if (isNaN(d.getTime())) return "";
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${month}-${day}-${year}`;
    }

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/create-payment-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount,
                        vehicle,
                        pickupLocation,
                        dropLocation,
                        pickupDate,
                        pickupTime,
                        meetGreetYes,
                    }),
                });

                if (!res.ok) {
                    const text = await res.text();
                    console.error("❌ Payment Intent fetch failed:", res.status, text);
                    throw new Error("Failed to create payment intent");
                }

                const data = await res.json();
                setClientSecret(data.clientSecret);
            } catch (err) {
                console.error("❌ Fetch Error:", err);
                setErrorMessage(err instanceof Error ? err.message : "Unknown error");
            }
        })();
    }, [amount, vehicle, pickupLocation, dropLocation, pickupDate, pickupTime, meetGreetYes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!stripe || !elements || !clientSecret) {
            setErrorMessage("Payment system not ready.");
            return;
        }

        setLoading(true);
        try {
            const cardElement = elements.getElement(CardNumberElement);
            if (!cardElement) throw new Error("Card element not found");

            const bookingId = uuidv4();

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: cardHolder || fullName || "Guest",
                        email: email,
                        phone: phone,
                        address: billingAddress ? { line1: billingAddress } : undefined,
                    },
                },
            });

            if (error) throw new Error(error.message ?? "Payment failed");
            if (!paymentIntent) throw new Error("No payment intent returned");

            if (paymentIntent?.status === "succeeded") {
                // ✅ FIXED: Make booking API call but don't block redirect on errors
                try {
                    await fetch("https://devsquare-apis.vercel.app/api/dslLimoService/booking", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: bookingId,
                            from_location: pickupLocation,
                            to_location: dropLocation,
                            pickup_date: formatIsoDate(pickupDate),
                            pickup_time: pickupTime,
                            return_date: formatIsoDate(returnDate),
                            return_time: returnTime,
                            price: Math.round(finalTotal),
                            base_price: Math.round(basePrice),
                            tax: 5,
                            airport_fee: 5,
                            
                            gratuity: 20,
                            distance: Math.round(distance),
                            email,
                            hours: tripType === "hourly" ? hours : 0,
                            name: fullName,
                            car_type: vehicle.type,
                            phone_number: phone,
                            Passengers: passengers,
                            luggage,
                            flight_number: flightNumber,
                            airline_code: airlineCode,
                            tripType,
                            rear_seats: rearFacingSeat,
                            booster_seats: boosterSeat,
                            meetGreet: meetGreetYes,
                            airportPickup: airportPickup,
                            carSeats: carSeats,
                        }),
                    });
                } catch (bookingError) {
                    console.error("⚠️ Booking API error (proceeding anyway):", bookingError);
                    // Continue to success page even if booking API fails
                }


                window.location.href = "/payment-success";
            } else {
                setErrorMessage("Payment was not successful.");
            }
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col-reverse md:flex-row gap-6"
            >

                {/* Left side form */}

                <div className="flex-1 space-y-4">
                    <div className="mb-6">
                        <h1 className="text-2xl md:block hidden font-bold text-gray-800 mb-3">PAYMENT INFORMATION</h1>
                        <div className="flex md:block hidden flex-col-reverse md:flex-row items-center gap-2 text-base text-gray-600">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                            <span>All transactions are secure and encrypted. Safe and secure payments.</span>
                        </div>
                        <span className="md:hidden block font-bold text-2xl">Card Details</span>
                    </div>

                    {/* Card Holder */}
                    <div>
                        <label className="text-base text-gray-700 block mb-1">
                            Card Holder Name
                        </label>
                        <input
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="Card Holder Name"
                            className="w-full border rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008492]"
                        />
                    </div>

                    {/* Card Number */}
                    <div>
                        <label className="text-base text-gray-700 block mb-1">
                            Card Number
                        </label>
                        <div className="border rounded-md px-3 py-2">
                            <CardNumberElement options={{ style: ElementStyles }} />
                        </div>
                    </div>

                    {/* Expiry + CVC */}
                    <div className="flex gap-3">
                        <div className="w-1/2">
                            <label className="text-base text-gray-700 block mb-1">
                                Expiration Date
                            </label>
                            <div className="border rounded-md px-3 py-2">
                                <CardExpiryElement options={{ style: ElementStyles }} />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label className="text-base text-gray-700 block mb-1">CVC</label>
                            <div className="border rounded-md px-3 py-2">
                                <CardCvcElement options={{ style: ElementStyles }} />
                            </div>
                        </div>
                    </div>

                    {/* Billing */}
                    {/* <div>
                        <label className="text-base text-gray-700 block mb-1">
                            Enter Billing Information
                        </label>
                        <input
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                            placeholder="Billing address"
                            className="w-full border rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008492]"
                        />
                    </div> */}

                    {/* Terms */}
                    {/* <div className="text-xs text-gray-500 space-y-2">
                        <div className="flex items-start gap-2">
                            <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                            <span>Please review our cancellation policy before proceeding.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                            <span>
                                I agree to the terms and authorize the payment (optional).
                            </span>
                        </div>
                    </div> */}

                    {errorMessage && (
                        <p className="text-red-600 text-base">{errorMessage}</p>
                    )}

                    {/* Submit Button aligned right */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!stripe || loading}
                            className="bg-black text-white py-3 px-6 rounded-md font-semibold hover:opacity-95 transition"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border border-white border-t-4 border-t-transparent rounded-full mx-auto animate-spin" />
                            ) : (
                                "PROCEED TO CHECKOUT"
                            )}
                        </button>
                    </div>

                </div>

                {/* Right side card mockup */}
                <div className="w-full sm:w-72 md:w-82 lg:w-96 shrink-0 flex flex-col justify-center">
                    <h1 className="text-2xl md:hidden block font-bold text-gray-800 mb-5">PAYMENT INFORMATION</h1>

                    {/* Payment Card Mockup */}
                    <div className="relative md:block hidden  w-full h-44 sm:h-48 md:h-52 lg:h-56 rounded-xl bg-black text-white p-4 shadow-lg">

                        {/* Chip */}
                        <div className="absolute top-4 left-4 w-10 h-8 bg-yellow-400 rounded-sm"></div>

                        {/* Card Number */}
                        <div className="absolute top-14 left-6 right-6 text-lg tracking-widest text-gray-300">
                            {maskedNumberPreview}
                        </div>

                        {/* Card Holder & Expiry */}
                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs">
                            {/* <div className="text-gray-400 text-[10px] sm:text-xs">YOUR NAME HERE</div> */}
                            <div className="text-base mt-1 text-gray-400">
                                {cardHolder ? cardHolder.toUpperCase() : "YOUR NAME HERE"}
                            </div>

                            <div className="text-right text-[10px] sm:text-xs">
                                <div className="text-gray-400">valid thru</div>
                                <div className="mt-1">{expiryPreview}</div>
                            </div>
                        </div>
                    </div>

                    {/* Secure badges */}
                    <div className="mt-4 md:block hidden flex gap-3">
                        <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-2">
                            <span className="text-xs text-gray-500">SECURE SSL ENCRYPTION</span>
                        </div>
                        <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-2">
                            <span className="text-xs text-gray-500">SECURE PAY</span>
                        </div>
                    </div>
                </div>


            </form>
        </div>
    );
}