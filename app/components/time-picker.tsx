"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TimeInputProps {
  hour?: number;
  minute?: number;
  minTime?: string; // e.g. "14:30"
  onChange: (hour: number, minute: number) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ hour, minute, onChange }) => {
  const initialHour = hour ?? new Date().getHours();
  const initialMinute = minute ?? 0;

  const [selectedHour, setSelectedHour] = useState(initialHour % 12 || 12);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  const [period, setPeriod] = useState(initialHour >= 12 ? "PM" : "AM");

  useEffect(() => {
    if (hour !== undefined) {
      setSelectedHour(hour % 12 || 12);
      setPeriod(hour >= 12 ? "PM" : "AM");
    }
    if (minute !== undefined) {
      setSelectedMinute(minute);
    }
  }, [hour, minute]);

  // Convert to 24h for validation
  const to24Hour = (h: number, p: string) => {
    if (p === "AM") {
      return h === 12 ? 0 : h;
    } else {
      return h === 12 ? 12 : h + 12;
    }
  };

  const handleHourChange = (newHour: number) => {
    setSelectedHour(newHour);
  };

  const handleMinuteChange = (newMinute: number) => {
    setSelectedMinute(newMinute);
  };

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  const handleOK = () => {
    // Update parent with selected time
    onChange(to24Hour(selectedHour, period), selectedMinute);
  };

  // const handleCancel = () => {
  //   // Reset the time selection to initial values
  //   setSelectedHour(initialHour % 12 || 12);
  //   setSelectedMinute(initialMinute);
  //   setPeriod(initialHour >= 12 ? "PM" : "AM");
  // };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
        {/* Hour Selector */}
        <div className="flex flex-col items-center">
          <label className="text-sm font-medium text-gray-400 mb-2">Hour</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => handleHourChange(selectedHour === 12 ? 1 : selectedHour + 1)}
              className="w-8 h-8 bg-[#008492] hover:bg-[#008492] rounded-xl flex items-center justify-center transition-all duration-200 mb-2 shadow-lg hover:scale-110 active:scale-95"
            >
              <ChevronUp className="text-white" />
            </button>

            <div className="text-xl font-bold text-white mb-2 cursor-grab active:cursor-grabbing select-none bg-gray-800 px-2 py-1 rounded-lg border border-gray-600 hover:border-[#F4910B] transition-colors">
              {String(selectedHour).padStart(2, "0")}
            </div>

            <button
              type="button"
              onClick={() => handleHourChange(selectedHour === 1 ? 12 : selectedHour - 1)}
              className="w-8 h-8 bg-[#008492] hover:bg-[#008492] rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
            >
              <ChevronDown className="text-white" />
            </button>
          </div>
        </div>

        {/* Minute Selector */}
        <span className="text-2xl font-bold text-gray-400 mt-6">:</span>

        <div className="flex flex-col items-center">
          <label className="text-sm font-medium text-gray-400 mb-2">Minute</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => handleMinuteChange((selectedMinute + 5) % 60)}
              className="w-8 h-8 bg-[#008492] hover:bg-[#008492] rounded-xl flex items-center justify-center transition-all duration-200 mb-2 shadow-lg hover:scale-110 active:scale-95"
            >
              <ChevronUp className="text-white" />
            </button>

            <div className="text-xl font-bold text-white mb-2 cursor-grab active:cursor-grabbing select-none bg-gray-800 px-2 py-1 rounded-lg border border-gray-600 hover:border-[#F4910B] transition-colors">
              {String(selectedMinute).padStart(2, "0")}
            </div>

            <button
              type="button"
              onClick={() => handleMinuteChange((selectedMinute - 5 + 60) % 60)}
              className="w-8 h-8 bg-[#008492] hover:bg-[#008492] rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
            >
              <ChevronDown className="text-white" />
            </button>
          </div>
        </div>

        {/* AM/PM Selector */}
        <div className="flex flex-col justify-end items-center">
          <label className="text-sm font-medium text-gray-400 mb-2">Period</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => handlePeriodChange(period === "AM" ? "PM" : "AM")}
              className="w-8 h-8 bg-[#008492] hover:bg-[#008492] rounded-xl flex items-center justify-center transition-all duration-200 mb-2 shadow-lg hover:scale-110 active:scale-95"
            >
              <ChevronUp className="text-white" />
            </button>

            <div className="text-xl font-bold text-white mb-2 cursor-grab active:cursor-grabbing select-none bg-gray-800 px-2 py-1 rounded-lg border border-gray-600 hover:border-[#F4910B] transition-colors">
              {period}
            </div>

            <button
              type="button"
              onClick={() => handlePeriodChange(period === "AM" ? "PM" : "AM")}
                className="w-8 h-8 bg-[#008492] hover:bg-[#008492] rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
            >
              <ChevronDown className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Display selected time */}
      <div className="text-lg  font-semibold text-gray-800">
        {selectedHour ? (
          <>
          <div ><span className="text-black ">{String(selectedHour).padStart(2, "0")}</span>
            <span className="text-black mx-2 animate-pulse">:</span>
            <span className="text-black">{String(selectedMinute).padStart(2, "0")}</span>
            <span className="ml-3 text-black">
              {period}
            </span></div>
            
          </>
        ) : (
          <span className="text-gray-500">00:00 --</span>
        )}
      </div>

      {/* OK and Cancel Buttons */}
      <div className="flex justify-end gap-4 mt-4 w-full">
        <button
          onClick={handleOK}
          className="bg-[#008492] hover:bg-[#007472] text-white py-2 px-3 rounded-md font-semibold transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default TimeInput;
