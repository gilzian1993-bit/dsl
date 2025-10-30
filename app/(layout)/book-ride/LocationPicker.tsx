"use client";

import { useRef } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { SlLocationPin } from "react-icons/sl";
import useFormStore, { FieldType, FormDataType } from "@/stores/FormStore";
import { GOOGLE_MAPS_API_KEY } from "@/lib/config";

interface LocationInputProps {
  field: keyof FormDataType;
  label?: string;
  placeholder: string;
  index?: number; 
  isStop?: boolean;
  onAddStop?: () => void;
  onRemoveStop?: () => void;
  showAddButton?: boolean;
}

export default function LocationInput({
  field,
  label,
  placeholder,
  index,
}: LocationInputProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { formData, setFormData } = useFormStore();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (place.formatted_address && place.geometry?.location) {
      const coords = `${place.geometry.location.lat()},${place.geometry.location.lng()}`;
      setFormData(field, place.formatted_address, coords , index);
    }
  };

  const handleInputChange = (value: string) => {
    setFormData(field, value, "",index);
  };
  
  const fieldData =
     field === "stops" 
      ? formData.stops[index!]
      : (formData[field as keyof FormDataType] as FieldType<string>);

     

  return (
    <div className="relative flex items-center gap-3 w-full">
      

      {/* Input */}
      {!isLoaded ? (
        <div className="flex flex-col gap-1 w-full">
          {label && <div className="text-sm font-semibold text-gray-700">{label}</div>}
        <div className="relative flex-1">
          <SlLocationPin className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            placeholder="Loading..."
            className="w-full pl-8 md:pl-10 pr-2 md:pr-3 py-2 md:py-2.5 border border-gray-300 rounded-lg text-gray-500 bg-gray-50 cursor-not-allowed"
            />
        </div>
            </div>
      ) : (
        <div className="flex flex-col gap-1 w-full">
        {label &&  <div className="text-sm font-semibold text-gray-700">{label}</div> }
        <Autocomplete
          onLoad={(auto) => (autocompleteRef.current = auto)}
          onPlaceChanged={handlePlaceChanged}
          options={{ componentRestrictions: { country: "usa" } }}
          className={`w-full `}
        >
          <div className="relative flex-1 w-full">
            <SlLocationPin className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={fieldData?.value || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full pl-8 md:pl-10 pr-2 md:pr-3 py-2 md:py-2.5 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4910B] text-black text-base bg-white ${fieldData.error ? ' border-red-500' : 'border-gray-300'} `}
            />
          </div>
        </Autocomplete>
        </div>
      )}

    </div>
  );
}
