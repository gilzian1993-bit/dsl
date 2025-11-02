"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "../ui/Card";

interface Coordinates {
  lat: number;
  lng: number;
}

interface GoogleMapsRouteProps {
  fromCoords: Coordinates;
  toCoords: Coordinates;
  className?: string;
}

/**
 * Replace with env variable in production.
 * Example: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
 */
const API_KEY = "AIzaSyDaQ998z9_uXU7HJE5dolsDqeO8ubGZvDU";

/**
 * Load Google Maps JS once and return a Promise that resolves when ready.
 * This avoids double-loading and races.
 */
function loadGoogleMaps(apiKey: string, libraries: string[] = ["geometry"]) {
  const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(",")}`;

  // If already loaded, resolve immediately
  if (typeof window !== "undefined" && (window as any).google && (window as any).google.maps) {
    return Promise.resolve(window.google);
  }

  // If a script with the same src exists and is already loaded or loading, reuse it.
  const existing = Array.from(document.getElementsByTagName("script")).find((s) =>
    s.src.startsWith("https://maps.googleapis.com/maps/api/js")
  ) as HTMLScriptElement | undefined;

  if (existing) {
    // If it's already loaded and window.google exists, resolve, else wait for load event
    if ((window as any).google && (window as any).google.maps) {
      return Promise.resolve((window as any).google);
    }
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => {
        if ((window as any).google && (window as any).google.maps) resolve((window as any).google);
        else reject(new Error("Google Maps did not attach to window.google"));
      });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps script")));
    });
  }

  // Otherwise inject a new script
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;

    const onLoad = () => {
      if ((window as any).google && (window as any).google.maps) resolve((window as any).google);
      else reject(new Error("Google Maps loaded but window.google is not available"));
    };

    const onError = () => reject(new Error("Failed to load Google Maps script"));

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    document.head.appendChild(script);
  });
}

export default function GoogleMapsRoute({ fromCoords, toCoords }: GoogleMapsRouteProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ from?: any; to?: any }>({});
  const routeRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // initialize map (or update existing map) whenever coords or mapRef changes
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      setError(null);
      setIsLoaded(false);

      if (!mapRef.current) {
        setError("Map container not available");
        return;
      }

      try {
        const google = await loadGoogleMaps(API_KEY, ["geometry"]);
        if (cancelled) return;

        // make sure google.maps exists (defensive)
        if (!google || !google.maps) {
          throw new Error("Google Maps library is not available");
        }

        // If map already exists just update markers/route and fit bounds
        if (mapInstanceRef.current) {
          updateMapElements(google);
          setIsLoaded(true);
          return;
        }

        // Create new map instance
        const map = new google.maps.Map(mapRef.current, {
          zoom: 13,
          center: fromCoords || { lat: 0, lng: 0 },
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        mapInstanceRef.current = map;

        // create markers + route
        createOrUpdateMarkersAndRoute(google, map);

        // fit bounds
        fitBounds(google, map);

        setIsLoaded(true);
      } catch (err: any) {
        console.error("Google Maps init error:", err);
        setError(err?.message || "Failed to initialize map");
        setIsLoaded(false);
      }
    }

    boot();

    return () => {
      cancelled = true;
    };
    // Re-run when coords change
  }, [fromCoords?.lat, fromCoords?.lng, toCoords?.lat, toCoords?.lng]);

  // Helper: create or update markers and route polyline
  function createOrUpdateMarkersAndRoute(google: any, map: any) {
    if (!google || !google.maps || !map) return;

    // Remove previous route if exists
    if (routeRef.current) {
      routeRef.current.setMap(null);
      routeRef.current = null;
    }

    // Remove previous markers
    if (markersRef.current.from) {
      markersRef.current.from.setMap(null);
      markersRef.current.from = undefined;
    }
    if (markersRef.current.to) {
      markersRef.current.to.setMap(null);
      markersRef.current.to = undefined;
    }

    // Create from marker
    markersRef.current.from = new google.maps.Marker({
      position: fromCoords,
      map,
      title: "From Location",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#22c55e",
        fillOpacity: 1,
        strokeColor: "#16a34a",
        strokeWeight: 2,
      },
    });

    // Create to marker
    markersRef.current.to = new google.maps.Marker({
      position: toCoords,
      map,
      title: "To Location",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#ef4444",
        fillOpacity: 1,
        strokeColor: "#dc2626",
        strokeWeight: 2,
      },
    });

    // Create polyline route with arrow icons
    routeRef.current = new google.maps.Polyline({
      path: [fromCoords, toCoords],
      geodesic: true,
      strokeColor: "#3b82f6",
      strokeOpacity: 1.0,
      strokeWeight: 4,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
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
    });

    routeRef.current.setMap(map);

    // Info windows
    try {
      const fromInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding:8px">
            <h3 style="margin:0;font-weight:600;color:#16a34a">From Location</h3>
            <div style="font-size:12px;color:#374151">Lat: ${fromCoords.lat.toFixed(6)}</div>
            <div style="font-size:12px;color:#374151">Lng: ${fromCoords.lng.toFixed(6)}</div>
          </div>
        `,
      });

      const toInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding:8px">
            <h3 style="margin:0;font-weight:600;color:#dc2626">To Location</h3>
            <div style="font-size:12px;color:#374151">Lat: ${toCoords.lat.toFixed(6)}</div>
            <div style="font-size:12px;color:#374151">Lng: ${toCoords.lng.toFixed(6)}</div>
          </div>
        `,
      });

      markersRef.current.from.addListener("click", () => {
        toInfoWindow.close();
        fromInfoWindow.open(map, markersRef.current.from);
      });

      markersRef.current.to.addListener("click", () => {
        fromInfoWindow.close();
        toInfoWindow.open(map, markersRef.current.to);
      });
    } catch (err) {
      // Some map operations can fail if the library isn't fully present; catch to avoid breaking UI
      console.warn("InfoWindow creation issue:", err);
    }
  }

  // Helper: if map exists, just update markers/route and fit bounds
  function updateMapElements(google: any) {
    const map = mapInstanceRef.current;
    if (!map || !google || !google.maps) return;

    createOrUpdateMarkersAndRoute(google, map);
    fitBounds(google, map);
  }

  function fitBounds(google: any, map: any) {
    if (!google || !google.maps || !map) return;
    try {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(fromCoords);
      bounds.extend(toCoords);
      // First fit, then apply padding
      map.fitBounds(bounds);
      const padding = { top: 50, right: 50, bottom: 50, left: 50 };
      // fitBounds second arg is available on some maps versions; wrap in try
      try {
        map.fitBounds(bounds, padding);
      } catch {
        // ignore if not supported; map already fit once
      }
    } catch (err) {
      console.warn("fitBounds failed:", err);
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
    );
  }

  return (
    <Card className={`overflow-hidden mb-5 lg:mb-10 max-w-6xl mx-auto`}>
      <div
        ref={mapRef}
        className="w-full h-44 lg:h-80"
        style={{ minHeight: "200px", position: "relative" }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        {/* map will be injected into this div by google.maps.Map */}
      </div>
    </Card>
  );
}
