'use client';
import React from 'react';
import { X, MapPin, Radio, CloudRain, Thermometer, TrendingUp, AlertTriangle, ArrowDown } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

export interface SelectedStationData {
  name: string;
  lat: number;
  lng: number;
  databaseStationName: string;
  temp: number | null;
  precip: number | null;
  weatherCode: number | null;
  accumulatedRainfall3d: number | null;
  correlationCoefficient: number;
  impactedSites: {
    name: string;
    risk: 'Low' | 'Medium' | 'High' | 'Critical';
    description: string;
  }[];
}

interface MapStationDetailProps {
  station: SelectedStationData;
  onClose: () => void;
}

const riskConfig: Record<string, { label: string; color: string; bg: string }> = {
  Critical: { label: 'Critical Risk', color: 'text-danger', bg: 'bg-danger/10 border-danger/30' },
  High: { label: 'High Risk', color: 'text-warning', bg: 'bg-warning/10 border-warning/30' },
  Medium: { label: 'Medium Risk', color: 'text-primary', bg: 'bg-primary/10 border-primary/30' },
  Low: { label: 'Low Risk', color: 'text-positive', bg: 'bg-positive/10 border-positive/30' },
};

// Open-Meteo weather code interpreter
function getWeatherDesc(code: number | null): string {
  if (code === null) return 'N/A';
  if (code === 0) return 'Clear sky';
  if (code >= 1 && code <= 3) return 'Partly cloudy';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snowy';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Overcast';
}

export default function MapStationDetail({ station, onClose }: MapStationDetailProps) {
  return (
    <div className="absolute top-4 left-4 w-80 glass-card-elevated border border-border rounded-xl overflow-hidden z-30 shadow-2xl animate-in fade-in slide-in-from-left-2 duration-300">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-border">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Radio size={13} className="text-[#06b6d4] shrink-0 animate-pulse" />
            <span className="text-xs font-semibold text-[#06b6d4] uppercase tracking-wide">
              Official Weather Station
            </span>
          </div>
          <h3 className="text-sm font-semibold text-foreground truncate">{station.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all ml-2 shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      {/* Live & Database Summary Row */}
      <div className="grid grid-cols-2 border-b border-border divide-x divide-border bg-muted/10">
        <div className="px-4 py-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium flex items-center gap-1">
            <CloudRain size={10} className="text-primary" /> Live Precipitation
          </span>
          <p className="font-mono text-xl font-bold text-primary mt-1">
            {station.precip !== null ? `${station.precip} mm` : '0.0 mm'}
          </p>
        </div>
        <div className="px-4 py-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium flex items-center gap-1">
            <TrendingUp size={10} className="text-accent" /> 3-Day Accumulated
          </span>
          <p className="font-mono text-xl font-bold text-accent mt-1">
            {station.accumulatedRainfall3d !== null ? `${station.accumulatedRainfall3d.toFixed(1)} mm` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-3.5 max-h-[calc(100vh-16rem)] overflow-y-auto scrollbar-ocean">
        {/* Current Info */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Thermometer size={14} className="text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Temperature</p>
              <p className="font-semibold text-foreground">{station.temp !== null ? `${station.temp}°C` : 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CloudRain size={14} className="text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Conditions</p>
              <p className="font-semibold text-foreground truncate">{getWeatherDesc(station.weatherCode)}</p>
            </div>
          </div>
        </div>

        {/* Station Location */}
        <div className="flex items-start gap-2.5 pt-1.5 border-t border-border/60">
          <MapPin size={13} className="text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] text-muted-foreground">Location Coordinates</p>
            <p className="font-mono text-xs text-foreground">{station.lat.toFixed(4)}°S, {station.lng.toFixed(4)}°E</p>
          </div>
        </div>

        {/* Correlation Stat */}
        <div className="flex items-start gap-2.5 pt-1.5 border-t border-border/60">
          <TrendingUp size={13} className="text-[#06b6d4] mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground">Debris Influx Correlation</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs text-foreground font-semibold">
                r = {station.correlationCoefficient}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium border border-primary/10">
                Strong Correlation
              </span>
            </div>
          </div>
        </div>

        {/* Downstream Impact Alert */}
        <div className="pt-2.5 border-t border-border/60">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2 flex items-center gap-1">
            <ArrowDown size={11} className="text-[#06b6d4]" /> Downstream Impact Analysis
          </p>

          <div className="space-y-2">
            {station.impactedSites.map((site) => {
              const risk = riskConfig[site.risk];
              return (
                <div key={site.name} className={`p-2 rounded-lg border ${risk.bg} flex flex-col gap-1`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">{site.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded border uppercase tracking-wider font-mono ${risk.color}`}>
                      {risk.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{site.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {station.accumulatedRainfall3d !== null && station.accumulatedRainfall3d > 40 && (
          <div className="bg-danger/8 border border-danger/20 rounded-lg p-2.5 flex items-start gap-2">
            <AlertTriangle size={12} className="text-danger mt-0.5 shrink-0" />
            <p className="text-[10px] text-danger/90">
              Significant cumulative rain detected. Increased debris runoff likely to wash downstream over next 24-48 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
