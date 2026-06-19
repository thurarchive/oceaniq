'use client';
import React, { useState } from 'react';
import { SlidersHorizontal, X, Calendar, Tag, Gauge, MapPin } from 'lucide-react';

const wasteCategories = [
  { id: 'cat-all', label: 'All Categories', value: 'all' },
  { id: 'cat-plastic', label: 'Plastic', value: 'plastic' },
  { id: 'cat-organic', label: 'Organic', value: 'organic' },
  { id: 'cat-fishing', label: 'Fishing Gear', value: 'fishing_gear' },
  { id: 'cat-mixed', label: 'Mixed', value: 'mixed' },
  { id: 'cat-hazardous', label: 'Hazardous', value: 'hazardous' },
];

const timeRanges = [
  { id: 'range-7d', label: 'Last 7 days', value: '7d' },
  { id: 'range-30d', label: 'Last 30 days', value: '30d' },
  { id: 'range-90d', label: 'Last 90 days', value: '90d' },
  { id: 'range-1y', label: 'Last year', value: '1y' },
  { id: 'range-all', label: 'All time', value: 'all' },
];

const areas = [
  { id: 'area-all', label: 'All Areas', value: 'all' },
  { id: 'area-jakarta', label: 'Jakarta Bay', value: 'jakarta_bay' },
  { id: 'area-bekasi', label: 'Bekasi Coast', value: 'bekasi_coast' },
  { id: 'area-citarum', label: 'Citarum Mouth', value: 'citarum_mouth' },
  { id: 'area-karawang', label: 'Karawang Zone', value: 'karawang' },
  { id: 'area-subang', label: 'Subang Zone', value: 'subang' },
];

export default function MapFilterSidebar() {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedArea, setSelectedArea] = useState('all');
  const [confidenceMin, setConfidenceMin] = useState(60);

  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedTimeRange !== '30d',
    selectedArea !== 'all',
    confidenceMin !== 60,
  ]?.filter(Boolean)?.length;

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedTimeRange('30d');
    setSelectedArea('all');
    setConfidenceMin(60);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`absolute top-3 right-3 z-20 flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border transition-all duration-200 ${
          open || activeFilterCount > 0
            ? 'glass-card-elevated border-primary/30 text-primary' :'glass-card border-border text-muted-foreground hover:text-foreground'
        }`}
      >
        <SlidersHorizontal size={14} />
        <span className="hidden sm:inline">Filters</span>
        {activeFilterCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
            {activeFilterCount}
          </span>
        )}
      </button>
      {/* Sidebar panel */}
      {open && (
        <div className="absolute top-0 right-0 bottom-0 w-72 glass-card-elevated border-l border-border z-10 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">Map Filters</span>
            </div>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-muted-foreground hover:text-danger transition-colors"
                >
                  Reset
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-ocean p-4 space-y-5">
            {/* Time Range */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Calendar size={13} className="text-muted-foreground" />
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Time Range</label>
              </div>
              <div className="space-y-1">
                {timeRanges?.map((range) => (
                  <button
                    key={range?.id}
                    onClick={() => setSelectedTimeRange(range?.value)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-150 ${
                      selectedTimeRange === range?.value
                        ? 'bg-primary/12 text-primary border border-primary/25 font-medium' :'text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent'
                    }`}
                  >
                    {range?.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Waste Category */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Tag size={13} className="text-muted-foreground" />
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Waste Category</label>
              </div>
              <div className="space-y-1">
                {wasteCategories?.map((cat) => (
                  <button
                    key={cat?.id}
                    onClick={() => setSelectedCategory(cat?.value)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-150 ${
                      selectedCategory === cat?.value
                        ? 'bg-primary/12 text-primary border border-primary/25 font-medium' :'text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent'
                    }`}
                  >
                    {cat?.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Area */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <MapPin size={13} className="text-muted-foreground" />
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Monitoring Area</label>
              </div>
              <div className="space-y-1">
                {areas?.map((area) => (
                  <button
                    key={area?.id}
                    onClick={() => setSelectedArea(area?.value)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-150 ${
                      selectedArea === area?.value
                        ? 'bg-primary/12 text-primary border border-primary/25 font-medium' :'text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent'
                    }`}
                  >
                    {area?.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Confidence threshold */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Gauge size={13} className="text-muted-foreground" />
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Min. Confidence
                </label>
                <span className="ml-auto font-mono text-xs text-primary font-semibold">{confidenceMin}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={confidenceMin}
                onChange={(e) => setConfidenceMin(Number(e?.target?.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Only show ML estimate points with confidence ≥ {confidenceMin}%
              </p>
            </div>
          </div>

          {/* Apply footer */}
          <div className="border-t border-border p-4 shrink-0">
            <button
              onClick={() => setOpen(false)}
              className="btn-primary w-full text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}