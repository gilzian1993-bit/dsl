"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GoInfo, GoPeople } from "react-icons/go";
import { PiSuitcase } from "react-icons/pi";
import { cn } from "@/lib/utils";
import useFormStore from "@/stores/FormStore";
import { brandColor } from "@/lib/colors";
import { ArrowRight, Loader } from "lucide-react";
import LoadingButton from "./LoadingButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const fleets = [
  {
    id: 1,
    type: "SEDAN",
    name: "SEDAN",
    image: "/images/sedan/cadilac-xts.png",
    price10Miles: 80,
    price: 2.50,
    hourly: 70,
    passengers: 3,
    suitcases: 3,
    features: ["WiFi", "Leather Seats", "Climate Control"],
    cars: [
      "CADILLAC XTS ",
      "Similar",
    ],
     isAvailable:true,
  },
  {
    id: 2,
    type: "MID SUV",
    name: "MID SUV",
    image: "/images/SUV/lincoln-aviator.png",
    price10Miles: 90,
    price: 2.75,
    hourly: 80,
    passengers: 4,
    suitcases: 4,
    features: ["WiFi", "Leather Seats", "Rear Climate Control"],
    cars: [
      "Lincoln Aviator",
      "Cadillac XT6",
    ],
     isAvailable:true,
  },
  {
    id: 3,
    type: "SUV",
    name: "SUV",
    image: "/images/SUV/cadilac-escalate.png",
    price10Miles: 100,
    price: 3.5,
    hourly: 100,
    passengers: 7,
    suitcases: 6,
    features: ["WiFi", "Premium Leather", "Panoramic Roof"],
    cars: [
      "Chevrolet Suburban",
      "Similar",
      
    ],
    isAvailable:true,
  },
  {
    id: 4,
    type: "SPRINTER",
    name: "SPRINTER",
    image: "/images/spinter/spinter.png",
    price10Miles: 250,
    price: 250,
    hourly: 250,
    passengers: 11,
    suitcases: 10,
    features: ["WiFi", "TV Screen", "Extra Legroom"],
    cars: ["Sprinter"],
    isAvailable:false,
  },
];


function CarList() {
  const { formData, category, setFormData, formLoading } = useFormStore();
  const router = useRouter();
  const [loadingVehicle, setLoadingVehicle] = useState<string | null>(null);

  const handleSelect = async (item: (typeof fleets)[0], price:number, graduatiy:number) => {
    setLoadingVehicle(item.name);
    setFormData("car", item.name, '');
    setFormData("basePrice", price, '');
    setFormData("graduatiy", graduatiy, '');
    
    // Small delay to show loading state, then navigate
    await new Promise(resolve => setTimeout(resolve, 300));
    router.push('/book-ride/passenger-details');
  };

  return (
    <div className="w-full flex flex-col gap-2 md:gap-4">
      {fleets.map((item) => {
        let price = 0;
        if(category==='hourly'){
           price = (Number(formData.duration.value) * item.hourly)
        } else{
          price = item.price10Miles;
          price += formData.distance.value > 10 ? (formData.distance.value - 10 ) * item.price : 0;
        }
        const graduatiy = ((price/100)*20)  ;
        const totalPrice =  (price + graduatiy + formData.stopsPrice.value).toFixed(2);
        
        const isSprinter = item.name === "SPRINTER";
        
        return <div
          key={item.name}
          className={cn(
            "grid max-md:grid-cols-8 grid-cols-8 gap-1 lg:gap-5 bg-white border  rounded-xl shadow-sm overflow-hidden p-2 md:p-3",
            "hover:shadow-md transition-shadow duration-200" , item.name===formData.car.value ? 'border-brand' : 'border-gray-200'
          )}
        >

          {/* Image Section */}
          <div className=" bg-white flex justify-center items-center w-full col-span-2">
            <Image
              src={item.image}
              width={150}
              height={150}
              alt={item.name}
              className="object-contain w-full"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center gap-1 col-span-4 w-full">
            <h2 className="text-base max-md:leading-4 md:text-xl font-semibold text-gray-900 uppercase">
              {item.name}
            </h2>
            <p className="text-gray-600 text-[12px] ">{item.cars.join(' - ')}</p>

            <div className="flex items-center gap-3 md:gap-5  text-gray-700 text-sm">
              <div className="flex items-center gap-1">
                <GoPeople size={14} color={brandColor} />
                <span>{item.passengers} </span>
              </div>
              <div className="flex items-center gap-1">
                <PiSuitcase size={14} color={brandColor} />
                <span>{item.suitcases} <span className="max-md:hidden">Suitcases</span></span>
              </div>
            </div>
            
            {!isSprinter && (
              <div className="flex items-start gap-1 md:gap-3 w-full">
                <div className="text-xl md:text-3xl font-bold text-gray-900">
                  ${totalPrice}
                </div>
                <div className="text-[10px] lg:text-sm text-red-500 line-through">
                  ${(Number(totalPrice)+((Number(price)/100)*5)).toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {/* Price and Action Section */}
          <div className="flex flex-col justify-end items-center w-full col-span-2 gap-2">
            {!isSprinter && (
              <>
                <div className="text-right font-normal text-black gap-2 items-center md:text-sm text-[7px] flex" >
                  <GoInfo />
                  No Tools Include
                </div>
                <div className="text-center font-bold text-orange-500 md:text-base" >5% OFF</div>
              </>
            )}
            
            {loadingVehicle === item.name ? (
              <div className="bg-blue-500 text-white rounded-md p-1 md:px-4 md:py-2 transition-all max-md:text-base w-full flex justify-center items-center gap-1">
                <Loader className="animate-spin" size={20} />
                <span>Loading</span>
              </div>
            ) : item.isAvailable ? (
              <button
                onClick={() => handleSelect(item, price, graduatiy)}
                disabled={loadingVehicle !== null}
                className={`bg-brand hover:bg-[#0294a4] text-black rounded-md p-1 md:px-4 md:py-2 transition-all max-md:text-base w-fit flex justify-center items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>Select</span> <span className="max-md:hidden">Vehicle</span>
                <ArrowRight className="max-lg:hidden text-2xl" size={20}/>
                <ArrowRight className="lg:hidden" size={15}/>
              </button>
            ) : (
              <Link href='/contact' className={`bg-brand hover:bg-[#0294a4] text-black rounded-md p-1 md:px-4 md:py-2 transition-all max-md:text-base flex justify-center items-center gap-1 w-full`}>Request</Link>
            )}
          </div>
        </div>
      })}
    </div>
  );
}

export default CarList;