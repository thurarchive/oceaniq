'use client';
import React from 'react';
import { X, MapPin, Clock, User, Gauge, Tag, Layers, CheckCircle, AlertCircle, Brain } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

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

interface MapPointDetailProps {
  point: MapPoint;
  onClose: () => void;
}

const typeLabel: Record<string, string> = {
  observation: 'Verified Observation',
  citizen: 'Citizen Report',
  ml: 'ML Estimate',
};

const intensityConfig: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: 'text-danger', bg: 'bg-danger/10' },
  high: { label: 'High', color: 'text-warning', bg: 'bg-warning/10' },
  medium: { label: 'Medium', color: 'text-primary', bg: 'bg-primary/10' },
  low: { label: 'Low', color: 'text-positive', bg: 'bg-positive/10' },
};

export default function MapPointDetail({ point, onClose }: MapPointDetailProps) {
  const intensityCfg = intensityConfig[point.intensity];
  const formattedDate = point.timestamp.split('T')[0];
  const formattedTime = point.timestamp.split('T')[1]?.replace('Z', ' UTC') ?? '';

  return (
    <div className="absolute top-4 left-4 md:left-auto md:right-4 md:top-4 w-80 glass-card-elevated border border-border rounded-xl overflow-hidden z-30 shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-border">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {point.type === 'ml' ? (
              <Brain size={13} className="text-warning shrink-0" />
            ) : point.type === 'citizen' ? (
              <User size={13} className="text-accent shrink-0" />
            ) : (
              <CheckCircle size={13} className="text-positive shrink-0" />
            )}
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {typeLabel[point.type]}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-foreground truncate">{point.zone}</h3>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all ml-2 shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      {/* Key metric */}
      <div className={`px-4 py-3 ${intensityCfg.bg} border-b border-border`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Waste Density</p>
            <p className={`font-mono text-2xl font-bold ${intensityCfg.color}`}>
              {point.wasteDensity} <span className="text-sm font-normal">kg/km²</span>
            </p>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${intensityCfg.bg} ${intensityCfg.color} border-current/30`}>
            {intensityCfg.label}
          </span>
        </div>
      </div>

      {/* Metadata grid */}
      <div className="p-4 space-y-3">
        {/* Coordinates */}
        <div className="flex items-start gap-2.5">
          <MapPin size={13} className="text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Coordinates</p>
            <p className="font-mono text-xs text-foreground">{point.lat}°S, {point.lng}°E</p>
          </div>
        </div>

        {/* Waste category */}
        <div className="flex items-start gap-2.5">
          <Tag size={13} className="text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Waste Category</p>
            <p className="text-xs text-foreground font-medium">{point.wasteCategory}</p>
          </div>
        </div>

        {/* Confidence */}
        <div className="flex items-start gap-2.5">
          <Gauge size={13} className="text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">
              {point.type === 'ml' ? 'Model Confidence' : 'Data Reliability'}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    point.confidence >= 90 ? 'bg-positive' : point.confidence >= 70 ? 'bg-primary' : 'bg-warning'
                  }`}
                  style={{ width: `${point.confidence}%` }}
                />
              </div>
              <span className="font-mono text-xs text-foreground font-semibold">{point.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Source */}
        <div className="flex items-start gap-2.5">
          <Layers size={13} className="text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Data Source</p>
            <p className="text-xs text-foreground">{point.source}</p>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-start gap-2.5">
          <Clock size={13} className="text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Recorded</p>
            <p className="font-mono text-xs text-foreground">{formattedDate} {formattedTime}</p>
          </div>
        </div>

        {/* Moderation status */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <span className="text-xs text-muted-foreground">Status</span>
          {point.type === 'ml' ? (
            <StatusBadge variant="estimated" />
          ) : point.moderationStatus === 'Verified' ? (
            <StatusBadge variant="verified" />
          ) : (
            <StatusBadge variant="approved" />
          )}
        </div>

        {/* Description */}
        <div className="pt-1 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">{point.description}</p>
        </div>

        {point.type === 'ml' && (
          <div className="bg-warning/8 border border-warning/20 rounded-lg p-2.5 flex items-start gap-2">
            <AlertCircle size={12} className="text-warning mt-0.5 shrink-0" />
            <p className="text-xs text-warning/90">
              This is a model estimate, not a measured observation. See methodology for details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}