"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "../ui/Card"
// import { Card } from "@/components/ui/card"

interface Coordinates {
  lat: number
  lng: number
}

interface GoogleMapsRouteProps {
  fromCoords: Coordinates
  toCoords: Coordinates
  className?: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}
const API_KEY = "AIzaSyDaQ998z9_uXU7HJE5dolsDqeO8ubGZvDU";


export default function GoogleMapsRoute({
  fromCoords,
  toCoords,
}: GoogleMapsRouteProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

useEffect(() => {
  // Already loaded
  if (window.google && window.google.maps) {
    initializeMap()
    return
  }

  // Check if script already exists
  const existingScript = document.querySelector(
    `script[src*="maps.googleapis.com/maps/api/js"]`
  ) as HTMLScriptElement

  if (existingScript) {
    existingScript.addEventListener("load", initializeMap)
    return
  }

  // Inject new script
  const script = document.createElement("script")
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=geometry`
  script.async = true
  script.defer = true
  script.addEventListener("load", initializeMap)
  script.addEventListener("error", () => setError("Failed to load Google Maps"))
  document.head.appendChild(script)

  return () => {
    script.removeEventListener("load", initializeMap)
  }
}, []) // 👈 empty deps, load only once


  const initializeMap = () => {
    if (!mapRef.current || !window.google) return

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center: fromCoords,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      // Create markers with custom icons
      const fromMarker = new window.google.maps.Marker({
        position: fromCoords,
        map: map,
        title: "From Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeColor: "#16a34a",
          strokeWeight: 2,
        },
      })

      const toMarker = new window.google.maps.Marker({
        position: toCoords,
        map: map,
        title: "To Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeColor: "#dc2626",
          strokeWeight: 2,
        },
      })

      // Create directional route line with arrows
      const routePath = new window.google.maps.Polyline({
        path: [fromCoords, toCoords],
        geodesic: true,
        strokeColor: "#3b82f6",
        strokeOpacity: 1.0,
        strokeWeight: 4,
        icons: [
          {
            icon: {
              path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 4,
              strokeColor: "#1d4ed8",
              strokeWeight: 2,
              fillColor: "#3b82f6",
              fillOpacity: 1,
            },
            offset: "25%",
            repeat: "50px",
          },
        ],
      })

      routePath.setMap(map)

      // Fit map bounds to show both points
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend(fromCoords)
      bounds.extend(toCoords)
      map.fitBounds(bounds)

      // Add some padding to the bounds
      const padding = { top: 50, right: 50, bottom: 50, left: 50 }
      map.fitBounds(bounds, padding)

      // Add info windows
      const fromInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-green-700">From Location</h3>
            <p class="text-sm text-gray-600">Lat: ${fromCoords.lat.toFixed(6)}</p>
            <p class="text-sm text-gray-600">Lng: ${fromCoords.lng.toFixed(6)}</p>
          </div>
        `,
      })

      const toInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-red-700">To Location</h3>
            <p class="text-sm text-gray-600">Lat: ${toCoords.lat.toFixed(6)}</p>
            <p class="text-sm text-gray-600">Lng: ${toCoords.lng.toFixed(6)}</p>
          </div>
        `,
      })

      fromMarker.addListener("click", () => {
        toInfoWindow.close()
        fromInfoWindow.open(map, fromMarker)
      })

      toMarker.addListener("click", () => {
        fromInfoWindow.close()
        toInfoWindow.open(map, toMarker)
      })
    } catch (err) {
      setError("Failed to initialize map")
      console.error("Map initialization error:", err)
    }
  }

  if (error) {
    return (
      <Card className={`p-6 `}>
        <div className="text-center text-red-600">
          <p className="font-semibold">Error loading map</p>
          <p className="text-sm mt-1">{error}</p>
          <p className="text-xs mt-2 text-gray-500">Please check your Google Maps API key</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden mb-5 lg:mb-10 max-w-6xl mx-auto`}>
      {/* <div className="p-4 bg-gray-50 border-b">
        <h3 className="font-semibold text-gray-800">Route Map</h3>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>
              From: {fromCoords.lat.toFixed(4)}, {fromCoords.lng.toFixed(4)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>
              To: {toCoords.lat.toFixed(4)}, {toCoords.lng.toFixed(4)}
            </span>
          </div>
        </div>
      </div> */}
      <div ref={mapRef} className="w-full h-44 lg:h-80" style={{ minHeight: "200px" }}>
        {!isLoaded && (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
