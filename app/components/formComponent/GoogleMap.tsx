"use client";

import { useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

// LatLng type for positions
export interface LatLng {
  lat: number;
  lng: number;
}

// Generic location type for markers
export interface Location {
  id: string;
  name?: string;
  position: LatLng;
}

// Office type from backend or static data
export interface Office {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

// Props for the map component
interface MapComponentProps {
  mapCenter: LatLng;
  selectedLocation?: Location;
  officeLocations?: Office[];
  transformOfficeData?: (office: Office) => Location;
  handleCardClick?: (location: Location) => void;
  searchCoordinates?: LatLng;
  pickupLat?: string;
  pickupLng?: string;
  dropLat?: string;
  dropLng?: string;
}

const API_KEY = "AIzaSyDaQ998z9_uXU7HJE5dolsDqeO8ubGZvDU";

export default function MapComponent({
  mapCenter,
  selectedLocation,
  officeLocations = [],
  transformOfficeData,
  handleCardClick,
  searchCoordinates,
  pickupLat,
  pickupLng,
  dropLat,
  dropLng,
}: MapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
  });

  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  // Parse string coordinates to LatLng
  const parseLatLng = (lat?: string, lng?: string): LatLng | undefined => {
    if (!lat || !lng) return undefined;
    return { lat: parseFloat(lat), lng: parseFloat(lng) };
  };

  const pickupPosition = parseLatLng(pickupLat, pickupLng);
  const dropPosition = parseLatLng(dropLat, dropLng);

  if (!isLoaded) return <div className="flex items-center justify-center min-h-[200px]">
                <div className="w-5 h-5 border border-gray-300 border-t-4 border-t-gray-500 rounded-full animate-spin"></div>
            </div>;

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "40%",
        minHeight: "300px",
        borderRadius: "0px",
      }}
      center={mapCenter}
      zoom={10}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {/* Directions */}
      {pickupPosition && dropPosition && (
        <DirectionsService
          options={{
            origin: pickupPosition,
            destination: dropPosition,
            travelMode: "DRIVING" as google.maps.TravelMode,
          }}
          callback={(result, status) => {
            if (status === "OK" && result) setDirectionsResponse(result);
          }}
        />
      )}

      {directionsResponse && (
        <DirectionsRenderer
          options={{
            directions: directionsResponse,
            suppressMarkers: true,
            polylineOptions: { strokeColor: "#C9C9C9", strokeWeight: 5 },
          }}
        />
      )}

      {/* Pickup marker */}
      {pickupPosition && (
        <Marker
          position={pickupPosition}
          label={{ text: "A", color: "white", fontWeight: "bold" }}
          icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
        />
      )}

      {/* Drop marker */}
      {dropPosition && (
        <Marker
          position={dropPosition}
          label={{ text: "B", color: "white", fontWeight: "bold" }}
          icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
        />
      )}

      {/* Center marker */}
      {mapCenter && (
        <Marker
          position={mapCenter}
          icon={{
            path: window.google?.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#000000",
            fillOpacity: 1,
            strokeWeight: 1,
          }}
        />
      )}

      {/* Selected location marker */}
      {selectedLocation && (
        <Marker
          position={selectedLocation.position}
          icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
        />
      )}

      {/* Office locations */}
      {officeLocations.map((office) => {
        const location = transformOfficeData?.(office);
        if (!location) return null;
        return (
          <Marker
            key={location.id}
            position={location.position}
            onClick={() => handleCardClick?.(location)}
            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" }}
          />
        );
      })}

      {/* Search marker */}
      {searchCoordinates && (
        <Marker
          position={searchCoordinates}
          icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
        />
      )}
    </GoogleMap>
  );
}
