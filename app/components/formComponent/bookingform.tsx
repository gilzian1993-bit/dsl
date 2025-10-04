"use client";

import { useRef, useState, useEffect } from "react";
import { MapPin, CalendarIcon, ClockIcon, ChevronDown, Plus } from "lucide-react";
import { Autocomplete, Libraries, useLoadScript } from "@react-google-maps/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Calendar from "../../../components/ui/calendar";
import { format } from "date-fns";
import TimePicker from "../time-picker";
import { Dispatch, SetStateAction } from "react";
import { toast, Toaster } from "sonner";
import TimeInput from "../time-picker";
import { SlLocationPin } from "react-icons/sl";
import { X } from "lucide-react";

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
  stopsCount: number; // Add stopsCount to the interface
  setStopsCount: Dispatch<SetStateAction<number>>; // Add setStopsCount to the interface
  stop1: string;
  stop2: string;
  stop3: string;
  stop4: string;
  defaultValues: {
    pickupLocation: string;
    dropLocation: string;
    pickupDate: string;
    pickupTime: string;
    tripType: string;
    pickupLat:string;
    pickupLng:string;
    dropLat:string;
    dropLng:string;
    stop1: string;
    stop2: string;
    stop3: string;
    stop4: string;
    hours: string;
  };
  setStop1: Dispatch<SetStateAction<string>>;
  setStop2: Dispatch<SetStateAction<string>>;
  setStop3: Dispatch<SetStateAction<string>>;
  setStop4: Dispatch<SetStateAction<string>>;
}


const airports = [
  {
    name: "Newark Liberty International Airport (EWR)",
    coords: { lat: 40.6895, lng: -74.1745 },
  },
  {
    name: "John F. Kennedy International Airport (JFK)",
    coords: { lat: 40.6413, lng: -73.7781 },
  },
  {
    name: "LaGuardia Airport (LGA)",
    coords: { lat: 40.7769, lng: -73.8740 },
  },
  {
    name: "Teterboro Airport (TEB)",
    coords: { lat: 40.8500, lng: -74.0608 },
  },
  {
    name: "Westchester County Airport (HPN)",
    coords: { lat: 41.0670, lng: -73.7076 },
  },
];

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
    defaultValues,
    setHours,
    handleBookNow,
    loading,
    stopsCount,
    setStopsCount,
    stop1,
    stop2,
    stop3,
    stop4,
    setStop1,
    setStop2,
    setStop3,
    setStop4
  } = props;

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [open, setOpen] = useState(false);


  const [errors, setErrors] = useState<FormErrors>({});
  // Toggle dropdown visibility
  const toggleDropdown = () => setOpen((prevState) => !prevState);

  const pickupRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropRef = useRef<google.maps.places.Autocomplete | null>(null);
  const stopsRefs = useRef<(google.maps.places.Autocomplete | null)[]>([]);
  const libraries: Libraries = ["places"];
  const { isLoaded } = useLoadScript({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyDaQ998z9_uXU7HJE5dolsDqeO8ubGZvDU",
    libraries,
  });

  const handleTimeChange = (hour: number, minute: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    const formatted = `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
    setSelectedTime(formatted);

    setIsTimePickerOpen(false);
  };

  const handleSelect = (hour: number) => {
    setHours(hour);
    setOpen(false);
  };

  const addStop = () => {
    if (stopsCount < 4) {
      setStopsCount(prev => prev + 1);
      // Do not reset stop1, stop2, etc.
    }
  };
  const stops = [stop1, stop2, stop3, stop4]; // Always 4 items

  const removeStop = (index: number) => {
    switch (index) {
      case 0:
        setStop1(stop2);
        setStop2(stop3);
        setStop3(stop4);
        setStop4("");
        break;
      case 1:
        setStop2(stop3);
        setStop3(stop4);
        setStop4("");
        break;
      case 2:
        setStop3(stop4);
        setStop4("");
        break;
      case 3:
        setStop4("");
        break;
    }
    setStopsCount(prev => prev - 1);
  };


  const updateStop = (index: number, value: string) => {
    switch (index) {
      case 0: setStop1(value); break;
      case 1: setStop2(value); break;
      case 2: setStop3(value); break;
      case 3: setStop4(value); break;
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Use actual values or defaults
    const pickupVal = pickupLocation || defaultValues.pickupLocation || "";
    const dropVal = dropLocation || defaultValues.dropLocation || "";
    const dateVal =
      pickupDate ??
      (defaultValues.pickupDate ? new Date(defaultValues.pickupDate) : null);
    const timeVal = selectedTime || defaultValues.pickupTime || "";
    const hoursVal = hours || (defaultValues.hours ? parseInt(defaultValues.hours) : 0);

    // Validate Pickup Location
    if (!pickupVal.trim()) {
      newErrors.pickupLocation = "Pickup location is required";
    }

    // Validate Drop Location if pointToPoint
    if (tripType === "pointToPoint") {
      if (!dropVal.trim()) {
        newErrors.dropLocation = "Drop location is required";
      } else if (pickupVal.trim().toLowerCase() === dropVal.trim().toLowerCase()) {
        toast.error("Pickup and Drop location cannot be the same. Please select different locations.");
        return false;
      }
    }

    // Validate Date
    if (!dateVal || isNaN(dateVal.getTime())) {
      newErrors.pickupDate = "Date is required";
    }

    // Validate Time
    if (!timeVal.trim()) {
      newErrors.selectedTime = "Time is required";
    }

    // Validate Hours if hourlyRate
    if (tripType === "hourlyRate") {
      if (!hoursVal || hoursVal <= 0) {
        newErrors.hours = "Duration is required";
      }
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Book Now function
  const onBookNow = () => {
    // Ensure defaults are set for date & time if empty
    if (!pickupDate && defaultValues.pickupDate) {
      const d = new Date(defaultValues.pickupDate);
      if (!isNaN(d.getTime())) setPickupDate(d);
    }
    if (!selectedTime && defaultValues.pickupTime) {
      setSelectedTime(defaultValues.pickupTime);
    }

    if (validateForm()) {
      handleBookNow();
    }
  };


  const StopsSection = () => {
    return (
      <div className="w-full">
        <div className="flex flex-col mb-6 md:mb-0 sm:flex-row sm:items-center sm:justify-between">
          {stopsCount < 5 && (
            <span
              onClick={addStop}
              className="absolute right-3 cursor-pointer rounded-sm border text-white border-gray-300 bg-black md:px-2 md:py-0.5 px-4 py-2 text-[10px] font-medium text-gray-600"
              aria-hidden="true"
            >
              + Add Stop
            </span>
          )}
        </div>
      </div>
    );
  };


  return (

    <div className="relative z-10 bg-white rounded-xl shadow-2xl px-6 py-7 mx-auto w-full max-w-5xl">


      {/* ---TABS--- */}
      <div className="flex absolute -top-7 bg-[#232323] rounded-full p-1 overflow-hidden shadow-md">
        {["airportRide", "pointToPoint", "hourlyRate"].map((type) => (
          <button
            key={type}
            onClick={() => setTripType(type)}
            className={`px-6 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-200 ${tripType === type
              ? "bg-white text-gray-900 shadow"
              : "text-white hover:bg-gray-700"
              }`}
          >
            {type === "airportRide"
              ? "Airport Ride"
              : type === "hourlyRate"
                ? "Hourly Rate"
                : "Point-to-Point"}
          </button>
        ))}
      </div>


      {/* ---FIELDS--- */}
      <div
        className={`mt-6 grid grid-cols-1 gap-4 md:gap-5 ${tripType === "hourlyRate" ? "md:grid-cols-6" : "md:grid-cols-5"
          }`}
      >
        {/* Pickup Location */}
        {/* Pickup Location */}
        <div className="flex flex-col relative">
          <div className="flex flex-row items-center gap-4 mb-2">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
              Pickup Location
            </label>

            <div className="lg:block hidden"><StopsSection /></div>
          </div>


          <div className="relative w-full">
            {/* Ensure the MapPin icon is positioned correctly within the container */}
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />

            {tripType === "airportRide" ? (
              <div className="relative">
                {/* Custom Dropdown for Airport Selection */}
                <button
                  type="button"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left text-base flex justify-between items-center"
                  onClick={toggleDropdown} // Toggle dropdown visibility
                >
                  <span className="text-sm font-medium text-gray-600 ">
                    {pickupLocation || defaultValues.pickupLocation || "Select Airport"}
                  </span>

                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} // Rotate icon on open
                  />
                </button>

                {/* Dropdown Options */}
                {open && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md">
                    <ul className="max-h-60 overflow-y-auto">
                      {airports.map((airport) => (
                        <li
                          key={airport.name}
                          className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setPickupLocation(airport.name || defaultValues.pickupLocation); // Set the selected airport name
                            setPickupCoords(airport.coords); // Set the coordinates for the selected airport
                            setOpen(false); // Close dropdown
                          }}
                        >
                          {airport.name || defaultValues.pickupLocation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              isLoaded && (
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none text-base bg-white"
                    value={pickupLocation || defaultValues.pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                </Autocomplete>
              )
            )}
          </div>

          {errors.pickupLocation && (
            <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>
          )}
        </div>


        <div className="mt-2 md:hidden block flex justify-center items-center">
          <h3 className="rounded-sm border text-white border-gray-300 bg-black px-2 py-2 text-[10px] whitespace-nowrap font-medium text-gray-600">

            Additional Stops
          </h3>


          <StopsSection />

        </div>


        {stopsCount > 0 && (

          <div className="space-y-2 md:hidden block md:space-y-3 w-full mt-5">
            {[0, 1, 2, 3].map((index) => {
              if (index >= stopsCount) return null; // only show active stops

              const stopValue =
                index === 0 ? stop1 :
                  index === 1 ? stop2 :
                    index === 2 ? stop3 :
                      stop4;

              return (
                <div
                  key={index} // stable key prevents remount
                  className="relative w-full p-2 md:p-3 rounded-xl border-2 bg-blue-50 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 md:gap-3 w-full">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-[#008492] text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-md flex-shrink-0">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                      {!isLoaded ? (
                        <div className="text-center text-sm">Loading...</div>
                      ) : (
                        <Autocomplete
                          options={{ componentRestrictions: { country: "us" } }}
                          onLoad={(autocomplete) => (stopsRefs.current[index] = autocomplete)}
                          onPlaceChanged={() => {
                            const place = stopsRefs.current[index]?.getPlace();
                            if (place?.formatted_address) {
                              updateStop(index, place.formatted_address);
                            }
                          }}
                        >
                          <div className="relative w-full">
                            <SlLocationPin className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 md:w-4 md:h-4" />
                            <input
                              onChange={(e) => updateStop(index, e.target.value)} // optional manual typing
                              placeholder={`Enter stop ${index + 1} location`}
                              className="w-full pl-7 md:pl-8 pr-2 md:pr-3 py-1.5 md:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4910B] focus:border-transparent text-black text-xs md:text-sm bg-white"
                            />
                          </div>
                        </Autocomplete>

                      )}
                    </div>

                    {index === stopsCount - 1 && (
                      <button
                        type="button"
                        onClick={() => removeStop(index)}
                        className="w-5 h-5 md:w-6 md:h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110 flex-shrink-0"
                      >
                        <X className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 md:mt-2 flex items-center gap-1 w-full">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-0.5 md:h-1 flex-1 rounded-full transition-all duration-300 ${i <= index ? "bg-[#008492]" : "bg-gray-200"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}


          </div>

        )}

        {/* Drop Location OR Duration */}
        {tripType === "hourlyRate" ? (
          <>  <div className="flex flex-col">
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
                    {hour || defaultValues.hours} Hour
                  </button>
                ))}
              </PopoverContent>
            </Popover>
            {errors.hours && (
              <p className="text-red-500 text-sm mt-1">{errors.hours}</p>
            )}
          </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Dropoff Location
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
                      placeholder="Enter dropoff location"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none text-base bg-white"
                      value={dropLocation || defaultValues.dropLocation}
                      onChange={(e) => setDropLocation(e.target.value)}
                    />
                  </Autocomplete>
                )}
              </div>
              {errors.dropLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.dropLocation}</p>
              )}
            </div></>

        ) : (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Dropoff Location
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
                    placeholder="Enter dropoff location"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none text-base bg-white"
                    value={dropLocation || defaultValues.dropLocation}
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
                {pickupDate
                  ? format(pickupDate, "EEE dd MMM yyyy")
                  : defaultValues.pickupDate
                    ? format(new Date(defaultValues.pickupDate), "EEE dd MMM yyyy")
                    : "Select Date"}

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
                {selectedTime || defaultValues.pickupTime || "Select Time"}
              </button>
            </PopoverTrigger>

            <PopoverContent side="top" align="center" className="w-auto p-0 z-[9999]">
              <div className="bg-white rounded-md shadow-lg p-4">
                <TimeInput minTime="09:30" onChange={handleTimeChange} />
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
      {stopsCount > 0 && (

        <div className="space-y-2 md:block hidden md:space-y-3 w-full mt-5">
          {[0, 1, 2, 3].map((index) => {
            if (index >= stopsCount) return null; // only show active stops

            const stopValue =
              index === 0 ? stop1 :
                index === 1 ? stop2 :
                  index === 2 ? stop3 :
                    stop4;

            return (
              <div
                key={index} // stable key prevents remount
                className="relative w-full p-2 md:p-3 rounded-xl border-2 bg-blue-50 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-center gap-2 md:gap-3 w-full">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-[#008492] text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-md flex-shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0 w-full">
                    {!isLoaded ? (
                      <div className="text-center text-sm">Loading...</div>
                    ) : (
                      <Autocomplete
                        options={{ componentRestrictions: { country: "us" } }}
                        onLoad={(autocomplete) => (stopsRefs.current[index] = autocomplete)}
                        onPlaceChanged={() => {
                          const place = stopsRefs.current[index]?.getPlace();
                          if (place?.formatted_address) {
                            updateStop(index, place.formatted_address);
                          }
                        }}
                      >
                        <div className="relative w-full">
                          <SlLocationPin className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 md:w-4 md:h-4" />
                          <input
                            onChange={(e) => updateStop(index, e.target.value)} // optional manual typing
                            placeholder={`Enter stop ${index + 1} location`}
                            className="w-full pl-7 md:pl-8 pr-2 md:pr-3 py-1.5 md:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4910B] focus:border-transparent text-black text-xs md:text-sm bg-white"
                          />
                        </div>
                      </Autocomplete>

                    )}
                  </div>

                  {index === stopsCount - 1 && (
                    <button
                      type="button"
                      onClick={() => removeStop(index)}
                      className="w-5 h-5 md:w-6 md:h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110 flex-shrink-0"
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-2 md:mt-2 flex items-center gap-1 w-full">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-0.5 md:h-1 flex-1 rounded-full transition-all duration-300 ${i <= index ? "bg-[#008492]" : "bg-gray-200"
                        }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}


        </div>

      )}
    </div>
  );
}  