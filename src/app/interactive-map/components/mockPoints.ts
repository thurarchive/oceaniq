export interface MapPoint {
  id: string;
  type: 'observation' | 'citizen' | 'ml';
  intensity: 'critical' | 'high' | 'medium' | 'low';
  zone: string;
  lat: number;
  lng: number;
  wasteDensity: number;
  wasteCategory: string;
  confidence: number;
  source: string;
  timestamp: string;
  moderationStatus: string;
  description: string;
  clusterCount?: number;
  x?: number;
  y?: number;
  contributorName?: string;
  reviewerName?: string;
}

export const mockPoints: MapPoint[] = [
  {
    id: 'obs-001',
    type: 'observation', intensity: 'critical',
    zone: 'North Jakarta Bay Zone A',
    lat: -6.0847, lng: 106.8232,
    wasteDensity: 84.2, wasteCategory: 'Plastic-dominant',
    confidence: 100, source: 'Field Survey Team 3',
    timestamp: '2026-06-16T14:30:00Z',
    moderationStatus: 'Verified',
    description: 'High concentration of single-use plastics and styrofoam near river outlet. Tide-dependent accumulation pattern observed.',
  },
  {
    id: 'obs-002',
    type: 'citizen', intensity: 'high',
    zone: 'Bekasi Coastal Sector B',
    lat: -6.1203, lng: 107.0124,
    wasteDensity: 67.8, wasteCategory: 'Mixed organic + plastic',
    confidence: 92, source: 'Citizen: Ahmad Fauzi',
    timestamp: '2026-06-17T05:45:00Z',
    moderationStatus: 'Approved',
    description: 'Mixed waste including plastic bags, food packaging, and organic material. Post-rainfall accumulation near mangrove edge.',
    contributorName: 'Ahmad Fauzi',
    reviewerName: 'Admin1',
  },
  {
    id: 'ml-001',
    type: 'ml', intensity: 'high',
    zone: 'Karawang Offshore Zone',
    lat: -6.2341, lng: 107.2891,
    wasteDensity: 51.3, wasteCategory: 'Fishing gear + plastic',
    confidence: 78, source: 'ML Model v1.3.0',
    timestamp: '2026-06-17T06:00:00Z',
    moderationStatus: 'ML Estimate',
    description: 'Model estimate based on rainfall (230mm/month), tidal level 1.4m, wind 7.2 m/s. Top features: rainfallMm, riverDischarge.',
  },
  {
    id: 'obs-003',
    type: 'observation', intensity: 'medium',
    zone: 'Subang River Mouth',
    lat: -6.3015, lng: 107.5012,
    wasteDensity: 32.6, wasteCategory: 'Plastic + organic',
    confidence: 100, source: 'Field Survey Team 1',
    timestamp: '2026-06-15T09:15:00Z',
    moderationStatus: 'Verified',
    description: 'Moderate accumulation at river mouth. Seasonal pattern consistent with last year\'s dry season baseline.',
  },
  {
    id: 'citizen-002',
    type: 'citizen', intensity: 'medium',
    zone: 'Tangerang Coastal Strip',
    lat: -6.0432, lng: 106.6891,
    wasteDensity: 28.4, wasteCategory: 'Plastic bags + packaging',
    confidence: 85, source: 'Citizen: Dewi Santoso',
    timestamp: '2026-06-17T04:20:00Z',
    moderationStatus: 'Approved',
    description: 'Large concentration of plastic bags washed up after overnight tide. Photographed and GPS-logged.',
    contributorName: 'Dewi Santoso',
    reviewerName: 'Admin2',
  },
  {
    id: 'ml-002',
    type: 'ml', intensity: 'medium',
    zone: 'Indramayu Zone C',
    lat: -6.4122, lng: 107.8234,
    wasteDensity: 24.1, wasteCategory: 'Fishing gear',
    confidence: 71, source: 'ML Model v1.3.0',
    timestamp: '2026-06-17T06:00:00Z',
    moderationStatus: 'ML Estimate',
    description: 'Estimate driven primarily by fishing activity patterns and seasonal wind direction. Moderate confidence.',
  },
  {
    id: 'obs-004',
    type: 'observation', intensity: 'low',
    zone: 'Banten Bay East',
    lat: -5.9876, lng: 106.5341,
    wasteDensity: 11.8, wasteCategory: 'Mixed low-density',
    confidence: 100, source: 'Field Survey Team 2',
    timestamp: '2026-06-14T11:00:00Z',
    moderationStatus: 'Verified',
    description: 'Low density scattered waste. Below alert threshold. Consistent with baseline seasonal levels.',
  },
  {
    id: 'cluster-01',
    type: 'observation', intensity: 'high',
    zone: 'Citarum River Mouth',
    lat: -6.1789, lng: 107.1234,
    wasteDensity: 58.9, wasteCategory: 'Multi-category cluster',
    confidence: 97, source: 'Multiple (cluster: 12 points)',
    timestamp: '2026-06-17T00:00:00Z',
    moderationStatus: 'Verified',
    description: 'Cluster of 12 observation points within 500m radius. Predominantly plastic with organic component.',
    clusterCount: 12,
  },
];
