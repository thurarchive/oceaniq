"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export type BasemapType = "ocean-dark" | "satellite" | "topographic";

type MapCanvasProps = {
  activeBasemap: BasemapType;
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

export default function MapCanvasMapLibre({
  activeBasemap,
  initialCenter = [106.8456, -6.1088], //Jakarta Area
  initialZoom = 9.5,
}: MapCanvasProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [isClient, setIsClient] = useState(false);

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
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: MAPBOX_STYLES[activeBasemap],
        center: initialCenter,
        zoom: initialZoom,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
      
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
  }, [isClient, initialCenter, initialZoom]);

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
    </div>
  );
}