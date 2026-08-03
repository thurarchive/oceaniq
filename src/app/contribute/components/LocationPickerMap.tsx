'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
mapboxgl.accessToken = MAPBOX_TOKEN;

interface LocationPickerMapProps {
  lat: number | null;
  lng: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function LocationPickerMap({ lat, lng, onLocationSelect }: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [detecting, setDetecting] = useState(false);

  const defaultCenter: [number, number] = [106.8456, -6.2088]; // Jakarta center default

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      const initialCenter: [number, number] =
        lat !== null && lng !== null ? [lng, lat] : defaultCenter;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/thurarchive/cmqjjl7lo001q01qp8ln5c0e3',
        center: initialCenter,
        zoom: lat !== null && lng !== null ? 13 : 9,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

      // Create marker element with SVG pin icon
      const el = document.createElement('div');
      el.className = 'custom-map-pin-wrapper';
      el.innerHTML = `
        <div style="
          cursor: grab;
          filter: drop-shadow(0 4px 12px rgba(14, 165, 233, 0.6));
          transition: transform 0.15s ease;
        ">
          <svg width="22" height="24" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="url(#oceaniq-marker-grad)"/>
            <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12C1.5 19.8 11.2 29.7 12 30.5C12.8 29.7 22.5 19.8 22.5 12C22.5 6.2 17.8 1.5 12 1.5Z" stroke="#ffffff" stroke-width="1" stroke-opacity="0.6"/>
            <circle cx="12" cy="11" r="4.5" fill="#ffffff"/>
            <defs>
              <linearGradient id="oceaniq-marker-grad" x1="0" y1="0" x2="24" y2="32" gradientUnits="userSpaceOnUse">
                <stop stop-color="#38bdf8"/>
                <stop offset="0.5" stop-color="#0ea5e9"/>
                <stop offset="1" stop-color="#0284c7"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: el, draggable: true, anchor: 'bottom' })
        .setLngLat(initialCenter)
        .addTo(map);

      markerRef.current = marker;

      const handleDragEnd = () => {
        const lngLat = marker.getLngLat();
        onLocationSelect(Number(lngLat.lat.toFixed(6)), Number(lngLat.lng.toFixed(6)));
      };

      marker.on('dragend', handleDragEnd);

      map.on('click', (e) => {
        const { lat: clickedLat, lng: clickedLng } = e.lngLat;
        marker.setLngLat([clickedLng, clickedLat]);
        onLocationSelect(Number(clickedLat.toFixed(6)), Number(clickedLng.toFixed(6)));
      });

      mapRef.current = map;

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (err) {
      console.error('Error initializing location map:', err);
    }
  }, []);

  // Update marker position if lat/lng props change externally
  useEffect(() => {
    if (markerRef.current && lat !== null && lng !== null) {
      const currentPos = markerRef.current.getLngLat();
      if (Math.abs(currentPos.lat - lat) > 0.0001 || Math.abs(currentPos.lng - lng) > 0.0001) {
        markerRef.current.setLngLat([lng, lat]);
        if (mapRef.current) {
          mapRef.current.flyTo({ center: [lng, lat], zoom: 14, essential: true });
        }
      }
    }
  }, [lat, lng]);

  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = Number(pos.coords.latitude.toFixed(6));
        const userLng = Number(pos.coords.longitude.toFixed(6));
        onLocationSelect(userLat, userLng);
        if (markerRef.current) {
          markerRef.current.setLngLat([userLng, userLat]);
        }
        if (mapRef.current) {
          mapRef.current.flyTo({ center: [userLng, userLat], zoom: 14, essential: true });
        }
        setDetecting(false);
        toast.success('Location detected!');
      },
      (err) => {
        console.error(err);
        setDetecting(false);
        toast.error('Could not detect location. Please tap on the map to set your pin.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-border/70 shadow-inner group">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating GPS button */}
      <button
        type="button"
        onClick={handleGPSDetect}
        disabled={detecting}
        className="absolute top-3 right-3 bg-card/90 hover:bg-card backdrop-blur-md border border-border text-foreground text-xs font-semibold px-3 py-2 rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer z-10"
      >
        {detecting ? (
          <Loader2 size={13} className="animate-spin text-primary" />
        ) : (
          <Navigation size={13} className="text-primary" />
        )}
        <span>{detecting ? 'Detecting…' : 'Use Current GPS'}</span>
      </button>

      {/* Helper overlay bar at bottom */}
      <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-xl flex items-center justify-between pointer-events-none z-10">
        <span className="flex items-center gap-1">
          <MapPin size={12} className="text-primary animate-bounce" />
          Click on map or drag pin to drop location
        </span>
        <span className="font-mono text-[10px] opacity-80">
          {lat !== null && lng !== null ? `${lat.toFixed(4)}°, ${lng.toFixed(4)}°` : 'No pin set'}
        </span>
      </div>
    </div>
  );
}
