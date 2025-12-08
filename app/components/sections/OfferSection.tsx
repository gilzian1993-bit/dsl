import Image from "next/image"

export default function WhatWeOfferSection() {
  return (
    <section className="py-12 sm:py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Vehicle Image */}
          <div className="flex justify-center lg:justify-start">
            <Image
              src="/about-image.png"
              alt="Luxury Black Lincoln Navigator SUV"
              width={500}
              height={300}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain"
            />
          </div>

          {/* Content */}
          <div className="space-y-5 sm:space-y-6 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              What We Offer?
            </h2>

            <div className="text-gray-600 leading-relaxed space-y-4 text-sm sm:text-base md:text-lg">
              <p>
                At <span className="font-semibold">DSL Limo Services</span>, we believe that every journey should be more than just transportation. With over <span className="font-semibold">15 years of experience</span> in the luxury transportation industry, we have mastered the art of delivering exceptional travel experiences. We don’t just drive — we create moments of elegance and comfort. Whether you’re stepping into one of our vehicles after a long flight, arriving at a special event, or preparing for an important meeting, we ensure that you feel relaxed, refreshed, and ready.
              </p>

              <p>
                With us, your journey becomes more than transportation — it’s an experience built on <span className="font-semibold">luxury, professionalism, and sophistication</span>, backed by a decade and a half of trusted service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
