"use client";
import { useState, useRef, useEffect } from "react";

interface TimePickerProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  onClose: () => void;
}

export default function TimePicker({
  onClose,
  selectedTime,
  onTimeSelect,
}: TimePickerProps) {
  const [selectedHour, setSelectedHour] = useState<number>(10);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [amPm, setAmPm] = useState<"AM" | "PM">("PM");
  const [step, setStep] = useState<"hour" | "minute">("hour");
  const svgRef = useRef<SVGSVGElement>(null);

  const formatTime = () => {
    const displayHour = selectedHour === 0 ? 12 : selectedHour;
    const paddedMinutes = selectedMinute.toString().padStart(2, "0");
    return `${displayHour}:${paddedMinutes} ${amPm}`;
  };

  const handleHourClick = (hour: number) => {
    setSelectedHour(hour);
    setStep("minute");
  };

  const handleMinuteFromPosition = (x: number, y: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = x - rect.left - cx;
    const dy = y - rect.top - cy;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    const minute = Math.round((angle / 360) * 60) % 60;
    setSelectedMinute(minute);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const move = (ev: MouseEvent | TouchEvent) => {
      const clientX = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
      const clientY = "touches" in ev ? ev.touches[0].clientY : ev.clientY;
      handleMinuteFromPosition(clientX, clientY);
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
  };

  const handleOK = () => {
    onTimeSelect(formatTime());
    onClose();
  };
  const handleMinuteClick = (minute: number) => setSelectedMinute(minute);


  return (
    <div className="flex items-center justify-center">
      <div className="w-[200px] bg-white  p-2">
        {/* Display time */}
        <div className="text-black px-2 py-1 text-center border-b mb-2">
          <p className="text-lg font-light">{formatTime()}</p>
        </div>

        {/* Hour Picker */}
        {step === "hour" ? (
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <button
              onClick={() => setAmPm("AM")}
              className={`absolute left-0 -bottom-5 px-2 py-1 text-xs rounded ${amPm === "AM" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              AM
            </button>

            <svg className="w-full h-full" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="#f8f9fa" />
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => {
                const angle = (hour % 12) * 30 - 90;
                const radius = 70;
                const x = Math.cos((angle * Math.PI) / 180) * radius + 100;
                const y = Math.sin((angle * Math.PI) / 180) * radius + 100;
                const isSelected = selectedHour === hour;
                return (
                  <g key={hour}>
                    {isSelected && <circle cx={x} cy={y} r="16" fill="#1f2937" />}
                    <text
                      x={x}
                      y={y + 4}
                      textAnchor="middle"
                      className={`text-sm cursor-pointer select-none ${isSelected ? "fill-white font-medium" : "fill-gray-700"
                        }`}
                      onClick={() => handleHourClick(hour)}
                    >
                      {hour}
                    </text>
                  </g>
                );
              })}
              <line
                x1="100"
                y1="100"
                x2={Math.cos(((selectedHour % 12) * 30 - 90) * (Math.PI / 180)) * 70 + 100}
                y2={Math.sin(((selectedHour % 12) * 30 - 90) * (Math.PI / 180)) * 70 + 100}
                stroke="#1f2937"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="3" fill="#1f2937" />
            </svg>

            <button
              onClick={() => setAmPm("PM")}
              className={`absolute right-0 -bottom-5 px-2 py-1 text-xs rounded ${amPm === "PM" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              PM
            </button>
          </div>
        ) : (
          // Minute Picker with draggable hand
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <svg
              ref={svgRef}
              className="w-full h-full"
              viewBox="0 0 200 200"
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <circle cx="100" cy="100" r="90" fill="#f8f9fa" />
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => {
                const angle = (minute / 60) * 360 - 90;
                const radius = 70;
                const x = Math.cos((angle * Math.PI) / 180) * radius + 100;
                const y = Math.sin((angle * Math.PI) / 180) * radius + 100;
                const isSelected = selectedMinute === minute;
                return (
                  <g key={minute}>
                    {isSelected && <circle cx={x} cy={y} r="10" fill="#1f2937" />}
                    <text
                      x={x}
                      y={y + 4}
                      textAnchor="middle"
                      className={`text-xs cursor-pointer select-none ${isSelected ? "fill-white font-medium" : "fill-gray-700"
                        }`}
                      onClick={() => handleMinuteClick(minute)}
                    >
                      {minute.toString().padStart(2, "0")}
                    </text>
                  </g>
                );
              })}

              {/* Draggable minute hand */}
              <line
                x1="100"
                y1="100"
                x2={Math.cos((selectedMinute / 60) * 360 * (Math.PI / 180) - Math.PI / 2) * 70 + 100}
                y2={Math.sin((selectedMinute / 60) * 360 * (Math.PI / 180) - Math.PI / 2) * 70 + 100}
                stroke="#1f2937"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="3" fill="#1f2937" />
            </svg>
          </div>
        )}

        {/* Bottom Buttons */}
            {step === "minute" && (<div className="flex justify-end gap-3 px-4 pt-3 pb-2">
      
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-xs font-medium"
          >
            Cancel
          </button>
         
            <button
              onClick={handleOK}
              className="text-black hover:text-blue-700 text-xs font-medium"
            >
              OK
            </button>
         
        </div> )}
      </div>
    </div>
  );
}
