'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Brain, Users, CheckCircle, Radio, Info, X } from 'lucide-react';

export default function MapLegend() {
  const [isOpen, setIsOpen] = useState(false);
  const legendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const mapEl = document.getElementById('map') || document.querySelector('.mapboxgl-canvas');
      if (
        legendRef.current &&
        !legendRef.current.contains(target) &&
        mapEl &&
        mapEl.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border glass-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200 cursor-pointer shadow-md uppercase tracking-wider"
      >
        <Info size={14} className="text-primary" />
        <span>Legend</span>
      </button>
    );
  }

  return (
    <div ref={legendRef} className="absolute bottom-4 right-4 glass-card-elevated border border-border rounded-xl p-3 z-20 min-w-48 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Legend</p>
        <button
          onClick={() => setIsOpen(false)}
          className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all cursor-pointer"
          title="Close legend"
        >
          <X size={14} />
        </button>
      </div>

      {/* Layer Types */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-positive border border-white/20 shrink-0" />
          <CheckCircle size={11} className="text-positive" />
          <span className="text-[11px] text-muted-foreground">Verified Observation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent border border-white/20 shrink-0" />
          <Users size={11} className="text-accent" />
          <span className="text-[11px] text-muted-foreground">Citizen Report</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning border border-white/20 shrink-0" />
          <Brain size={11} className="text-warning" />
          <span className="text-[11px] text-muted-foreground">ML Estimate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#06b6d4] border border-white/20 shrink-0 animate-pulse" />
          <Radio size={11} className="text-[#06b6d4]" />
          <span className="text-[11px] text-muted-foreground">Weather Station</span>
        </div>
      </div>

      {/* Waste Intensity */}
      <div className="border-t border-border pt-2.5 mb-2.5">
        <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide text-[10px]">Debris Quantity</p>
        <div className="space-y-1">
          {[
            { label: 'Critical (> 1000 items)', color: 'bg-danger', size: 'w-2.5 h-2.5' },
            { label: 'High (500-1000 items)', color: 'bg-warning', size: 'w-2.5 h-2.5' },
            { label: 'Medium (200-500 items)', color: 'bg-primary', size: 'w-2.5 h-2.5' },
            { label: 'Low (< 200 items)', color: 'bg-positive', size: 'w-2.5 h-2.5' },
          ].map((item) => (
            <div key={`legend-intensity-${item.label}`} className="flex items-center gap-2">
              <div className={`${item.size} rounded-full ${item.color} border border-white/20 shrink-0`} />
              <span className="text-[11px] text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rainfall intensity */}
      <div className="border-t border-border pt-2.5">
        <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide text-[10px]">Rainfall Buffer</p>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          </div>
          <span className="text-[11px] text-muted-foreground">Precipitation area</span>
        </div>
        <div className="h-1.5 rounded-full w-full bg-gradient-to-r from-blue-500/10 to-blue-600/80" />
        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
          <span>0 mm</span>
          <span>Heavy rain</span>
        </div>
      </div>
    </div>
  );
}