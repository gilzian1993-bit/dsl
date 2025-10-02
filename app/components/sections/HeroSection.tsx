"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { calculateDistance } from "@/app/actions/getDistance";

// Dynamic import for BookingForm to avoid SSR issues
const BookingForm = dynamic(() => import("../formComponent/bookingform"), { ssr: false });

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Run only on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ All hooks MUST be declared before returning
  const bookingDetails = {
    pickupLocation: searchParams.get("pickupLocation") || "",
    dropLocation: searchParams.get("dropLocation") || "",
    pickupDate: searchParams.get("pickupDate") || "",
    pickupTime: searchParams.get("pickupTime") || "",
    tripType: searchParams.get("tripType") || "",
    stop1: searchParams.get("stop1") || "",
    stop2: searchParams.get("stop2") || "",
    stop3: searchParams.get("stop3") || "",
    stop4: searchParams.get("stop4") || "",
    hours: searchParams.get("hours") || "",
  };

  // State
  const [tripType, setTripType] = useState("airportRide");
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [stopsCount, setStopsCount] = useState(0);
  const [stop1, setStop1] = useState("");
  const [stop2, setStop2] = useState("");
  const [stop3, setStop3] = useState("");
  const [stop4, setStop4] = useState("");
  const [hours, setHours] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dropCoords, setDropCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState<boolean>(false);

  // Background refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const backgrounds = ["/header.png", "/header2.png", "/header3.png", "/header4.png"];
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentBg((prev) => (prev + 1) % backgrounds.length), 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  useEffect(() => {
    if (!mounted) return; // ✅ safe check INSIDE effect

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
        if (overlayRef.current) overlayRef.current.style.transition = "opacity 1.5s ease-out";
        if (overlayRef.current) overlayRef.current.style.opacity = "0.4";
      }, 100);
    }

    animate(titleRef.current, 300);
    animate(subtitleRef.current, 600);
    animate(formRef.current, 900);
  }, [mounted]);

  // ✅ Now do the conditional render here
  if (!mounted) {
    return <div style={{ height: "440px" }} />; // placeholder until mounted
  }

  return (
    <section
      className="relative w-full min-h-[440px] flex flex-col items-center md:pt-16 justify-center pt-34 bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${backgrounds[currentBg]})` }}
    >
      <div ref={overlayRef} className="absolute inset-0 bg-black/20 z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center mt-5 md:mb-6">
        <h1 ref={titleRef} className="text-[#FFFFFF] text-4xl md:text-5xl font-bold tracking-wide mb-2">
          The Best Fleet Services
        </h1>
        <div ref={subtitleRef} className="text-[#FFFFFF] text-2xl md:text-3xl font-normal">
          In New York
        </div>
      </div>

      <div ref={formRef} className="w-full flex md:mt-5 mt-47 justify-center">
        <BookingForm
          defaultValues={bookingDetails}
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
          handleBookNow={() => {}} // you can paste your booking logic back here
          loading={loading}
          stopsCount={stopsCount}
          setStopsCount={setStopsCount}
          stop1={stop1}
          stop2={stop2}
          stop3={stop3}
          stop4={stop4}
          setStop1={setStop1}
          setStop2={setStop2}
          setStop3={setStop3}
          setStop4={setStop4}
        />
      </div>
    </section>
  );
}
