"use client"

import useFormStore from "@/stores/FormStore"
import { ArrowRightLeft } from "lucide-react"
import React from "react"

export default function AddReturn() {
  const { formData, setFormData, setFieldOptions } = useFormStore()

  const basePrice = Number(formData.price?.value || 0)
  const from = formData.fromLocation?.value || ""
  const to = formData.toLocation?.value || ""
  const isReturn = formData.isReturn?.value || false

  const discountedPrice = basePrice - (basePrice / 10)
  const formattedPrice = discountedPrice.toFixed(2)

  const headingText = `Heading back to ${from || "your location"}?`
  const subText = isReturn
    ? `Return transfer from ${to || "your destination"} to ${
        from || "your departure point"
      } has been added for ${formattedPrice} $.`
    : `Add your return transfer${to ? ` from ${to}` : ""} to ${
        from || "your departure point"
      } for an additional ${formattedPrice} $.`

  return (
    <div
      className={`p-2 md:p-3 flex gap-2 md:gap-7 items-center w-full relative rounded-md transition-all duration-300 ${
        isReturn ? "bg-green-100" : "bg-[#e5ebf7]"
      }`}
    >
      <div className="text-xs px-2 py-1 bg-brand text-black absolute right-3 -top-1 rounded-md">
        10% Off
      </div>

      <div
        className={`flex items-center text-lg md:text-2xl justify-center p-2 rounded-full transition-all ${
          isReturn ? "bg-green-600" : "bg-black"
        }`}
      >
        <ArrowRightLeft size={12} className=" text-white md:hidden" />
        <ArrowRightLeft size={25} className=" text-white max-md:hidden" />
      </div>

      <div className="flex flex-col gap-1 sm:gap-2 w-full max-w-[70%]">
        <div className="text-sm md:text-lg font-semibold md:font-bold text-black">{headingText}</div>
        <div
          className={`text-xs md:text-sm ${
            isReturn ? "text-green-700" : "text-gray-800"
          } transition-all`}
        >
          {subText}
        </div>
      </div>

      <div className="h-full flex items-end justify-end ml-auto">
        <div
          onClick={() => {setFormData("isReturn", !isReturn); setFieldOptions('returnDate',isReturn? false : true); setFieldOptions('returnTime',isReturn? false : true) }}
          className={`px-2 md:px-6 py-1 md:py-2 rounded-sm border border-black text-nowrap cursor-pointer transition-all duration-200 max-lg:text-sm ${
            isReturn
              ? "bg-black text-white hover:bg-red-600 hover:border-red-600"
              : "hover:bg-black hover:text-white"
          }`}
        >
          {isReturn ? "Cancel Return" : "Add Return"}
        </div>
      </div>
    </div>
  )
}
