import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { Users, Briefcase, Wind, Wifi } from "lucide-react";
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
      { icon: Users, text: "3 Passengers" },
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
      { icon: Users, text: "3 Passengers" },
      { icon: Briefcase, text: "3 Luggage" },
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
      { icon: Users, text: "3 Passengers" },
      { icon: Briefcase, text: "3 Luggage" },
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
      { icon: Users, text: "3 Passengers" },
      { icon: Briefcase, text: "3 Luggage" },
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
      { icon: Users, text: "2-7 Passengers" },
      { icon: Briefcase, text: "2-3 Suitcase" },
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
      { icon: Users, text: "2-7 Passengers" },
      { icon: Briefcase, text: "2-3 Suitcase" },
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
      { icon: Briefcase, text: "6-7 Suitcase" },
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
      { icon: Briefcase, text: "6-7 Suitcase" },
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
      { icon: Briefcase, text: "6-7 Suitcase" },
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
      { icon: Briefcase, text: "6-7 Suitcase" },
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
      { icon: Briefcase, text: "12 Suitcase" },
      { icon: Wind, text: "Air Conditioning: Yes" },
      { icon: Wifi, text: "USB Port: Yes" },
    ],
  },
];

export default function VehicleCard({ vehicle }: { vehicle: typeof vehicles[0] }) {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.2,
    });
    const router = useRouter();

    return (
      <div ref={ref} className={`transition-all duration-700 ease-out transform ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="p-6 ">
          <div className="mb-6">
            <Image
              src={vehicle.image || "/placeholder.svg"}
              alt={vehicle.name}
              width={300}
              height={200}
              className="w-full h-full object-cover rounded"
            />
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-4">{vehicle.name}</h3>

          <div className="space-y-3 mb-6">
            {vehicle.features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <IconComponent className="w-4 h-4 mr-3 text-gray-500" />
                  <span>{feature.text}</span>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => router.push("/")}
            className="bg-[#008492] text-white py-3 px-4 rounded font-medium hover:bg-[#008492] transition-colors text-sm w-full"
          >
            VIEW DETAILS
          </button>
        </div>
      </div>
    );
  }