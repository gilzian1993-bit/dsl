"use client";

import React, { useState, useEffect } from "react";

interface TimeInputProps {
  hour?: number;
  minute?: number;
  minTime?: string; // e.g. "14:30"
  onChange: (hour: number, minute: number) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ hour, minute, minTime, onChange }) => {
  // Convert given hour into 12-hour format with AM/PM
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

  const isTimeDisabled = (h: number, m: number, p: string) => {
    if (!minTime) return false;
    const [minHour, minMinute] = minTime.split(":").map(Number);
    const candidate = to24Hour(h, p);
    return candidate < minHour || (candidate === minHour && m < minMinute);
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

  const handleCancel = () => {
    // Reset the time selection to initial values
    setSelectedHour(initialHour % 12 || 12);
    setSelectedMinute(initialMinute);
    setPeriod(initialHour >= 12 ? "PM" : "AM");
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <label className="text-sm font-medium text-gray-600 mb-2">Hour</label>
          <select
            value={selectedHour}
            onChange={(e) => handleHourChange(parseInt(e.target.value))}
            className="w-16 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const hour12 = i + 1;
              const disabled = isTimeDisabled(hour12, selectedMinute, period);
              return (
                <option key={hour12} value={hour12} disabled={disabled}>
                  {String(hour12).padStart(2, "0")}
                </option>
              );
            })}
          </select>
        </div>

        <span className="text-2xl font-bold text-gray-400 mt-6">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <label className="text-sm font-medium text-gray-600 mb-2">Minute</label>
          <select
            value={selectedMinute}
            onChange={(e) => handleMinuteChange(parseInt(e.target.value))}
            className="w-16 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
          >
            {Array.from({ length: 60 }, (_, i) => {
              const disabled = isTimeDisabled(selectedHour, i, period);
              return (
                <option key={i} value={i} disabled={disabled}>
                  {String(i).padStart(2, "0")}
                </option>
              );
            })}
          </select>
        </div>

        {/* AM/PM */}
        <div className="flex flex-col justify-end items-center">
          <label className="text-sm font-medium text-gray-600 mb-2">Period</label>
          <select
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="w-20 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      {/* Display selected time */}
      <div className="text-lg font-semibold text-gray-800 mb-2">
        {String(selectedHour).padStart(2, "0")}:{String(selectedMinute).padStart(2, "0")} {period}
      </div>

      {/* OK and Cancel Buttons */}
<div className="flex justify-end gap-4 mt-4">
  <button
    onClick={handleOK}
    className="bg-[#008492] hover:bg-[#007472] text-white py-3 px-6 rounded-md font-semibold transition"
  >
    OK
  </button>
</div>


    </div>
  );
};

export default TimeInput;
