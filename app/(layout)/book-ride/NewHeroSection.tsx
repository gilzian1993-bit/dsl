"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import HeroForm from "./HeroForm";

type Slide = {
  src: string;
  alt?: string;
  title: string;
};

export default function NewHeroSection() {
  const slides: Slide[] = [
    { src: "/manhattan-skyline.jpg", alt: "Hero image 2", title: "Luxury Travel & Chauffeured Service" },
    { src: "/brunette-businesswoman-posing-inside-car.jpg", alt: "Hero image 1", title: "The Best Fleet Service in New York" },
    { src: "/3rd.png", alt: "Hero image 3", title: "Airport Chauffeur Service To and From JFK, LGA, EWR, TEB" },
  ];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    if (!isPaused) {
      timeoutRef.current = window.setTimeout(() => {
        setIndex((i) => (i + 1) % slides.length);
      }, 6000);
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [index, isPaused, slides.length]);

  useEffect(() => {
    function onTouchStart() {
      setIsPaused(true);
    }
    function onTouchEnd() {
      setIsPaused(false);
    }
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const goTo = (i: number) => {
    setIndex(i % slides.length);
  };
  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Hero image slider"
    >
      <div className="absolute inset-0 h-[420px] lg:h-screen w-full">
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(.22,1,.36,1)] ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={i === index ? "false" : "true"}
            style={{ willChange: "opacity" }}
          >
            <Image
              src={s.src}
              alt={s.alt ?? `Slide ${i + 1}`}
              fill
              sizes="100vw"
              className="object-cover w-full h-full"
              priority={i === index}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      <div className="relative z-20">
        <div className="max-w-screen-2xl mx-auto px-4 grid gap-6 lg:grid-cols-2 xl:grid-cols-3 pt-20 lg:py-48 lg:px-5">
          <div className="flex flex-col gap-2 md:gap-5 items-start justify-center h-full w-full xl:col-span-2 max-lg:px-3">
            <h1 className="text-2xl font-semibold lg:text-7xl text-white leading-tight">
              {slides[index].title}
            </h1>
            <div className="text-base lg:text-2xl text-white font-bold">
              5% OFF on One Way & 10% OFF on Return
            </div>
          </div>

          <div className="flex items-center justify-center h-full w-full">
            <div className="w-full max-w-md">
              <HeroForm />
            </div>
          </div>
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {`Slide ${index + 1} of ${slides.length}: ${slides[index].title}`}
      </div>
    </section>
  );
}