"use client";

import { useState, useEffect } from "react";

interface TimePickerProps {
 
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  onClose: () => void; // still used to close Popover when time is selected
}

export default function TimePicker({

  onClose,

  selectedTime,
  onTimeSelect,
}: TimePickerProps) {
  const [selectedHour, setSelectedHour] = useState(10);
  const [amPm, setAmPm] = useState("PM");

  // Format live display time string, always minutes "00"
  const formatTime = () => {
    const displayHour = selectedHour === 0 ? 12 : selectedHour;
    return `${displayHour}:00 ${amPm}`;
  };

  const handleHourClick = (hour: number) => {
    setSelectedHour(hour);
  };

  const handleOK = () => {
    onTimeSelect(formatTime());
    onClose();
  };

  // if (!isOpen) return null;

  return (
    <div className="flex items-center justify-center ">
      <div className="" style={{ width: "200px", height: "auto" }}>
        {/* Header */}
        <div className="bg-white text-black px-4 rounded-t-lg text-center ">
         
          {/* Use live formatted time here */}
          <p className="text-xl font-light">{formatTime()}</p>
        </div>

        {/* Clock */}
        <div className="px-2 pb-4">
          <div className="relative w-40 h-40 mx-auto flex items-center">
            {/* AM button on left */}
            <button
              onClick={() => setAmPm("AM")}
              className={`absolute left-0 top-7/8 transform -translate-y-1/2 px-0.5 py-0.5 text-xs rounded ${
                amPm === "AM" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
              style={{ left: "" }}
            >
              AM
            </button>

            <svg className="w-full h-full" viewBox="0 0 240 240">
              {/* Clock face background */}
              <circle cx="120" cy="120" r="110" fill="#f8f9fa" stroke="none" />

              {/* Hour numbers */}
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => {
                const angle = (hour % 12) * 30 - 90;
                const radius = 85;
                const x = Math.cos((angle * Math.PI) / 180) * radius + 120;
                const y = Math.sin((angle * Math.PI) / 180) * radius + 120;
                const isSelected = selectedHour === hour;

                return (
                  <g key={hour}>
                    {isSelected && <circle cx={x} cy={y} r="20" fill="#1f2937" />}
                    <text
                      x={x}
                      y={y + 5}
                      textAnchor="middle"
                      className={`text-base cursor-pointer select-none ${
                        isSelected ? "fill-white font-medium" : "fill-gray-700"
                      }`}
                      onClick={() => handleHourClick(hour)}
                    >
                      {hour}
                    </text>
                  </g>
                );
              })}

              {/* Clock hand */}
              <line
                x1="120"
                y1="120"
                x2={Math.cos(((selectedHour % 12) * 30 - 90) * (Math.PI / 180)) * 85 + 120}
                y2={Math.sin(((selectedHour % 12) * 30 - 90) * (Math.PI / 180)) * 85 + 120}
                stroke="#1f2937"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Center dot */}
              <circle cx="120" cy="120" r="4" fill="#1f2937" />
            </svg>

            {/* PM button on right */}
            <button
              onClick={() => setAmPm("PM")}
              className={`absolute right-0 top-7/8 transform -translate-y-1/2 px-0.5 py-0.5 text-xs rounded ${
                amPm === "PM" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
              style={{ right: "" }}
            >
              PM
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4 px-6 pb-4 pt-2">
          <div className="flex gap-5">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleOK}
              className="text-black hover:text-blue-700 text-sm font-medium"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
