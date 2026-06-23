'use client';
import React, { useState } from 'react';
import MapPointDetail from './MapPointDetail';
// import MapLegend from './MapLegend';
import { ZoomIn, ZoomOut, Compass } from 'lucide-react';

interface MapPoint {
  id: string;
  x: number;
  y: number;
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
}

const mapPoints: MapPoint[] = [
  {
    id: 'obs-001',
    x: 22, y: 42,
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
    x: 38, y: 35,
    type: 'citizen', intensity: 'high',
    zone: 'Bekasi Coastal Sector B',
    lat: -6.1203, lng: 107.0124,
    wasteDensity: 67.8, wasteCategory: 'Mixed organic + plastic',
    confidence: 92, source: 'Citizen: Ahmad Fauzi',
    timestamp: '2026-06-17T05:45:00Z',
    moderationStatus: 'Approved',
    description: 'Mixed waste including plastic bags, food packaging, and organic material. Post-rainfall accumulation near mangrove edge.',
  },
  {
    id: 'ml-001',
    x: 55, y: 48,
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
    x: 70, y: 38,
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
    x: 30, y: 58,
    type: 'citizen', intensity: 'medium',
    zone: 'Tangerang Coastal Strip',
    lat: -6.0432, lng: 106.6891,
    wasteDensity: 28.4, wasteCategory: 'Plastic bags + packaging',
    confidence: 85, source: 'Citizen: Dewi Santoso',
    timestamp: '2026-06-17T04:20:00Z',
    moderationStatus: 'Approved',
    description: 'Large concentration of plastic bags washed up after overnight tide. Photographed and GPS-logged.',
  },
  {
    id: 'ml-002',
    x: 78, y: 52,
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
    x: 15, y: 65,
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
    x: 44, y: 45,
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

const typeColors: Record<string, { marker: string; ring: string }> = {
  observation: { marker: 'bg-positive', ring: 'border-positive/50' },
  citizen: { marker: 'bg-accent', ring: 'border-accent/50' },
  ml: { marker: 'bg-warning', ring: 'border-warning/50' },
};

const intensitySize: Record<string, number> = {
  critical: 22,
  high: 18,
  medium: 14,
  low: 10,
};

export default function MapCanvas() {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [zoom, setZoom] = useState(8);

  return (
    <div className="flex-1 relative overflow-hidden bg-linear-to-b from-[#041a2e] to-[#062440]">
      {/* Ocean grid background */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ocean-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(14,165,233,0.15)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ocean-grid)" />
      </svg>

      {/* Simulated coastline SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Water background gradient */}
        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0369a1" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="heatGradJakarta" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Main coastline */}
        <path
          d="M0,72 Q8,65 15,68 Q22,71 28,64 Q35,57 42,60 Q50,63 56,55 Q63,47 70,52 Q78,57 85,50 Q92,43 100,48 L100,100 L0,100 Z"
          fill="url(#waterGrad)"
          stroke="rgba(14,165,233,0.25)"
          strokeWidth="0.3"
        />
        {/* Secondary coastal strip */}
        <path
          d="M0,80 Q15,76 30,78 Q45,80 60,74 Q75,68 90,72 Q95,73 100,71 L100,100 L0,100 Z"
          fill="rgba(6,182,212,0.05)"
          stroke="rgba(6,182,212,0.12)"
          strokeWidth="0.2"
        />

        {/* River lines */}
        <path d="M22,0 Q21,20 22,42" stroke="rgba(14,165,233,0.3)" strokeWidth="0.4" fill="none" strokeDasharray="1,1" />
        <path d="M44,0 Q43,15 44,45" stroke="rgba(14,165,233,0.25)" strokeWidth="0.35" fill="none" strokeDasharray="1,1" />
        <path d="M70,0 Q69,18 70,38" stroke="rgba(14,165,233,0.2)" strokeWidth="0.3" fill="none" strokeDasharray="1,1" />

        {/* Monitoring zone polygons */}
        {[
          { x: 18, y: 38, w: 12, h: 10, label: 'Zone A' },
          { x: 34, y: 30, w: 14, h: 12, label: 'Zone B' },
          { x: 52, y: 42, w: 12, h: 10, label: 'Zone C' },
          { x: 66, y: 34, w: 10, h: 9, label: 'Zone D' },
        ].map((zone) => (
          <rect
            key={`zone-${zone.label}`}
            x={zone.x}
            y={zone.y}
            width={zone.w}
            height={zone.h}
            rx="1"
            fill="rgba(14,165,233,0.04)"
            stroke="rgba(14,165,233,0.2)"
            strokeWidth="0.3"
            strokeDasharray="1.5,1"
          />
        ))}

        {/* Heatmap blobs for ML estimate zones */}
        <ellipse cx="22" cy="43" rx="8" ry="6" fill="rgba(239,68,68,0.18)" />
        <ellipse cx="44" cy="45" rx="7" ry="5" fill="rgba(245,158,11,0.15)" />
        <ellipse cx="55" cy="48" rx="6" ry="4.5" fill="rgba(245,158,11,0.12)" />
      </svg>

      {/* Map markers */}
      {mapPoints.map((point) => {
        const colors = typeColors[point.type];
        const size = intensitySize[point.intensity];
        return (
          <div
            key={point.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            onClick={() => setSelectedPoint(selectedPoint?.id === point.id ? null : point)}
          >
            {/* Pulse ring for critical */}
            {point.intensity === 'critical' && (
              <div
                className={`absolute inset-0 rounded-full border-2 ${colors.ring} map-marker-pulse`}
                style={{ width: size + 12, height: size + 12, marginLeft: -(size + 12) / 2 + size / 2, marginTop: -(size + 12) / 2 + size / 2 }}
              />
            )}

            {point.clusterCount ? (
              <div
                className={`${colors.marker} rounded-full flex items-center justify-center text-white font-bold border-2 border-white/20 shadow-lg hover:scale-110 transition-transform duration-150 font-mono`}
                style={{ width: size + 8, height: size + 8, fontSize: 9 }}
              >
                {point.clusterCount}
              </div>
            ) : (
              <div
                className={`${colors.marker} rounded-full border-2 border-white/30 shadow-lg hover:scale-125 hover:border-white/60 transition-all duration-150 ${
                  selectedPoint?.id === point.id ? 'scale-125 border-white/80 ring-2 ring-white/30' : ''
                }`}
                style={{ width: size, height: size }}
              />
            )}

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
              <div className="glass-card-elevated border border-border rounded-lg px-2.5 py-1.5 whitespace-nowrap">
                <p className="text-xs font-semibold text-foreground">{point.zone}</p>
                <p className="font-mono text-xs text-primary">{point.wasteDensity} kg/km²</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Point Detail Popup */}
      {selectedPoint && (
        <MapPointDetail
          point={selectedPoint}
          onClose={() => setSelectedPoint(null)}
        />
      )}

      {/* Zoom controls */}
      <div className="absolute left-4 bottom-16 flex flex-col gap-1 z-20">
        <button
          onClick={() => setZoom((z) => Math.min(z + 1, 18))}
          className="w-8 h-8 glass-card-elevated border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          title="Zoom in"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 1, 3))}
          className="w-8 h-8 glass-card-elevated border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          title="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
        <button
          className="w-8 h-8 glass-card-elevated border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          title="Reset bearing"
        >
          <Compass size={14} />
        </button>
      </div>

      {/* Zoom level indicator */}
      <div className="absolute left-4 bottom-4 glass-card border border-border px-2.5 py-1 rounded-lg z-20">
        <span className="font-mono text-xs text-muted-foreground">Zoom {zoom}</span>
      </div>

      {/* Coordinates indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card border border-border px-3 py-1 rounded-lg z-20 hidden md:block">
        <span className="font-mono text-xs text-muted-foreground">-6.1234°S, 107.0123°E</span>
      </div>

      {/* <MapLegend /> */}
    </div>
  );
}