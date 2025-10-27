"use client";


import { brandColor } from "@/lib/colors";
import useFormStore from "@/stores/FormStore";
import { ArrowRight } from "lucide-react";

export default function PickupTripDetails() {
  const { formData,category } = useFormStore();
  const { fromLocation, toLocation, stops, duration } = formData
  
  const locations = [
    fromLocation,
    ...stops,
  ].filter(Boolean);

  if(category==='hourly'){
    locations.push({...duration, value:duration.value + " Hours"})
  } else {
    locations.push(toLocation)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 max-w-md">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="p-2 rounded-md"
          style={{ backgroundColor: brandColor }}
        >
          <ArrowRight className="text-black w-4 h-4" />
        </div>
        <h2 className="font-semibold text-lg text-gray-900">
          Pickup {category === 'trip' ? 'Trip' : 'Hourly'} Details
        </h2>
      </div>

      <hr className="mb-4" />

      {/* Location List */}
      <div className="flex flex-col ">
        {locations.map((loc, index) => {
          const isFirst = index === 0;
          const isLast = index === locations.length - 1;
          const isStop = !isFirst && !isLast;
          const color = isLast ? brandColor : "black";

          return (
            <div key={index} className="flex gap-3 items-start relative">
           
              <div className="flex flex-col items-center mt-1">
                <div
                  className="w-5 h-5 rounded-full border-4"
                  style={{
                    borderColor: color,
                    backgroundColor: "white",
                  }}
                />
                {!isLast && <div className={`w-0.5 bg-gray-400 ${loc?.value.length>105 ? 'h-16' : loc?.value.length>70 ? 'h-12' : loc?.value.length>35 ? 'h-8' : 'h-4'}`} />}
              </div>

             
              <div>
                <h3 className="font-semibold text-gray-900">
                  {loc?.value || "N/A"}
                </h3>
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
