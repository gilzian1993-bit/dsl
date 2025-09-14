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
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MapComponent from "./GoogleMap";
// import MapComponent from "./GoogleMap";

interface VehicleOption {
    id: number;
    name: string;
    type: string;
    image: string;
    price: number;
    hourly: number;
    passengers: number;
    bags: number;
    features: string[];
}

const vehicles: VehicleOption[] = [
    // 🚘 Sedans
    {
        id: 1,
        name: "CADILLAC XTS - SEDAN",
        type: "SEDAN",
        image: "/images/sedan/cadilac-xts.png",
        price: 85,          // base/point-to-point
        hourly: 85,         // hourly rate
        passengers: 3,
        bags: 2,
        features: ["WiFi", "Leather Seats", "Climate Control"],
    },
    {
        id: 2,
        name: "LINCOLN CONTINENTAL - SEDAN",
        type: "SEDAN",
        image: "/images/sedan/lincoln.png",
        price: 85,
        hourly: 85,
        passengers: 3,
        bags: 2,
        features: ["WiFi", "Premium Audio", "Leather Seats"],
    },
    {
        id: 3,
        name: "CADILLAC CTS - SEDAN",
        type: "SEDAN",
        image: "/images/sedan/cadilac.cts.png",
        price: 85,
        hourly: 85,
        passengers: 3,
        bags: 2,
        features: ["WiFi", "USB Charging", "Tinted Windows"],
    },
    {
        id: 4,
        name: "CADILLAC LYRIQ - SEDAN",
        type: "SEDAN",
        image: "/images/sedan/cadilac.png",
        price: 85,
        hourly: 85,
        passengers: 3,
        bags: 2,
        features: ["WiFi", "Heated Seats", "Panoramic Roof"],
    },

    // 🚙 Mid SUVs
    {
        id: 5,
        name: "Lincoln Aviator - MID SIZE SUV",
        type: "MID SUV",
        image: "/images/SUV/lincoln-aviator.png",
        price: 110,
        hourly: 110,
        passengers: 5,
        bags: 4,
        features: ["WiFi", "Leather Seats", "Rear Climate Control"],
    },
    {
        id: 6,
        name: "Cadillac XT6 - MID SIZE SUV",
        type: "MID SUV",
        image: "/images/SUV/cadilac-xt6.png",
        price: 110,
        hourly: 110,
        passengers: 5,
        bags: 4,
        features: ["WiFi", "Premium Audio", "All-Wheel Drive"],
    },

    // 🚐 SUVs
    {
        id: 7,
        name: "Chevrolet Suburban - SUV",
        type: "SUV",
        image: "/images/SUV/chevrolet.png",
        price: 110,
        hourly: 110,
        passengers: 7,
        bags: 6,
        features: ["WiFi", "Rear Entertainment", "Large Cargo Space"],
    },
    {
        id: 8,
        name: "Cadillac Escalade - SUV",
        type: "SUV",
        image: "/images/SUV/cadilac-escalate.png",
        price: 110,
        hourly: 110,
        passengers: 7,
        bags: 6,
        features: ["WiFi", "Premium Leather", "Panoramic Roof"],
    },
    {
        id: 9,
        name: "GMC Yukon XL - SUV",
        type: "SUV",
        image: "/images/SUV/GMC.png",
        price: 110,
        hourly: 110,
        passengers: 7,
        bags: 6,
        features: ["WiFi", "USB Charging", "Heated Seats"],
    },
    {
        id: 10,
        name: "Lincoln Navigator - SUV",
        type: "SUV",
        image: "/images/SUV/lincol-navigator.png",
        price: 110,
        hourly: 110,
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
        hourly: 250,
        passengers: 14,
        bags: 10,
        features: ["WiFi", "TV Screen", "Extra Legroom"],
    },
];


// Group by type
const groupedVehicles: Record<string, VehicleOption[]> = vehicles.reduce((acc, v) => {
    if (!acc[v.type]) acc[v.type] = [];
    acc[v.type].push(v);
    return acc;
}, {} as Record<string, VehicleOption[]>);

export default function VehicleSelection({ onNext, step }: { onNext: (vehicle: VehicleOption) => void, step: number }) {
    // Get pickup and drop location from query params
    const searchParams = useSearchParams();
    const pickupLocation = searchParams.get("pickupLocation") || "";
    const dropLocation = searchParams.get("dropLocation") || "";
    const [indexes, setIndexes] = useState<Record<string, number>>({});
    const pickupDate = searchParams.get("pickupDate") || "";
    const pickupTime = searchParams.get("pickupTime") || "";
    const [showModal, setShowModal] = useState(false);
    const tripType = searchParams.get("tripType") || "";
    const [showTripDetailsMobile, setShowTripDetailsMobile] = useState(false);
    const distance = Number(searchParams.get("distance") || "0"); // meters
    const hours = Number(searchParams.get("hours") || "0"); // meters
    const pickupLat = Number(searchParams.get("pickupLat") || "0");
    const pickupLng = Number(searchParams.get("pickupLng") || "0");
    const dropLat = Number(searchParams.get("dropLat") || "0");
    const dropLng = Number(searchParams.get("dropLng") || "0");
    const mapCenter = pickupLat && pickupLng ? { lat: pickupLat, lng: pickupLng } : { lat: 34.0522, lng: -118.2437 }; // Default to LA
    const router = useRouter();
    let price = 0;
    function calculatePrice(vehicle: VehicleOption, distance: number, hours: number, tripType: string): number {
        let price = 0;

        if (tripType === "hourly") {
            price = Number((hours * vehicle.hourly).toFixed(2));
        } else {
            switch (vehicle.type) {
                case "SEDAN":
                    price = distance <= 20 ? 85 : distance * 3;
                    break;
                case "MID SUV":
                    price = distance <= 20 ? 95 : distance * 3.25;
                    break;
                case "SUV":
                    price = distance <= 20 ? 110 : distance * 3.75;
                    break;
                case "SPRINTER":
                    price = distance <= 17
                        ? distance * 7  // ✅ your $7/mile rule
                        : distance <= 38
                            ? 250
                            : 250 + (distance - 38) * 2.3;
                    break;
                default:
                    price = vehicle.price;
            }
        }

        return price;
    }
    useEffect(() => {
        if (window.innerWidth < 768) {
            const interval = setInterval(() => {
                Object.keys(groupedVehicles).forEach((type) => {
                    handleNext(type);
                });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, []);




    const API_KEY = "AIzaSyAu9Wmzbazm3PNeiV4XkGrKeCE_fJMh1K8";
    const handleNext = (type: string) => {
        const items = groupedVehicles[type];
        setIndexes((prev) => ({
            ...prev,
            [type]: (prev[type] ?? 0) + 1 >= items.length ? 0 : (prev[type] ?? 0) + 1,
        }));
    };

    const handlePrev = (type: string) => {
        const items = groupedVehicles[type];
        setIndexes((prev) => ({
            ...prev,
            [type]: (prev[type] ?? 0) - 1 < 0 ? items.length - 1 : (prev[type] ?? 0) - 1,
        }));
    };

    return (
        <>
            {/* Header */}
            <div className="bg-[#DDDDDD] md:block hidden px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() =>
                            router.push(
                                `/?pickupLocation=${encodeURIComponent(pickupLocation)}&dropLocation=${encodeURIComponent(
                                    dropLocation
                                )}&pickupDate=${pickupDate}&pickupTime=${pickupTime}&tripType=${tripType}&distance=${distance}&hours=${hours}`
                            )
                        }
                        className="flex items-center font-semibold text-gray-700 hover:text-black"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        BACK
                    </button>

                    <h1 className="text-md font-semibold">{step} - Select Your Vehicle</h1>
                </div>
            </div>

            {/* Layout */}
            <div className="min-h-screen max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row">


                    {/* Left Panel (Trip details) */}
                    <div className="w-full md:w-80 p-4">
                        <div className="mb-6">
                            <div className="w-full  shadow-md bg-white overflow-hidden rounded-lg">
                                {/* Google Maps Embed showing route from pickup to drop location */}
                                <MapComponent
                                    mapCenter={mapCenter}
                                   selectedLocation={undefined}
                                    officeLocations={[]}
                                    transformOfficeData={(office: any) => office}
                                    handleCardClick={(location: any) => console.log(location)}
                                    // searchCoordinates={null}
                                    pickupLat={pickupLat.toString()}
                                    pickupLng={pickupLng.toString()}
                                    dropLat={dropLat.toString()}
                                    dropLng={dropLng.toString()}
                                />


                            </div>
                        </div>
                        {/* Mobile: Trip Details */}
                        <div className="md:hidden block mb-3">
                            <button
                                onClick={() => setShowTripDetailsMobile(!showTripDetailsMobile)}
                                className="w-full bg-[#008492] p-5 text-white rounded-md flex justify-between items-center"
                            >
                                <span>Pickup Trip Details</span>
                                <ChevronDown className={`transition-transform ${showTripDetailsMobile ? "rotate-180" : ""}`} />
                            </button>

                            {showTripDetailsMobile && (
                                <div className="space-y-4 mt-7">
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
                                            <span className="font-medium">{pickupDate}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <Image src="/clock--.svg" alt="Clock" width={16} height={16} />
                                            <span className="font-medium">{pickupTime}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

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
                                        <img src="/calendar.svg" alt="Calendar" className="w-4 h-4" />
                                        <span className="font-medium">
                                            {pickupDate
                                                ? new Date(pickupDate).toLocaleDateString("en-US", {
                                                    weekday: "short",   // e.g. Mon
                                                    month: "short",     // e.g. Sep
                                                    day: "numeric",     // e.g. 12
                                                    year: "numeric",    // e.g. 2025
                                                })
                                                : ""}
                                        </span>

                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <img src="/clock--.svg" alt="Clock" className="w-4 h-4" />
                                        <span className="font-medium">{pickupTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Right Panel (Vehicle categories) */}
                    <div className="w-full md:flex-1 max-w-4xl mx-auto space-y-4 mt-6 px-4">
                        {Object.keys(groupedVehicles).map((type) => {
                            const items = groupedVehicles[type];
                            const index = indexes[type] ?? 0;
                            const current = items[index];

                            return (
                                <div
                                    key={type}
                                    className="relative bg-white border border-gray-200 shadow-sm rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4"
                                >
                                    {/* Image carousel */}
                                    <div className="relative w-36 md:block hidden h-24 flex-shrink-0" >
                                        <Image
                                            src={current.image}
                                            alt={current.name}
                                            width={144}
                                            height={96}
                                            className="object-contain w-full h-full"
                                        />
                                        {items.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => handlePrev(type)}
                                                    className="absolute -left-4 top-1/2 -translate-y-1/2  p-1 "
                                                >
                                                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleNext(type)}
                                                    className="absolute -right-4 top-1/2 -translate-y-1/2  p-1  hover:bg-gray-100"
                                                >
                                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </>
                                        )}


                                    </div>
                                    <div className="md:hidden block  p-4 flex flex-col items-center gap-2">
                                        <h3 className="font-bold text-lg text-gray-800 text-center">{current.name}</h3>
                                        <Image
                                            src={current.image}
                                            alt={current.name}
                                            width={200}
                                            height={120}
                                            className="object-contain w-full h-auto"
                                        />
                                        {items.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => handlePrev(type)}
                                                    className="absolute  left-7 top-1/3 -translate-y-1/2  p-1 rounded-full border border-black  "
                                                >
                                                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleNext(type)}
                                                    className="absolute rounded-full border border-black  right-7 top-1/3 -translate-y-1/2  p-1  hover:bg-gray-100"
                                                >
                                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </>
                                        )}

                                    </div>
                                    <div className="flex md:hidden items-center justify-between w-full   ">
                                        {/* Passengers */}
                                        <div className="flex items-center bg-[#F6F6F6] border border-[#008492] rounded-full px-3 py-2 gap-1">
                                            <Users className="w-4 h-4 text-[#000000]" />
                                            <span>{current.passengers}</span>
                                        </div>

                                        {/* Price (centered) */}
                                        <div className="text-xl font-bold text-gray-900  text-center">
                                            ${calculatePrice(current, distance, hours, tripType).toFixed(2)}


                                        </div>

                                        {/* Bags */}
                                        <div className="flex items-center bg-[#F6F6F6] border border-[#008492] px-3 py-2 rounded-full gap-1">
                                            <Briefcase className="w-4 h-4 text-[#000000]" />
                                            <span>{current.bags}</span>
                                        </div>
                                    </div>


                                    <button
                                        onClick={() => {
                                            const selectedVehicle = {
                                                ...current,
                                                price: calculatePrice(current, distance, hours, tripType),

                                                vehicleTitle: getVehicleTitle(current.type),
                                                tripType: tripType,
                                            };
                                            onNext(selectedVehicle);
                                        }}

                                        className="bg-[#008492] md:hidden block hover:bg-[#008492] text-white px-4 py-2 rounded-md font-medium w-full"
                                    >
                                        Select Vehicle
                                    </button>
                                    {/* Vehicle Info */}
                                    <div className="flex-1 md:block hidden">
                                        {/* Title + Info */}
                                        <div className="relative w-full">
                                            {/* Title + Info icon */}
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg mt-1 font-semibold text-gray-800 uppercase">
                                                    Luxury - {getVehicleTitle(type)}
                                                </h3>

                                                <button
                                                    type="button"
                                                    onClick={() => setShowModal(!showModal)}
                                                    className="focus:outline-none"
                                                >
                                                    <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                                                </button>
                                            </div>

                                            {/* Small modal above the card */}
                                            {showModal && (
                                                <div className="absolute -top-36 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg w-72 p-4 z-50">
                                                    {/* Close button */}
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
                                                        This luxury vehicle provides premium comfort, spacious seating, and
                                                        modern amenities for your trip.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Vehicle list name(s) */}
                                        <p className="text-sm text-gray-500 mt-1">
                                            {current.name}
                                        </p>

                                        {/* Features row */}
                                        <div className="flex items-center gap-4 mt-3 text-gray-600">
                                            {/* Passengers + Bags */}
                                            <div className="flex items-center bg-[#F6F6F6] border border-[#008492] gap-6 text-sm  rounded-full px-3 py-1 shadow-sm">
                                                {/* Passengers */}
                                                <div className="flex items-center text-[#000000] gap-1">
                                                    <Users className="w-4 h-4 text-[#000000]" />
                                                    <span>{current.passengers}</span>
                                                </div>

                                                {/* Bags */}
                                                <div className="flex items-center text-[#000000] gap-1">
                                                    <Briefcase className="w-4 h-4 text-[#000000]" />
                                                    <span>{current.bags}</span>
                                                </div>
                                            </div>

                                            {/* AC */}
                                            <div className="flex items-center gap-1 text-sm bg-[#F6F6F6] border border-[#008492] rounded-full px-2 py-1 shadow-sm">
                                                <Image src="/AC.svg" alt="AC" width={16} height={16} />
                                            </div>

                                            {/* WiFi */}
                                            <div className="flex items-center gap-1 text-sm bg-[#F6F6F6] border border-[#008492] rounded-full px-2 py-1 shadow-sm">
                                                <Wifi className="w-4 h-4 text-[#000000]" />
                                            </div>
                                        </div>


                                    </div>


                                    {/* Action */}
                                    {/* Right section (button + price) */}
                                    <div className="flex md:block hidden flex-col items-end gap-2 min-w-[150px]">
                                        <button
                                            onClick={() => {
                                                const selectedVehicle = {
                                                    ...current,
                                                    price: calculatePrice(current, distance, hours, tripType),

                                                    vehicleTitle: getVehicleTitle(current.type),
                                                    tripType: tripType,
                                                };
                                                onNext(selectedVehicle);
                                            }}

                                            className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium text-sm"
                                        >
                                            Select Vehicle
                                            <ArrowRight className="w-4 h-4" />
                                        </button>


                                        <div className="text-gray-900 font-bold text-xl mt-4">
                                            ${calculatePrice(current, distance, hours, tripType).toFixed(2)}




                                        </div>

                                        <div className="flex items-center gap-1 text-black mt-4   text-sm">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="w-4 h-4 border border-[#00BA00] rounded-full p-[2px]"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            Includes gratuity and tax
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

// ✅ Helpers
function getVehicleTitle(type: string) {
    switch (type) {
        case "SEDAN":
            return "Sedan";
        case "MID SUV":
            return "Mid-Size SUV";
        case "SUV":
            return "SUV";
        case "SPRINTER":
            return "Sprinter Van";
        default:
            return type;
    }
}
