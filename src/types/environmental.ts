export interface EnvironmentalRecord {
  id: number;
  station_name: string;
  record_date: string;
  rainfall_mm: number | null;
  wind_max_ms: number | null;
  wind_dir_max: number | null;
  wind_avg_ms: number | null;
  wind_dir_dominant: string | null;
}
