'use client';
import React, { useState } from 'react';
import { BarChart3, Download, Calendar, RefreshCw, ChevronDown } from 'lucide-react';

import { ZONES } from '@/constants/zones';

const zones = ZONES.map((z) => z.name);
const dateRanges = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 6 months', 'Last year'];

export default function AnalyticsHeader() {
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [selectedRange, setSelectedRange] = useState('Last 90 days');
  const [zoneOpen, setZoneOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={18} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Marine waste trends, composition, and environmental correlations — 17 Jun 2026
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Zone selector */}
        <div className="relative">
          <button
            onClick={() => { setZoneOpen(!zoneOpen); setRangeOpen(false); }}
            className="flex items-center gap-2 text-sm px-3 py-2 glass-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            <span className="hidden sm:inline">{selectedZone}</span>
            <span className="sm:hidden">Zone</span>
            <ChevronDown size={13} className={`transition-transform ${zoneOpen ? 'rotate-180' : ''}`} />
          </button>
          {zoneOpen && (
            <div className="absolute right-0 top-10 w-48 glass-card-elevated border border-border rounded-xl overflow-hidden z-30 shadow-xl">
              {zones?.map((z) => (
                <button
                  key={`zone-opt-${z}`}
                  onClick={() => { setSelectedZone(z); setZoneOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${selectedZone === z ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    }`}
                >
                  {z}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date range selector */}
        <div className="relative">
          <button
            onClick={() => { setRangeOpen(!rangeOpen); setZoneOpen(false); }}
            className="flex items-center gap-2 text-sm px-3 py-2 glass-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            <Calendar size={13} />
            <span className="hidden sm:inline">{selectedRange}</span>
            <span className="sm:hidden">Range</span>
            <ChevronDown size={13} className={`transition-transform ${rangeOpen ? 'rotate-180' : ''}`} />
          </button>
          {rangeOpen && (
            <div className="absolute right-0 top-10 w-44 glass-card-elevated border border-border rounded-xl overflow-hidden z-30 shadow-xl">
              {dateRanges?.map((r) => (
                <button
                  key={`range-opt-${r}`}
                  onClick={() => { setSelectedRange(r); setRangeOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${selectedRange === r ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setSelectedZone('All Zones')}
          className="flex items-center gap-1.5 text-sm px-3 py-2 glass-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all cursor-pointer">
          <RefreshCw size={13} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        <button className="flex items-center gap-1.5 text-sm px-3 py-2 glass-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
          <Download size={13} />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
}