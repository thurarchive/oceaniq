"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ZONES } from "@/constants/zones";
import { MapLayer } from "./LayerPanel";
import MapPointDetail from "./MapPointDetail";
import MapLegend from "./MapLegend";
import MapStationDetail, { SelectedStationData } from "./MapStationDetail";
import { useWasteObservations } from "../hooks/useWasteObservations";
import { useWeatherStations } from "../hooks/useWeatherStations";
import { MapPoint } from "./mockPoints";
import { Brain } from "lucide-react";
import { toast } from "sonner";

export type BasemapType = "ocean-dark" | "satellite" | "topographic";

type MapCanvasProps = {
  activeBasemap: BasemapType;
  selectedZone?: string;
  layers: MapLayer[];
  selectedCategories: string[];
  selectedTimeRanges: string[];
  selectedAreas: string[];
  confidenceMin: number;
  initialCenter?: [number, number];
  initialZoom?: number;
  refreshTrigger?: number;
  isExperimental?: boolean;
};

const MAPBOX_STYLES: Record<BasemapType, string> = {
  "ocean-dark": "mapbox://styles/thurarchive/cmqjjl7lo001q01qp8ln5c0e3",
  "satellite": "mapbox://styles/mapbox/satellite-streets-v12",
  "topographic": "mapbox://styles/mapbox/outdoors-v12",
};

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
mapboxgl.accessToken = MAPBOX_API_KEY;

// Haversine formula to compute distance in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Generate circular polygon coordinate ring representing specified radius (km)
const createGeoJSONCircle = (center: [number, number], radiusKm: number, points = 64): GeoJSON.Position[][] => {
  const [longitude, latitude] = center;
  const coords: GeoJSON.Position[] = [];
  const kmPerDegreeLat = 111.1; // approximate km per degree latitude

  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 360;
    const angleRad = (angle * Math.PI) / 180;
    const latRad = (latitude * Math.PI) / 180;

    // Offset latitude and longitude
    const offsetLat = (radiusKm * Math.cos(angleRad)) / kmPerDegreeLat;
    const offsetLng = (radiusKm * Math.sin(angleRad)) / (kmPerDegreeLat * Math.cos(latRad));

    coords.push([longitude + offsetLng, latitude + offsetLat]);
  }
  coords.push(coords[0]); // Close the polygon
  return [coords];
};

// Generate GeoJSON polygons for monitoring zones based on coordinates list
const zoneGeojson: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: ZONES.filter((z) => z.name !== "All Zones").map((z) => {
    const [lng, lat] = z.center;
    const offset = z.offset ?? 0.04;
    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [lng - offset, lat - offset],
            [lng + offset, lat - offset],
            [lng + offset, lat + offset],
            [lng - offset, lat + offset],
            [lng - offset, lat - offset],
          ],
        ],
      },
      properties: {
        name: z.name,
      },
    };
  }),
};

export default function MapCanvasMapbox({
  activeBasemap,
  selectedZone = "All Zones",
  layers,
  selectedCategories,
  selectedTimeRanges,
  selectedAreas,
  confidenceMin,
  initialCenter = [117.5400, -2.5000],
  initialZoom = 4.5,
  refreshTrigger = 0,
  isExperimental = false,
}: MapCanvasProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [selectedStation, setSelectedStation] = useState<SelectedStationData | null>(null);

  const [customPredictionPoint, setCustomPredictionPoint] = useState<MapPoint | null>(null);
  const [predictingCoords, setPredictingCoords] = useState<{ lat: number; lng: number } | null>(null);

  const isExperimentalRef = useRef<boolean>(isExperimental);
  useEffect(() => {
    isExperimentalRef.current = isExperimental;
    if (!isExperimental) {
      setCustomPredictionPoint(null);
      if (selectedPoint?.id.startsWith("ml-custom-")) {
        setSelectedPoint(null);
      }
    }
    if (mapRef.current && isClient) {
      const map = mapRef.current;
      if (map.isStyleLoaded()) {
        updateVisibility(map);
      } else {
        map.once("idle", () => updateVisibility(map));
      }
    }
  }, [isExperimental, selectedPoint, isClient]);

  const triggerCustomPrediction = async (lat: number, lng: number) => {
    const verifiedStations = points.filter((p) => p.type === "observation");
    if (verifiedStations.length > 0) {
      let minDistance = Infinity;
      verifiedStations.forEach((station) => {
        const dist = calculateDistance(lat, lng, station.lat, station.lng);
        if (dist < minDistance) {
          minDistance = dist;
        }
      });

      const PREDICTION_THRESHOLD_KM = 5.0; // 5 km threshold
      if (minDistance > PREDICTION_THRESHOLD_KM) {
        toast.warning("Clicked coordinate is too far from a monitored station. Please click closer to a station for a reliable estimate.");
        return;
      }
    }

    setPredictingCoords({ lat, lng });
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat,
          lng,
          weather: "Clear",
          tides: "High",
          msl: 1.0,
          tides_in_number: 1.0,
        }),
      });

      const result = await response.json();
      if (result.error) {
        console.error("Prediction failed:", result.error);
        return;
      }

      const density = result.predicted_density;
      let intensity: "critical" | "high" | "medium" | "low" = "low";
      if (density > 1000) intensity = "critical";
      else if (density > 500) intensity = "high";
      else if (density > 200) intensity = "medium";

      const customPoint: MapPoint = {
        id: `ml-custom-${Date.now()}`,
        type: "ml",
        intensity,
        zone: `Custom Coordinate (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        lat,
        lng,
        wasteDensity: density,
        wasteCategory: "Model Estimate",
        confidence: 85,
        source: `ML Subprocess (Closest: ${result.closest_station.name})`,
        timestamp: new Date().toISOString(),
        moderationStatus: "ML Simulation",
        description: `Dynamic estimate computed by XGBoost subprocess. Closest historical baseline station used: ${result.closest_station.name} (${(result.closest_station.distance_degrees * 111).toFixed(1)} km away).`
      };

      setCustomPredictionPoint(customPoint);
      setSelectedPoint(customPoint);
    } catch (err) {
      console.error("Failed to fetch prediction:", err);
    } finally {
      setPredictingCoords(null);
    }
  };

  // Invoke custom data fetching hooks
  const { points } = useWasteObservations(refreshTrigger, isExperimental);
  const { weatherStationsData } = useWeatherStations(refreshTrigger);

  const circleGeojsonRef = useRef<GeoJSON.FeatureCollection>({ type: "FeatureCollection", features: [] });
  const mlGeojsonRef = useRef<GeoJSON.FeatureCollection>({ type: "FeatureCollection", features: [] });
  const bufferGeojsonRef = useRef<GeoJSON.FeatureCollection>({ type: "FeatureCollection", features: [] });

  // React Ref to handle the Mapbox event listener stale closure bug
  const weatherStationsDataRef = useRef<SelectedStationData[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Synchronize Ref with the weather state
  useEffect(() => {
    weatherStationsDataRef.current = weatherStationsData;
  }, [weatherStationsData]);

  // React Ref to handle the Mapbox layers/state sync stale closure bug
  const layersRef = useRef<MapLayer[]>(layers);
  useEffect(() => {
    layersRef.current = layers;
  }, [layers]);

  // Construct weather stations GeoJSON dynamically using Ref to avoid stale closures
  const getWeatherStationsGeojson = (): GeoJSON.FeatureCollection => {
    return {
      type: "FeatureCollection",
      features: weatherStationsDataRef.current.map(ws => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [ws.lng, ws.lat]
        },
        properties: {
          name: ws.name,
          databaseStationName: ws.databaseStationName,
          temp: ws.temp,
          precip: ws.precip,
          weatherCode: ws.weatherCode,
          accumulatedRainfall3d: ws.accumulatedRainfall3d,
          correlationCoefficient: ws.correlationCoefficient,
        }
      }))
    };
  };

  const updateVisibility = (mapInstance?: mapboxgl.Map) => {
    const map = mapInstance || mapRef.current;
    if (!map) return;

    const currentLayers = layersRef.current;
    const isObsActive = currentLayers.find((l) => l.id === "layer-observations")?.active ?? true;
    const isCitizenActive = currentLayers.find((l) => l.id === "layer-citizen")?.active ?? true;
    const isMlActive = currentLayers.find((l) => l.id === "layer-ml")?.active ?? true;
    const isZonesActive = currentLayers.find((l) => l.id === "layer-zones")?.active ?? true;
    const isRainfallActive = currentLayers.find((l) => l.id === "layer-rainfall")?.active ?? false;

    if (map.getLayer("waste-circles-observation")) {
      map.setLayoutProperty("waste-circles-observation", "visibility", isObsActive ? "visible" : "none");
    }
    if (map.getLayer("waste-circles-citizen")) {
      map.setLayoutProperty("waste-circles-citizen", "visibility", isCitizenActive ? "visible" : "none");
    }
    if (map.getLayer("waste-heatmap-ml")) {
      map.setLayoutProperty("waste-heatmap-ml", "visibility", isMlActive ? "visible" : "none");
    }
    if (map.getLayer("monitoring-zones-fill")) {
      map.setLayoutProperty("monitoring-zones-fill", "visibility", isZonesActive ? "visible" : "none");
    }
    if (map.getLayer("monitoring-zones-outline")) {
      map.setLayoutProperty("monitoring-zones-outline", "visibility", isZonesActive ? "visible" : "none");
    }
    if (map.getLayer("weather-stations-circles")) {
      map.setLayoutProperty("weather-stations-circles", "visibility", isRainfallActive ? "visible" : "none");
    }
    if (map.getLayer("weather-stations-labels")) {
      map.setLayoutProperty("weather-stations-labels", "visibility", isRainfallActive ? "visible" : "none");
    }
    if (map.getLayer("weather-stations-buffer")) {
      map.setLayoutProperty("weather-stations-buffer", "visibility", isRainfallActive ? "visible" : "none");
    }
    if (map.getLayer("prediction-buffer-fill")) {
      map.setLayoutProperty("prediction-buffer-fill", "visibility", isExperimental ? "visible" : "none");
    }
    if (map.getLayer("prediction-buffer-line")) {
      map.setLayoutProperty("prediction-buffer-line", "visibility", isExperimental ? "visible" : "none");
    }
  };

  // Reusable helper to set up Mapbox custom sources & layers
  const setupLayers = (map: mapboxgl.Map) => {
    // 1. Add Sources
    if (!map.getSource("waste-points-source")) {
      map.addSource("waste-points-source", {
        type: "geojson",
        data: circleGeojsonRef.current,
      });
    }
    if (!map.getSource("ml-estimates-source")) {
      map.addSource("ml-estimates-source", {
        type: "geojson",
        data: mlGeojsonRef.current,
      });
    }
    if (!map.getSource("monitoring-zones-source")) {
      map.addSource("monitoring-zones-source", {
        type: "geojson",
        data: zoneGeojson,
      });
    }
    if (!map.getSource("weather-stations-source")) {
      map.addSource("weather-stations-source", {
        type: "geojson",
        data: getWeatherStationsGeojson(),
      });
    }
    if (!map.getSource("prediction-buffer-source")) {
      map.addSource("prediction-buffer-source", {
        type: "geojson",
        data: bufferGeojsonRef.current,
      });
    }

    // 2. Add Monitoring Zones Layers (Polygons)
    if (!map.getLayer("monitoring-zones-fill")) {
      map.addLayer({
        id: "monitoring-zones-fill",
        type: "fill",
        source: "monitoring-zones-source",
        paint: {
          "fill-color": "#0ea5e9",
          "fill-opacity": 0.02,
        },
      });
    }
    if (!map.getLayer("monitoring-zones-outline")) {
      map.addLayer({
        id: "monitoring-zones-outline",
        type: "line",
        source: "monitoring-zones-source",
        paint: {
          "line-color": "#0ea5e9",
          "line-width": 1.5,
          "line-dasharray": [3, 2],
        },
      });
    }

    // Prediction Buffer Layers
    if (!map.getLayer("prediction-buffer-fill")) {
      map.addLayer({
        id: "prediction-buffer-fill",
        type: "fill",
        source: "prediction-buffer-source",
        paint: {
          "fill-color": "#10b981",
          "fill-opacity": 0.08,
        },
      });
    }
    if (!map.getLayer("prediction-buffer-line")) {
      map.addLayer({
        id: "prediction-buffer-line",
        type: "line",
        source: "prediction-buffer-source",
        paint: {
          "line-color": "#10b981",
          "line-width": 1.5,
          "line-dasharray": [3, 3],
          "line-opacity": 0.35,
        },
      });
    }

    // 3. Add Heatmap Layer for ML Estimates
    if (!map.getLayer("waste-heatmap-ml")) {
      map.addLayer({
        id: "waste-heatmap-ml",
        type: "heatmap",
        source: "ml-estimates-source",
        paint: {
          "heatmap-weight": ["interpolate", ["linear"], ["get", "wasteDensity"], 0, 0, 80, 1],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(16, 185, 129, 0)",
            0.2, "rgba(16, 185, 129, 0.4)",
            0.6, "rgba(245, 158, 11, 0.7)",
            1.0, "rgba(239, 68, 68, 0.85)",
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 5, 9, 20],
          "heatmap-opacity": 0.75,
        },
      });
    }

    // 4. Add Circles for Verified Observations
    if (!map.getLayer("waste-circles-observation")) {
      map.addLayer({
        id: "waste-circles-observation",
        type: "circle",
        source: "waste-points-source",
        filter: ["==", ["get", "type"], "observation"],
        paint: {
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "wasteDensity"],
            0, "#0ea5e9",
            20, "#f59e0b",
            50, "#ea580c",
            80, "#ef4444",
          ],
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 4, 15, 12],
          "circle-opacity": 0.85,
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#ffffff",
        },
      });
    }

    // 5. Add Circles for Citizen Reports
    if (!map.getLayer("waste-circles-citizen")) {
      map.addLayer({
        id: "waste-circles-citizen",
        type: "circle",
        source: "waste-points-source",
        filter: ["==", ["get", "type"], "citizen"],
        paint: {
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "wasteDensity"],
            0, "#0ea5e9",
            20, "#f59e0b",
            50, "#ea580c",
            80, "#ef4444",
          ],
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 4, 15, 12],
          "circle-opacity": 0.85,
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#ffffff",
        },
      });
    }

    // 6. Add Weather Station Layers
    if (!map.getLayer("weather-stations-buffer")) {
      map.addLayer({
        id: "weather-stations-buffer",
        type: "circle",
        source: "weather-stations-source",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["coalesce", ["get", "accumulatedRainfall3d"], 0],
            0, 15,
            10, 30,
            50, 60,
            100, 100
          ],
          "circle-color": "#3b82f6",
          "circle-opacity": 0.12,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#3b82f6",
          "circle-stroke-opacity": 0.25,
        }
      });
    }

    if (!map.getLayer("weather-stations-circles")) {
      map.addLayer({
        id: "weather-stations-circles",
        type: "circle",
        source: "weather-stations-source",
        paint: {
          "circle-color": "#06b6d4",
          "circle-radius": 7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        }
      });
    }

    if (!map.getLayer("weather-stations-labels")) {
      map.addLayer({
        id: "weather-stations-labels",
        type: "symbol",
        source: "weather-stations-source",
        layout: {
          "text-field": [
            "concat",
            ["get", "databaseStationName"],
            " Station: ",
            ["coalesce", ["get", "accumulatedRainfall3d"], 0],
            " mm"
          ],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1.8],
          "text-anchor": "top",
          "text-size": 11,
        },
        paint: {
          "text-color": "#38bdf8",
          "text-halo-color": "#090d16",
          "text-halo-width": 1.5,
        }
      });
    }

    // Click handler for waste points popup
    const handleFeatureClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (e.features && e.features[0]) {
        const props = e.features[0].properties;
        if (!props) return;
        setSelectedPoint({
          id: props.id,
          type: props.type,
          intensity: props.intensity,
          zone: props.zone,
          lat: Number(props.lat),
          lng: Number(props.lng),
          wasteDensity: Number(props.wasteDensity),
          wasteCategory: props.wasteCategory,
          confidence: Number(props.confidence),
          source: props.source,
          timestamp: props.timestamp,
          moderationStatus: props.moderationStatus,
          description: props.description,
          clusterCount: props.clusterCount ? Number(props.clusterCount) : undefined,
        });
        setSelectedStation(null);
      }
    };

    // Click handler for Weather Stations (reads from REF to avoid stale React closures)
    const handleStationClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (e.features && e.features[0]) {
        const props = e.features[0].properties;
        if (!props) return;
        const match = weatherStationsDataRef.current.find(ws => ws.name === props.name);
        if (match) {
          setSelectedStation(match);
          setSelectedPoint(null);
        }
      }
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", "waste-circles-observation", handleFeatureClick);
    map.on("click", "waste-circles-citizen", handleFeatureClick);
    map.on("click", "weather-stations-circles", handleStationClick);

    map.on("mouseenter", "waste-circles-observation", handleMouseEnter);
    map.on("mouseleave", "waste-circles-observation", handleMouseLeave);
    map.on("mouseenter", "waste-circles-citizen", handleMouseEnter);
    map.on("mouseleave", "waste-circles-citizen", handleMouseLeave);
    map.on("mouseenter", "weather-stations-circles", handleMouseEnter);
    map.on("mouseleave", "weather-stations-circles", handleMouseLeave);

    // Close popups when clicking map background
    map.on("click", (e) => {
      const clickPoints = map.queryRenderedFeatures(e.point, {
        layers: ["waste-circles-observation", "waste-circles-citizen", "weather-stations-circles"],
      });
      if (!clickPoints || clickPoints.length === 0) {
        setSelectedPoint(null);
        setSelectedStation(null);

        if (isExperimentalRef.current) {
          const { lng, lat } = e.lngLat;
          triggerCustomPrediction(lat, lng);
        }
      }
    });

    updateVisibility(map);
  };

  // INITIALIZATION: Run once on mount
  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapRef.current) return;

    if (!MAPBOX_API_KEY) {
      console.error("MapCanvas: NEXT_PUBLIC_MAPBOX_TOKEN is not set in env configuration");
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

      map.addControl(new mapboxgl.NavigationControl(), "bottom-left");

      map.on("load", () => {
        setupLayers(map);
      });

      map.on("style.load", () => {
        setupLayers(map);
      });

      mapRef.current = map;

      const resizeObserver = new ResizeObserver(() => {
        map.resize();
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        resizeObserver.disconnect();
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (error) {
      console.error("MapCanvas: Failed to initialize MapboxGL map instance", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  // Update weather stations source when data state changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const setWeatherSourceData = () => {
      const source = map.getSource("weather-stations-source") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(getWeatherStationsGeojson());
      }
    };

    if (map.isStyleLoaded()) {
      setWeatherSourceData();
    } else {
      map.once("idle", setWeatherSourceData);
    }
  }, [weatherStationsData]);

  // FLY TO SELECTED ZONE: Triggered whenever selected zone changes
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
      } else {
        const matchPoint = points.find((p) => p.zone === selectedZone);
        if (matchPoint) {
          mapRef.current.flyTo({
            center: [matchPoint.lng, matchPoint.lat],
            zoom: 12.0,
            essential: true,
            duration: 2000,
          });
        }
      }
    }
  }, [selectedZone, isClient, points]);

  // BASEMAP UPDATE
  useEffect(() => {
    if (mapRef.current && isClient) {
      mapRef.current.setStyle(MAPBOX_STYLES[activeBasemap]);
    }
  }, [activeBasemap, isClient]);

  // REACTIVE DATA UPDATE & FILTERING
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const allPoints = customPredictionPoint ? [...points, customPredictionPoint] : points;
    const filtered = allPoints.filter((p) => {
      if (selectedCategories && selectedCategories.length > 0) {
        const matchesSomeCat = selectedCategories.some((cat) => {
          const catLower = cat.toLowerCase();
          const pCat = p.wasteCategory.toLowerCase();
          if (catLower === "plastic" && pCat.includes("plastic")) return true;
          if (catLower === "organic" && pCat.includes("organic")) return true;
          if (catLower === "fishing_gear" && (pCat.includes("fishing") || pCat.includes("gear"))) return true;
          if (catLower === "mixed" && (pCat.includes("mixed") || pCat.includes("multi"))) return true;
          if (catLower === "hazardous" && pCat.includes("hazardous")) return true;
          return false;
        });
        if (!matchesSomeCat) return false;
      }

      if (selectedAreas && selectedAreas.length > 0) {
        const matchesSomeArea = selectedAreas.some((area) => {
          const zone = ZONES.find(z => z.name.toLowerCase().replace(/\s+/g, '_') === area);
          if (zone) {
            const [zLng, zLat] = zone.center;
            const offset = zone.offset ?? 0.04;
            const inside = p.lng >= zLng - offset && p.lng <= zLng + offset &&
              p.lat >= zLat - offset && p.lat <= zLat + offset;
            if (inside) return true;
          }
          const areaMatch = area.replace(/_/g, " ").toLowerCase();
          const zoneMatch = p.zone.toLowerCase();
          return zoneMatch.includes(areaMatch) || areaMatch.includes(zoneMatch);
        });
        if (!matchesSomeArea) return false;
      }

      if (p.type === "ml" && p.confidence < confidenceMin) return false;

      if (selectedTimeRanges && selectedTimeRanges.length > 0) {
        const rawTimestamp = p.timestamp ? p.timestamp.trim().replace(" ", "T") : "";
        const pDate = new Date(rawTimestamp);
        const now = new Date("2026-06-22T20:47:22+07:00");
        const diffTime = Math.abs(now.getTime() - pDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const matchesSomeRange = selectedTimeRanges.some((range) => {
          if (range === "all") return true;
          if (range === "7d" && diffDays <= 7) return true;
          if (range === "30d" && diffDays <= 30) return true;
          if (range === "90d" && diffDays <= 90) return true;
          if (range === "1y" && diffDays <= 365) return true;
          return false;
        });
        if (!matchesSomeRange) return false;
      }

      return true;
    });

    const makeFeature = (p: MapPoint) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [p.lng, p.lat],
      },
      properties: {
        ...p,
      },
    });

    const circlePoints = filtered.filter((p) => p.type === "observation" || p.type === "citizen");
    const mlPoints = filtered.filter((p) => p.type === "ml");

    // De-duplicate verified stations by coordinates to draw buffer zones only once per station location
    const verifiedStations = points.filter((p) => p.type === "observation");
    const uniqueStations: MapPoint[] = [];
    const seenStations = new Set<string>();
    for (const p of verifiedStations) {
      const stationKey = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
      if (!seenStations.has(stationKey)) {
        seenStations.add(stationKey);
        uniqueStations.push(p);
      }
    }

    const bufferGeojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: uniqueStations.map((station) => ({
        type: "Feature" as const,
        geometry: {
          type: "Polygon" as const,
          coordinates: createGeoJSONCircle([station.lng, station.lat], 5.0), // 5km prediction threshold radius
        },
        properties: {
          id: station.id,
          name: station.zone,
        },
      })),
    };

    const circleGeojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: circlePoints.map(makeFeature),
    };

    const mlGeojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: mlPoints.map(makeFeature),
    };

    circleGeojsonRef.current = circleGeojson;
    mlGeojsonRef.current = mlGeojson;
    bufferGeojsonRef.current = bufferGeojson;

    const setSourceData = () => {
      const circSource = map.getSource("waste-points-source") as mapboxgl.GeoJSONSource;
      if (circSource) circSource.setData(circleGeojson);

      const mlSource = map.getSource("ml-estimates-source") as mapboxgl.GeoJSONSource;
      if (mlSource) mlSource.setData(mlGeojson);

      const bufSource = map.getSource("prediction-buffer-source") as mapboxgl.GeoJSONSource;
      if (bufSource) bufSource.setData(bufferGeojson);
    };

    if (map.isStyleLoaded()) {
      setSourceData();
    } else {
      map.once("idle", setSourceData);
    }
  }, [points, customPredictionPoint, selectedCategories, selectedTimeRanges, selectedAreas, confidenceMin, isExperimental]);

  // Focus on map point from URL search parameters on load
  useEffect(() => {
    if (!mapRef.current || points.length === 0) return;
    const map = mapRef.current;

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const focusId = params.get("id");
      const latParam = params.get("lat");
      const lngParam = params.get("lng");

      if (focusId) {
        const match = points.find((p) => p.id === focusId);
        if (match) {
          map.flyTo({ center: [match.lng, match.lat], zoom: 10 });
          setSelectedPoint(match);
        }
      } else if (latParam && lngParam) {
        const lat = parseFloat(latParam);
        const lng = parseFloat(lngParam);
        if (!isNaN(lat) && !isNaN(lng)) {
          map.flyTo({ center: [lng, lat], zoom: 10 });
        }
      }
    }
  }, [points]);

  // TOGGLE VISIBILITY FOR ACTIVE LAYERS
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (map.isStyleLoaded()) {
      updateVisibility(map);
    } else {
      map.once("idle", () => updateVisibility(map));
    }
  }, [layers]);

  return (
    <div className="flex-1 h-full relative overflow-hidden">
      <div id="map" ref={mapContainerRef} className="w-full h-full" />

      {/* Experimental mode banner */}
      {isExperimental && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-warning/95 text-warning-foreground text-[11px] font-bold px-4 py-2 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-warning/30 backdrop-blur-md z-20 flex items-center gap-1.5">
          <Brain size={13} className="shrink-0 animate-pulse text-warning-foreground" />
          <span>EXPERIMENTAL MODE: Live ML Inference Active. Click anywhere on map to run prediction.</span>
        </div>
      )}

      {/* Loading overlay when running python inference */}
      {predictingCoords && (
        <div className="absolute bottom-16 right-4 bg-card/90 border border-border text-foreground px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-20 text-xs font-medium backdrop-blur-md">
          <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Executing XGBoost Subprocess...</span>
        </div>
      )}

      {/* Point Detail Popup */}
      {selectedPoint && (
        <MapPointDetail point={selectedPoint} onClose={() => setSelectedPoint(null)} />
      )}

      {/* Station Detail Popup */}
      {selectedStation && !selectedPoint && (
        <MapStationDetail station={selectedStation} onClose={() => setSelectedStation(null)} />
      )}

      <MapLegend />
    </div>
  );
}