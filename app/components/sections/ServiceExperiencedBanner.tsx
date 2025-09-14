import Image from "next/image"

export default function ServiceExperienceBanner() {
    return (
        <section className="w-full">
            {/* 🔹 Top Banner with Background Image */}
            <div className="relative w-full h-[260px] md:h-[400px] flex items-center">
                <Image
                    src="/services.png"
                    alt="Banner Background"
                    fill
                    priority
                    className="object-cover"
                />

                <div className="relative z-10 flex flex-col py-6 md:py-10 justify-center h-full px-4 sm:px-8 md:px-16 lg:px-32 max-w-3xl">
                    <h2 className="text-black text-xl sm:text-2xl md:text-3xl font-bold mb-3 uppercase leading-snug md:leading-tight">
                        Only Qualified Chauffeurs
                    </h2>

                    <div className="border-t-2 border-[#008492] w-32 mb-4"></div>


                    <p className="text-[#757575] text-xs sm:text-sm md:text-base opacity-90 mb-5">
                        Behind the wheel are our highly trained, professional chauffeurs who embody
                        courtesy, discretion, and expertise. More than just drivers, they are
                        dedicated professionals committed to ensuring that you travel in comfort,
                        safety, and style. Their knowledge of routes, punctuality, and personalized
                        approach guarantee a seamless experience.
                    </p>

                    <a
                        href="#"
                        className="inline-block italic bg-[#008492] text-white font-semibold rounded px-4 sm:px-5 py-2 text-sm sm:text-base shadow hover:bg-gray-100 hover:text-black transition w-fit"
                    >
                        Book Now
                    </a>
                </div>

            </div>

            {/* 🔹 Bottom Pricing Section */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-[#138fa2] px-4 sm:px-8 md:px-16 lg:px-32 py-4">
                <div className="flex-1 text-white text-center md:text-left text-sm sm:text-base">
                    <span className="font-semibold">WHAT ABOUT PRICING ? </span>
                    <span className="font-normal opacity-80">
                       Don&apos;t worry, that possible may have been and the impact can be taken on your last day now.

                    </span>
                </div>
                <a
                    href="#"
                    className="flex items-center justify-center bg-black text-white font-semibold px-5 sm:px-6 py-2 sm:py-3 text-sm sm:text-base hover:bg-[#222] transition whitespace-nowrap rounded"
                >
                    Check Rates <span className="ml-2">&rarr;</span>
                </a>
            </div>
        </section>
    )
}
