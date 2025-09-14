'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

interface DateTimeInputProps {
  date: string;  
  time: string; 
  onChange: (date: string, time: string) => void;
  placeholder?: string;
  minDate?: string;  
  minTime?: string;  
  showTimeAfterDate?: boolean; 
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({ 
  date, 
  time, 
  onChange,
  placeholder = 'Select Date & Time',
  minDate,
  minTime,
  showTimeAfterDate = true
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedHour, setSelectedHour] = useState(() => {
    if (time) return parseInt(time.split(':')[0]);
    return new Date().getHours();
  });
  const [selectedMinute, setSelectedMinute] = useState(() => {
    if (time) return parseInt(time.split(':')[1]);
    return new Date().getMinutes();
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentView, setCurrentView] = useState<'date' | 'time'>('date');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Initialize with props
  useEffect(() => {
    if (date) setSelectedDate(date);
    if (time) {
      const [hour, minute] = time.split(':').map(Number);
      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  }, [date, time]);

  // Set initial month view based on selected date or min date
  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate));
    } else if (minDate) {
      setCurrentMonth(new Date(minDate));
    } else {
      setCurrentMonth(new Date());
    }
  }, [selectedDate, minDate]);

  // Detect outside clicks
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (showDropdown && 
          dropdownRef.current && 
          !dropdownRef.current.contains(target) && 
          triggerRef.current && 
          !triggerRef.current.contains(target)) {
        setShowDropdown(false);
        setCurrentView('date');
      }
    };

    document.addEventListener('click', handleOutsideClick, true);
    return () => document.removeEventListener('click', handleOutsideClick, true);
  }, [showDropdown]);

  // Format display text
  const displayDateTime = useMemo(() => {
    if (!selectedDate) return placeholder;
    
    const dateObj = new Date(selectedDate);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
    const year = dateObj.getFullYear();
    
    if (showTimeAfterDate || time) {
      const timeStr = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
      return `${weekday}, ${day} ${month} ${year}, ${timeStr}`;
    }
    
    return `${weekday}, ${day} ${month} ${year}`;
  }, [selectedDate, selectedHour, selectedMinute, placeholder, showTimeAfterDate, time]);

  // Calendar navigation
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDayOfPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
    
    if (firstDayOfPrevMonth >= today) {
      setCurrentMonth(prevMonth);
    }
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Check if a date is disabled
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return true;

    if (minDate) {
      const minDateObj = new Date(minDate);
      minDateObj.setHours(0, 0, 0, 0);
      if (date < minDateObj) return true;
    }

    return false;
  };

  // Check if a time is disabled
  const isTimeDisabled = (hour: number, minute: number) => {
    if (!minTime || !minDate || selectedDate !== minDate) return false;
    
    const [minHour, minMinute] = minTime.split(':').map(Number);
    
    return hour < minHour || (hour === minHour && minute < minMinute);
  };

  // Generate calendar days
  const generateCalendarDays = (month: Date) => {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    const firstDayOfWeek = startOfMonth.getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(month.getFullYear(), month.getMonth(), i);
      days.push({
        day: i,
        isDisabled: isDateDisabled(dayDate)
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays(currentMonth);

  // Handle date selection
  const handleDateSelect = (day: number | null, isDisabled: boolean) => {
    if (day && !isDisabled) {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0');
      const dayStr = String(newDate.getDate()).padStart(2, '0');
      const newDateStr = `${year}-${month}-${dayStr}`;
      
      setSelectedDate(newDateStr);
      
      if (showTimeAfterDate) {
        setCurrentView('time');
      } else {
        setShowDropdown(false);
      }
      
      // Reset time if needed when date changes
      if (minDate && newDateStr === minDate && minTime) {
        const [minHour, minMinute] = minTime.split(':').map(Number);
        
        if (selectedHour < minHour || (selectedHour === minHour && selectedMinute < minMinute)) {
          setSelectedHour(minHour);
          setSelectedMinute(minMinute);
        }
      }
      
      const timeString = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
      onChange(newDateStr, timeString);
    }
  };

  // Handle time change
  const handleTimeChange = (newHour?: number, newMinute?: number) => {
    const hour = newHour ?? selectedHour;
    const minute = newMinute ?? selectedMinute;
    
    const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
    onChange(selectedDate, timeString);
  };

  // Handle responsive positioning
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    const handleResize = () => {
      checkMobile();
      if (showDropdown && triggerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        setDropdownPosition(spaceBelow < 400 ? 'top' : 'bottom');
      }
    };

    checkMobile();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showDropdown]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        className="w-full flex items-center justify-start px-3 py-3 border border-gray-300 rounded-md bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:border-gray-400 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown(!showDropdown);
          setCurrentView('date');
        }}
      >
        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
        </svg>
        {displayDateTime}
      </button>

      {showDropdown && (
        <div 
          ref={dropdownRef}
          className={`absolute z-[1000] ${dropdownPosition === 'bottom' ? 'mt-2' : 'bottom-full mb-2'} 
            w-full sm:w-auto min-w-[320px] bg-white border border-gray-300 rounded-lg shadow-xl
            ${isMobile ? 'fixed inset-x-0 mx-4 max-h-[85vh] overflow-y-auto' : ''}`}
          onClick={(e) => e.stopPropagation()}
          style={isMobile ? { 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            maxHeight: '85vh',
            width: 'calc(100% - 2rem)'
          } : {}}
        >
          {currentView === 'date' ? (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={goToPreviousMonth} 
                  className="p-2 text-gray-600 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={(() => {
                    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
                    return isDateDisabled(prevMonth);
                  })()}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-lg font-semibold text-gray-800">
                  {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button 
                  onClick={goToNextMonth} 
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="py-2">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 text-center text-sm gap-1">
                {calendarDays.map((dayObj, index) => (
                  <div key={index} className="aspect-square">
                    {dayObj ? (
                      <button
                        className={`w-full h-full flex items-center justify-center rounded-lg transition-all duration-150 font-medium
                          ${dayObj.isDisabled 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                        onClick={() => handleDateSelect(dayObj.day, dayObj.isDisabled)}
                        disabled={dayObj.isDisabled}
                      >
                        {dayObj.day}
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
              
              {!showTimeAfterDate && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <div className="border-b border-gray-200 pb-3 mb-4">
                <button 
                  onClick={() => setCurrentView('date')}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to calendar
                </button>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold mb-4 text-gray-800">
                  {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </div>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <label className="text-sm font-medium text-gray-600 mb-2">Hour</label>
                    <select
                      value={selectedHour}
                      onChange={(e) => {
                        const newHour = parseInt(e.target.value);
                        setSelectedHour(newHour);
                        handleTimeChange(newHour, selectedMinute);
                      }}
                      className="w-16 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i;
                        const disabled = isTimeDisabled(hour, selectedMinute);
                        return (
                          <option key={hour} value={hour} disabled={disabled}>
                            {String(hour).padStart(2, '0')}
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
                      onChange={(e) => {
                        const newMinute = parseInt(e.target.value);
                        setSelectedMinute(newMinute);
                        handleTimeChange(selectedHour, newMinute);
                      }}
                      className="w-16 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                    >
                      {Array.from({ length: 60 }, (_, i) => {
                        const disabled = isTimeDisabled(selectedHour, i);
                        return (
                          <option key={i} value={i} disabled={disabled}>
                            {String(i).padStart(2, '0')}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  {String(selectedHour).padStart(2, '0')}:{String(selectedMinute).padStart(2, '0')}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDropdown(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeInput;