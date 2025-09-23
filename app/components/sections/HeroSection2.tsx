"use client";

import Image from "next/image";
import { useInView } from "react-intersection-observer";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  image?: string; // single car image
}

export default function HeroSection2({
  title,
  subtitle,
  backgroundImage,
  image,
}: HeroSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[60vh] md:min-h-[55vh] flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#00849280]/50 transition-opacity duration-700"
        style={{ opacity: inView ? 1 : 0 }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 mt-6 md:mt-12">
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-bold leading-tight transform transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {title}
        </h1>

        {/* Divider with icon */}
        <div
          className={`flex items-center justify-center my-4 md:my-4 transform transition-all duration-700 delay-200 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex-1 h-px bg-white/30 max-w-16 md:max-w-20"></div>
          <Image
            src="/car-icon.svg"
            width={18}
            height={18}
            alt="car icon"
            className="mx-3 w-4 h-4 md:w-5 md:h-5"
          />
          <div className="flex-1 h-px bg-white/30 max-w-16 md:max-w-20"></div>
        </div>

        {subtitle && (
          <p
            className={`mt-2 text-base sm:text-lg md:text-md max-w-2xl mx-auto transform transition-all duration-700 delay-400 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Fleet Car Image */}
      {image && (
        <div
          className={`relative z-10 mt-8 sm:mt-12 -mb-12 sm:-mb-28 md:-mb-25 px-4 w-full transform transition-all duration-700 delay-600 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <Image
            src={image}
            alt="Fleet car"
            width={900}
            height={700}
            className="object-contain mx-auto drop-shadow-2xl max-w-full h-auto"
            priority
          />
        </div>
      )}
    </section>
  );
}
