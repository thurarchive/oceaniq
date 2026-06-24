import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { mockPoints, MapPoint } from "../components/mockPoints";

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

export function useWasteObservations(refreshTrigger: number) {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("waste_observations")
          .select("*");

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: MapPoint[] = data.map((item: WasteObservationRow) => {
            const density = item.debris_coverage_m2 ?? item.debris_quantity ?? 0.0;

            let intensity: "critical" | "high" | "medium" | "low" = "low";
            if (density > 80) intensity = "critical";
            else if (density > 45) intensity = "high";
            else if (density > 10) intensity = "medium";

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
              type: "observation",
              intensity,
              zone: item.site_name || "Unnamed Station",
              lat: item.lat ?? 0.0,
              lng: item.lng ?? 0.0,
              wasteDensity: density,
              wasteCategory: category,
              confidence: 100,
              source: `Official Station #${item.site_id ?? "Unknown"}`,
              timestamp: item.observation_time || new Date().toISOString(),
              moderationStatus: "Verified",
              description: desc,
            };
          });

          const citizenAndMlMocks = mockPoints.filter((p) => p.type === "citizen" || p.type === "ml");
          setPoints([...mapped, ...citizenAndMlMocks]);
        } else {
          setPoints(mockPoints);
        }
      } catch (err) {
        console.warn("Failed to load waste points from Supabase, falling back to mock points. Error details:", err);
        setPoints(mockPoints);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [refreshTrigger]);

  return { points, loading };
}
