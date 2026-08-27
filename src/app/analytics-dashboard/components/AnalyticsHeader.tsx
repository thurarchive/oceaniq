'use client';
import React, { useState } from 'react';
import { BarChart3, Download, Calendar, RefreshCw, ChevronDown } from 'lucide-react';
import { ZONES } from '@/constants/zones';
import { useLanguage } from '@/context/LanguageContext';

export default function AnalyticsHeader() {
  const { language, t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [selectedRange, setSelectedRange] = useState('Last 90 days');
  const [zoneOpen, setZoneOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);

  const zones = [t.analytics.allZones, ...ZONES.map((z) => z.name)];
  const dateRanges = [
    { key: 'Last 7 days', label: t.analytics.range7d },
    { key: 'Last 30 days', label: t.analytics.range30d },
    { key: 'Last 90 days', label: t.analytics.range90d },
    { key: 'Last 6 months', label: t.analytics.range6m },
    { key: 'Last year', label: t.analytics.range1y },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">{t.analytics.title}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {t.analytics.subtitle}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Zone selector */}
        <div className="relative">
          <button
            onClick={() => { setZoneOpen(!zoneOpen); setRangeOpen(false); }}
            className="flex items-center gap-2 text-sm px-3 py-2 glass-card border border-border rounded-lg text-foreground hover:border-primary/30 transition-all cursor-pointer shadow-xs"
          >
            <span className="hidden sm:inline">{selectedZone === 'All Zones' ? t.analytics.allZones : selectedZone}</span>
            <span className="sm:hidden">{t.common.zone}</span>
            <ChevronDown size={13} className={`transition-transform ${zoneOpen ? 'rotate-180' : ''}`} />
          </button>
          {zoneOpen && (
            <div className="absolute right-0 top-10 w-48 glass-card-elevated border border-border rounded-xl overflow-hidden z-30 shadow-xl max-h-60 overflow-y-auto scrollbar-ocean">
              {zones.map((z) => (
                <button
                  key={`zone-opt-${z}`}
                  onClick={() => { setSelectedZone(z); setZoneOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                    (selectedZone === z || (selectedZone === 'All Zones' && z === t.analytics.allZones))
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
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
            className="flex items-center gap-2 text-sm px-3 py-2 glass-card border border-border rounded-lg text-foreground hover:border-primary/30 transition-all cursor-pointer shadow-xs"
          >
            <Calendar size={13} />
            <span className="hidden sm:inline">
              {dateRanges.find((r) => r.key === selectedRange)?.label || selectedRange}
            </span>
            <span className="sm:hidden">{t.common.date}</span>
            <ChevronDown size={13} className={`transition-transform ${rangeOpen ? 'rotate-180' : ''}`} />
          </button>
          {rangeOpen && (
            <div className="absolute right-0 top-10 w-44 glass-card-elevated border border-border rounded-xl overflow-hidden z-30 shadow-xl">
              {dateRanges.map((r) => (
                <button
                  key={`range-opt-${r.key}`}
                  onClick={() => { setSelectedRange(r.key); setRangeOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                    selectedRange === r.key
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setSelectedZone('All Zones')}
          className="flex items-center gap-1.5 text-sm px-3 py-2 glass-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all cursor-pointer shadow-xs"
        >
          <RefreshCw size={13} />
          <span className="hidden sm:inline">{t.common.refresh}</span>
        </button>

        <button className="flex items-center gap-1.5 text-sm px-3 py-2 glass-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all cursor-pointer shadow-xs">
          <Download size={13} />
          <span className="hidden sm:inline">{t.common.export}</span>
        </button>
      </div>
    </div>
  );
}