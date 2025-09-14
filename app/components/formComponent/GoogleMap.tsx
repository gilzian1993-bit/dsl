import { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const API_KEY = "AIzaSyDaQ998z9_uXU7HJE5dolsDqeO8ubGZvDU"; // Replace with your secured API key if needed

export default function MapComponent({
  mapCenter,
  selectedLocation,
  officeLocations,
  transformOfficeData,
  handleCardClick,
  searchCoordinates,
  pickupLat,
  pickupLng,
  dropLat,
  dropLng,
}: any) {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "40%",
          minHeight: "300px",
          borderRadius: "0px",
        }}
        center={mapCenter}
        zoom={10} // Adjusted for a 30mi range
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
            {
              featureType: "administrative.land_parcel",
              elementType: "labels.text.fill",
              stylers: [{ color: "#bdbdbd" }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#eeeeee" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#757575" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#e5e5e5" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9e9e9e" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "road.arterial",
              elementType: "labels.text.fill",
              stylers: [{ color: "#757575" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#dadada" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#616161" }],
            },
            {
              featureType: "road.local",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9e9e9e" }],
            },
            {
              featureType: "transit.line",
              elementType: "geometry",
              stylers: [{ color: "#e5e5e5" }],
            },
            {
              featureType: "transit.station",
              elementType: "geometry",
              stylers: [{ color: "#eeeeee" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#c9c9c9" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9e9e9e" }],
            },
          ],
        }}

      >
        {/* 🚗 Directions Service */}
        {pickupLat && pickupLng && dropLat && dropLng && (
          <DirectionsService
            options={{
              origin: { lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) },
              destination: {
                lat: parseFloat(dropLat),
                lng: parseFloat(dropLng),
              },
              travelMode: "DRIVING" as google.maps.TravelMode
            }}
            callback={(result, status) => {
              if (status === "OK" && result) {
                setDirectionsResponse(result);
              }
            }}
          />
        )}

        {/* 🛣️ Render Route */}
        {directionsResponse && (
          <DirectionsRenderer
            options={{
              directions: directionsResponse,
              suppressMarkers: true, // Hide default A/B markers
              polylineOptions: {
                strokeColor: "#C9C9C9",
                strokeWeight: 5,
              },
            }}
          />
        )}

        {/* 🅰️ Pickup Marker with label A */}
        {pickupLat && pickupLng && (
          <Marker
            position={{ lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) }}
            label={{
              text: "A",
              color: "white",
              fontWeight: "bold",
            }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        )}

        {/* 🅱️ Drop Marker with label B */}
        {dropLat && dropLng && (
          <Marker
            position={{ lat: parseFloat(dropLat), lng: parseFloat(dropLng) }}
            label={{
              text: "B",
              color: "white",
              fontWeight: "bold",
            }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        )}

        {/* ⚫ Black Center Marker (Midpoint or user location) */}
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

        {/* 📍 Selected Location Marker */}
        {selectedLocation ? (
          <Marker
            position={selectedLocation.position}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        ) : (
          officeLocations.map((office: any) => {
            const location = transformOfficeData(office);
            return (
              <Marker
                key={location.id}
                position={location.position}
                onClick={() => handleCardClick(location)}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                }}
              />
            );
          })
        )}

        {/* 🔵 Search Coordinates Marker */}
        {searchCoordinates && (
          <Marker
            position={searchCoordinates}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
