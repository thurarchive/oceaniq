"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ZONES } from "@/constants/zones";

export type BasemapType = "ocean-dark" | "satellite" | "topographic";

type MapCanvasProps = {
  activeBasemap: BasemapType;
  selectedZone?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
};

// 2. Use standard Mapbox style URLs
const MAPBOX_STYLES: Record<BasemapType, string> = {
  "ocean-dark": "mapbox://styles/thurarchive/cmqjjl7lo001q01qp8ln5c0e3",
  "satellite": "mapbox://styles/mapbox/satellite-streets-v12",
  "topographic": "mapbox://styles/mapbox/outdoors-v12",
};

// 3. Set your token globally for Mapbox
const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
mapboxgl.accessToken = MAPBOX_API_KEY;


export default function MapCanvasMapbox({
  activeBasemap,
  selectedZone = "All Zones",
  initialCenter = [117.5400, -2.5000],
  initialZoom = 4.5,
}: MapCanvasProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<{ lng: number; lat: number } | null>(null);

  const selectedSiteCoords = selectedPoint ? [selectedPoint.lng, selectedPoint.lat] : null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // INITIALIZATION: Run once when the component mounts
  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapRef.current) return;

    if (!MAPBOX_API_KEY) {
      console.error("MapCanvas: NEXT_PUBLIC_MAPBOX_TOKEN is not set in .env.local");
      return;
    }

    try {
      const activeZone = ZONES.find((z) => z.name === selectedZone) || ZONES[0];
      const startCenter = activeZone ? activeZone.center : initialCenter;
      const startZoom = activeZone ? activeZone.zoom : initialZoom;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: MAPBOX_STYLES[activeBasemap],
        center: startCenter,
        zoom: startZoom,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

      // Hook up click listener to capture coordinates
      map.on("click", (e) => {
        setSelectedPoint({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      });

      mapRef.current = map;

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (error) {
      console.error("MapCanvas: Failed to initialize map", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  // FLY TO SELECTED ZONE: Run whenever `selectedZone` changes
  useEffect(() => {
    if (mapRef.current && isClient && selectedZone) {
      const zoneData = ZONES.find((z) => z.name === selectedZone);
      if (zoneData) {
        mapRef.current.flyTo({
          center: zoneData.center,
          zoom: zoneData.zoom,
          essential: true,
          duration: 2000,
        });
      }
    }
  }, [selectedZone, isClient]);

  // DYNAMIC STYLE UPDATE: Run whenever `activeBasemap` changes from the Sidebar
  useEffect(() => {
    if (mapRef.current && isClient) {
      // mapbox-gl smoothly crossfades between styles
      mapRef.current.setStyle(MAPBOX_STYLES[activeBasemap]);
    }
  }, [activeBasemap, isClient]);


  return (
    // Make sure z-0 is here so it sits BEHIND your layers panel
    <div className="w-full h-full relative rounded-xl overflow-hidden shadow-lg border border-white/10 z-0">
      <div
        ref={mapContainerRef}
        className="w-full h-full"
      />
      {/* Show coordinate on the selected location (in the popup) */}
      {selectedSiteCoords && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card border border-border px-3 py-1.5 rounded-lg z-20 shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground">
            Location: {selectedSiteCoords[1].toFixed(5)}°N, {selectedSiteCoords[0].toFixed(5)}°E
          </span>
        </div>
      )}
    </div>

  );
}