import Image from "next/image";
import { Car, User, Clock, Wifi, ShieldCheck } from "lucide-react";

export default function WhyChooseUsSection() {
  const benefits = [
    {
      icon: Car,
      text: "Luxury Fleet Featuring Sedan, Mid SUV, And Full SUV",
    },
    {
      icon: User,
      text: "Professional, Fully Vetted, And Discreet Chauffeurs",
    },
    {
      icon: Clock,
      text: "24/7 Availability For All Your Travel Needs",
    },
    {
      icon: Wifi,
      text: "On-Board Wi-Fi And Complimentary Bottled Water",
    },
    {
      icon: ShieldCheck,
      text: "Trusted By Business Leaders And Global Travelers",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Why Choose Our Black Car Service in New York
            </h2>
            <p className="text-gray-700 text-base sm:text-lg mb-8 leading-relaxed">
              At DSL, we offer more than just a ride, we deliver a premium, reliable experience. Since 2010, we've built our reputation on a personal approach to luxury transport. Our team prioritizes your safety, discretion, and comfort above all else.
            </p>
            
            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <IconComponent className="w-6 h-6 text-gray-700" />
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed">
                      {benefit.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="order-1 lg:order-2">
            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden">
              <Image
                src="/why-choose-us.png"
                alt="Professional chauffeur in luxury car"
                fill
                className="object-cover object-left"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
