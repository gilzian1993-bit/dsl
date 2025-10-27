import useFormStore from "@/stores/FormStore";
import { fleets } from "./CarList";
import Image from "next/image";
import { LuggageIcon, Users } from "lucide-react";
 
export default function SelectedCar() 
{
  const { formData } = useFormStore();
  const selectedFleet = fleets.find((item)=>item.name===formData.car.value);
  if(!selectedFleet) return null;
 
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between gap-2 w-full">
      <Image src={selectedFleet.image} width={150} height={150} alt={selectedFleet.name} className="w-16" />
       <div className="font-bold text-sm" >{selectedFleet.name}</div>
       <div className="flex items-center gap-2">
         
         <div className="flex items-center gap-1">
            <Users className="size-3 font-bold"/>
            <p>{selectedFleet.passengers}</p>
         </div>
         
         <div className="flex items-center gap-1">
            <LuggageIcon className="size-3 font-bold"/>
            <p>{selectedFleet.suitcases}</p>
         </div>

       </div>
    </div>
  );
}