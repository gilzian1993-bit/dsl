"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const airports = [
  { name: "NEWARK AIRPORT (EWR)", image: "/image 3.png", href: "#" },
  { name: "TETERBORO AIRPORT (TEB)", image: "/image 4.png", href: "#" },
  { name: "WESTCHESTER COUNTY (HPN)", image: "/image 6.png", href: "#" },
  { name: "JOHN F. KENNEDY AIRPORT (JFK)", image: "/image--.jpg", href: "#" },
  { name: "LAGUARDIA AIRPORT (LGA)", image: "/image2.png", href: "#" },
];

export default function AirportsWeServe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // detect screen size
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const slidesToShow = isMobile ? 1 : 3;

  const nextSlide = () =>
    setCurrentIndex((prev) =>
      prev === airports.length - slidesToShow ? 0 : prev + 1
    );

  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? airports.length - slidesToShow : prev - 1
    );

  // Auto scroll
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <section
      className=" max-w-6xl mx-auto px-4 md:px-8 py-12 bg-[#138fa2]/90 flex flex-col items-center overflow-hidden"
      style={{
        backgroundImage: "url('/section.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Heading */}
      <h2 className="text-white font-bold text-2xl md:text-3xl tracking-wide mb-3 text-center">
        THE AIRPORTS WE SERVE
      </h2>

      {/* Divider with star */}
      <div className="flex items-center justify-center my-3 sm:my-4">
        <div className="flex-1 h-px bg-white/30 max-w-12 sm:max-w-16 md:max-w-20"></div>
        <Star className="w-4 sm:w-5 h-4 sm:h-5 text-white mx-2 sm:mx-3 fill-white" />
        <div className="flex-1 h-px bg-white/30 max-w-12 sm:max-w-16 md:max-w-20"></div>
      </div>

      {/* Description */}
      <p className="text-white text-center text-sm md:text-base mb-10 max-w-2xl">
        We provide a super VIP experience in New York, New Jersey, Pennsylvania, and Connecticut, US.
      </p>

      {/* Carousel Container */}
      <div className="relative w-full flex items-center justify-center">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2
          w-10 h-10 rounded-full flex items-center justify-center 
          border-2 border-white bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Mobile Carousel */}
        <div className="block md:hidden w-[260px] h-[280px] overflow-hidden relative">
          <div
            className="flex transition-transform duration-[1500ms] ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {airports.map((airport) => (
              <a
                key={airport.name}
                href={airport.href}
                className="flex-shrink-0 w-[260px] h-[280px] relative rounded-xl overflow-hidden shadow-lg border border-white/20"
              >
                <img
                  src={airport.image || "/placeholder.svg"}
                  alt={airport.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-3 py-4">
                  <span className="text-white font-semibold text-base leading-tight drop-shadow-md block text-center">
                    {airport.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Desktop Carousel */}
          <div className="hidden md:block w-full overflow-hidden relative">
          <div
           className="flex transition-transform duration-2000 ease-in-out"

            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {airports.map((airport) => (
              <a
                key={airport.name}
                href={airport.href}
                className="flex-shrink-0 w-1/3 px-2 relative rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={airport.image || "/placeholder.svg"}
                  alt={airport.name}
                  className="object-cover w-full h-[220px] rounded-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-3 py-2">
                  <span className="text-white font-semibold text-sm leading-snug drop-shadow-md block text-center break-words">
                    {airport.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2
          w-10 h-10 rounded-full flex items-center justify-center 
          border-2 border-white bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </section>
  );
}
