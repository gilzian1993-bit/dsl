"use client";
import { Star } from "lucide-react";
import { useInView } from "react-intersection-observer";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function HeroSection3({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      className="relative w-full min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#00849299]/60" />

      {/* Content with animation */}
      <div
        ref={ref}
        className={`relative z-10 text-center px-4 sm:px-6 mt-6 md:mt-10 transition-all duration-700 ease-out transform ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-snug sm:leading-tight">
          {title}
        </h1>

        {/* Divider with icon */}
        <div className="flex items-center justify-center my-3 sm:my-4">
          <div className="flex-1 h-px bg-white/30 max-w-12 sm:max-w-16 md:max-w-20"></div>
          <Star className="w-4 sm:w-5 h-4 sm:h-5 text-white mx-2 sm:mx-3 fill-white" />
          <div className="flex-1 h-px bg-white/30 max-w-12 sm:max-w-16 md:max-w-20"></div>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base md:text-lg max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
