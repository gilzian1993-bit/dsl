
export const dynamic = "force-dynamic"; 
import Image from "next/image";
import styles from "./page.module.css";
import HeroSection from "../components/sections/HeroSection";
import AirportsWeServe from "../components/sections/AirpportsWeServe";
import OurFleet from "../components/sections/OurfleetSection";
import BestExperienceBanner from "../components/sections/BestExperienceBanner";
import ServicesSection from "../components/sections/Services-Section";


export default function Home() {
  return (
      <main >
     
      <HeroSection/>
      <AirportsWeServe/>
      <OurFleet/>
      <BestExperienceBanner/>
      <ServicesSection/>
  
    </main>
  );
}
