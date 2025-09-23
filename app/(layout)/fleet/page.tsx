import HeroSection2 from "@/app/components/sections/HeroSection2";

import OurFleetSection from "@/app/components/sections/OurfleetSection2";

export default function Fleet() {
  return (
    <>
      <HeroSection2
        title="OUR FLEET"
        subtitle="We offer you a super VIP experience in New York, New Jersey, NYC Metro, LUX"
        backgroundImage="/serve-image.png"
        image="/fleet-header.png" // only one image now
      />
      <OurFleetSection/>
    </>
  );
}
