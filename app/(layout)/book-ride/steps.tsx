"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface Step {
  id: number;
  title: string;
  path: string;
}

export default function Steps() {
  const pathname = usePathname();

  const steps: Step[] = [
    { id: 1, title: "Transfer Vehicle", path: "/book-ride/select-vehicle" },
    { id: 2, title: "Transfer Details", path: "/book-ride/passenger-details" },
    { id: 3, title: "Payment Details", path: "/book-ride/confirm-payment" },
  ];

  // Determine current step based on pathname
  const getCurrentStep = () => {
    if (pathname === "/book-ride/select-vehicle") return 2;
    if (pathname === "/book-ride/passenger-details") return 3;
    if (pathname === "/book-ride/confirm-payment") return 4;
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="flex items-center justify-between w-full ">
      {steps.map((stepData, index) => {
        const stepNumber = stepData.id + 1; // Map to step 2, 3, 4
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <React.Fragment key={stepData.id}>
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 text-sm font-medium transition-colors
                  ${
                    isActive || isCompleted
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-100 text-gray-400 border-gray-300"
                  }`}
              >
                {stepData.id}
              </div>
              <span
                className={`text-sm font-medium max-lg:hidden ${
                  isActive ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {stepData.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 ${
                  isCompleted ? "bg-gray-300" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
