import Image from "next/image"

export default function BestExperienceBanner() {
  return (
    <section className="w-full min-h-[223px]">
      <div className="relative w-full h-[260px] md:h-[400px] flex items-center">
        <Image
          src="/serve-image.png"
          alt="Banner Background"
          fill
          priority
          className="object-cover"
        />
        <div className="relative z-10 flex flex-col py-7 justify-center h-full px-6 md:px-32 max-w-3xl">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-3 leading-tight">
            WE PROMISE, YOU WILL
            <br />
            HAVE THE BEST EXPERIENCE
          </h2>
          <p className="text-[#C9C9C9] text-sm md:text-base opacity-90 mb-5">
            With our 6-years of experience in this large transportation industry,
            the team delivers two materials for all its deliveries you represent brand
            experiences:
          </p>
          <a
            href="#"
            className="inline-block bg-[#008492] text-white font-semibold rounded px-5 py-2 shadow hover:bg-gray-100 transition w-fit"
          >
            Book Now
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full flex flex-col md:flex-row items-center gap-4 bg-[#138fa2] px-6 md:px-32 ">
        <div className="flex-1 text-white my-4 text-sm md:text-base">
          <span className="font-semibold">WHAT ABOUT PRICING? </span>
          <span className="font-normal opacity-80">
            Don&apos;t worry that possible may have been and the impact can be taken
            on you last day now.
          </span>
        </div>
        <a
          href="#"
          className="flex items-center bg-black text-white font-semibold px-6 py-3 hover:bg-[#222] transition whitespace-nowrap"
        >
          Check Rates <span className="ml-2">&rarr;</span>
        </a>
      </div>
    </section>
  )
}
