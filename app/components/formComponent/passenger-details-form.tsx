"use client";

import { Info, Minus, Plus, Mail, CalendarIcon, ClockIcon } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import TimePicker from "../time-picker";
import Calendar from "../../../components/ui/calendar";
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
    }) => void;
    onBack: () => void;
    tripType: string;
    meetGreetYes: boolean;
    setMeetGreetYes: React.Dispatch<React.SetStateAction<boolean>>;
    airportPickup: boolean;
    setAirportPickup: React.Dispatch<React.SetStateAction<boolean>>;
    vehicle: VehicleOption;
}

export default function PassengerDetailsForm({
    onBack,
    onNext,
    tripType,
    meetGreetYes,
    setMeetGreetYes,
    airportPickup,
    vehicle,
    setAirportPickup,
}: PassengerDetailsFormProps) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // const [airportPickup, setAirportPickup] = useState(false);
    const [carSeats, setCarSeats] = useState(false);
    const [returnTrip, setReturnTrip] = useState(false);
    const [rearFacingSeat, setRearFacingSeat] = useState(0);
    const [boosterSeat, setBoosterSeat] = useState(0);
    const [returnDate, setReturnDate] = useState<Date | null>(null);
    const [returnTime, setReturnTime] = useState<string | null>(null);
    const [isReturnCalendarOpen, setIsReturnCalendarOpen] = useState(false);
    const [isReturnTimeOpen, setIsReturnTimeOpen] = useState(false);
    const [passengers, setPassengers] = useState(1); // default 1 passenger
    const [luggage, setLuggage] = useState(0);
    const [activeToggle, setActiveToggle] = useState<string | null>(null);

    const handleToggle = (toggleName: string) => {
        setActiveToggle(activeToggle === toggleName ? null : toggleName);
    };

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleNext = () => {
        const newErrors: { [key: string]: string } = {};

        if (!fullName.trim()) newErrors.fullName = "Full Name is required";
        if (!email.trim()) newErrors.email = "Email is required";
        if (!phone.trim()) newErrors.phone = "Phone number is required";
        if (passengers < 1) newErrors.passengers = "Select at least 1 passenger";
        if (luggage < 0) newErrors.luggage = "Select luggage count";
        if (carSeats) {
            if (rearFacingSeat === 0 && boosterSeat === 0)
                newErrors.carSeats = "Select at least one car seat type";
        }
        if (returnTrip) {
            if (!returnDate) newErrors.returnDate = "Return Date is required";
            if (!returnTime) newErrors.returnTime = "Return Time is required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onNext({
                fullName,
                email,
                phone,
                tripType,
                meetGreetYes: activeToggle === "meetGreetYes",
                airportPickup: activeToggle === "airportPickup",
                carSeats: activeToggle === "carSeats",
                returnTrip,
                rearFacingSeat,
                boosterSeat,
                passengers,
                luggage,
            });
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
                            disabled={passengers >= vehicle.passengers} // disable if reached max
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
                            disabled={luggage >= vehicle.bags} // disable if reached max
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
  {tripType !== "hourlyRate" && (<div className="mb-6">

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
                    {errors.returnDate && <p className="text-red-500 text-sm mt-1">{errors.returnDate}</p>}
                </div>

                {/* Return Time */}
                <div className="flex flex-col relative mt-4">
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
                    {errors.returnTime && <p className="text-red-500 text-sm mt-1">{errors.returnTime}</p>}
                </div>
            </div>)}







            {/* Options */}
            <div className="mb-4 flex  flex-row sm:items-center sm:gap-6 gap-4">
                {/* Airport Pickup */}
                <div className="flex items-center gap-2">
                    <label className="relative items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={activeToggle === "airportPickup"}
                            onChange={() => handleToggle("airportPickup")}
                            className="sr-only"
                        />

                        <div
                            className={`w-11 h-6 rounded-full ${activeToggle === "airportPickup" ? "bg-[#008492]" : "bg-gray-300"
                                } relative transition-colors`}
                        >
                            <div
                                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${activeToggle === "airportPickup" ? "translate-x-5" : "translate-x-0.5"
                                    }`}
                            ></div>
                        </div>
                    </label>
                    <span className="text-base text-gray-700">Airport Pickup</span>
                    <Info className="w-4 h-4 text-gray-400" />
                </div>

                {/* Meet & Greet */}
                <div className="flex items-center gap-2">
                    <label className="relative items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={activeToggle === "meetGreetYes"}
                            onChange={() => handleToggle("meetGreetYes")}
                            className="sr-only"
                        />

                        <div
                            className={`w-11 h-6 rounded-full ${activeToggle === "meetGreetYes" ? "bg-[#008492]" : "bg-gray-300"
                                } relative transition-colors`}
                        >
                            <div
                                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${activeToggle === "meetGreetYes" ? "translate-x-5" : "translate-x-0.5"
                                    }`}
                            ></div>
                        </div>
                    </label>
                    <span className="text-base text-gray-700">Meet & Greet</span>
                    <Info className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Flight Info if Airport Pickup */}
            {activeToggle === "airportPickup" && (
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base font-bold text-gray-900">Flight Departure Information</h3>
                        <Info className="w-4 h-4 text-gray-400" />
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
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Flight No #"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                </div>
            )}

            {/* Meet & Greet Info */}
            {activeToggle === "meetGreetYes" && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mt-2 mb-5">
                    <p className="text-gray-600 text-md">
                        We&apos;ll arrange a personal assistant to meet you at the airport.

                    </p>
                    <p className="text-gray-800 font-medium mt-2">
                        Note: An additional $25 will be added to your total price.
                    </p>
                </div>
            )}

            {/* Car Seats + Return Trip */}
            <div className="mb-6 flex flex-row sm:items-center sm:gap-6 gap-4">
                <div className="flex items-center gap-2">
                    <label className="relative items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={activeToggle === "carSeats"}
                            onChange={() => handleToggle("carSeats")}
                            className="sr-only"
                        />

                        <div
                            className={`w-11 h-6 rounded-full ${activeToggle === "carSeats" ? "bg-[#008492]" : "bg-gray-300"
                                } relative transition-colors`}
                        >
                            <div
                                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${activeToggle === "carSeats" ? "translate-x-5" : "translate-x-0.5"
                                    }`}
                            ></div>
                        </div>
                    </label>
                    <span className="text-base  text-gray-900">Car Seats?</span>
                    <Info className="w-4 h-4 text-gray-400" />
                </div>


            </div>

            {/* Car Seat Details */}
            <div
                className={`overflow-hidden transition-all duration-500 ${activeToggle === "carSeats" ? "max-h-96 mb-4" : "max-h-0"
                    }`}
            >
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

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-end mb-4 gap-4">
                <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-md font-medium text-base hover:bg-gray-800 transition-colors"
                >
                    CONTINUE TO PAYMENT
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
