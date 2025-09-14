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
}

export default function BookingPageClient() {
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // ✅ Client-side: useSearchParams is safe here
  const searchParams = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation") || "";
  const dropLocation = searchParams.get("dropLocation") || "";
  const pickupDate = searchParams.get("pickupDate") || "";
  const pickupTime = searchParams.get("pickupTime") || "";
  const tripType = searchParams.get("tripType") || "";

  return (
    <div className="">
      {step === 1 && (
        <VehicleSelection
          step={step}
          onNext={(vehicle) => {
            setSelectedVehicle(vehicle);
            setStep(2);
          }}
        />
      )}

      {step === 2 && selectedVehicle && (
        <UserInformation
          vehicle={selectedVehicle}
          pickupLocation={pickupLocation}
          dropLocation={dropLocation}
          pickupDate={pickupDate}
          pickupTime={pickupTime}
          tripType={tripType}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
          step={step}
        />
      )}

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
