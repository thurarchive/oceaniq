"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ZONES } from "@/constants/zones";
import { supabase } from "@/lib/supabase";
import { mockPoints, MapPoint } from "./mockPoints";
import { MapLayer } from "./LayerPanel";
import MapPointDetail from "./MapPointDetail";
// import MapLegend from "./MapLegend";

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
};

const MAPBOX_STYLES: Record<BasemapType, string> = {
  "ocean-dark": "mapbox://styles/thurarchive/cmqjjl7lo001q01qp8ln5c0e3",
  "satellite": "mapbox://styles/mapbox/satellite-streets-v12",
  "topographic": "mapbox://styles/mapbox/outdoors-v12",
};

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
mapboxgl.accessToken = MAPBOX_API_KEY;

// Generate GeoJSON polygons for monitoring zones based on coordinates list
const zoneGeojson: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: ZONES.filter((z) => z.name !== "All Zones").map((z) => {
    const [lng, lat] = z.center;
    const offset = z.offset ?? 0.04; // Outer boundary size
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
}: MapCanvasProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [points, setPoints] = useState<MapPoint[]>([]);

  const circleGeojsonRef = useRef<GeoJSON.FeatureCollection>({ type: "FeatureCollection", features: [] });
  const mlGeojsonRef = useRef<GeoJSON.FeatureCollection>({ type: "FeatureCollection", features: [] });

  //Fix map resize issue
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  interface WasteObservationRow {
    id: string;
    lat: number | null;
    lng: number | null;
    site_id: string | number | null;
    site_name: string | null;
    observation_time: string | null;
    debris_coverage_m2: number | null;
    debris_quantity: number | null;
    plastic_pct: number | null;
    organic_pct: number | null;
    plastic_quantity: number | null;
    organic_quantity: number | null;
    weather: string | null;
    tides: string | null;
    msl: number | null;
    compact_coverage_m2: number | null;
    compact_pct: number | null;
    scatter_coverage_m2: number | null;
    scatter_pct: number | null;
    approx_moving_debris: number | null;
    approx_stuck_debris: number | null;
  }

  // Fetch observation points from Supabase on mount (fall back to mock baseline data on error)
  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from("waste_observations")
          .select("*");

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: MapPoint[] = data.map((item: WasteObservationRow) => {
            // Waste Density from debris_coverage_m2 or debris_quantity fallback
            const density = item.debris_coverage_m2 ?? item.debris_quantity ?? 0.0;

            // Intensity classification based on density threshold values
            let intensity: "critical" | "high" | "medium" | "low" = "low";
            if (density > 80) intensity = "critical";
            else if (density > 45) intensity = "high";
            else if (density > 10) intensity = "medium";

            // Category classification derived from plastic_pct & organic_pct breakdown
            let category = "Mixed Debris";
            if (item.plastic_pct !== null && item.organic_pct !== null) {
              if (item.plastic_pct > 70) category = "Plastic-dominant";
              else if (item.organic_pct > 70) category = "Organic-dominant";
              else if (item.plastic_pct > 0 || item.organic_pct > 0) {
                category = `Mixed (${Math.round(item.plastic_pct)}% Plastic, ${Math.round(item.organic_pct)}% Organic)`;
              }
            } else if (item.plastic_quantity !== null || item.organic_quantity !== null) {
              const plastic = item.plastic_quantity ?? 0;
              const organic = item.organic_quantity ?? 0;
              const total = plastic + organic;
              if (total > 0) {
                const pPct = (plastic / total) * 100;
                const oPct = (organic / total) * 100;
                if (pPct > 70) category = "Plastic-dominant";
                else if (oPct > 70) category = "Organic-dominant";
                else category = `Mixed (${Math.round(pPct)}% Plastic, ${Math.round(oPct)}% Organic)`;
              }
            }

            // Description generated dynamically from weather, tides, and coverage parameters
            let desc = "";
            if (item.weather) desc += `Weather: ${item.weather}. `;
            if (item.tides) desc += `Tides: ${item.tides} (MSL: ${item.msl ?? 0}m). `;
            if (item.compact_coverage_m2 !== null && item.compact_coverage_m2 > 0) {
              desc += `Compact coverage: ${item.compact_coverage_m2}m² (${Math.round(item.compact_pct ?? 0)}%). `;
            }
            if (item.scatter_coverage_m2 !== null && item.scatter_coverage_m2 > 0) {
              desc += `Scatter coverage: ${item.scatter_coverage_m2}m² (${Math.round(item.scatter_pct ?? 0)}%). `;
            }
            if (item.approx_moving_debris !== null || item.approx_stuck_debris !== null) {
              desc += `Debris: ${item.approx_moving_debris ?? 0} moving, ${item.approx_stuck_debris ?? 0} stuck. `;
            }
            if (!desc) {
              desc = "Official survey record at location.";
            }

            return {
              id: item.id,
              type: "observation", // Official observation category
              intensity,
              zone: item.site_name || "Unnamed Station",
              lat: item.lat ?? 0.0,
              lng: item.lng ?? 0.0,
              wasteDensity: density,
              wasteCategory: category,
              confidence: 100, // Verified observations have maximum confidence
              source: `Official Station #${item.site_id ?? "Unknown"}`,
              timestamp: item.observation_time || new Date().toISOString(),
              moderationStatus: "Verified",
              description: desc,
              clusterCount: undefined,
            };
          });

          // Merge with mock citizen and ml points to keep other interactive demo layers active
          const citizenAndMlMocks = mockPoints.filter((p) => p.type === "citizen" || p.type === "ml");
          setPoints([...mapped, ...citizenAndMlMocks]);
        } else {
          setPoints(mockPoints);
        }
      } catch (err) {
        console.warn("Failed to load waste points from Supabase, falling back to mock points. Error details:", err);
        setPoints(mockPoints);
      }
    }
    loadData();
  }, [refreshTrigger]);

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

    // Click handler helper for popup detail card
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
      }
    };

    // Hover cursor helpers
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", "waste-circles-observation", handleFeatureClick);
    map.on("click", "waste-circles-citizen", handleFeatureClick);

    // Close panel when clicking anywhere on the map that is NOT a waste point
    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["waste-circles-observation", "waste-circles-citizen"],
      });
      if (!features || features.length === 0) {
        setSelectedPoint(null);
      }
    });

    map.on("mouseenter", "waste-circles-observation", handleMouseEnter);
    map.on("mouseleave", "waste-circles-observation", handleMouseLeave);
    map.on("mouseenter", "waste-circles-citizen", handleMouseEnter);
    map.on("mouseleave", "waste-circles-citizen", handleMouseLeave);

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

  // FLY TO SELECTED ZONE: Triggered whenever selected zone changes
  useEffect(() => {
    if (mapRef.current && isClient && selectedZone) {
      // 1. Try to find in predefined ZONES first
      const zoneData = ZONES.find((z) => z.name === selectedZone);
      if (zoneData) {
        mapRef.current.flyTo({
          center: zoneData.center,
          zoom: zoneData.zoom,
          essential: true,
          duration: 2000,
        });
      } else {
        // 2. Try to find in loaded database points (site names)
        const matchPoint = points.find((p) => p.zone === selectedZone);
        if (matchPoint) {
          mapRef.current.flyTo({
            center: [matchPoint.lng, matchPoint.lat],
            zoom: 12.0, // A nice close-up zoom for a specific site
            essential: true,
            duration: 2000,
          });
        }
      }
    }
  }, [selectedZone, isClient, points]);

  // BASMAP UPDATE: Re-render layout on base layers update
  useEffect(() => {
    if (mapRef.current && isClient) {
      mapRef.current.setStyle(MAPBOX_STYLES[activeBasemap]);
    }
  }, [activeBasemap, isClient]);

  // REACTIVE DATA UPDATE & FILTERING
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Apply active filters on datasets
    const filtered = points.filter((p) => {
      // 1. Category Filter
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

      // 2. Area Filter
      if (selectedAreas && selectedAreas.length > 0) {
        const matchesSomeArea = selectedAreas.some((area) => {
          // A: Geographic Bounding Box Check if it matches an official zone name
          const zone = ZONES.find(z => z.name.toLowerCase().replace(/\s+/g, '_') === area);
          if (zone) {
            const [zLng, zLat] = zone.center;
            const offset = zone.offset ?? 0.04;
            const inside = p.lng >= zLng - offset && p.lng <= zLng + offset &&
              p.lat >= zLat - offset && p.lat <= zLat + offset;
            if (inside) return true;
          }

          // B: Fallback string match on site name / zone name
          const areaMatch = area.replace(/_/g, " ").toLowerCase();
          const zoneMatch = p.zone.toLowerCase();
          return zoneMatch.includes(areaMatch) || areaMatch.includes(zoneMatch);
        });
        if (!matchesSomeArea) return false;
      }

      // 3. Confidence Filter (ML estimates only)
      if (p.type === "ml" && p.confidence < confidenceMin) return false;

      // 4. Time Range Filter
      if (selectedTimeRanges && selectedTimeRanges.length > 0) {
        const rawTimestamp = p.timestamp ? p.timestamp.trim().replace(" ", "T") : "";
        const pDate = new Date(rawTimestamp);
        const now = new Date("2026-06-22T20:47:22+07:00"); // Base reference time
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

    const circleGeojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: circlePoints.map(makeFeature),
    };

    const mlGeojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: mlPoints.map(makeFeature),
    };

    // Keep state values in refs so style.load can fetch them instantly
    circleGeojsonRef.current = circleGeojson;
    mlGeojsonRef.current = mlGeojson;

    const setSourceData = () => {
      const circSource = map.getSource("waste-points-source") as mapboxgl.GeoJSONSource;
      if (circSource) circSource.setData(circleGeojson);

      const mlSource = map.getSource("ml-estimates-source") as mapboxgl.GeoJSONSource;
      if (mlSource) mlSource.setData(mlGeojson);
    };

    if (map.isStyleLoaded()) {
      setSourceData();
    } else {
      map.once("idle", setSourceData);
    }
  }, [points, selectedCategories, selectedTimeRanges, selectedAreas, confidenceMin]);

  // TOGGLE VISIBILITY FOR ACTIVE LAYERS
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const updateVisibility = () => {
      const isObsActive = layers.find((l) => l.id === "layer-observations")?.active ?? true;
      const isCitizenActive = layers.find((l) => l.id === "layer-citizen")?.active ?? true;
      const isMlActive = layers.find((l) => l.id === "layer-ml")?.active ?? true;
      const isZonesActive = layers.find((l) => l.id === "layer-zones")?.active ?? true;

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
    };

    if (map.isStyleLoaded()) {
      updateVisibility();
    } else {
      map.once("idle", updateVisibility);
    }
  }, [layers]);

  return (
    <div className="flex-1 h-full relative overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Point Detail Popup */}
      {selectedPoint && (
        <MapPointDetail point={selectedPoint} onClose={() => setSelectedPoint(null)} />
      )}

      {/* <MapLegend /> */}
    </div>
  );
}