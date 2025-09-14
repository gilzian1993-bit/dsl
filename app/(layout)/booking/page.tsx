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
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Get booking data from query params
  const searchParams = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation") || "";
  const dropLocation = searchParams.get("dropLocation") || "";
  const pickupDateString = searchParams.get("pickupDate") || "";
  const pickupTime = searchParams.get("pickupTime") || "";
  const tripType = searchParams.get("tripType") || "";

  // Convert pickupDate string to Date | null
  const pickupDate: Date | null = pickupDateString ? new Date(pickupDateString) : null;

  return (
    <div className="">
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
  pickupDate={pickupDate ? pickupDate.toISOString() : ""} // <-- convert Date | null to string
  pickupTime={pickupTime}
  onNext={() => setStep(3)}
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
            pickupDate={pickupDate ? pickupDate.toISOString() : ""} // <-- convert Date | null to string
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
