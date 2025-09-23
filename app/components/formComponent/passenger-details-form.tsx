"use client";

import { Info, Minus, Plus, CalendarIcon, ClockIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import TimePicker from "../time-picker";
import Calendar from "../../../components/ui/calendar";

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
  }) => void;
  onBack: () => void;
  tripType: string;
  meetGreetYes: boolean;
  setMeetGreetYes: React.Dispatch<React.SetStateAction<boolean>>;
  finalTotal: number;
  vehicle: VehicleOption;
  totalPrice: number;
  onPriceChange: (updatedTotal: number) => void;
}

export default function PassengerDetailsForm({
  onBack,
  onNext,
  tripType,
  meetGreetYes,
  setMeetGreetYes,

  vehicle,
  totalPrice,
  onPriceChange,
  finalTotal,
}: PassengerDetailsFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [airlineCode, setAirlineCode] = useState("");
  const [flightNumber, setFlightNumber] = useState("");

  const [carSeats, setCarSeats] = useState(false);
  const [returnTrip, setReturnTrip] = useState(false);
  const [rearFacingSeat, setRearFacingSeat] = useState(0);
  const [boosterSeat, setBoosterSeat] = useState(0);
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
  const [showReturnTrip, setShowReturnTrip] = useState(false);
  const [airportPickup, setAirportPickup] = useState(false);
  // 🔹 Real-time price calculation
  useEffect(() => {
    const seatCharge = carSeats ? (rearFacingSeat + boosterSeat) * 10 : 0;
    const meetGreetCharge = meetGreetYes ? 25 : 0;

    const updatedTotal = totalPrice + seatCharge + meetGreetCharge;
    onPriceChange(updatedTotal);
  }, [rearFacingSeat, boosterSeat, carSeats, meetGreetYes, totalPrice, onPriceChange]);

  // 🔹 Validation + next
  const handleNext = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = "Full Name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address";

    const phoneRegex = /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(phone)) newErrors.phone = "Enter a valid US phone number";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true); // show loader

      const formData = {
        fullName,
        email,
        phone,
        tripType,
        meetGreetYes,
        airportPickup,
        carSeats,
        finalTotal,
        returnTrip,
        rearFacingSeat: carSeats ? rearFacingSeat : 0,
        boosterSeat: carSeats ? boosterSeat : 0,
        passengers,
        luggage,
        airlineCode: airportPickup ? airlineCode : "",
        flightNumber: airportPickup ? flightNumber : "",
        returnDate: returnTrip && returnDate ? returnDate.toISOString() : undefined,
        returnTime: returnTrip ? returnTime ?? undefined : undefined,
      };
      try {
        await onNext(formData);
      } finally {
        setTimeout(() => setLoading(false), 500); // spinner shows at least 0.5s
      }
    }
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
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
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
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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

      {/* Options */}
      <div className="mb-4 flex md:flex-row flex-col sm:items-center sm:gap-6 gap-4">
        {/* Airport Pickup */}
        <div className="flex items-center gap-2">
          <label className="relative items-center cursor-pointer">
            <input
              type="checkbox"
              checked={airportPickup}
              onChange={() => {
                setAirportPickup(!airportPickup);
                setShowAirportPickup(!showAirportPickup);

              }}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full ${airportPickup ? "bg-[#008492]" : "bg-gray-300"
                } relative transition-colors`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${airportPickup ? "translate-x-5" : "translate-x-0.5"
                  }`}
              ></div>
            </div>
          </label>
          <span className="text-base text-gray-700">Airport Pickup</span>
          {/* <Info className="w-4 h-4 text-gray-400" /> */}
        </div>

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
              className={`w-11 h-6 rounded-full ${meetGreetYes ? "bg-[#008492]" : "bg-gray-300"
                } relative transition-colors`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${meetGreetYes ? "translate-x-5" : "translate-x-0.5"
                  }`}
              ></div>
            </div>
          </label>
          <span className="text-base text-gray-700">Meet & Greet</span>
          {/* <Info className="w-4 h-4 text-gray-400" /> */}
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
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-50 text-gray-700 text-sm p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
              $10 will be added in total price for per rear and booster seats.
            </div>
          </div>
        </div>

        {/* Return Trip Toggle */}
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
          {/* <Info className="w-4 h-4 text-gray-400" /> */}
        </div>
      </div>
      {/* Flight Info if Airport Pickup */}
      {showAirportPickup && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-bold text-gray-900">Flight Departure Information</h3>
            {/* <Info className="w-4 h-4 text-gray-400" /> */}
          </div>
          <p className="text-base text-gray-600 mb-4">
            Helps us schedule your pickup accordingly and ensure timely drop-off at the airport.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <img
                src="/plane.svg"
                alt="Plane"
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Airline Name or Code"
                value={airlineCode}
                onChange={(e) => setAirlineCode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <input
              type="text"
              placeholder="Flight No #"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      )}

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
              <label className="block text-base text-gray-700 mb-2">Rear facing seat</label>
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
            <div>
              <label className="block text-base text-gray-700 mb-2">Booster seat</label>
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
          </div>
        </div>
      )}

      {/* Return Trip Details */}
      {showReturnTrip && (
        <div className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Return Date */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Return Date</label>
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Return Time */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-600 mb-1">Return Time</label>
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
                    <TimePicker
                      selectedTime={returnTime ?? ""}
                      onTimeSelect={(time: string) => {
                        setReturnTime(time);
                        setIsReturnTimeOpen(false);
                      }}
                      onClose={() => setIsReturnTimeOpen(false)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}