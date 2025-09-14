"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const airports = [
  {
    name: "JOHN F. KENNEDY AIRPORT (JFK)",
    image: "/airports-1.png",
    href: "#",
  },
  {
    name: "LAGUARDIA AIRPORT (LGA)",
    image: "/airports-2.png",
    href: "#",
  },
  {
    name: "NEWARK AIRPORT (EWR)",
    image: "/airports-3.png",
    href: "#",
  },
  {
    name: "TETERBORO AIRPORT (TEB)",
    image: "/airports-4.png",
    href: "#",
  },
];

export default function AirportsWeServe() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? airports.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === airports.length - 1 ? 0 : prev + 1
    );
  };

  // Auto scroll only on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === airports.length - 1 ? 0 : prev + 1
        );
      }, 3000); // every 3s
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <section
      className="relative max-w-5xl mx-auto bg-[#138fa2] bg-opacity-90 flex flex-col items-center justify-center pb-12 pt-8 overflow-hidden"
      style={{
        backgroundImage: "url('/section.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-5xl w-full mx-auto text-center">
        <h2 className="text-white font-bold text-2xl md:text-3xl tracking-wide mb-4">
          THE AIRPORTS WE SERVE
        </h2>

        <div className="flex items-center justify-center mb-6">
          <div className="flex-1 h-px bg-white/30 max-w-20"></div>
          <Star className="w-4 h-4 text-white mx-3 fill-white" />
          <div className="flex-1 h-px bg-white/30 max-w-20"></div>
        </div>

        <p className="text-white text-sm md:text-base mb-8">
          We offer you a super VIP experience in New York, New Jersey,
          Pennsylvania And Connecticut , US
        </p>

        {/* Cards with arrows */}
        <div className="relative flex items-center justify-center">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2
            w-7 h-7 rounded-full flex items-center justify-center 
            border-2 border-white bg-transparent hover:bg-white/10 
            transition-colors z-10"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>

          {/* Mobile: Sliding carousel */}
          <div className="block md:hidden w-[260px] h-[280px] overflow-hidden relative">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {airports.map((airport) => (
                <a
                  key={airport.name}
                  href={airport.href}
                  className="flex-shrink-0 w-[260px] h-[280px] relative rounded-[12px] overflow-hidden bg-white shadow-md"
                >
                  <img
                    src={airport.image || "/placeholder.svg"}
                    alt={airport.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-3 py-4">
                    <span className="text-white font-semibold text-base leading-tight drop-shadow-md block">
                      {airport.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Desktop: All cards */}
          <div className="hidden md:flex flex-wrap justify-center gap-6">
            {airports.map((airport) => (
              <a
                key={airport.name}
                href={airport.href}
                className="group relative w-[180px] h-[210px] rounded-[10px] overflow-hidden bg-white shadow-md transition-transform hover:scale-105"
              >
                <img
                  src={airport.image || "/placeholder.svg"}
                  alt={airport.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-3 py-2">
                  <span className="text-white font-semibold text-sm leading-snug drop-shadow-md block break-words">
                    {airport.name}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2
            w-7 h-7 rounded-full flex items-center justify-center 
            border-2 border-white bg-transparent hover:bg-white/10 
            transition-colors z-10"
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
