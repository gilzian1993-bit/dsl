import { Anchor } from "lucide-react";

 const features = [
    {
      title: "Personal Driver",
      description: "An experienced driver committed to quality service.",
    },
    {
      title: "24/7 Availability",
      description: "Our chauffeur services operate around the clock, ready to assist you.",
    },
    {
      title: "Professionalism",
      description:
        "Maintaining high standards of conduct, appearance and performance.",
    },
  ];

export default function FeatureList() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-3 w-full">
      {features.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="bg-brand rounded-full p-2 flex items-center justify-center mt-1">
            <Anchor className="text-black w-3 h-3" />
          </div>
          <div className="flex flex-col">
            <div className="font-semibold text-gray-700">{item.title}</div>
            <div className="text-gray-500 text-xs">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
