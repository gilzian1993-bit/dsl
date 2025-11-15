import Image from "next/image"
import Link from "next/link"

export default function CallActionSection() {
  return (
    <section className="relative w-full h-[320px] sm:h-[380px] md:h-[500px] flex items-center justify-center">
      {/* 🔹 Background Image */}
      <Image
        src="/call-action.png"
        alt="Luxury Car Interior"
        fill
        priority
        className="object-cover"
      />


      {/* 🔹 Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-snug sm:leading-tight">
          OR ANYWHERE YOU NEED US TO TAKE
        </h1>

        <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-xl mx-auto">
          Not only taking to flight, parties, weddings, casinos, birthdays but we
          also take you to anywhere you want to go.
        </p>

        {/* Call Now */}
        <a href="https://wa.me/18006793415"
          target="_blank"
          rel="noopener noreferrer">
          <div className="mb-6 sm:mb-8">
            <p className="text-white font-[var(--font-montserrat)] text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6">
              CALL NOW +1 800 679 3415
            </p>
          </div></a>


        {/* Divider with OR */}
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="flex-1 h-px bg-white max-w-16 sm:max-w-20"></div>
          <span className="mx-3 text-[#008492] text-sm sm:text-base md:text-lg lg:text-xl">
            OR
          </span>
          <div className="flex-1 h-px bg-white max-w-16 sm:max-w-20"></div>
        </div>

        {/* CTA Button */}
        <a href="/" className="bg-[#008492] hover:bg-[#00707e] text-white font-semibold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 rounded transition-colors duration-200">
          Book Online
        </a>
      </div>
    </section>
  )
}
