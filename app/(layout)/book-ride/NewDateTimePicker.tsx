"use client"

import { useRef, useState, useEffect } from "react"
import { format, addMonths, subMonths, startOfMonth, eachDayOfInterval, getDay, isSameDay, isBefore, startOfDay } from "date-fns"
import { ChevronRight, ChevronUp, ChevronDown, Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import useFormStore, { FormDataType } from "@/stores/FormStore"

interface DateTimePickerProps {
  selectedDate: string
  selectedTime: string
  placeholder: string
  setFormData: (
    key: keyof FormDataType,
    value: string | number | boolean,
    coardinates?: string,
    index?: number
  ) => void
  dateFieldName: keyof FormDataType
  timeFieldName: keyof FormDataType
  minSelectableDate?: Date | null
  isDisable?: boolean
}


export default function NewDateTimePicker({
  selectedDate,
  selectedTime,
  setFormData,
  dateFieldName,
  timeFieldName,
  minSelectableDate,
  placeholder,
  isDisable
}: DateTimePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [dateOpen, setDateOpen] = useState(false)
  const [timeOpen, setTimeOpen] = useState(false)
  const [hour, setHour] = useState<number | null>(null)
  const [minute, setMinute] = useState<number | null>(null)
  const [amPm, setAmPm] = useState<"AM" | "PM" | null>(null)
  const { formData } = useFormStore()
  const datePickerRef = useRef<HTMLDivElement>(null)
  const timePickerRef = useRef<HTMLDivElement>(null)
  const hoursContainerRef = useRef<HTMLDivElement>(null)
  const minutesContainerRef = useRef<HTMLDivElement>(null)

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setDateOpen(false)
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setTimeOpen(false)
      }
    }

    if (dateOpen || timeOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dateOpen, timeOpen])

  // Prevent body scroll on mobile when calendar is open
  useEffect(() => {
    if (dateOpen) {
      // Check if mobile view
      const isMobile = window.innerWidth < 640
      if (isMobile) {
        document.body.style.overflow = 'hidden'
      }
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [dateOpen])

  // Initialize hour, minute, and AM/PM from selectedTime (24-hour format)
  useEffect(() => {
    if (selectedTime) {
      const [hours24, minutes] = selectedTime.split(":")
      const hours24Int = parseInt(hours24)
      const minutesInt = parseInt(minutes)
      
      // Convert 24-hour to 12-hour format
      if (hours24Int === 0) {
        setHour(12)
        setAmPm("AM")
      } else if (hours24Int === 12) {
        setHour(12)
        setAmPm("PM")
      } else if (hours24Int > 12) {
        setHour(hours24Int - 12)
        setAmPm("PM")
      } else {
        setHour(hours24Int)
        setAmPm("AM")
      }
      setMinute(minutesInt)
    } else {
      setHour(null)
      setMinute(null)
      setAmPm(null)
    }
  }, [selectedTime])

  // Calendar logic
  const getCalendarDays = () => {
    const startOfCurrentMonth = startOfMonth(currentMonth)
    const startDayOfWeek = (getDay(startOfCurrentMonth) + 6) % 7

    const startDate = new Date(startOfCurrentMonth)
    startDate.setDate(startOfCurrentMonth.getDate() - startDayOfWeek)

    const days = eachDayOfInterval({
      start: startDate,
      end: new Date(startDate.getTime() + 41 * 24 * 60 * 60 * 1000),
    })

    return days
  }

  const handleDateSelect = (date: Date) => {
    const formatted = format(date, "yyyy-MM-dd")
    setFormData(dateFieldName, formatted)
    setDateOpen(false)
  }

  const handleHourSelect = (selectedHour: number) => {
    setHour(selectedHour)
  }

  const handleAmPmSelect = (selectedAmPm: "AM" | "PM") => {
    setAmPm(selectedAmPm)
  }

  const handleMinuteSelect = (selectedMinute: number) => {
    setMinute(selectedMinute)
  }

  const handleTimeSave = () => {
    if (hour !== null && minute !== null && amPm !== null) {
      // Convert 12-hour to 24-hour format for storage
      let hours24 = hour
      if (amPm === "PM" && hour !== 12) {
        hours24 = hour + 12
      } else if (amPm === "AM" && hour === 12) {
        hours24 = 0
      }
      const timeStr = `${hours24.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      setFormData(timeFieldName, timeStr)
      setTimeOpen(false)
    }
  }

  const scrollHours = (direction: "up" | "down") => {
    if (hoursContainerRef.current) {
      const scrollAmount = 40
      hoursContainerRef.current.scrollBy({
        top: direction === "up" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const scrollMinutes = (direction: "up" | "down") => {
    if (minutesContainerRef.current) {
      const scrollAmount = 40
      minutesContainerRef.current.scrollBy({
        top: direction === "up" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const formatTimeDisplay = (time: string) => {
    if (!time) return ""
    const [hours24, minutes] = time.split(":")
    const hours24Int = parseInt(hours24)
    let hours12: number
    let period: string
    
    if (hours24Int === 0) {
      hours12 = 12
      period = "AM"
    } else if (hours24Int === 12) {
      hours12 = 12
      period = "PM"
    } else if (hours24Int > 12) {
      hours12 = hours24Int - 12
      period = "PM"
    } else {
      hours12 = hours24Int
      period = "AM"
    }
    
    return `${hours12}:${minutes.padStart(2, "0")} ${period}`
  }

  // Generate hours array (1-12) for 12-hour format
  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  
  // Generate minutes array (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const dateError = !Array.isArray(formData[dateFieldName]) && formData[dateFieldName].error
  const timeError = !Array.isArray(formData[timeFieldName]) && formData[timeFieldName].error

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* DATE PICKER */}
        <div className="relative w-full" ref={datePickerRef}>
          <div
            className={cn(
              "relative h-11 sm:h-12 w-full rounded-md border bg-white px-3 py-1 flex items-center cursor-pointer transition-[color,box-shadow]",
              dateError ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50" : "border-gray-300",
              isDisable ? "opacity-50 cursor-not-allowed" : ""
            )}
            onClick={() => {
              if (isDisable) return
              setDateOpen((prev) => !prev)
              setTimeOpen(false)
            }}
          >
            <Calendar
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 z-10",
                dateError ? "text-red-500" : "text-gray-500"
              )}
            />
            <div className={cn(
              "text-sm sm:text-base w-full truncate",
              !selectedDate && "text-muted-foreground",
              dateError ? "text-red-500" : selectedDate ? "text-gray-800" : "text-gray-500",
              "pl-8 sm:pl-9"
            )}>
              {selectedDate
                ? format(new Date(selectedDate), "dd MMM yyyy")
                : "Select date"}
            </div>
          </div>

          {dateOpen && !isDisable && (
            <>
              {/* Mobile Modal Overlay */}
              <div
                className="fixed inset-0 bg-black/50 z-[9998] sm:hidden"
                onClick={() => setDateOpen(false)}
              />
              {/* Calendar Container */}
              <div
                className={cn(
                  // Mobile: Fixed bottom modal with rounded top corners
                  "fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-t-2xl shadow-2xl border-t border-gray-200",
                  "max-h-[85vh] overflow-y-auto",
                  // Desktop: Absolute dropdown
                  "sm:absolute sm:top-full sm:mt-2 sm:bottom-auto sm:left-auto sm:right-0 sm:rounded-xl sm:border sm:max-h-none sm:overflow-visible",
                  "sm:w-[320px] sm:z-50"
                )}
              >
                {/* Mobile: Cancel Button Header */}
                <div className="sticky top-0 bg-black text-white text-center py-3 px-4 rounded-t-2xl sm:hidden z-10">
                  <button
                    type="button"
                    onClick={() => setDateOpen(false)}
                    className="text-white font-medium text-base"
                  >
                    Cancel
                  </button>
                </div>

                {/* Calendar Content */}
                <div className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180 text-gray-600" />
                    </button>
                    <span className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900">
                      {format(currentMonth, "MMMM yyyy")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 text-center text-[10px] sm:text-xs lg:text-sm font-medium mb-1.5 sm:mb-2 text-gray-600">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="py-1 sm:py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 text-center text-xs sm:text-sm gap-0.5 sm:gap-1 pb-2 sm:pb-0">
                    {getCalendarDays().map((date, idx) => {
                      const inactive = date.getMonth() !== currentMonth.getMonth()
                      const today = startOfDay(new Date())
                      const disabled =
                        (minSelectableDate && isBefore(date, startOfDay(minSelectableDate))) ||
                        isBefore(date, startOfDay(new Date()))

                      const isSelected =
                        selectedDate && isSameDay(date, new Date(selectedDate))

                      return (
                        <div
                          key={idx}
                          onClick={() => !disabled && handleDateSelect(date)}
                          className={cn(
                            "py-1 sm:py-1.5 lg:py-2 rounded-md sm:rounded-lg cursor-pointer transition-all border-2 border-transparent text-[10px] sm:text-xs lg:text-sm",
                            disabled
                              ? "text-gray-300 cursor-not-allowed"
                              : inactive
                                ? "text-gray-400"
                                : "hover:bg-[#008492]/10 hover:text-[#008492]",
                            isSelected
                              ? "bg-[#008492] text-white border-[#008492] font-semibold hover:bg-[#008492]/90"
                              : ""
                          )}
                        >
                          {date.getDate()}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* TIME PICKER */}
        <div className="relative w-full" ref={timePickerRef}>
          <div
            className={cn(
              "relative h-11 sm:h-12 w-full rounded-md border bg-white px-3 py-1 flex items-center cursor-pointer transition-[color,box-shadow]",
              timeError ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50" : "border-gray-300",
              isDisable ? "opacity-50 cursor-not-allowed" : ""
            )}
            onClick={() => {
              if (isDisable) return
              setTimeOpen((prev) => !prev)
              setDateOpen(false)
            }}
          >
            <Clock
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 z-10",
                timeError ? "text-red-500" : "text-gray-500"
              )}
            />
            <div className={cn(
              "text-sm sm:text-base w-full truncate",
              !selectedTime && "text-muted-foreground",
              timeError ? "text-red-500" : selectedTime ? "text-gray-800" : "text-gray-500",
              "pl-8 sm:pl-9"
            )}>
              {selectedTime
                ? formatTimeDisplay(selectedTime)
                : "Select time"}
            </div>
          </div>
          {timeOpen && !isDisable && (
            <div
              className={cn(
                "absolute top-full mt-2 z-50 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 p-3",
                "w-[220px] sm:w-[240px]",
                "left-1/2 -translate-x-1/2"
              )}
            >
              {/* Three Column Layout: Hours | Minutes | AM/PM */}
              <div className="grid grid-cols-3 gap-1.5">
                {/* Column 1: Hours */}
                <div className="flex flex-col">
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 text-center">
                    Hour
                  </h3>
                  <div className="flex flex-col items-center gap-1">
                    {/* Up Arrow */}
                    <button
                      type="button"
                      onClick={() => scrollHours("up")}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    </button>
                    {/* Hours List */}
                    <div 
                      ref={hoursContainerRef}
                      className="flex flex-col gap-0.5 max-h-48 overflow-y-auto hide-scrollbar w-full"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {hours.map((hourValue) => (
                        <button
                          key={hourValue}
                          type="button"
                          onClick={() => handleHourSelect(hourValue)}
                          className={cn(
                            "py-2 px-2 text-sm font-medium rounded-lg transition-all w-full text-center",
                            hour === hourValue
                              ? "bg-[#008492] text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                          )}
                        >
                          {hourValue.toString()}
                        </button>
                      ))}
                    </div>
                    {/* Down Arrow */}
                    <button
                      type="button"
                      onClick={() => scrollHours("down")}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Column 2: Minutes */}
                <div className="flex flex-col">
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 text-center">
                    Minute
                  </h3>
                  <div className="flex flex-col items-center gap-1">
                    {/* Up Arrow */}
                    <button
                      type="button"
                      onClick={() => scrollMinutes("up")}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    </button>
                    {/* Minutes List */}
                    <div 
                      ref={minutesContainerRef}
                      className="flex flex-col gap-0.5 max-h-48 overflow-y-auto hide-scrollbar w-full"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {minutes.map((minuteValue) => (
                        <button
                          key={minuteValue}
                          type="button"
                          onClick={() => handleMinuteSelect(minuteValue)}
                          className={cn(
                            "py-2 px-2 text-sm font-medium rounded-lg transition-all w-full text-center",
                            minute === minuteValue
                              ? "bg-[#008492] text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                          )}
                        >
                          {minuteValue.toString().padStart(2, "0")}
                        </button>
                      ))}
                    </div>
                    {/* Down Arrow */}
                    <button
                      type="button"
                      onClick={() => scrollMinutes("down")}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Column 3: AM/PM */}
                <div className="flex flex-col">
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 text-center">
                    Period
                  </h3>
                  <div className="flex flex-col gap-1.5 mt-[28px]">
                    {(["AM", "PM"] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => handleAmPmSelect(period)}
                        className={cn(
                          "py-3 px-2 text-sm font-semibold rounded-lg transition-all w-full",
                          amPm === period
                            ? "bg-[#008492] text-white"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleTimeSave}
                disabled={hour === null || minute === null || amPm === null}
                className={cn(
                  "w-full py-2.5 px-4 text-sm font-semibold rounded-lg transition-all mt-3",
                  hour !== null && minute !== null && amPm !== null
                    ? "bg-[#008492] text-white hover:bg-[#006d7a] cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                )}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
