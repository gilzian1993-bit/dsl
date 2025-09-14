"use client"

import { useState } from "react"

import { MapPin, Calendar, Clock } from "lucide-react"

export function BookingForm() {
  const [formData, setFormData] = useState({
    pickup: "New York, NYC local",
    destination: "New York, NYC local",
    date: "2025-07-07",
    time: "05:00",
  })

  return (
    <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            From
          </label>
          <input
            placeholder="New York, NY local"
            value={formData.pickup}
            onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            To
          </label>
          <input
            placeholder="New York, NY local"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            07 Jul 2025
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            5:00 AM
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 invisible">Button</label>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 w-full h-10">BOOK NOW</button>
        </div>
      </div>
    </div>
  )
}
