"use client"

import {
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Info,
    Wifi,
    ArrowRight,
    MapPin,
    X,
    ChevronDown,
    Edit,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PassengerDetailsForm from "./passenger-details-form";
interface UserInfo {
    fullName: string;
    email: string;
    phone: string;
    // add other passenger fields as needed
}
interface UserInformationProps {
    vehicle: VehicleOption;
    selectedVehicle: VehicleOption;
    pickupLocation: string;
    dropLocation: string;
    pickupDate: string;
    pickupTime: string;
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
        finalTotal: number;
    }) => void;

    onBack: () => void;
    step: number;
    tripType: string;

}

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
    total?: number;
    base?: number;
}

interface Props {
    vehicle: VehicleOption;
    onNext: () => void;
    onBack: () => void;
    step: number;
}
const vehicles: VehicleOption[] = [
    // 🚘 Sedans
    {
        id: 1,
        name: "CADILLAC XTS - SEDAN",
        type: "SEDAN",
        image: "/images/sedan/cadilac-xts.png",
        price: 95,
        passengers: 3,
        bags: 3,
        features: ["WiFi", "Leather Seats", "Climate Control"],
    },
    {
        id: 2,
        name: "LINCOLN CONTINENTAL - SEDAN",
        type: "SEDAN",
        image: "/images/sedan/lincoln.png",
        price: 95,
        passengers: 3,
        bags: 3,
        features: ["WiFi", "Premium Audio", "Leather Seats"],
    },
    {
        id: 3,
        name: "CADILLAC CTS - SEDAN",
        type: "SEDAN",
        image: "/images/sedan/cadilac.cts.png",
        price: 95,
        passengers: 3,
        bags: 3,
        features: ["WiFi", "USB Charging", "Tinted Windows"],
    },
    {
        id: 4,
        name: "CADILLAC LYRIQ - SEDAN",
        type: "SEDAN",
        image: "/images/sedan/cadilac.png",
        price: 95,
        passengers: 3,
        bags: 3,
        features: ["WiFi", "Heated Seats", "Panoramic Roof"],
    },

    // 🚙 Mid SUVs
    {
        id: 5,
        name: "Lincoln Aviator - MID SIZE SUV",
        type: "MID SUV",
        image: "/images/SUV/lincoln-aviator.png",
        price: 130,
        passengers: 4,
        bags: 4,
        features: ["WiFi", "Leather Seats", "Rear Climate Control"],
    },
    {
        id: 6,
        name: "Cadillac XT6 - MID SIZE SUV",
        type: "MID SUV",
        image: "/images/SUV/cadilac-xt6.png",
        price: 130,
        passengers: 4,
        bags: 4,
        features: ["WiFi", "Premium Audio", "All-Wheel Drive"],
    },

    // 🚐 SUVs
    {
        id: 7,
        name: "Chevrolet Suburban - SUV",
        type: "SUV",
        image: "/images/SUV/chevrolet.png",
        price: 160,
        passengers: 7,
        bags: 6,
        features: ["WiFi", "Rear Entertainment", "Large Cargo Space"],
    },
    {
        id: 8,
        name: "Cadillac Escalade - SUV",
        type: "SUV",
        image: "/images/SUV/cadilac-escalate.png",
        price: 170,
        passengers: 7,
        bags: 6,
        features: ["WiFi", "Premium Leather", "Panoramic Roof"],
    },
    {
        id: 9,
        name: "GMC Yukon XL - SUV",
        type: "SUV",
        image: "/images/SUV/GMC.png",
        price: 160,
        passengers: 7,
        bags: 6,
        features: ["WiFi", "USB Charging", "Heated Seats"],
    },
    {
        id: 10,
        name: "Lincoln Navigator - SUV",
        type: "SUV",
        image: "/images/SUV/lincol-navigator.png",
        price: 170,
        passengers: 7,
        bags: 6,
        features: ["WiFi", "Premium Audio", "Massage Seats"],
    },

    // 🚐 Sprinter
    {
        id: 11,
        name: "Sprinter",
        type: "SPRINTER",
        image: "/images/spinter/spinter.png",
        price: 250,
        passengers: 14,
        bags: 10,
        features: ["WiFi", "TV Screen", "Extra Legroom"],
    },
];



export default function UserInformation({ vehicle, onNext, onBack, step,
    pickupLocation,
    dropLocation,
    pickupDate,
    pickupTime,
    tripType,
    selectedVehicle,

}: UserInformationProps) {
    console.log("Selected Vehicle:", selectedVehicle);
    const [indexes, setIndexes] = useState<Record<string, number>>({});
    const [showModal, setShowModal] = useState(false);
    const [rearFacingSeat, setRearFacingSeat] = useState(0);
    const [boosterSeat, setBoosterSeat] = useState(0);
    const [returnRearFacingSeat, setReturnRearFacingSeat] = useState(0);
    const [returnBoosterSeat, setReturnBoosterSeat] = useState(0);
    const [showTripDetailsMobile, setShowTripDetailsMobile] = useState(false);
    const [meetGreetYes, setMeetGreetYes] = useState(false);
    const [ReturnMeetGreetYes, setReturnMeetGreetYes] = useState(false);
    const [returnTripYes, setReturnTripYes] = useState(false);
    const [returnStopsCount, setReturnStopsCount] = useState(0);
    const meetGreetCost = (meetGreetYes ? 25 : 0) + (ReturnMeetGreetYes ? 25 : 0);
    const returnDiscount = returnTripYes ? 0.10 : 0;
    const getVehiclePrice = (vehicle: VehicleOption): number => {
        if (typeof vehicle.price === "number") {
            return vehicle.price;
        }
        return vehicle.price.total;
    };

    const basePrice = getVehiclePrice(vehicle);

    const totalPriceBeforeDiscount = tripType !== "hourlyRate" ? basePrice + meetGreetCost : basePrice;


    const discountAmount =
        returnDiscount * basePrice
    const totalPrice = totalPriceBeforeDiscount - discountAmount;

    // Update the final total price
    const [finalTotal, setFinalTotal] = useState(totalPrice);


    const total = selectedVehicle?.total ?? getVehiclePrice(selectedVehicle);
    const base = Number(selectedVehicle?.base ?? 0);
    const seatCharge = (rearFacingSeat + boosterSeat) * 10;
    const gratuity = (base * 2) * 0.20; // 20% of total base (for return trip)
    const tax = (base * 2) * 0.05;      // 5% of total base (for return trip)
      const airportFee = tripType === "airportRide" ? 5 : 0;
console.log("Meet Greet:", meetGreetYes, "Return Meet Greet:", ReturnMeetGreetYes,"cost", meetGreetCost);

    const calculatedPrice =
        returnTripYes
            ? (
                (base * 2)                       
                - (base * 2 * 0.10)            
                + (meetGreetYes ? 25 : 0) + (ReturnMeetGreetYes ? 25 : 0)
                + (returnStopsCount > 0 ? 20 * returnStopsCount : 0)        
                + seatCharge                     
                + gratuity                      
                + tax  
                + airportFee                    
            )
            : finalTotal;




    console.log("total:", basePrice);
    return (
        <>
            {/* Header */}
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
                                        <Image src="/calendar.svg" alt="Calendar" width={16} height={16} />
                                        <span className="font-medium">  {pickupDate
                                            ? new Date(pickupDate).toLocaleDateString("en-US", {
                                                weekday: "short",   // e.g. Mon
                                                month: "short",     // e.g. Sep
                                                day: "numeric",     // e.g. 12
                                                year: "numeric",    // e.g. 2025
                                            })
                                            : ""}</span>
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


                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-[#008492] p-1.5 rounded-md flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="font-bold text-gray-800">Pickup </h2>
                                <span className="ml-auto text-sm font-bold text-gray-600"> ${typeof vehicle.price === "number"
                                    ? vehicle.price.toFixed(2)
                                    : Number(vehicle.price.total).toFixed(2)}
                                </span>
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
                                    <span className="ml-auto text-base font-bold text-gray-600">
                                        ${calculatedPrice.toFixed(2)}
                                    </span>

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
                    <div className="flex-flex-col">
                        {/* Right Panel (Vehicle categories) */}
                        <div className="w-full md:block hidden mx-auto space-y-4 mt-4 px-4">
                            <div className="relative bg-white border border-gray-200 shadow-sm rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                {/* Image carousel */}
                                <div className="relative w-36 md:block hidden h-24 md:flex-shrink-0">
                                    <Image
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        width={144}
                                        height={96}
                                        className="object-contain w-full h-full"
                                    />
                                </div>

                                {/* Mobile view */}
                                <div className="md:hidden block p-4 flex flex-col items-center gap-2">
                                    <h3 className="font-bold text-lg text-gray-800 text-center">
                                        {vehicle.name}
                                    </h3>
                                    <Image
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        width={200}
                                        height={120}
                                        className="object-contain w-full h-auto"
                                    />
                                </div>

                                <div className="flex md:hidden items-center justify-between w-full">
                                    {/* Passengers */}
                                    <div className="flex items-center bg-[#F6F6F6] border border-[#008492] rounded-full px-3 py-2 gap-1">
                                        <Users className="w-4 h-4 text-[#000000]" />
                                        <span>{vehicle.passengers}</span>
                                    </div>

                                    {/* Price (centered) */}
                                    <div className="text-xl font-bold text-gray-900 text-center">
                                        ${getVehiclePrice(vehicle).toFixed(2)}
                                    </div>

                                    {/* Bags */}
                                    <div className="flex items-center bg-[#F6F6F6] border border-[#008492] px-3 py-2 rounded-full gap-1">
                                        <Briefcase className="w-4 h-4 text-[#000000]" />
                                        <span>{vehicle.bags}</span>
                                    </div>
                                </div>

                                {/* Vehicle Info */}
                                <div className="md:flex-1 md:block hidden">
                                    <div className="relative w-full">
                                        {/* Title + Info */}
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-md mt-1 font-semibold text-gray-800 uppercase">

                                                Luxury - {vehicle.name}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(!showModal)}
                                                className="focus:outline-none"
                                            >
                                                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                                            </button>
                                        </div>

                                        {/* Modal */}
                                        {showModal && (
                                            <div className="absolute -top-36 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg w-72 p-4 z-50">
                                                <button
                                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                                    onClick={() => setShowModal(false)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <h2 className="text-base font-semibold text-gray-800 mb-2">
                                                    Vehicle Information
                                                </h2>
                                                <p className="text-sm text-gray-600">
                                                    This {vehicle.type} provides premium comfort, spacious seating, and
                                                    modern amenities for your trip.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Features list */}
                                    <p className="text-sm text-gray-500 mt-1">
                                        {vehicle.name}
                                    </p>

                                    {/* Features row */}
                                    <div className="flex items-center gap-4 mt-1 text-gray-600">
                                        {/* Passengers + Bags */}
                                        <div className="flex items-center bg-[#F6F6F6] border border-[#008492] gap-6 text-sm rounded-full px-3 py-1 shadow-sm">
                                            <div className="flex items-center text-[#000000] gap-1">
                                                <Users className="w-4 h-4 text-[#000000]" />
                                                <span>{vehicle.passengers}</span>
                                            </div>
                                            <div className="flex items-center text-[#000000] gap-1">
                                                <Briefcase className="w-4 h-4 text-[#000000]" />
                                                <span>{vehicle.bags}</span>
                                            </div>
                                        </div>

                                        {/* Dynamic features */}
                                        <div className="flex items-center gap-1 text-sm bg-[#F6F6F6] border border-[#008492] rounded-full px-2 py-1 shadow-sm">
                                            <Image src="/AC.svg" alt="AC" width={16} height={16} />
                                        </div>

                                        {/* WiFi */}
                                        <div className="flex items-center gap-1 text-sm bg-[#F6F6F6] border border-[#008492] rounded-full px-2 py-1 shadow-sm">
                                            <Wifi className="w-4 h-4 text-[#000000]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Right section (button + price) */}
                                <div className="flex md:block hidden flex-col items-end gap-2 min-w-[150px]">
                                    <button className="flex items-center justify-center gap-2 bg-black hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium text-sm">
                                        Selected

                                    </button>
                                    <div className="text-gray-900 font-bold mt-4 text-xl">
                                        ${calculatedPrice.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full mx-auto space-y-4 mt-4 px-4">
                            <PassengerDetailsForm
                                onBack={onBack}
                                onNext={(data) => {
                                    // Include the finalTotal in the data passed to onNext
                                    onNext({
                                        ...data,
                                        finalTotal: calculatedPrice // This is the updated total from state
                                    });
                                }}
                                setReturnStopsCount={setReturnStopsCount}
                                setReturnBoosterSeat={setReturnBoosterSeat}
                                returnBoosterSeat={returnBoosterSeat}
                                returnRearFacingSeat={returnRearFacingSeat}
                                setReturnRearFacingSeat={setReturnRearFacingSeat}
                                boosterSeat={boosterSeat}
                                setBoosterSeat={setBoosterSeat}
                                rearFacingSeat={rearFacingSeat}
                                setRearFacingSeat={setRearFacingSeat}
                                returnStopsCount={returnStopsCount}
                                pickupDate={pickupDate}
                                totalPrice={totalPrice}
                                tripType={tripType}
                                finalTotal={finalTotal}
                                meetGreetYes={meetGreetYes}
                                returnTrip={returnTripYes}
                                setReturnTrip={setReturnTripYes}
                                setReturnMeetGreetYes={setReturnMeetGreetYes}
                                ReturnMeetGreetYes={ReturnMeetGreetYes}
                                onPriceChange={(updatedTotal) => setFinalTotal(updatedTotal)}
                                setMeetGreetYes={setMeetGreetYes}
                                vehicle={vehicle}
                                total={total}



                            /></div>
                    </div>



                </div>
            </div>
        </>
    );
}


