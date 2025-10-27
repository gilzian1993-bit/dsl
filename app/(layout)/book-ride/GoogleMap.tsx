"use client";

import { useEffect, useRef } from "react";
import useFormStore from "@/stores/FormStore";
import { brandColor } from "@/lib/colors";
import { Route, Timer } from "lucide-react";

export default function GoogleMapsRoute() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { formData } = useFormStore();
  const { fromLocation, toLocation, stops, distance, duration } = formData;

  const fromCoords = fromLocation.coardinates;
  const toCoords = toLocation.coardinates;

  // Helper: "lat,lng" → { lat, lng }
  const parseCoords = (coord?: string) => {
    if (!coord) return null;
    const [lat, lng] = coord.split(",").map(Number);
    return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
  };

  useEffect(() => {
    const initMap = async () => {
      try {
        const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
        const { Marker } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
        const { DirectionsService, DirectionsRenderer } = (await google.maps.importLibrary("routes")) as google.maps.RoutesLibrary;

        const from = parseCoords(fromCoords);
        const to = parseCoords(toCoords);
        const waypointsList = (stops || [])
          .map((s) => parseCoords(s.coardinates))
          .filter(Boolean);

        const map = new Map(mapRef.current as HTMLElement, {
          center: from || { lat: 31.5204, lng: 74.3587 }, // Default: Lahore
          zoom: 11,
          disableDefaultUI: true,
        });

        // Case 1: Only pickup
        if (from && !to && waypointsList.length === 0) {
          new Marker({
            position: from,
            map,
            label: "A",
          });
          map.setCenter(from);
          return;
        }

        // Case 2: Full route
        if (from && to) {
          const directionsService = new DirectionsService();
          const directionsRenderer = new DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: brandColor,
              strokeWeight: 5,
            },
          });
          directionsRenderer.setMap(map);

          const waypoints = waypointsList.map((stop) => ({
            location: stop!,
            stopover: true,
          }));

          const request: google.maps.DirectionsRequest = {
            origin: from,
            destination: to,
            waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
          };

          directionsService.route(request, (result, status) => {
            if (status === "OK" && result) {
              directionsRenderer.setDirections(result);

              // Label sequence: A (pickup), B..Y (stops), Z (dropoff)
              const labels = ["A", ...Array.from({ length: waypointsList.length }, (_, i) => String.fromCharCode(66 + i)), String.fromCharCode(66 + waypointsList.length)];

              // Pickup
              new Marker({ position: from, map, label: labels[0] });

              // Stops
              waypointsList.forEach((stop, idx) => {
                new Marker({
                  position: stop!,
                  map,
                  label: labels[idx + 1],
                });
              });

              // Dropoff
              new Marker({
                position: to,
                map,
                label: labels[labels.length - 1],
              });
            }
          });
        }
      } catch (error) {
        console.error("Google Maps failed to load:", error);
      }
    };

    if (typeof window !== "undefined" && (window as any).google) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=maps,marker,routes`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [fromCoords, toCoords, JSON.stringify(formData.stops)]);

  return (
    <div
      className={`w-full h-[350px] rounded-2xl overflow-hidden bg-white border-2 lg:border-4 border-brand shadow-sm flex flex-col`}
    >
      <div ref={mapRef} className="w-full h-full rounded-sm" />
      <div className="py-1 flex items-center gap-3 px-2 ">
      <div className="py-1 flex items-center gap-1 ">
       <Route color={brandColor} size={15}/>
       <div>{distance.value ?? 0 } Mile</div>
      </div>
      <div className="py-1 flex items-center gap-1 ">
       <Timer color={brandColor} size={15}/>
       <div>{duration.value !== '' ? duration.value : 0} hours</div>
      </div>
      </div>
    </div>
  );
}
