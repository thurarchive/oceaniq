// TypeScript types for the `waste_observations` Supabase table

export type ObservationStatus = 'pending_moderation' | 'published' | 'draft' | 'rejected';

export type VolumeEstimate =
  | '< 1 Trash Bag'
  | '1-5 Bags'
  | 'Small Truck'
  | 'Large Accumulation';

export type CompositionType =
  | 'Plastic Bottles/Bags'
  | 'Fishing Nets/Gear'
  | 'Styrofoam'
  | 'Glass/Metal'
  | 'Organic/Wood';

export type WeatherCondition = 'Clear' | 'Rain' | 'Overcast';
export type TideCondition = 'High' | 'Low' | 'Ebb' | 'Flood';

export interface DetailedCompositionItem {
  category: string;
  item: string;
  count: number;
}

export interface WasteObservation {
  id: string;
  user_id: string;
  status: ObservationStatus;
  created_at: string;
  updated_at: string;

  // Location
  location_lat: number | null;
  location_lng: number | null;
  site_name: string | null;
  data_source?: string | null;

  // Citizen fields
  volume_estimate: VolumeEstimate | null;
  primary_composition: CompositionType[] | null;
  notes: string | null;
  photo_url: string | null;

  // Expert fields
  weather_condition: WeatherCondition | null;
  tide_condition: TideCondition | null;
  transect_length_m: number | null;
  transect_area_m2: number | null;
  total_weight_kg: number | null;
  total_items: number | null;
  detailed_composition: DetailedCompositionItem[] | null;

  // Source indicator
  submission_type: 'citizen' | 'expert';
}

// For dashboard stats aggregation
export interface UserContributionStats {
  total_submissions: number;
  total_weight_kg: number;
  unique_sites: number;
}

// Insert payload — omit server-generated fields
export type WasteObservationInsert = Omit<WasteObservation, 'id' | 'created_at' | 'updated_at'>;
