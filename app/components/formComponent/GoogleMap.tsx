import { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const API_KEY = "YOUR_API_KEY_HERE"; // replace with secured key

interface LatLng {
  lat: number;
  lng: number;
}

interface Location {
  position: LatLng;
  id?: string;
}

interface MapComponentProps {
  mapCenter: LatLng;
  selectedLocation?: Location;
  officeLocations?: any[]; // Ideally, type this properly if you know office shape
  transformOfficeData?: (office: any) => Location;
  handleCardClick?: (location: Location) => void;
  searchCoordinates?: LatLng;
  pickupLat?:  string;
  pickupLng?:  string;
  dropLat?: string;
  dropLng?:  string;
}

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
        zoom={10}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
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

        {directionsResponse && (
          <DirectionsRenderer
            options={{
              directions: directionsResponse,
              suppressMarkers: true,
              polylineOptions: { strokeColor: "#C9C9C9", strokeWeight: 5 },
            }}
          />
        )}

        {pickupLat && pickupLng && (
          <Marker
            position={{ lat: parseFloat(pickupLat.toString()), lng: parseFloat(pickupLng.toString()) }}
            label={{ text: "A", color: "white", fontWeight: "bold" }}
            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
          />
        )}

        {dropLat && dropLng && (
          <Marker
            position={{ lat: parseFloat(dropLat.toString()), lng: parseFloat(dropLng.toString()) }}
            label={{ text: "B", color: "white", fontWeight: "bold" }}
            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
          />
        )}

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

        {selectedLocation ? (
          <Marker
            position={selectedLocation.position}
            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
          />
        ) : (
          officeLocations.map((office) => {
            const location = transformOfficeData?.(office);
            return location ? (
              <Marker
                key={location.id}
                position={location.position}
                onClick={() => handleCardClick?.(location)}
                icon={{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" }}
              />
            ) : null;
          })
        )}

        {searchCoordinates && (
          <Marker
            position={searchCoordinates}
            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
