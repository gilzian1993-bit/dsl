"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
}

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
    returnTime,
}: PaymentCardProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    function convertTo24Hour(time12h: string) {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // --- Debug: log props
    useEffect(() => {
        console.log("PaymentCard mounted with props:", {
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
            returnTime,
        });
    }, []);
    const basePrice = typeof vehicle.price === "object" ? vehicle.price.basePrice : vehicle.price;
    const tollFee = typeof vehicle.price === "object" ? vehicle.price.tollFee : 0;
    const airportFee = typeof vehicle.price === "object" ? vehicle.price.airportFee : 0;
    const gratuity = typeof vehicle.price === "object" ? vehicle.price.gratuity : 0;
    const total = typeof vehicle.price === "object" ? vehicle.price.total : vehicle.price;



    useEffect(() => {
        (async () => {
            console.log("Creating payment intent...");
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

                console.log("Payment intent response status:", res.status);

                if (!res.ok) throw new Error("Failed to create payment intent");

                const data = await res.json();
                console.log("Payment intent data:", data);
                setClientSecret(data.clientSecret);
            } catch (err) {
                console.error("Error creating payment intent:", err);
                setErrorMessage(err instanceof Error ? err.message : "Unknown error");
            }
        })();
    }, [amount, vehicle, pickupLocation, dropLocation, pickupDate, pickupTime, meetGreetYes]);



    // --- Handle Payment Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const bookingId = uuidv4();
        console.log("handleSubmit triggered");

        if (!stripe || !elements || !clientSecret) {
            console.warn("Stripe or elements or clientSecret missing");
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            // 1️⃣ Submit payment info from the Stripe element
            console.log("Submitting payment element...");
            const { error: submitError } = await elements.submit();
            if (submitError) throw new Error(submitError.message ?? "Invalid payment details");

            // 2️⃣ Confirm payment manually without automatic redirect
            console.log("Confirming Stripe payment...");
            const { paymentIntent, error } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success`, // ✅ Required by Stripe
                },
                redirect: "if_required",
            });


            if (error) throw new Error(error.message || "Payment failed");

            // 3️⃣ Check payment status
            if (!paymentIntent) throw new Error("Payment intent not returned");
            console.log("PaymentIntent status:", paymentIntent.status);

            if (paymentIntent.status === "succeeded") {
                console.log("Payment succeeded, calling booking API...");


                try {
                    const bookingRes = await fetch("https://devsquare-apis.vercel.app/api/dslLimoService/booking", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: bookingId,
                            from_location: pickupLocation,
                            to_location: dropLocation,
                            pickup_date: pickupDate,
                            pickup_time: pickupTime,
                            return_date: returnDate,
                            return_time: returnTime,
                            price: total,
                            base_price: basePrice,
                            toll_fee: tollFee,
                            airport_fee: airportFee,
                            gratuity: gratuity,
                            email,
                            hours: tripType === "hourly" ? hours : "N/A",
                            name: fullName,
                            carType: vehicle.type,
                            phone_number: phone,
                            Passengers: passengers,
                            luggage,
                            flight_number: flightNumber,
                            airline_code: airlineCode,
                            tripType,
                            meetGreetYes,
                            airportPickup,
                            rearFacingSeat: rearFacingSeat,
                            boosterSeat: boosterSeat,

                        }),
                    });

                    const bookingData = await bookingRes.json();
                    console.log("Booking confirmed:", bookingData);
                } catch (err) {
                    console.error("Booking API failed:", err);
                }

                console.log("Redirecting to payment-success...");
                window.location.href = "/payment-success";
            }

            else {
                console.warn("Payment not completed. Status:", paymentIntent.status);
                setErrorMessage("Payment was not successful.");
            }

        } catch (err) {
            console.error("handleSubmit error:", err);
            setErrorMessage(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    if (!clientSecret) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement className="p-3 border rounded-md" />
            {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-[#008492] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#006d77] transition"
            >
                {loading ? <div className="w-4 h-4 border border-gray-300 border-t-4 border-t-gray-500 rounded-full animate-spin"></div> : `Pay $${total}`}
            </button>
        </form>
    );
}
