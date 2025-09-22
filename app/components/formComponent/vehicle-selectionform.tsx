"use client"

import {
    ArrowLeft,
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
import type { Location } from "./GoogleMap";
type PriceBreakdown = {
  basePrice: number;
  gratuity: number;
  tollFee: number;
  tax: number;
  airportFee?: number;
  total: number;
};

type SelectedVehicle = Omit<VehicleOption, "price"> & {
  price: PriceBreakdown;
  vehicleTitle: string;
  tripType: string;
  hours?: number;
};

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
        price: 85,
        hourly: 85,
        passengers: 3,
        bags: 3,
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
        bags: 3,
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
        bags: 3,
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
        bags: 3,
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
        passengers: 4,
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


export default function VehicleSelection({
    onNext,
    step,
}: {
    onNext: (vehicle: SelectedVehicle) => void; // ✅ no 'any'
    step: number;
}) {
    const searchParams = useSearchParams();
    const pickupLocation = searchParams.get("pickupLocation") || "";
    const dropLocation = searchParams.get("dropLocation") || "";
    const pickupDate = searchParams.get("pickupDate") || "";
    const pickupTime = searchParams.get("pickupTime") || "";
    const tripType = searchParams.get("tripType") || "";
    const distance = Number(searchParams.get("distance") || "0");
    const hours = Number(searchParams.get("hours") || "0");
    const pickupLat = Number(searchParams.get("pickupLat") || "0");
    const pickupLng = Number(searchParams.get("pickupLng") || "0");
    const dropLat = Number(searchParams.get("dropLat") || "0");
    const dropLng = Number(searchParams.get("dropLng") || "0");
    const [loading, setLoading] = useState(false);
    const [loadingVehicleId, setLoadingVehicleId] = useState<number | null>(null);

    const [indexes, setIndexes] = useState<Record<string, number>>({});
    const [openVehicleModalId, setOpenVehicleModalId] = useState<number | null>(null);
    const [showTripDetailsMobile, setShowTripDetailsMobile] = useState(false);

    const router = useRouter();

    const mapCenter =
        pickupLat && pickupLng ? { lat: pickupLat, lng: pickupLng } : { lat: 34.0522, lng: -118.2437 };

    // Price calculation
    function calculatePrice(
        vehicle: VehicleOption,
        distance: number,
        hours: number,
        tripType: string
    ) {
        let basePrice = 0;

        if (tripType === "hourly") {
            // Only hourly * vehicle hourly rate
            basePrice = Number((hours * vehicle.hourly).toFixed(2));
        } else {
            // Point-to-point pricing
            switch (vehicle.type) {
                case "SEDAN":
                    basePrice = distance <= 20 ? 85 : distance * 3;
                    break;
                case "MID SUV":
                    basePrice = distance <= 20 ? 95 : distance * 3.25;
                    break;
                case "SUV":
                    basePrice = distance <= 20 ? 110 : distance * 3.75;
                    break;
                case "SPRINTER":
                    basePrice =
                        distance <= 17
                            ? distance * 7
                            : distance <= 38
                                ? 250
                                : 250 + (distance - 38) * 2.3;
                    break;
                default:
                    basePrice = vehicle.price;
            }
        }

        const gratuity = 20; // flat fee
        const tollFee = 10;  // flat fee
        const airportFee = 5; // flat fee
        const tax = 5;       // flat fee
        const total = basePrice + gratuity + tollFee + tax;

        return { basePrice, gratuity, tollFee, tax, total };
    }

    // Carousel auto-rotate (mobile)
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
        <div className="min-h-screen max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row">
                {/* LEFT PANEL (Trip Details + Map) */}
                <div className="w-full md:w-80 p-4">
                    <div className="mb-6">
                        <div className="w-full  shadow-md bg-white overflow-hidden rounded-lg">
                            {/* Google Maps Embed showing route from pickup to drop location */}


                            <MapComponent
                                mapCenter={mapCenter}
                                selectedLocation={undefined}
                                officeLocations={[]}
                                // transformOfficeData={(office: Office) => office}
                                handleCardClick={(location: Location) => console.log(location)}
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

                {/* RIGHT PANEL */}
                <div className="w-full md:flex-1 max-w-4xl mx-auto space-y-4 mt-6 px-4">
                    {Object.keys(groupedVehicles).map((type) => {
                        const items = groupedVehicles[type];
                        const index = indexes[type] ?? 0;
                        const current = items[index];
                        const breakdown = calculatePrice(current, distance, hours, tripType);
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

                                    <div className="flex flex-row gap-4">  <h3 className="font-bold text-lg text-gray-800 text-center">{current.name}</h3>
                                        <button
                                            type="button"
                                            onClick={() => setOpenVehicleModalId(openVehicleModalId === current.id ? null : current.id)}
                                            className="focus:outline-none"
                                        >
                                            <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                                        </button>

                                    </div>

                                    {openVehicleModalId === current.id && (
                                        <div className="absolute top-15 left-1/2 transform -translate-x-1/2  w-72 p-4 z-50">

                                            <div className="bg-gray-50 border border-gray-200 p-4 rounded shadow-md  w-72 text-sm text-gray-700 mb-6">
                                                <p className="mb-2">
                                                    **Additional Fees such as Tolls, Parking &amp;/or Car seat fee charges may apply (if not included).
                                                </p>
                                                <p>
                                                    **Preferred vehicle types are based on availability. <br />
                                                    **Use client for booking confirmation.
                                                </p>
                                            </div>
                                        </div>
                                    )}

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
                                        ${breakdown.total.toFixed(2)}


                                    </div>

                                    {/* Bags */}
                                    <div className="flex items-center bg-[#F6F6F6] border border-[#008492] px-3 py-2 rounded-full gap-1">
                                        <Briefcase className="w-4 h-4 text-[#000000]" />
                                        <span>{current.bags}</span>
                                    </div>
                                </div>


                                <button
                                    onClick={() => {
                                        setLoadingVehicleId(current.id); // set which vehicle is loading
                                        const selectedVehicle = {
                                            ...current,
                                            price: calculatePrice(current, distance, hours, tripType),
                                            vehicleTitle: getVehicleTitle(current.type),
                                            tripType: tripType,
                                        };
                                        setTimeout(() => {
                                            onNext(selectedVehicle);
                                            // don’t reset loading here, component will unmount anyway
                                        }, 500);
                                    }}
                                    disabled={loadingVehicleId === current.id}
                                    className="bg-[#008492] md:hidden block hover:bg-[#007472] text-white px-4 py-2 rounded-md font-medium w-full flex justify-center items-center gap-2"
                                >
                                    {loadingVehicleId === current.id ? (
                                        <div className="w-5 h-5 border border-gray-300 border-t-4 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        "Select Vehicle"
                                    )}
                                </button>


                                {/* Vehicle Info */}
                                <div className="flex-1 md:block hidden">
                                    {/* Title + Info */}
                                    <div className="relative w-full">
                                        {/* Title + Info icon */}
                                        <div className="flex items-center gap-2 group relative">
                                            <h3 className="text-lg mt-1 font-semibold text-gray-800 uppercase">
                                                Luxury - {getVehicleTitle(type)}
                                            </h3>

                                            <button type="button" className="focus:outline-none">
                                                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                                            </button>

                                            {/* Small modal above the card */}
                                            <div
                                                className="absolute top-10 left-1/2 -translate-x-1/2 w-72 
                 opacity-0 invisible 
                 group-hover:opacity-100 group-hover:visible 
                 transition-all duration-200 z-50"
                                            >
                                                <div className="bg-gray-50 border border-gray-200 p-4 rounded shadow-md text-sm text-gray-700 mb-6">
                                                    <p className="mb-2">
                                                        **Additional Fees such as Tolls, Parking &amp;/or Car seat fee charges may apply (if not included).
                                                    </p>
                                                    <p>
                                                        **Preferred vehicle types are based on availability. <br />
                                                        **Use client for booking confirmation.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
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
                                            setLoadingVehicleId(current.id);
                                            const selectedVehicle = {
                                                ...current,
                                                price: calculatePrice(current, distance, hours, tripType),
                                                vehicleTitle: getVehicleTitle(current.type),
                                                tripType: tripType,
                                                basePrice: calculatePrice(current, distance, hours, tripType).basePrice,
                                                gratuity: 20,
                                                tollFee: 10,
                                                airportFee: 5,
                                                tax: 5,
                                                total: calculatePrice(current, distance, hours, tripType).total,
                                                hours: tripType === "hourly" ? hours : undefined,
                                            };
                                            setTimeout(() => {
                                                onNext(selectedVehicle);
                                                // don’t reset loading here, component will unmount anyway
                                            }, 500);

                                            // If onNext is async, reset after it's done
                                            // setLoadingVehicleId(null);
                                        }}
                                        disabled={loadingVehicleId === current.id}
                                        className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium text-sm"
                                    >
                                        {loadingVehicleId === current.id ? (
                                            <div className="w-5 h-5 border border-gray-300 border-t-4 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                Select Vehicle
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>



                                    <div className="text-gray-900 font-bold text-xl mt-4">
                                        ${breakdown.total.toFixed(2)}




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
    );
}

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
