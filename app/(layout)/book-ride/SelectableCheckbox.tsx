"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import useFormStore, { FormDataType } from "@/stores/FormStore"

interface SelectableCheckboxProps {
  fieldName: keyof FormDataType
  label: string
  subLabel?: string
}

export default function SelectableCheckbox({
  fieldName,
  label,
  subLabel,
}: SelectableCheckboxProps) {
  const { formData, setFormData, setFieldOptions } = useFormStore()

  const value = Boolean(!Array.isArray(formData[fieldName]) && formData[fieldName]?.value)
  const isError =
    !Array.isArray(formData[fieldName]) && formData[fieldName]?.error

  const handleChange = (checked: boolean) => {
    setFormData(fieldName, checked)
    if(fieldName==='isAirportPickup'){
      setFieldOptions('flightName',checked)
      setFieldOptions('flightNumber',checked)
    }
  }

  return (
    <div
      className={cn(
        "flex items-start gap-2  px-1 rounded-md cursor-pointer transition-all",
        isError && "border border-red-500 bg-red-50"
      )}
      onClick={() => handleChange(!value)}
    >
      <Checkbox
        checked={value}
        onCheckedChange={handleChange}
        className="bg-white"
      />
      <div className="flex flex-col">
        <label
          className={cn(
            "text-sm font-medium leading-none",
            value ? "text-slate-900" : "text-gray-700"
          )}
        >
          {label}
        </label>
        {subLabel && (
          <span className="text-xs text-gray-500 mt-[1px]">{subLabel}</span>
        )}
      </div>
    </div>
  )
}
