"use client";

import { useEffect, useRef } from "react";
import useFormStore from "@/stores/FormStore";
import { brandColor } from "@/lib/colors";
import { Route, Timer } from "lucide-react";
import { GOOGLE_MAPS_API_KEY } from "@/lib/config";

export default function GoogleMapsRoute() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { formData } = useFormStore();
  const { fromLocation, toLocation, stops, distance, duration } = formData;

  const fromCoords = fromLocation?.coardinates;
  const toCoords = toLocation?.coardinates;

  // Convert "lat,lng" → { lat, lng }
  const parseCoords = (coord?: string): google.maps.LatLngLiteral | null => {
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
          .filter((p): p is google.maps.LatLngLiteral => !!p);

        // Initialize map
        const map = new Map(mapRef.current as HTMLElement, {
          center: from || { lat: 31.5204, lng: 74.3587 }, // Lahore default
          zoom: 13,
          disableDefaultUI: true,
        });

        // Only pickup marker
        if (from && !to && waypointsList.length === 0) {
          new Marker({ position: from, map, label: "A" });
          map.setCenter(from);
          map.setZoom(14);
          return;
        }

        // Full route logic
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

          const waypoints: google.maps.DirectionsWaypoint[] = waypointsList.map((stop) => ({
            location: stop,
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

              const bounds = new google.maps.LatLngBounds();
              const labels = ["A", ...waypointsList.map((_, i) => String.fromCharCode(66 + i)), "Z"];

              // Pickup
              new Marker({ position: from, map, label: labels[0] });
              bounds.extend(from);

              // Stops
              waypointsList.forEach((stop, idx) => {
                new Marker({ position: stop, map, label: labels[idx + 1] });
                bounds.extend(stop);
              });

              // Dropoff
              new Marker({ position: to, map, label: labels[labels.length - 1] });
              bounds.extend(to);

              map.fitBounds(bounds);

              google.maps.event.addListenerOnce(map, "bounds_changed", () => {
                const zoom = map.getZoom();
                if (zoom && zoom > 15) map.setZoom(14);
              });
            }
          });
        }
      } catch (error) {
        console.error("Google Maps failed to load:", error);
      }
    };

    // ✅ Fully type-safe check for existing google.maps
    if (typeof window !== "undefined" ) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=maps,marker,routes`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Wait a tick to ensure google.maps is ready
        setTimeout(initMap, 100);
      };
      document.head.appendChild(script);
    }
  }, [fromCoords, toCoords, JSON.stringify(formData.stops)]);

  return (
    <div className="w-full h-[350px] rounded-2xl overflow-hidden bg-white border-2 lg:border-4 border-brand shadow-sm flex flex-col">
      <div ref={mapRef} className="w-full h-full rounded-sm" />
      <div className="py-1 flex items-center gap-3 px-2">
        <div className="py-1 flex items-center gap-1">
          <Route color={brandColor} size={15} />
          <div>{distance?.value ?? 0} Mile</div>
        </div>
        <div className="py-1 flex items-center gap-1">
          <Timer color={brandColor} size={15} />
          <div>{duration?.value !== "" ? duration?.value : 0} hours</div>
        </div>
      </div>
    </div>
  );
}
