"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, MapPin, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { Autocomplete, Libraries, useJsApiLoader, useLoadScript } from "@react-google-maps/api";
import TimePicker from "../time-picker";
import { calculateDistance } from "@/app/actions/getDistance";
import BookingForm from "../formComponent/bookingform";

export default function HeroSection() {
  const [tripType, setTripType] = useState("pointToPoint");
  const [pickupDate, setPickupDate] = useState<Date | null>(null);

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // ✅ Parent component
  const [isTimePickerOpen, setIsTimePickerOpen] = useState<boolean>(false);

  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dropCoords, setDropCoords] = useState<{ lat: number; lng: number } | null>(null);
  const pickupRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [hours, setHours] = useState<number>(0);

  const router = useRouter();
  const libraries: Libraries = ["places"]
  // Google Places Loader
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyDaQ998z9_uXU7HJE5dolsDqeO8ubGZvDU",
    libraries,
  })

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsTimePickerOpen(false);
  };
  const handleDateChange = (date: Date | null) => setPickupDate(date);
  const handleTripTypeChange = (type: string) => setTripType(type);

  const handleBookNow = async () => {
    setLoading(true);

    let distance = 0;

    if (tripType === "pointToPoint") {
      // ✅ Only calculate distance when needed
      const result = await calculateDistance({ from: pickupLocation, to: dropLocation });

      if (result.error || !result.distance) {
        alert(result.error || "Could not calculate distance");
        setLoading(false);
        return;
      }

      distance = result.distance;
    }

    const params = new URLSearchParams({
      pickupLocation,
      dropLocation,
      pickupDate: pickupDate ? pickupDate.toISOString() : "",
      pickupTime: selectedTime,
      pickupLat: pickupCoords?.lat.toString() || "",
      pickupLng: pickupCoords?.lng.toString() || "",
      dropLat: dropCoords?.lat.toString() || "",
      dropLng: dropCoords?.lng.toString() || "",
      distance: distance.toFixed(2), // ✅ will be "0.00" for hourly
      tripType,
      hours: hours.toString(),
    });

    setTimeout(() => {
      setLoading(false);
      router.push(`/booking?${params.toString()}`);
    }, 1500);
  };


  // Animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const backgrounds = [
    "/header.png",
    "/header2.png",
    "/header3.png",
    "/header4.png",
  ];
  const [currentBg, setCurrentBg] = useState(0);

  // Auto change background every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgrounds.length]);
  useEffect(() => {
    const animate = (el: HTMLElement | null, delay: number) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, delay);
    };
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "0.7";

      setTimeout(() => {
        if (overlayRef.current) {   // 👈 check again before using
          overlayRef.current.style.transition = "opacity 1.5s ease-out";
          overlayRef.current.style.opacity = "0.4";
        }
      }, 100);
    }

    animate(titleRef.current, 300);
    animate(subtitleRef.current, 600);
    animate(formRef.current, 900);
  }, []);

  return (
     <section
      className="relative w-full min-h-[440px] flex flex-col items-center justify-center pt-16 bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${backgrounds[currentBg]})` } }
    >
     
   <div ref={overlayRef} className="absolute inset-0 bg-black/20 z-0" />
      {/* Text */}
      <div className="relative z-10 text-center mb-6">
        <h1
          ref={titleRef}
          className="text-[#FFFFFF] text-4xl md:text-5xl font-bold font-hind tracking-wide mb-2"
        >
          The Best Fleet Services
        </h1>
        <div
          ref={subtitleRef}
          className="text-[#FFFFFF] text-2xl md:text-3xl font-normal"
        >
          In New York
        </div>
      </div>

      {/* Booking Box */}
      {/* Booking Box */}
      <div ref={formRef} className="w-full flex mt-5 justify-center">

        <BookingForm
          tripType={tripType}
          setTripType={setTripType}
          pickupDate={pickupDate}
          setPickupDate={setPickupDate}
          pickupLocation={pickupLocation}
          setPickupLocation={setPickupLocation}
          dropLocation={dropLocation}
          setDropLocation={setDropLocation}
          pickupCoords={pickupCoords}
          setPickupCoords={setPickupCoords}
          dropCoords={dropCoords}
          setDropCoords={setDropCoords}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          isTimePickerOpen={isTimePickerOpen}
          setIsTimePickerOpen={setIsTimePickerOpen}
          hours={hours}
          setHours={setHours}
          handleBookNow={handleBookNow}
          loading={loading}
        />
      </div>


    </section>
  );
}
