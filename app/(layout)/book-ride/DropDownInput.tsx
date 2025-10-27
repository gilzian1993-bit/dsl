"use client"

import { useEffect, useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import useFormStore, { FormDataType } from "@/stores/FormStore"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LucideProps } from "lucide-react"

interface DropdownOption {
  label: string
  value: string
}

interface CustomDropdownProps {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >
  fieldName: keyof FormDataType
  placeholder: string
  options: DropdownOption[]
}

export default function NewDropdownInput({
  Icon,
  fieldName,
  placeholder,
  options,
}: CustomDropdownProps) {
  const { formData, setFormData } = useFormStore()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const value =
    !Array.isArray(formData[fieldName]) && formData[fieldName].value
      ? String(formData[fieldName].value)
      : ""

  const error =
    !Array.isArray(formData[fieldName]) && formData[fieldName].error

  const filtered = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      opt.value.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (val: string) => {
    setFormData(fieldName, val)
    setOpen(false)
  }

  useEffect(() => {
    setSearch("")
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full justify-between text-left p-2 rounded-md border text-sm flex items-center gap-2 bg-white text-black",
            error ? "border-red-500" : "border-gray-300"
          )}
        >
          <Icon color="gray" className="shrink-0" />
          <span className="flex-1 truncate">
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
            className=""
          />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {/* ✅ ScrollArea fixed here */}
            <ScrollArea className="max-h-56 overflow-y-auto">
              <div className="py-1">
                {filtered.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onSelect={() => handleSelect(opt.value)}
                    className="flex items-center justify-between px-2 py-2 cursor-pointer"
                  >
                    <span>{opt.label}</span>
                    {value === opt.value && (
                      <Check className="h-4 w-4 text-[#F4910B]" />
                    )}
                  </CommandItem>
                ))}
              </div>
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
