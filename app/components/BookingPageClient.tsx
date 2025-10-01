"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import VehicleSelection from "@/app/components/formComponent/vehicle-selectionform";
import UserInformation from "@/app/components/formComponent/UserInformation";
import PaymentSection from "@/app/components/sections/PaymentSection";
import { PriceProvider } from "./context/priceContext";

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


}

interface UserInfo {
  fullName: string;
  email: string;
  phone: string;
  tripType: string;
  passengers: number;
  luggage: number;
  rearFacingSeat: number;
  boosterSeat: number;
  meetGreetYes?: boolean;
 ReturnMeetGreetYes?: boolean;
  airportPickup?: boolean;
  carSeats?: boolean;
  returnTrip?: boolean;
  returnDate?: string;
  returnTime?: string;
  airlineCode?: string;
  flightNumber?: string;
  finalTotal: number;
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
  const hours = Number(searchParams.get("hours") || 0);
  const distance = Number(searchParams.get("distance") || 0);

  // Compute finalTotal once vehicle is selected
  const finalTotal =
    selectedVehicle &&
    (typeof selectedVehicle.price === "object"
      ? selectedVehicle.price.total
      : selectedVehicle.price);

  return (
    <PriceProvider> <div>
      {/* Step 1: Vehicle Selection */}
      {step === 1 && (
        <VehicleSelection
          step={step}
          onNext={(vehicle: VehicleOption) => {
            setSelectedVehicle(vehicle);
            setStep(2);
          }}
        />
      )}

      {/* Step 2: User Information */}
      {step === 2 && selectedVehicle && (
        <UserInformation
          selectedVehicle={selectedVehicle}
          vehicle={selectedVehicle}
          pickupLocation={pickupLocation}
          dropLocation={dropLocation}
          pickupDate={pickupDate}
          pickupTime={pickupTime}
          tripType={tripType}

          onNext={(data) => {
            console.log("✅ User Info Captured:", data);
            setUserInfo(data);   // 🔹 save to state
            setStep(3);
          }}
          onBack={() => setStep(1)}
          step={step}
        />
      )}

      {/* Step 3: Payment */}
      {step === 3 && selectedVehicle && userInfo && (
        <PaymentSection
          selectedVehicle={selectedVehicle}
          step={step}
          fullName={userInfo.fullName}
          email={userInfo.email}
          phone={userInfo.phone}
          tripType={userInfo.tripType}
          distance={distance}
          pickupLocation={pickupLocation}
          dropLocation={dropLocation}
          pickupDate={pickupDate}
          pickupTime={pickupTime}
          vehicle={selectedVehicle}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
          // 🔹 Use userInfo instead of defaults
           ReturnMeetGreetYes={userInfo.ReturnMeetGreetYes ?? false}
          meetGreetYes={userInfo.meetGreetYes ?? false}
          passengers={userInfo.passengers}
          luggage={userInfo.luggage}
          rearFacingSeat={userInfo.rearFacingSeat}
          boosterSeat={userInfo.boosterSeat}
          airlineCode={userInfo.airlineCode}
          flightNumber={userInfo.flightNumber}
          returnDate={userInfo.returnDate}
          returnTime={userInfo.returnTime}
          airportPickup={userInfo.airportPickup ?? false}
          carSeats={userInfo.carSeats ?? false}
          returnTrip={userInfo.returnTrip ?? false}
          hours={hours}
          totalPrice={
            typeof selectedVehicle.price === "number"
              ? selectedVehicle.price
              : selectedVehicle.price.total
          }
          finalTotal={userInfo.finalTotal}


        />
      )}
    </div></PriceProvider>

  );
}
