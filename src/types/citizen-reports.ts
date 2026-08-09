// TypeScript types for the `citizen_reports` table

export type CitizenReportStatus =
  | 'draft'
  | 'pending_moderation'
  | 'approved'
  | 'rejected';

export type VolumeEstimate =
  | '< 1 Trash Bag'
  | '1–5 Bags'
  | 'Small Truck Load'
  | 'Large Accumulation';

export type WeatherCondition = 'Clear' | 'Overcast' | 'Rain' | 'Windy';
export type TideCondition = 'High' | 'Low' | 'Ebb' | 'Flood';
export type DistributionType = 'Concentrated' | 'Scattered' | 'Mixed';
export type MobilityType = 'Floating/Moving' | 'Stranded' | 'Mixed';
export type WeightRange = '< 5 kg' | '5–20 kg' | '20–100 kg' | '> 100 kg';

export interface CitizenReport {
  id: string;
  user_id: string;

  // Workflow
  status: CitizenReportStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  contributor_name: string | null;
  reviewer_name: string | null;

  // Location
  site_name: string | null;
  lat: number | null;
  lng: number | null;

  // Context
  observation_time: string;
  weather: WeatherCondition | null;
  tides: TideCondition | null;

  // Debris assessment
  volume_estimate: VolumeEstimate | null;
  distribution: DistributionType | null;
  mobility: MobilityType | null;
  area_estimate_m2: number | null;

  // Composition (booleans)
  has_plastic: boolean;
  has_organic: boolean;
  has_fishing_gear: boolean;
  has_styrofoam: boolean;
  has_glass_metal: boolean;

  // Weight
  weight_estimate_kg: number | null;
  weight_range: WeightRange | null;

  // Evidence
  photo_url: string;
  notes: string | null;

  // Promotion link
  promoted_observation_id: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export type CitizenReportInsert = Omit<
  CitizenReport,
  'id' | 'created_at' | 'updated_at' | 'reviewed_by' | 'reviewed_at' | 'promoted_observation_id' | 'reviewer_name'
>;

// Aggregated stats across both citizen_reports and waste_observations
export interface UserContributionStats {
  total_submissions: number;
  verified_submissions?: number;
  total_weight_kg: number;
  unique_sites: number;
  unlocked_badges_count?: number;
  current_tier_name?: string;
  is_public_leaderboard?: boolean;
}

