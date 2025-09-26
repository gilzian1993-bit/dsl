"use client";
import Image from "next/image";
import { useState } from "react";
import { Users, Briefcase, Wind, Wifi } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import VehicleCard from "../VehicleCard";

const fleetCategories = [
  { name: "ALL" },
  { name: "SEDAN" },
  { name: "MID SUV" },
  { name: "SUV" },
  { name: "SPRINTER" },
];

const vehicles = [
  {
    id: 1,
    name: "CADILLAC XTS - SEDAN",
    type: "SEDAN",
    image: "/images/sedan/cadilac-xts.png",
    features: [
      { icon: Users, text: "2-3 Passengers" },
      { icon: Briefcase, text: "2 Luggage" },
      { icon: Wind, text: "Air Conditioning: Yes" },
      { icon: Wifi, text: "WiFi Hot Spot" },
    ],
  },
  {
    id: 2,
    name: "LINCOLN CONTINENTAL - SEDAN",
    type: "SEDAN",
    image: "/images/sedan/lincoln.png",
    features: [
      { icon: Users, text: "2-3 Passengers" },
      { icon: Briefcase, text: "2 Luggage" },
      { icon: Wind, text: "Air Conditioning: Yes" },
      { icon: Wifi, text: "WiFi Hot Spot" },
    ],
  },
  {
    id: 3,
    name: "CADILLAC CTS - SEDAN",
    type: "SEDAN",
    image: "/images/sedan/cadilac.cts.png",
    features: [
      { icon: Users, text: "2-3 Passengers" },
      { icon: Briefcase, text: "2 Luggage" },
      { icon: Wind, text: "Air Conditioning: Yes" },
      { icon: Wifi, text: "WiFi Hot Spot" },
    ],
  },
  {
    id: 4,
    name: "CADILLAC LYRIQ - SEDAN",
    type: "SEDAN",
    image: "/images/sedan/cadilac.png",
    features: [
      { icon: Users, text: "2-3 Passengers" },
      { icon: Briefcase, text: "2 Luggage" },
      { icon: Wind, text: "Air Conditioning: Yes" },
      { icon: Wifi, text: "WiFi Hot Spot" },
    ],
  },
  {
    id: 5,
    name: "Lincoln Aviator - MID SIZE SUV",
    type: "MID SUV",
    image: "/images/SUV/lincoln-aviator.png",
    features: [
      { icon: Users, text: "2-3 Passengers" },
      { icon: Briefcase, text: "4 Luggage" },
      { icon: Wind, text: "Air Conditioning: Yes" },
      { icon: Wifi, text: "USB Port: Yes" },
    ],
  },
  {
    id: 6,
    name: "Cadillac XT6 - MID SIZE SUV",
    type: "MID SUV",
    image: "/images/SUV/cadilac-xt6.png",
    features: [
      { icon: Users, text: "2-3 Passengers" },
      { icon: Briefcase, text: "4 Luggage" },
      { icon: Wind, text: "Air Conditioning: Yes" },
      { icon: Wifi, text: "USB Port: Yes" },
    ],
  },
  {
    id: 7,
    name: "Chevrolet Suburban - SUV",
    type: "SUV",
    image: "/images/SUV/chevrolet.png",
    features: [
      { icon: Users, text: "6-7 Passengers" },
      { icon: Briefcase, text: "6-7 Luggage" },
      { icon: Wind, text: "Air Conditioning: Yes" },
      { icon: Wifi, text: "USB Port: Yes" },
    ],
  },
  {
    id: 8,
    name: "Cadillac Escalade - SUV",
    type: "SUV",
    image: "/images/SUV/cadilac-escalate.png",
    features: [
      { icon: Users, text: "6-7 Passengers" },
      { icon: Briefcase, text: "6-7 Luggage" },
      { icon: Wind, text: "Air Conditioning: Yes" },
      { icon: Wifi, text: "USB Port: Yes" },
    ],
  },
  {
    id: 9,
    name: "GMC Yukon XL - SUV",
    type: "SUV",
    image: "/images/SUV/GMC.png",
    features: [
      { icon: Users, text: "6-7 Passengers" },
      { icon: Briefcase, text: "6-7 Luggage" },
      { icon: Wind, text: "Air Conditioning: Yes" },
      { icon: Wifi, text: "USB Port: Yes" },
    ],
  },
  {
    id: 10,
    name: "Lincoln Navigator - SUV",
    type: "SUV",
    image: "/images/SUV/lincol-navigator.png",
    features: [
      { icon: Users, text: "6-7 Passengers" },
      { icon: Briefcase, text: "6-7 Luggage" },
      { icon: Wind, text: "Air Conditioning: Yes" },
      { icon: Wifi, text: "USB Port: Yes" },
    ],
  },
  {
    id: 11,
    name: "Sprinter",
    type: "SPRINTER",
    image: "/images/spinter/spinter.png",
    features: [
      { icon: Users, text: "11 Passengers" },
      { icon: Briefcase, text: "12 Luggage" },
      { icon: Wind, text: "Air Conditioning: Yes" },
      { icon: Wifi, text: "USB Port: Yes" },
    ],
  },
];

export default function OurFleetSection() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const router = useRouter();
 

  const filteredVehicles =
    activeCategory === "ALL"
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.type === activeCategory);

  return (
    <section className="py-32 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold font-Montserrat text-gray-900 mb-4">
            OUR FLEET
          </h2>
          <div className="flex items-center justify-center gap-5 mb-6">
            <div className="flex-1 h-px bg-[#DDDDDD] max-w-20"></div>
            <Image src="/Vector.png" alt="icon" width={20} height={20} />
            <div className="flex-1 h-px bg-[#DDDDDD] max-w-20"></div>
          </div>

          {/* Navigation Categories */}
          <div className="flex justify-center items-center  text-sm">
            {fleetCategories.map((category, index) => (
              <div key={category.name} className="flex items-center">
                <button
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-2 py-1 transition-colors ${activeCategory === category.name
                    ? "text-teal-500 font-medium"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {category.name}
                </button>
                {index < fleetCategories.length - 1 && (
                  <span className="text-gray-600 mx-2">/</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
