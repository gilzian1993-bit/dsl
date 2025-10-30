"use client";

import { Info, Minus, Plus, CalendarIcon, ClockIcon, MapPin, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import TimePicker from "../time-picker";
import Calendar from "../../../components/ui/calendar";
import TimeInput from "../time-picker";
import { Autocomplete, Libraries, useLoadScript } from "@react-google-maps/api";
import { SlLocationPin } from "react-icons/sl";
import { GOOGLE_MAPS_API_KEY } from "@/lib/config";

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

interface PassengerDetailsFormProps {
  onNext: (data: {
    fullName: string;
    email: string;
    phone: string;
    tripType: string;
    meetGreetYes: boolean;
    airportPickup: boolean;
    carSeats: boolean;
    returnTrip: boolean;
    rearFacingSeat: number;
    boosterSeat: number;
    passengers: number;
    luggage: number;
    airlineCode?: string;
    flightNumber?: string;
    returnDate?: string;

    returnTime?: string;
    finalTotal?: number;
    infantSeat: string;
    returnInfantSeat: string;
  }) => void;
  onBack: () => void;
  tripType: string;
  meetGreetYes: boolean;
  returnRearFacingSeat: number;
  returnBoosterSeat: number;
  setReturnRearFacingSeat: React.Dispatch<React.SetStateAction<number>>;
  setReturnBoosterSeat: React.Dispatch<React.SetStateAction<number>>;
  infantSeat: string;
  returnInfantSeat: string;
  rearFacingSeat: number;
  boosterSeat: number;
  setRearFacingSeat: React.Dispatch<React.SetStateAction<number>>;
  setInfantSeat: React.Dispatch<React.SetStateAction<string>>;
  setReturnInfantSeat: React.Dispatch<React.SetStateAction<string>>;
  setBoosterSeat: React.Dispatch<React.SetStateAction<number>>;
  setMeetGreetYes: React.Dispatch<React.SetStateAction<boolean>>;
  ReturnMeetGreetYes: boolean;
  setReturnMeetGreetYes: React.Dispatch<React.SetStateAction<boolean>>;
  returnTrip: boolean;
  setReturnTrip: React.Dispatch<React.SetStateAction<boolean>>;
  finalTotal: number;
  setReturnStopsCount: React.Dispatch<React.SetStateAction<number>>;
  returnStopsCount: number;
  vehicle: VehicleOption;
  totalPrice: number;
  pickupDate: string;
  onPriceChange: (updatedTotal: number) => void;
  basePrice?: number;
  total?: number;
}

export default function PassengerDetailsForm({
  onBack,
  onNext,
  tripType,
  meetGreetYes,
  setMeetGreetYes,
  setReturnMeetGreetYes,
  ReturnMeetGreetYes,
  pickupDate,
  returnTrip,
  returnStopsCount,
  setReturnStopsCount,
  setReturnTrip,
  vehicle,
  totalPrice,
  returnBoosterSeat,
  returnRearFacingSeat,
  setReturnBoosterSeat,
  setReturnRearFacingSeat,
  rearFacingSeat,
  infantSeat,
  returnInfantSeat,
  boosterSeat,

  setInfantSeat,
  setReturnInfantSeat,
  setRearFacingSeat,
  setBoosterSeat,
  onPriceChange,
  basePrice,
  finalTotal,
  total
}: PassengerDetailsFormProps) {
  console.log("Base Price", basePrice);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [airlineCode, setAirlineCode] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [returnAirlineCode, setReturnAirlineCode] = useState("");
  const [returnflightNumber, setReturnFlightNumber] = useState("");
  const [carSeats, setCarSeats] = useState(false);
  const [returnCarSeats, setReturnCarSeats] = useState(false);
  const [returnPickupLocation, setReturnPickupLocation] = useState("");

  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [returnTime, setReturnTime] = useState<string | null>(null);
  const [isReturnCalendarOpen, setIsReturnCalendarOpen] = useState(false);
  const [isReturnTimeOpen, setIsReturnTimeOpen] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Individual toggle states instead of a single activeToggle
  const [showAirportPickup, setShowAirportPickup] = useState(false);
  const [showMeetGreet, setShowMeetGreet] = useState(false);
  const [showCarSeats, setShowCarSeats] = useState(false);

  const [showReturnCarSeats, setReturnShowCarSeats] = useState(false);
  const [showReturnTrip, setShowReturnTrip] = useState(false);
  const [showReturnMeetGreet, setShowReturnMeetGreet] = useState(false);
  const [airportPickup, setAirportPickup] = useState(false);
  const pickupRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [returnStop1, setReturnStop1] = useState("");
  const [returnStop2, setReturnStop2] = useState("");
  const [returnStop3, setReturnStop3] = useState("");
  const [returnStop4, setReturnStop4] = useState("");
  const stopsRefs = useRef<(google.maps.places.Autocomplete | null)[]>([]);
  const libraries: Libraries = ["places"];
  const { isLoaded } = useLoadScript({
    googleMapsApiKey:GOOGLE_MAPS_API_KEY,
    libraries,
  });
  // 🔹 Real-time price calculation
  useEffect(() => {
    let seatCharge = carSeats ? (rearFacingSeat + boosterSeat) * 10 : 0;
    seatCharge += infantSeat==='Yes' ? 10 : 0;
   
    let returnSeatCharge = carSeats ? (returnRearFacingSeat + returnBoosterSeat) * 10 : 0;
    returnSeatCharge += returnInfantSeat ==='Yes' ? 10 : 0;
    // const meetGreetCharge = (meetGreetYes ? 25 : 0) + (ReturnMeetGreetYes ? 25 : 0);
    const returnTripCharge = returnTrip
      ? (basePrice! * 2) - (basePrice! * 2 * 0.10) + (returnStopsCount > 0 ? 20 * returnStopsCount : 0)
      : 0;

    const updatedTotal = returnTrip
      ? returnTripCharge + returnSeatCharge 
      : totalPrice + seatCharge;

    onPriceChange(updatedTotal);
  }, [
    rearFacingSeat,
    boosterSeat,
    carSeats,
    meetGreetYes,
    ReturnMeetGreetYes,
    returnTrip,
    returnStopsCount,
    totalPrice,
    basePrice,
    onPriceChange
  ]);


  const handleNext = async () => {
    const newErrors: { [key: string]: string } = {};

    // Full Name
    if (!fullName.trim()) newErrors.fullName = "Full Name is required";

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address";

    // Phone
    const phoneRegex = /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(phone)) newErrors.phone = "Enter a valid US phone number";

    // Passengers
    if (!passengers || passengers < 1) {
      newErrors.passengers = "At least 1 passenger is required";
    }

    // Luggage
    if (luggage < 0) {
      newErrors.luggage = "Luggage cannot be negative";
    }

    // 🔹 Airport Ride - Airport Pickup must be selected
    if (tripType === "airportRide") {
      if (!airlineCode.trim()) newErrors.airlineCode = "Airline name or code is required";
      if (!flightNumber.trim()) newErrors.flightNumber = "Flight number is required";
    }

    if (tripType === "airportRide" && returnTrip) {
      if (!returnAirlineCode.trim()) newErrors.returnAirlineCode = "Airline name or code is required";
      if (!returnflightNumber.trim()) newErrors.returnflightNumber = "Flight number is required";
    }

    // Return Trip Required Fields
    if (tripType !== "hourlyRate" && returnTrip) {
      if (!returnDate) newErrors.returnDate = "Return date is required";
      if (!returnTime) newErrors.returnTime = "Return time is required";
    }

    // Car Seats Validation
    if (carSeats) {
      if (rearFacingSeat === 0 && boosterSeat === 0) {
        newErrors.carSeats = "Please select at least one seat type";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const formData = {
        fullName,
        email,
        phone,
        tripType,
        meetGreetYes,
        ReturnMeetGreetYes,
        airportPickup,
        setReturnPickupLocation,
        returnPickupLocation,
        returnCarSeats,
        carSeats,
        finalTotal,
        returnTrip,
        returnRearFacingSeat: returnCarSeats ? returnRearFacingSeat : 0,
        returnBoosterSeat: returnCarSeats ? returnBoosterSeat : 0,
        rearFacingSeat: carSeats ? rearFacingSeat : 0,
        boosterSeat: carSeats ? boosterSeat : 0,
        passengers,
        luggage,
        total,
        returnAirlineCode: returnAirlineCode,
        returnflightNumber: returnflightNumber,
        airlineCode: airlineCode,
        flightNumber: flightNumber,
        returnDate: returnTrip && returnDate ? returnDate.toISOString() : undefined,
        returnTime: returnTrip ? returnTime ?? undefined : undefined,
        returnStop1,
        returnStop2, returnStop3, returnStop4, returnStopsCount, infantSeat, returnInfantSeat
      };

      try {

        await setTimeout(() => {
          onNext(formData);

        }, 500);;
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    }
  };
  console.log("finalTotal:", finalTotal);


  const handleTimeChange = (hour: number, minute: number) => {
    // ✅ Convert to 12-hour format with AM/PM
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    const formatted = `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
    setReturnTime(formatted);

    setIsReturnTimeOpen(false);
  };
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [boosterTooltipVisible, setboosterTooltipVisible] = useState(false);
  const [infantTooltipVisible, setInfantTooltipVisible] = useState(false);

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible);
  };
  const boosterToggleTooltip = () => {
    setboosterTooltipVisible(!boosterTooltipVisible);
  };
  const infantToggleTooltip = () => {
    setInfantTooltipVisible(!boosterTooltipVisible);
  };
  const addStop = () => {
    if (returnStopsCount < 4) {
      setReturnStopsCount(prev => prev + 1);

    }
  };
  const stops = [returnStop1, returnStop2, returnStop3, returnStop4]; // Always 4 items
// ddd
  const removeStop = (index: number) => {
    switch (index) {
      case 0:
        setReturnStop1(returnStop2);
        setReturnStop2(returnStop3);
        setReturnStop3(returnStop4);
        setReturnStop4("");
        break;
      case 1:
        setReturnStop2(returnStop3);
        setReturnStop3(returnStop4);
        setReturnStop4("");
        break;
      case 2:
        setReturnStop3(returnStop4);
        setReturnStop4("");
        break;
      case 3:
        setReturnStop4("");
        break;
    }
    setReturnStopsCount(prev => prev - 1);
  };


  const updateStop = (index: number, value: string) => {
    switch (index) {
      case 0: setReturnStop1(value); break;
      case 1: setReturnStop2(value); break;
      case 2: setReturnStop3(value); break;
      case 3: setReturnStop4(value); break;
    }
  };
  const StopsSection = () => {
    return (
      <div className="w-full">
        <div className="flex  flex-col mb-6 md:mb-0 sm:flex-row sm:items-center sm:justify-between">
          {returnStopsCount < 5 && (
            <span
              onClick={addStop}
              className="cursor-pointer rounded-sm border text-white border-gray-300 bg-black md:px-2 md:py-0.5 px-4 py-2 text-[10px] font-medium text-gray-600"
              aria-hidden="true"
            >
              + Add Stop
            </span>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="md:p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Passenger Details</h2>

      {/* Personal Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <img
            src="/user.svg"
            alt="User"
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-[#A7A7AA] rounded-md bg-[#F3F3F3] text-base text-[#515151] focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.fullName && <p className="text-red-500 text-base mt-1">{errors.fullName}</p>}
        </div>
        <div className="relative">
          <img
            src="/email.svg"
            alt="Email"
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-[#A7A7AA] rounded-md bg-[#F3F3F3] text-base text-[#515151] focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.email && <p className="text-red-500 text-base mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Phone */}
      <div className="mb-6">
        <div className="flex">
          <div className="flex items-center bg-[#F3F3F3] border border-r-0 border-[#A7A7AA] rounded-l-md px-3">
            <img src="/usa.svg" alt="US" className="w-7 h-7" />
            <span className="ml-2 text-base text-gray-700">+1</span>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="flex-1 px-4 py-3 border border-[#A7A7AA] rounded-r-md bg-[#F3F3F3] text-base text-[#515151] focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        {errors.phone && <p className="text-red-500 text-base mt-1">{errors.phone}</p>}
      </div>

      {/* Passengers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="relative">
          <div className="flex items-center justify-end space-x-5 pl-24 pr-4 py-3 border border-[#A7A7AA] rounded-md bg-[#F3F3F3]">
            <button
              type="button"
              onClick={() => setPassengers(Math.max(1, passengers - 1))}
              className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-base font-medium text-[#515151]">{passengers}</span>
            <button
              type="button"
              onClick={() => setPassengers(passengers + 1)}
              disabled={passengers >= vehicle.passengers}
              className={`w-6 h-6 rounded-full flex items-center justify-center ${passengers >= vehicle.passengers ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white"}`}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-base text-gray-400">
            Passengers
          </span>
        </div>

        {/* Luggage */}
        <div className="relative">
          <div className="flex items-center justify-end space-x-5 pl-24 pr-4 py-3 border border-[#A7A7AA] rounded-md bg-[#F3F3F3]">
            <button
              type="button"
              onClick={() => setLuggage(Math.max(0, luggage - 1))}
              className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-base font-medium text-[#515151]">{luggage}</span>
            <button
              type="button"
              onClick={() => setLuggage(luggage + 1)}
              disabled={luggage >= vehicle.bags}
              className={`w-6 h-6 rounded-full flex items-center justify-center ${luggage >= vehicle.bags ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white"}`}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-base text-gray-400">
            Luggage
          </span>
        </div>



      </div>

      {tripType === "airportRide" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Airline Name or Code"
              value={airlineCode}
              onChange={(e) => setAirlineCode(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.airlineCode && <p className="text-red-500 text-base mt-1">{errors.airlineCode}</p>}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Flight No #"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.flightNumber && <p className="text-red-500 text-base mt-1">{errors.flightNumber}</p>}
          </div>
        </div>
      )}





      {/* Options */}
      <div className="mb-4 flex md:flex-row flex-col sm:items-center sm:gap-6 gap-4">
        {/* Airport Pickup (only if tripType === "airportRide") */}



        {/* Meet & Greet */}
        <div className="flex items-center gap-2">
          <label className="relative items-center cursor-pointer">
            <input
              type="checkbox"
              checked={meetGreetYes}
              onChange={() => {
                setMeetGreetYes(!meetGreetYes);
                setShowMeetGreet(!showMeetGreet);
              }}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full ${showMeetGreet ? "bg-[#008492]" : "bg-gray-300"
                } relative transition-colors`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${showMeetGreet ? "translate-x-5" : "translate-x-0.5"
                  }`}
              ></div>
            </div>
          </label>
          <span className="text-base text-gray-700">Meet & Greet</span>
        </div>
      </div>




      {/* Car Seats + Return Trip */}
      <div className="mb-6 flex md:flex-row flex-col sm:items-center sm:gap-6 gap-4">
        {/* Car Seats Toggle */}
        <div className="flex  items-center gap-2 relative group">
          <label className="relative items-center cursor-pointer">
            <input
              type="checkbox"
              checked={carSeats}
              onChange={() => {
                setCarSeats(!carSeats);
                setShowCarSeats(!showCarSeats);
              }}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full ${carSeats ? "bg-[#008492]" : "bg-gray-300"
                } relative transition-colors`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${carSeats ? "translate-x-5" : "translate-x-0.5"
                  }`}
              ></div>
            </div>
          </label>
          <span className="text-base text-gray-900">Car Seats?</span>

          {/* Info icon with tooltip */}
          <div className="relative group">
            <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
            {/* Tooltip card */}
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-50 text-gray-700 text-base p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
              $10 will be added in total price for per rear and booster seats.
            </div>
          </div>
        </div>
        {errors.carSeats && (
          <p className="text-red-500 text-base mt-1">{errors.carSeats}</p>
        )}

        {/* Return Trip Toggle */}
        {tripType !== "hourlyRate" && (
          <div className="flex items-center gap-2">
            <label className="relative items-center cursor-pointer">
              <input
                type="checkbox"
                checked={returnTrip}
                onChange={() => {
                  setReturnTrip(!returnTrip);
                  setShowReturnTrip(!showReturnTrip);
                }}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full ${returnTrip ? "bg-[#008492]" : "bg-gray-300"
                  } relative transition-colors`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${returnTrip ? "translate-x-5" : "translate-x-0.5"
                    }`}
                ></div>
              </div>
            </label>
            <span className="text-base text-gray-900">Return Trip?</span>
            {returnTrip && (
              <span className="text-xs bg-[#008492] rounded-full py-2 text-white px-2">10% return discount</span>
            )}
            {/* <Info className="w-4 h-4 text-gray-400" /> */}
          </div>
        )}


      </div>



      {/* Meet & Greet Info */}
      {showMeetGreet && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mt-2 mb-5">
          <p className="text-gray-600 text-md">
            We&apos;ll arrange a personal assistant to meet you at the airport.
          </p>
          <p className="text-gray-800 font-medium mt-2">
            Note: An additional $25 will be added to your total price.
          </p>
        </div>
      )}

      {/* Car Seats Details */}
      {showCarSeats && (
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="flex  items-center gap-2 relative group mt-0"><label className="block text-base text-gray-700 mb-2">Rear facing seat</label>
                <div className="relative">
                  <Info
                    className="w-4 h-4 text-gray-400 cursor-pointer"
                    onClick={toggleTooltip} // Toggle tooltip on click
                  />
                  {/* Tooltip card */}
                  {tooltipVisible && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-50 text-gray-700 text-base p-3 rounded-lg shadow-lg z-50">
                      $10 will be added in total price for per rear and booster seats.
                    </div>
                  )}
                </div></div>

              <select
                value={rearFacingSeat}
                onChange={(e) => setRearFacingSeat(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {[...Array(7).keys()].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div >
              <div className="flex  items-center gap-2 relative group mt-0">
                <label className="block text-base text-gray-700 mb-2">Booster seat</label>
                <div className="relative">
                  <Info
                    className="w-4 h-4 text-gray-400 cursor-pointer"
                    onClick={boosterToggleTooltip} // Toggle tooltip on click
                  />
                  {/* Tooltip card */}
                  {boosterTooltipVisible && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-50 text-gray-700 text-base p-3 rounded-lg shadow-lg z-50">
                      $10 will be added in total price for per rear and booster seats.
                    </div>
                  )}
                </div>
              </div>

              <select
                value={boosterSeat}
                onChange={(e) => setBoosterSeat(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {[...Array(7).keys()].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>

              <div className="flex  items-center gap-2 relative group mt-0"><label className="block text-base text-gray-700 mb-2"> Infant Seat</label>
                <div className="relative">
                  <Info
                    className="w-4 h-4 text-gray-400 cursor-pointer"
                    onClick={toggleTooltip} 
                  />
                  {/* Tooltip card */}
                  {tooltipVisible && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-50 text-gray-700 text-base p-3 rounded-lg shadow-lg z-50">
                      $10 will be added in total price for yes infant seat.
                    </div>
                  )}
                </div></div>

              <select
                value={infantSeat}
                onChange={(e) => setInfantSeat(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {['Yes','No'].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}


      {/* Return Trip Details */}
      {tripType !== "hourlyRate" && showReturnTrip && (
        <div className="mb-4 mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Return Pickup */}
            <div className="flex flex-col ">
              <div className="flex flex-row justify-between ">
                <label className="text-base font-medium items-center text-gray-600 whitespace-nowrap">
                  Return Pickup
                </label>



                <div >
                  <StopsSection />
                </div>
              </div>


              <div className="relative w-full">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                {isLoaded && (
                  <Autocomplete
                    onLoad={(ref) => (pickupRef.current = ref)}
                    onPlaceChanged={() => {
                      const place = pickupRef.current?.getPlace();
                      if (place?.geometry?.location) {
                        setReturnPickupLocation(place.formatted_address || "");
                      }
                    }}
                    options={{ componentRestrictions: { country: "us" } }}
                  >
                    <input
                      placeholder="Enter return pickup location"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none text-base bg-white"
                      value={returnPickupLocation}
                      onChange={(e) => setReturnPickupLocation(e.target.value)}
                    />
                  </Autocomplete>
                )}
              </div>
              {errors.returnPickupLocation && (
                <p className="text-red-500 text-base mt-1">{errors.returnPickupLocation}</p>
              )}
            </div>
            {returnStopsCount > 0 && (

              <div className="space-y-2 md:hidden block md:space-y-3 w-full mt-5">
                {[0, 1, 2, 3].map((index) => {
                  if (index >= returnStopsCount) return null; // only show active stops

                  const stopValue =
                    index === 0 ? returnStop1 :
                      index === 1 ? returnStop2 :
                        index === 2 ? returnStop3 :
                          returnStop4;

                  return (
                    <div
                      key={index} // stable key prevents remount
                      className="relative w-full p-2 md:p-3 rounded-xl border-2 bg-blue-50 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-center gap-2 md:gap-3 w-full">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-[#008492] text-white rounded-full flex items-center justify-center font-bold text-xs md:text-base shadow-md flex-shrink-0">
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0 w-full">
                          {!isLoaded ? (
                            <div className="text-center text-base">Loading...</div>
                          ) : (
                            <Autocomplete
                              options={{ componentRestrictions: { country: "us" } }}
                              onLoad={(autocomplete) => (stopsRefs.current[index] = autocomplete)}
                              onPlaceChanged={() => {
                                const place = stopsRefs.current[index]?.getPlace();
                                if (place?.formatted_address) {
                                  updateStop(index, place.formatted_address);
                                }
                              }}
                            >
                              <div className="relative w-full">
                                <SlLocationPin className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 md:w-4 md:h-4" />
                                <input
                                  onChange={(e) => updateStop(index, e.target.value)} // optional manual typing
                                  placeholder={`Enter stop ${index + 1} location`}
                                  className="w-full pl-7 md:pl-8 pr-2 md:pr-3 py-1.5 md:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4910B] focus:border-transparent text-black text-xs md:text-base bg-white"
                                />
                              </div>
                            </Autocomplete>

                          )}
                        </div>

                        {index === returnStopsCount - 1 && (
                          <button
                            type="button"
                            onClick={() => removeStop(index)}
                            className="w-5 h-5 md:w-6 md:h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110 flex-shrink-0"
                          >
                            <X className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2 md:mt-2 flex items-center gap-1 w-full">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-0.5 md:h-1 flex-1 rounded-full transition-all duration-300 ${i <= index ? "bg-[#008492]" : "bg-gray-200"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}


              </div>

            )}
            {/* Return Date */}
            <div className="flex flex-col mb-4">

              <label className="text-base font-medium text-gray-600 mb-1">Return Date</label>
              <Popover open={isReturnCalendarOpen} onOpenChange={setIsReturnCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setIsReturnCalendarOpen(true)}
                    className="relative w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left"
                  >
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    {returnDate ? format(returnDate, "EEE dd MMM yyyy") : "Select Return Date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[9999]">
                  <Calendar
                    mode="single"
                    selected={returnDate ?? undefined}
                    onSelect={(date: Date | undefined) => {
                      setReturnDate(date ?? null);
                      setIsReturnCalendarOpen(false);
                    }}
                    disabled={{ before: new Date(pickupDate) }} // Ensure pickupDate is a Date object
                  />

                </PopoverContent>
              </Popover>
              {/* Error under date */}
              {errors.returnDate && (
                <p className="text-red-500 text-base mt-1">{errors.returnDate}</p>
              )}
            </div>
            {returnStopsCount > 0 && (
              <div className="w-full mb-4 md:space-y-3 space-y-2 block">
                {[0, 1, 2, 3].map((index) => {
                  if (index >= returnStopsCount) return null;

                  const stopValue =
                    index === 0 ? returnStop1 :
                      index === 1 ? returnStop2 :
                        index === 2 ? returnStop3 :
                          returnStop4;

                  return (
                    <div
                      key={index}
                      className="relative md:block hidden w-full p-2 md:p-3 rounded-xl border-2 bg-blue-50 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-center gap-2 md:gap-3 w-full">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-[#008492] text-white rounded-full flex items-center justify-center font-bold text-xs md:text-base shadow-md flex-shrink-0">
                          {index + 1}
                        </div>

                        <div className="flex-1 w-full min-w-0">
                          {!isLoaded ? (
                            <div className="text-center text-base">Loading...</div>
                          ) : (
                            <Autocomplete
                              options={{ componentRestrictions: { country: "us" } }}
                              onLoad={(autocomplete) => (stopsRefs.current[index] = autocomplete)}
                              onPlaceChanged={() => {
                                const place = stopsRefs.current[index]?.getPlace();
                                if (place?.formatted_address) {
                                  updateStop(index, place.formatted_address);
                                }
                              }}
                            >
                              <div className="relative w-full">
                                <SlLocationPin className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 md:w-4 md:h-4" />
                                <input
                                  onChange={(e) => updateStop(index, e.target.value)}
                                  placeholder={`Enter stop ${index + 1} location`}
                                  className="w-full pl-7 md:pl-8 pr-2 md:pr-3 py-1.5 md:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4910B] focus:border-transparent text-black text-xs md:text-base bg-white"
                                />
                              </div>
                            </Autocomplete>
                          )}
                        </div>

                        {index === returnStopsCount - 1 && (
                          <button
                            type="button"
                            onClick={() => removeStop(index)}
                            className="w-5 h-5 md:w-6 md:h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110 flex-shrink-0"
                          >
                            <X className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2 md:mt-2 flex items-center gap-1 w-full">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-0.5 md:h-1 flex-1 rounded-full transition-all duration-300 ${i <= index ? "bg-[#008492]" : "bg-gray-200"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}




          </div>
          <div className="flex flex-col relative">
            <label className="text-base font-medium text-gray-600 mb-1">Return Time</label>
            <Popover open={isReturnTimeOpen} onOpenChange={setIsReturnTimeOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="relative w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left"
                  onClick={() => setIsReturnTimeOpen(true)}
                >
                  <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  {returnTime || "Select Return Time"}
                </button>
              </PopoverTrigger>

              <PopoverContent side="top" align="center" className="w-auto p-0 z-[9999]">
                <div className="bg-white rounded-md shadow-lg p-4">
                  <TimeInput minTime="09:30" onChange={handleTimeChange} />
                </div>
              </PopoverContent>
            </Popover>
            {/* Error under time */}
            {errors.returnTime && (
              <p className="text-red-500 text-base mt-1">{errors.returnTime}</p>
            )}
          </div>
          <div className="flex items-center mb-6 mt-5 gap-5">
            {/* Show Meet & Greet for both airportRide & pointToPoint */}
            {(tripType === "airportRide" || tripType === "pointToPoint") && (
              <div className="flex items-center gap-2">
                <label className="relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ReturnMeetGreetYes}
                    onChange={() => {
                      setReturnMeetGreetYes(!ReturnMeetGreetYes);
                      setShowReturnMeetGreet(!showReturnMeetGreet);
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full ${showReturnMeetGreet ? "bg-[#008492]" : "bg-gray-300"
                      } relative transition-colors`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${showReturnMeetGreet ? "translate-x-5" : "translate-x-0.5"
                        }`}
                    ></div>
                  </div>
                </label>
                <span className="text-base text-gray-700">Meet & Greet</span>
              </div>
            )}
            <div className="flex md:flex-row flex-col sm:items-center sm:gap-6 gap-4">
              {/* Car Seats Toggle */}
              <div className="flex  items-center gap-2 relative group">
                <label className="relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={returnCarSeats}
                  onChange={() => {
  setReturnCarSeats(!returnCarSeats);
  setReturnShowCarSeats(!showReturnCarSeats);
}}

                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full ${returnCarSeats ? "bg-[#008492]" : "bg-gray-300"
                      } relative transition-colors`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${returnCarSeats ? "translate-x-5" : "translate-x-0.5"
                        }`}
                    ></div>
                  </div>
                </label>
                <span className="text-base text-gray-900">Car Seats?</span>

                {/* Info icon with tooltip */}
                <div className="relative group">
                  <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                  {/* Tooltip card */}
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-50 text-gray-700 text-base p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                    $10 will be added in total price for per rear and booster seats.
                  </div>
                </div>
              </div>
              {errors.returnCarSeats && (
                <p className="text-red-500 text-base mt-1">{errors.returnCarSeats}</p>
              )}




            </div>

          </div>

          {showReturnCarSeats && (
            <div className="mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="flex  items-center gap-2 relative group mt-0"><label className="block text-base text-gray-700 mb-2">Rear facing seat</label>
                    <div className="relative">
                      <Info
                        className="w-4 h-4 text-gray-400 cursor-pointer"
                        onClick={toggleTooltip} // Toggle tooltip on click
                      />
                      {/* Tooltip card */}
                      {tooltipVisible && (
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-50 text-gray-700 text-base p-3 rounded-lg shadow-lg z-50">
                          $10 will be added in total price for per rear and booster seats.
                        </div>
                      )}
                    </div></div>

                  <select
                    value={returnRearFacingSeat}
                    onChange={(e) => setReturnRearFacingSeat(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {[...Array(7).keys()].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div >
                  <div className="flex  items-center gap-2 relative group mt-0">
                    <label className="block text-base text-gray-700 mb-2">Booster seat</label>
                    <div className="relative">
                      <Info
                        className="w-4 h-4 text-gray-400 cursor-pointer"
                        onClick={boosterToggleTooltip} // Toggle tooltip on click
                      />
                      {/* Tooltip card */}
                      {boosterTooltipVisible && (
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-50 text-gray-700 text-base p-3 rounded-lg shadow-lg z-50">
                          $10 will be added in total price for per rear and booster seats.
                        </div>
                      )}
                    </div>
                  </div>

                  <select
                    value={returnBoosterSeat}
                    onChange={(e) => setReturnBoosterSeat(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {[...Array(7).keys()].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                 <div >
                  <div className="flex  items-center gap-2 relative group mt-0">
                    <label className="block text-base text-gray-700 mb-2">Infant seat</label>
                    <div className="relative">
                      <Info
                        className="w-4 h-4 text-gray-400 cursor-pointer"
                        onClick={infantToggleTooltip} // Toggle tooltip on click
                      />
                      {/* Tooltip card */}
                      {infantTooltipVisible && (
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-50 text-gray-700 text-base p-3 rounded-lg shadow-lg z-50">
                          $10 will be added in total price for yes infant seat.
                        </div>
                      )}
                    </div>
                  </div>

                  <select
                    value={returnInfantSeat}
                    onChange={(e) => setReturnInfantSeat(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {['Yes','No'].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          {/* Show airline & flight inputs ONLY for airportRide */}
          {tripType === "airportRide" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Airline Name or Code"
                  value={returnAirlineCode}
                  onChange={(e) => setReturnAirlineCode(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.returnAirlineCode && (
                  <p className="text-red-500 text-base mt-1">{errors.returnAirlineCode}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Flight No #"
                  value={returnflightNumber}
                  onChange={(e) => setReturnFlightNumber(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.returnflightNumber && (
                  <p className="text-red-500 text-base mt-1">{errors.returnflightNumber}</p>
                )}
              </div>
            </div>
          )}


        </div>
      )
      }


      {/* Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-end mb-4 gap-4">
        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-md font-medium text-base hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border border-gray-300 border-t-4 border-t-white rounded-full animate-spin"></div>
          ) : (
            "CONTINUE TO PAYMENT"
          )}
        </button>


        <button
          type="button"
          onClick={onBack}
          className="w-full md:hidden block sm:w-auto bg-gray-200 text-gray-900 px-8 py-3 rounded-md font-medium text-base hover:bg-gray-300 transition-colors"
        >
          BACK TO VEHICLE SELECTION
        </button>
      </div>
    </div >
  )
};
