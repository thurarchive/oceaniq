import React from 'react';
import { Brain, Users, CheckCircle } from 'lucide-react';

export default function MapLegend() {
  return (
    <div className="absolute bottom-4 right-4 glass-card-elevated border border-border rounded-xl p-3 z-20 min-w-44">
      <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5">Legend</p>
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-positive border border-white/20 shrink-0" />
          <CheckCircle size={11} className="text-positive" />
          <span className="text-xs text-muted-foreground">Verified Observation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent border border-white/20 shrink-0" />
          <Users size={11} className="text-accent" />
          <span className="text-xs text-muted-foreground">Citizen Report</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning border border-white/20 shrink-0" />
          <Brain size={11} className="text-warning" />
          <span className="text-xs text-muted-foreground">ML Estimate</span>
        </div>
      </div>
      <div className="border-t border-border pt-2.5 mb-2.5">
        <p className="text-xs text-muted-foreground mb-1.5">Intensity</p>
        <div className="space-y-1">
          {[
            { label: 'Critical', color: 'bg-danger', size: 'w-5 h-5' },
            { label: 'High', color: 'bg-warning', size: 'w-4 h-4' },
            { label: 'Medium', color: 'bg-primary', size: 'w-3.5 h-3.5' },
            { label: 'Low', color: 'bg-positive', size: 'w-2.5 h-2.5' },
          ]?.map((item) => (
            <div key={`legend-intensity-${item?.label}`} className="flex items-center gap-2">
              <div className={`${item?.size} rounded-full ${item?.color} border border-white/20 shrink-0`} />
              <span className="text-xs text-muted-foreground">{item?.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-2.5">
        <p className="text-xs text-muted-foreground mb-1.5">Heatmap</p>
        <div className="h-2 rounded-full w-full" style={{ background: 'linear-gradient(to right, rgba(16,185,129,0.6), rgba(245,158,11,0.7), rgba(239,68,68,0.8))' }} />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">Low</span>
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      </div>
    </div>
  );
}