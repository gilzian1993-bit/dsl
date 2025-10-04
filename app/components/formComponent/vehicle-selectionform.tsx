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
    Route,
    Clock,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MapComponent from "./GoogleMap";
import GoogleMapsRoute from "./GoogleMap";


// interfaces
interface PriceBreakdown {
    basePrice: number;
    gratuity: number;
    tollFee: number;
    tax: number;
    total: number;
}

interface VehicleOption {
    id: number;
    name: string;
    type: string;
    image: string;
    price: number;       // final selected price
    hourly: number;
    passengers: number;
    bags: number;
    features: string[];
    vehicleTitle?: string;
    tripType?: string;

    // Breakdown
    basePrice?: number;
    base?: number;
    gratuity?: number;
    tax?: number;
    airportFee?: number;
    total?: number;
    discountAmount?: number;
    finalPrice?: number;
    hours?: number;

}




const vehicles: VehicleOption[] = [
    // 🚘 Sedans
    {
        id: 1,
        name: "CADILLAC XTS - SEDAN",
        type: "SEDAN",
        image: "/images/sedan/cadilac-xts.png",
        price: 85,
        hourly: 80,
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
        hourly: 80,
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
        hourly: 80,
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
        hourly: 80,
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
        hourly: 90,
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
        hourly: 90,
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
        hourly: 100,
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
        hourly: 100,
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
        hourly: 100,
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
        hourly: 100,
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
        passengers: 11,
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
    onNext: (vehicle: VehicleOption) => void;  // 👈 use VehicleOption instead of any
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
    const stopsCount = Number(searchParams.get("stopsCount") || 0);
    const router = useRouter();

    const mapCenter =
        pickupLat && pickupLng ? { lat: pickupLat, lng: pickupLng } : { lat: 34.0522, lng: -118.2437 };

    function calculatePrice(
        vehicle: VehicleOption,
        distance: number,
        hours: number,
        tripType: string,

    ) {
        let basePrice = 0;

        // Adjust pricing based on tripType
        if (tripType === "hourlyRate") {
            basePrice = Number((hours * vehicle.hourly).toFixed(2));
        } else {
            // Adjust pricing for LaGuardia Airport (LGA) and John F. Kennedy International Airport (JFK)
            if (pickupLocation === "LaGuardia Airport (LGA)") {
                if (vehicle.type === "SEDAN") {
                    basePrice = distance <= 10 ? 85 : 85 + (distance - 10) * 3;
                } else if (vehicle.type === "MID SUV") {
                    basePrice = distance <= 10 ? 95 : 95 + (distance - 10) * 3.25;
                } else if (vehicle.type === "SUV") {
                    basePrice = distance <= 10 ? 105 : 105 + (distance - 10) * 3.50;
                } else if (vehicle.type === "SPRINTER") {
                    basePrice = distance <= 15 ? 210 : 210 + (distance - 15) * 7;
                }
            } else if (pickupLocation === "John F. Kennedy International Airport (JFK)") {
                if (vehicle.type === "SEDAN") {
                    basePrice = distance <= 15 ? 100 : 100 + (distance - 15) * 3;
                } else if (vehicle.type === "MID SUV") {
                    basePrice = distance <= 15 ? 110 : 110 + (distance - 15) * 3.25;
                } else if (vehicle.type === "SUV") {
                    basePrice = distance <= 15 ? 125 : 125 + (distance - 15) * 3.50;
                } else if (vehicle.type === "SPRINTER") {
                    basePrice = distance <= 15 ? 270 : 270 + (distance - 15) * 7;
                }
            }
            else if (pickupLocation === "Westchester County Airport (HPN)") {
                if (vehicle.type === "SEDAN") {
                    basePrice = distance <= 30 ? 135 : 135 + (distance - 30) * 3;
                } else if (vehicle.type === "MID SUV") {
                    basePrice = distance <= 30 ? 145 : 145 + (distance - 13) * 3.25;
                } else if (vehicle.type === "SUV") {
                    basePrice = distance <= 30 ? 165 : 165 + (distance - 13) * 3.50;
                } else if (vehicle.type === "SPRINTER") {
                    basePrice = distance <= 15 ? 270 : 270 + (distance - 15) * 7;
                }
            }
            else if (pickupLocation === "Teterboro Airport (TEB)") {
                if (vehicle.type === "SEDAN") {
                    basePrice = distance <= 30 ? 100 : 100 + (distance - 30) * 3;
                } else if (vehicle.type === "MID SUV") {
                    basePrice = distance <= 30 ? 120 : 120 + (distance - 13) * 3.25;
                } else if (vehicle.type === "SUV") {
                    basePrice = distance <= 30 ? 150 : 150 + (distance - 13) * 3.75;
                } else if (vehicle.type === "SPRINTER") {
                    basePrice = distance <= 15 ? 270 : 270 + (distance - 15) * 7;
                }
            }
            // Adjust pricing for other locations...
            else if (pickupLocation === "Newark Liberty International Airport (EWR)") {
                if (vehicle.type === "SEDAN") {
                    basePrice = distance <= 15 ? 100 : 100 + (distance - 15) * 3;
                } else if (vehicle.type === "MID SUV") {
                    basePrice = distance <= 15 ? 110 : 110 + (distance - 15) * 3.40;
                } else if (vehicle.type === "SUV") {
                    basePrice = distance <= 15 ? 130 : 130 + (distance - 15) * 3.75;
                } else if (vehicle.type === "SPRINTER") {
                    basePrice = distance <= 15 ? 260 : 260 + (distance - 15) * 7;
                }
            }

            else {
                switch (vehicle.type) {
                    case "SEDAN":
                        basePrice = distance <= 10
                            ? 85
                            : distance <= 20
                                ? 100
                                : 100 + (distance - 20) * 3;
                        break;
                    case "MID SUV":
                        basePrice = distance <= 10
                            ? 95
                            : distance <= 20
                                ? 110
                                : 110 + (distance - 20) * 3.25;
                        break;
                    case "SUV":
                        basePrice = distance <= 10
                            ? 110
                            : distance <= 20
                                ? 125
                                : 125 + (distance - 20) * 3.75;
                        break;
                    case "SPRINTER":
                        basePrice = distance <= 17
                            ? distance * 7
                            : distance <= 38
                                ? 250
                                : 250 + (distance - 38) * 2.3;
                        break;
                    default:
                        basePrice = vehicle.price;
                }
            }
        }

        const gratuity = basePrice * 0.20;
        const tax = basePrice * 0.05;


        const airportFee = tripType === "airportRide" ? 5 : 0;


        let total = basePrice + gratuity + tax + airportFee;
        if (tripType !== "hourlyRate" && stopsCount > 0) {
            total += 20 * stopsCount;
        }
        const discountPercentage = 5;
        const discountAmount = tripType !== "hourlyRate" ? total * (discountPercentage / 100) : 0;
        const finalPrice = total - discountAmount;

        console.log("Base:", basePrice);
        console.log("discountAmount:", discountAmount);
        console.log("hours:", hours);
        console.log("Gratuity (20%):", gratuity);
        console.log("Tax (5%):", tax);
        console.log("Airport Fee:", airportFee);
        console.log("Total with Stops Fee:", total);
        console.log("Stops:", stopsCount);


        return {
            basePrice,
            gratuity,
            tax,
            airportFee,
            total,
            discountAmount,
            finalPrice
        };
    }
    useEffect(() => {
        if (window.innerWidth < 768) {
            const interval = setInterval(() => {
                Object.keys(groupedVehicles).forEach((type) => {
                    handleNext(type);
                });
            }, 6000);
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


    const handleBack = () => {
        const pickupLocation = searchParams.get("pickupLocation") || "";
        const dropLocation = searchParams.get("dropLocation") || "";
        const pickupDate = searchParams.get("pickupDate") || "";
        const pickupTime = searchParams.get("pickupTime") || "";
        const hours = searchParams.get("hours") || "0";
        const pickupLat = Number(searchParams.get("pickupLat") || "0");
        const pickupLng = Number(searchParams.get("pickupLng") || "0");
        const dropLat = Number(searchParams.get("dropLat") || "0");
        const dropLng = Number(searchParams.get("dropLng") || "0");
        const stopsCount = searchParams.get("stopsCount") || "0";

        const formattedPickupDate = pickupDate ? new Date(pickupDate).toISOString() : "";

        const params = new URLSearchParams({
            pickupLocation,
            dropLocation,
            pickupDate: formattedPickupDate,
            pickupTime,
            hours,
            pickupLat: pickupLat.toString(),   // ✅ convert number to string
            pickupLng: pickupLng.toString(),   // ✅
            dropLat: dropLat.toString(),       // ✅
            dropLng: dropLng.toString(),       // ✅
            stopsCount,
        });

        // ✅ Attach query params after `?`
        router.push(`/?${params.toString()}`);
    };



    return (
        <>
            <div className="bg-[#DDDDDD] px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={handleBack} className="flex items-center font-semibold text-gray-700 hover:text-black">
                        <ArrowLeft className="h-4 w-4" />
                        BACK
                    </button>
                    <h1 className="text-lg font-semibold">{step} - Select Your Vehicle</h1>
                </div>
            </div>
            <div className="min-h-screen max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row">
                    {/* LEFT PANEL (Trip Details + Map) */}
                    <div className="w-full md:w-80 p-4">
                        <div className="mb-6">
                            <div className="w-full ">
                                {/* Google Maps Embed showing route from pickup to drop location */}


                                <GoogleMapsRoute
                                    fromCoords={{ lat: pickupLat, lng: pickupLng }}
                                    toCoords={{ lat: dropLat, lng: dropLng }}
                                />


                            </div>
                        </div>
                        {/* Mobile: Trip Details */}
                        <div className="md:hidden block mb-3">
                            <button
                                onClick={handleBack}
                                className="w-full bg-[#008492] p-5 mb-5 text-white rounded-md flex  items-center"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                BACK
                            </button>
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
                                            <Image src="/clock--.svg" alt="Clock" width={16} height={16} />
                                            <span className="font-medium">{pickupTime}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <Route className="w-4 h-4 text-gray-600" />
                                            <span className="font-medium">{distance} miles</span>
                                        </div>
                                        {tripType === "hourlyRate" && (
                                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                                <Clock className="w-4 h-4 text-gray-600" />
                                                <span className="font-medium">{hours} hrs</span>
                                            </div>
                                        )}

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
                                    <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
                                        <img src="/clock--.svg" alt="Clock" className="w-4 h-4" />
                                        <span className="font-medium">{pickupTime}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
                                        <Route className="w-4 h-4 text-gray-600" />
                                        <span className="font-medium">{distance} miles</span>
                                    </div>
                                    {tripType === "hourlyRate" && (
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <Clock className="w-4 h-4 text-gray-600" />
                                            <span className="font-medium">{hours} hrs</span>
                                        </div>
                                    )}
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

                                        <div className="flex flex-row gap-4">  <h3 className="font-bold text-lg text-gray-800 text-center">{getVehicleTitle(type)}</h3>
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
                                                        Additional fees such as tolls will be applied

                                                    </p>
                                                    <p>
                                                        Preferred vehicle types are based on availability

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

                                        {current.type === "SPRINTER" && (tripType === "pointToPoint" || tripType === "hourlyRate" || tripType === "airportRide") ? "" : (
                                            <div className="relative text-white bg-black mt-4 px-6 py-2 rounded-md font-medium text-sm">
                                                {/* Discount Badge Top-Right */}
                                                {tripType !== "hourlyRate" && (
                                                    <span className="absolute -top-2 md:-right-2 -right-4 bg-teal-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
                                                        5% OFF
                                                    </span>
                                                )}

                                                {/* Pricing */}
                                                <div className="flex flex-col items-center">
                                                    {tripType !== "hourlyRate" ? (
                                                        <>
                                                            {/* Original Price */}
                                                            <span className="text-white line-through text-sm">
                                                                ${breakdown.total.toFixed(2)}
                                                            </span>

                                                            {/* Final Price */}
                                                            <span className="text-2xl text-center font-bold text-white">
                                                                ${breakdown.finalPrice.toFixed(2)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        // Hourly → Show only final price (no discount, no strikethrough)
                                                        <span className="text-2xl text-center font-bold text-white">
                                                            ${breakdown.total.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                        )}

                                        {/* Bags */}
                                        <div className="flex items-center bg-[#F6F6F6] border border-[#008492] px-3 py-2 rounded-full gap-1">
                                            <Briefcase className="w-4 h-4 text-[#000000]" />
                                            <span>{current.bags}</span>
                                        </div>
                                    </div>


                                    <div className="flex flex-col justify-end">
                                        {/* Show the Request button for Sprinter on Mobile (when tripType is pointToPoint or hourlyRate) */}
                                        {current.type === "SPRINTER" && (tripType === "pointToPoint" || tripType === "hourlyRate" || tripType === "airportRide") ? (
                                            <button
                                                onClick={() => router.push("/contact")}  // Navigate to the contact page
                                                className="flex items-center justify-center  gap-2 bg-[#008492] hover:bg-[#008492] text-white px-5 py-2 rounded-md font-medium text-sm md:hidden block"
                                            >
                                                Request
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setLoadingVehicleId(current.id); // Set the vehicle as loading
                                                    const selectedVehicle: VehicleOption = {
                                                        ...current,
                                                        price: breakdown.finalPrice,       // discounted price
                                                        base: breakdown.basePrice,
                                                        gratuity: breakdown.gratuity,
                                                        tax: breakdown.tax,
                                                        airportFee: breakdown.airportFee,
                                                        total: breakdown.total,            // original total before discount
                                                        discountAmount: breakdown.discountAmount,
                                                        finalPrice: breakdown.finalPrice,
                                                        vehicleTitle: getVehicleTitle(current.type),
                                                        tripType: tripType,
                                                        hours: tripType === "hourly" ? hours : undefined,
                                                    };
                                                    console.log("Sending to next:", selectedVehicle);
                                                    setTimeout(() => {
                                                        onNext(selectedVehicle);  // Proceed with the selected vehicle
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
                                        )}
                                    </div>



                                    {/* Vehicle Info */}
                                    <div className="flex-1 md:block hidden">
                                        {/* Title + Info */}
                                        <div className="relative w-full">
                                            {/* Title + Info icon */}
                                            <div className="flex items-center gap-2 group relative">
                                                <h3 className="text-lg mt-1 font-semibold text-gray-800 uppercase">
                                                    {getVehicleTitle(type)}
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
                                                    <div className="bg-gray-50 border border-gray-200 p-4 rounded shadow-md  w-72 text-sm text-gray-700 mb-6">
                                                        <p className="mb-2">
                                                            Additional fees such as tolls will be applied

                                                        </p>
                                                        <p>
                                                            Preferred vehicle types are based on availability

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

                                        {current.type === "SPRINTER" && (tripType === "pointToPoint" || tripType === "hourlyRate" || tripType === "airportRide") ? "" : (
                                            <div className="relative text-white bg-black mt-4 mb-5 rounded-md font-medium text-sm">
                                                {/* Discount Badge Top-Right */}
                                                {tripType !== "hourlyRate" && (
                                                    <span className="absolute -top-2 md:-right-2 -right-5 bg-teal-600 text-white text-xs font-semibold md:px-2 md:py-1  px-4 py-2 rounded-md">
                                                        5% OFF
                                                    </span>
                                                )}

                                                {/* Pricing */}
                                                <div className="flex flex-col items-center">
                                                    {tripType !== "hourlyRate" ? (
                                                        <>
                                                            {/* Original Price */}
                                                            <span className="text-white line-through text-sm">
                                                                ${breakdown.total.toFixed(2)}
                                                            </span>

                                                            {/* Final Price */}
                                                            <span className="text-xl text-center font-bold text-white">
                                                                ${breakdown.finalPrice.toFixed(2)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        // Hourly → Show only final price (no discount, no strikethrough)
                                                        <span className="text-2xl text-center font-bold text-white">
                                                            ${breakdown.total.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                        )}
                                        {current.type === "SPRINTER" && (tripType === "pointToPoint" || tripType === "hourlyRate" || tripType === "airportRide") ? (
                                            <button
                                                onClick={() => router.push("/contact")}
                                                className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium text-sm"
                                            >
                                                Request
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setLoadingVehicleId(current.id);
                                                    const selectedVehicle: VehicleOption = {
                                                        ...current,
                                                        price: breakdown.finalPrice,       // discounted price
                                                        base: breakdown.basePrice,
                                                        gratuity: breakdown.gratuity,
                                                        tax: breakdown.tax,
                                                        airportFee: breakdown.airportFee,
                                                        total: breakdown.total,            // original total before discount
                                                        discountAmount: breakdown.discountAmount,
                                                        finalPrice: breakdown.finalPrice,
                                                        vehicleTitle: getVehicleTitle(current.type),
                                                        tripType: tripType,
                                                        hours: tripType === "hourly" ? hours : undefined,
                                                    };
                                                    console.log("Sending to next:", selectedVehicle); // ✅ log before sending
                                                    setTimeout(() => {
                                                        onNext(selectedVehicle);  // send entire object including basePrice
                                                    }, 500);
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


                                        )}
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
            </div></>

    );
}

function getVehicleTitle(type: string) {
    switch (type) {
        case "SEDAN":
            return "Luxury Sedan";   // 👈 Only sedan gets "Luxury"
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

