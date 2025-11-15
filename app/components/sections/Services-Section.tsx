import Image from "next/image";


export default function ServicesSection() {
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

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-400 max-w-24"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 whitespace-nowrap">
              OUR SERVICES
            </h2>
            <div className="flex-1 h-px bg-gray-400 max-w-24"></div>
          </div>
          <p className="text-gray-600 text-md">Magna Risus Vestibulum Vulputate</p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      </div>
    </section>
  )
}
