"use client";

import { useRef, useState } from "react";
import { MapPin, CalendarIcon, ClockIcon } from "lucide-react";
import { Autocomplete, Libraries, useLoadScript } from "@react-google-maps/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Calendar from "../../../components/ui/calendar";
import { format } from "date-fns";
import TimePicker from "../time-picker";
import { Dispatch, SetStateAction } from "react";
import { toast, Toaster } from "sonner";
interface LatLng {
  lat: number;
  lng: number;
}
interface FormErrors {
  pickupLocation?: string;
  dropLocation?: string;
  pickupDate?: string;
  selectedTime?: string;
  hours?: string;
}


interface BookingFormProps {
  tripType: string;
  setTripType: Dispatch<SetStateAction<string>>;
  pickupDate: Date | null;
  setPickupDate: Dispatch<SetStateAction<Date | null>>;
  pickupLocation: string;
  setPickupLocation: Dispatch<SetStateAction<string>>;
  dropLocation: string;
  setDropLocation: Dispatch<SetStateAction<string>>;
  pickupCoords: LatLng | null;
  setPickupCoords: Dispatch<SetStateAction<LatLng | null>>;
  dropCoords: LatLng | null;
  setDropCoords: Dispatch<SetStateAction<LatLng | null>>;
  selectedTime: string;
  setSelectedTime: Dispatch<SetStateAction<string>>;
  selectedDate: Date | null;
  setSelectedDate: Dispatch<SetStateAction<Date | null>>;
  isTimePickerOpen: boolean;
  setIsTimePickerOpen: Dispatch<SetStateAction<boolean>>;
  hours: number;
  setHours: Dispatch<SetStateAction<number>>;
  handleBookNow: () => void;
  loading: boolean;
}
export default function BookingForm(props: BookingFormProps) {
  const {
    tripType,
    setTripType,
    pickupDate,
    setPickupDate,
    pickupLocation,
    setPickupLocation,
    dropLocation,
    setDropLocation,
    pickupCoords,
    setPickupCoords,
    dropCoords,
    setDropCoords,
    selectedTime,
    setSelectedTime,
    selectedDate,
    setSelectedDate,
    isTimePickerOpen,
    setIsTimePickerOpen,
    hours,
    setHours,
    handleBookNow,
    loading,
  } = props;

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const pickupRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropRef = useRef<google.maps.places.Autocomplete | null>(null);
  // const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);

  const libraries: Libraries = ["places"];
  const { isLoaded } = useLoadScript({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyDaQ998z9_uXU7HJE5dolsDqeO8ubGZvDU",
    libraries,
  });

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsTimePickerOpen(false);
  };
  const handleSelect = (hour: number) => {
    setHours(hour);
    setOpen(false);
  };

  // ✅ Validate fields before booking
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!pickupLocation) newErrors.pickupLocation = "Pickup location is required";
    if (!pickupDate) newErrors.pickupDate = "Date is required";
    if (!selectedTime) newErrors.selectedTime = "Time is required";

    if (tripType === "pointToPoint") {
      if (!dropLocation) {
        newErrors.dropLocation = "Drop location is required";
      } else if (
        pickupLocation.trim().toLowerCase() === dropLocation.trim().toLowerCase()
      ) {
        // 🚫 Show toast if pickup = drop
        toast.error("Pickup and Drop location cannot be the same. Please select different locations.");
        return false;
      }
    }

    if (tripType === "hourlyRate") {
      if (!hours) newErrors.hours = "Duration is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const onBookNow = () => {
    if (validateForm()) {
      handleBookNow();
    }
  };

  return (

    <div className="relative z-10 bg-white rounded-xl shadow-2xl px-6 py-7 mx-auto w-full max-w-5xl">
      {/* ---TABS--- */}
     
      <div className="flex absolute -top-7 bg-[#232323] rounded-full p-1 overflow-hidden shadow-md">
        {["pointToPoint", "hourlyRate"].map((type) => (
          <button
            key={type}
            onClick={() => setTripType(type)}
            className={`px-6 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-200 ${tripType === type
              ? "bg-white text-gray-900 shadow"
              : "text-white hover:bg-gray-700"
              }`}
          >
            {type === "pointToPoint" ? "Point-to-Point" : "Hourly Rate"}
          </button>
        ))}
      </div>

      {/* ---FIELDS--- */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
        {/* Pickup Location */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Pickup Location
          </label>
          <div className="relative w-full">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            {isLoaded && (
              <Autocomplete
                onLoad={(ref) => (pickupRef.current = ref)}
                onPlaceChanged={() => {
                  const place = pickupRef.current?.getPlace();
                  if (place?.geometry?.location) {
                    setPickupLocation(place.formatted_address || "");
                    setPickupCoords({
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    });
                  }
                }}
                options={{ componentRestrictions: { country: "us" } }}
              >
                <input
                  placeholder="Enter pickup location"
                  className="w-full pl-10 pr-3 py-2 border rounded-md shadow-sm outline-none text-base bg-white"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                />
              </Autocomplete>
            )}
          </div>
          {errors.pickupLocation && (
            <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>
          )}
        </div>

        {/* Drop Location OR Duration */}
        {tripType === "hourlyRate" ? (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Duration
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-base"
                >
                  {hours ? `${hours} Hour` : "Select Duration"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-70 max-h-60 overflow-y-auto p-1 z-[9999]">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleSelect(hour)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 ${hours === hour ? "bg-gray-200 font-medium" : ""
                      }`}
                  >
                    {hour} Hour
                  </button>
                ))}
              </PopoverContent>
            </Popover>
            {errors.hours && (
              <p className="text-red-500 text-sm mt-1">{errors.hours}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Drop Location
            </label>
            <div className="relative w-full">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              {isLoaded && (
                <Autocomplete
                  onLoad={(ref) => (dropRef.current = ref)}
                  onPlaceChanged={() => {
                    const place = dropRef.current?.getPlace();
                    if (place?.geometry?.location) {
                      setDropLocation(place.formatted_address || "");
                      setDropCoords({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                      });
                    }
                  }}
                  options={{ componentRestrictions: { country: "us" } }}
                >
                  <input
                    placeholder="Enter drop location"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none text-base bg-white"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                  />
                </Autocomplete>
              )}
            </div>
            {errors.dropLocation && (
              <p className="text-red-500 text-sm mt-1">{errors.dropLocation}</p>
            )}
          </div>
        )}

        {/* Date */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Date</label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen} modal={false}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left"
              >
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                {pickupDate ? format(pickupDate, "EEE dd MMM yyyy") : "Select Date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[9999]" align="start" side="bottom">
              <Calendar
                mode="single"
                selected={pickupDate ?? undefined}
                onSelect={(date: Date | undefined) => {
                  setPickupDate(date ?? null);
                  setIsCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>

          {errors.pickupDate && (
            <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>
          )}
        </div>

        {/* Time */}
        <div className="flex flex-col ">
          <label className="text-sm font-medium text-gray-600 mb-1">Time</label>
          <Popover open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left"
                onClick={() => setIsTimePickerOpen(true)}
              >
                <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                {selectedTime || "Select Time"}
              </button>
            </PopoverTrigger>

            <PopoverContent side="top" align="center" className="w-auto p-0 z-[9999]">
              <div className="bg-white rounded-md shadow-lg p-4">
                <TimePicker

                  selectedTime={selectedTime}
                  onTimeSelect={handleTimeSelect}
                  onClose={() => setIsTimePickerOpen(false)}
                />
              </div>
            </PopoverContent>
          </Popover>
          {errors.selectedTime && (
            <p className="text-red-500 text-sm mt-1">{errors.selectedTime}</p>
          )}
        </div>

        {/* Book Button */}
        <div className="flex flex-col justify-end">
          <button
            onClick={onBookNow}
            disabled={loading}
            className="bg-[#23b1c0] hover:bg-[#1e9aa8] text-white rounded-md font-semibold text-base px-6 py-3 shadow-md transition-all w-full flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border border-gray-300 border-t-4 border-t-gray-500 rounded-full animate-spin"></div>
            ) : (
              "BOOK NOW"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
