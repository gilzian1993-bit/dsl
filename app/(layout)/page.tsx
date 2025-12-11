export const dynamic = "force-dynamic"; 

import AirportsWeServe from "../components/sections/AirpportsWeServe";
import OurFleet from "../components/sections/OurfleetSection";
import BestExperienceBanner from "../components/sections/BestExperienceBanner";
import ServicesSection from "../components/sections/Services-Section";
import ReviewsSection from "../components/sections/ReviewsSection";
import NewHeroSection from "./book-ride/NewHeroSection";
import InfiniteSlide from "./book-ride/InfiniteSlide";

export default function Home() {
  return (
      <main >
     <NewHeroSection/>
     <InfiniteSlide/>
     <AirportsWeServe/>
     <OurFleet/>
     <BestExperienceBanner/>
     <ServicesSection/>
     <ReviewsSection/>
    </main>
  );
}