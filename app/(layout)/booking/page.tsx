"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import VehicleSelection from "@/app/components/formComponent/vehicle-selectionform";
import UserInformation from "@/app/components/formComponent/UserInformation";
import PaymentSection from "@/app/components/sections/PaymentSection";

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
interface UserInfo {
    fullName: string;
    email: string;
    phone: string;
    // add other fields as needed
}

export default function BookingPage() {

    const [step, setStep] = useState(1);
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // you can refine this later

    // Get booking data from query params
    const searchParams = useSearchParams();
    const pickupLocation = searchParams.get("pickupLocation") || "";
    const dropLocation = searchParams.get("dropLocation") || "";
    const pickupDate = searchParams.get("pickupDate") || "";
    const pickupTime = searchParams.get("pickupTime") || "";
    const tripType = searchParams.get("tripType") || "";

    return (
        <div className="">
            {/* Show booking data summary at the top */}
            {/* <div className="mb-6 p-4 bg-gray-100 rounded">
                <h2 className="text-lg font-semibold mb-2">Booking Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div><span className="font-medium">Pickup Location:</span> {pickupLocation}</div>
                    <div><span className="font-medium">Drop Location:</span> {dropLocation}</div>
                    <div><span className="font-medium">Pickup Date:</span> {pickupDate ? new Date(pickupDate).toLocaleString() : ""}</div>
                    <div><span className="font-medium">Pickup Time:</span> {pickupTime}</div>
                </div>
            </div> */}
            {/* Step 1: Vehicle Selection */}
            {step === 1 && (
                <VehicleSelection
                    step={step}
                    onNext={(vehicle) => {
                        setSelectedVehicle(vehicle);
                        setStep(2);
                    }}
                />
            )}

            {/* Step 2: User Information */}
            {step === 2 && selectedVehicle && (
                <UserInformation
                    vehicle={selectedVehicle}
                    pickupLocation={pickupLocation}
                    dropLocation={dropLocation}
                    pickupDate={pickupDate}
                    pickupTime={pickupTime}
                    onNext={() => {

                        setStep(3);
                    }}
                    tripType={tripType}
                    onBack={() => setStep(1)}
                    step={step}
                />
            )}
            {/* Step 3: Payment Section */}
            {step === 3 && selectedVehicle && (
                <PaymentSection
                    step={step}
                    pickupLocation={pickupLocation}
                    dropLocation={dropLocation}
                    pickupDate={pickupDate}
                    pickupTime={pickupTime}
                    vehicle={selectedVehicle}
                    onBack={() => setStep(2)}
                    onNext={() => setStep(4)}
                    meetGreetYes

                />
            )}

        </div>
    );
}
