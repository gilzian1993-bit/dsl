
import CallActionSection from "@/app/components/sections/CallActionSection";
import HeroSection3 from "@/app/components/sections/HeroSection3";
import ServiceExperienceBanner from "@/app/components/sections/ServiceExperiencedBanner";
import ServicesSection from "@/app/components/sections/Services-Section";
import Image from "next/image";


export default function Fleet() {
  const services = [
    {
      title: "POINT-TO-POINT",
      description:
        "Enjoy short, reliable rides from one location to another without delays. Whether it is a business meeting, a social event, or a casual outing, we ensure smooth journeys. Travel in comfort and reach your destination stress-free.",
      icon: "/road.svg",
    },
    {
      title: "HOURLY HIRE",
      description:
        "Hire a professional driver and vehicle for the hours that suit your schedule. This flexible option is ideal for multiple stops, shopping trips, or meetings. Stay in control of your time while we handle the driving between meetings, trips, or exploring the city.",
      icon: "/clock.svg",
    },
    {
      title: "AIRPORT TRANSFERS",
      description:
        "Start and end your trip with our dependable airport transfer service. We’ll track your flight in real-time, pick you up on arrival, and travel with ease and comfort. No missed flights, no travel stress—just timely pickups and drop-offs.",
      icon: "/airport.svg",
    },
    {
      title: "AS DIRECTED",
      description:
        "With our 'As Directed' service, your journey is designed entirely around your schedule. No predefined routes—just personalized rides to take you wherever you need to go. From meetings to events, enjoy complete flexibility.",
      icon: "/direction-sign.svg",
    },
  ]
  const customerServices = [
    {
      title: "Customer-Centric Service",
      description:
        "We put our clients at the heart of everything we do, tailoring every ride to your specific needs and preferences. From the moment you book with us until you reach your destination, we focus on delivering a seamless experience. ",
      icon: "/shop.svg",
    },
    {
      title: "On-Time Guarantee",
      description:
        " Time is valuable, and we respect yours by ensuring punctuality in every ride. Our chauffeurs are trained to manage routes efficiently, avoiding unnecessary delays and ensuring a smooth journey. Whether it’s an early morning airport transfer or a late-night pickup, we are available 24/7 to serve you. ",
      icon: "/Fleet.svg",
    },
    {
      title: "Luxury Fleet",
      description:
        "Our fleet of vehicles is carefully curated to combine style, safety, and comfort. Each vehicle is modern, impeccably maintained, and equipped with premium features to elevate your travel experience. Whether you prefer a sleek sedan, a spacious SUV, or a luxury limousine, we have the right option for your journey. ",
      icon: "/customer.svg",
    },

  ]
  return (
    <>
      <HeroSection3
        title="OUR SERVICES"
        subtitle="We are the most popular limousine service in New York."
        backgroundImage="/serve-image.png"

      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 px-6 max-w-6xl mx-auto mb-16">
        {services.map((service, index) => {

          return (
            <div key={index} className="flex flex-col items-start">
              <div className="flex items-start gap-4">

                <Image
                  src={service.icon}
                  alt={service.title}
                  width={30}
                  height={30}
                  className="mt-1 shrink-0"
                />

                <div>
                  <h3 className="text-base font-bold text-black mb-2">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
                  <a
                    href="#"
                    className="text-[#1EACC7] font-medium italic text-sm mt-3 inline-block"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <CallActionSection />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16 mt-10 sm:mt-10 md:mt-12 px-4 sm:px-6 max-w-6xl mx-auto mb-12 md:mb-16">
        {customerServices.map((service, index) => (
          <div key={index} className="flex flex-col px-6 md:items-start md:text-left">
            <Image
              src={service.icon}
              alt={service.title}
              width={40}
              height={40}
              className="mb-4 bg-[#008492] p-2 rounded"
            />

            <h3 className="text-lg font-semibold text-black mb-2">{service.title}</h3>

            <p className="text-gray-600 text-sm leading-relaxed max-w-xs md:max-w-sm">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <ServiceExperienceBanner />

    </>
  );
}
