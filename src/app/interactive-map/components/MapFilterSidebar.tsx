'use client';
import React from 'react';
import { SlidersHorizontal, X, Calendar, Tag, Gauge, MapPin } from 'lucide-react';
import { ZONES } from '@/constants/zones';

const wasteCategories = [
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

const areas = ZONES.filter((z) => z.name !== 'All Zones').map((zone) => {
    return {
        id: `area-${zone.name.toLowerCase().replace(/\s+/g, '-')}`,
        label: zone.name,
        value: zone.name.toLowerCase().replace(/\s+/g, '_'),
    };
});

type MapFilterSidebarProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    selectedTimeRanges: string[];
    setSelectedTimeRanges: React.Dispatch<React.SetStateAction<string[]>>;
    selectedAreas: string[];
    setSelectedAreas: React.Dispatch<React.SetStateAction<string[]>>;
    confidenceMin: number;
    setConfidenceMin: (val: number) => void;
};

export default function MapFilterSidebar({
    open,
    setOpen,
    selectedCategories,
    setSelectedCategories,
    selectedTimeRanges,
    setSelectedTimeRanges,
    selectedAreas,
    setSelectedAreas,
    confidenceMin,
    setConfidenceMin,
}: MapFilterSidebarProps) {

    const activeTimeRangeCount = selectedTimeRanges.filter((r) => r !== 'all').length;

    const activeFilterCount =
        selectedCategories.length +
        activeTimeRangeCount +
        selectedAreas.length +
        (confidenceMin !== 60 ? 1 : 0);

    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedTimeRanges(['all']);
        setSelectedAreas([]);
        setConfidenceMin(60);
    };

    const handleToggleCategory = (value: string) => {
        setSelectedCategories((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleToggleTimeRange = (value: string) => {
        setSelectedTimeRanges((prev) => {
            if (value === 'all') {
                return ['all'];
            }
            const filtered = prev.filter((item) => item !== 'all');
            const next = filtered.includes(value)
                ? filtered.filter((item) => item !== value)
                : [...filtered, value];
            return next.length === 0 ? ['all'] : next;
        });
    };

    const handleToggleArea = (value: string) => {
        setSelectedAreas((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    return (
        <>
            {/* Toggle button */}
            {!open && (
                <button
                    onClick={() => setOpen(!open)}
                    className={`absolute top-3 right-3 z-20 flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${activeFilterCount > 0
                        ? 'glass-card-elevated border-primary/30 text-primary' : 'glass-card border-border text-muted-foreground hover:text-foreground'
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
            )}

            {/* Sidebar panel */}
            {open && (
                <div className="absolute top-3 right-3 w-72 max-h-[calc(100vh-6rem)] glass-card-elevated border border-border rounded-xl shadow-2xl z-20 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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
                                    className="text-xs text-muted-foreground hover:text-danger hover:underline transition-all cursor-pointer font-medium"
                                >
                                    Reset
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-ocean p-4 space-y-6">
                        {/* Waste Category */}
                        <div>
                            <div className="flex items-center gap-2 mb-2.5">
                                <Tag size={13} className="text-muted-foreground" />
                                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Waste Category</label>
                            </div>
                            <div className="space-y-1">
                                {wasteCategories.map((cat) => {
                                    const isChecked = selectedCategories.includes(cat.value);
                                    return (
                                        <label
                                            key={cat.id}
                                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/30 cursor-pointer text-sm transition-all duration-150 border border-transparent hover:border-border/30"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleToggleCategory(cat.value)}
                                                className="w-4 h-4 rounded border-border bg-muted/20 text-primary focus:ring-primary/30 focus:ring-offset-0 focus:ring-1 transition-all cursor-pointer"
                                            />
                                            <span className={isChecked ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                                                {cat.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Range */}
                        <div>
                            <div className="flex items-center gap-2 mb-2.5">
                                <Calendar size={13} className="text-muted-foreground" />
                                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Time Range</label>
                            </div>
                            <div className="space-y-1">
                                {timeRanges.map((range) => {
                                    const isChecked = selectedTimeRanges.includes(range.value);
                                    return (
                                        <label
                                            key={range.id}
                                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/30 cursor-pointer text-sm transition-all duration-150 border border-transparent hover:border-border/30"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleToggleTimeRange(range.value)}
                                                className="w-4 h-4 rounded border-border bg-muted/20 text-primary focus:ring-primary/30 focus:ring-offset-0 focus:ring-1 transition-all cursor-pointer"
                                            />
                                            <span className={isChecked ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                                                {range.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Monitoring Areas (Zones) */}
                        <div>
                            <div className="flex items-center gap-2 mb-2.5">
                                <MapPin size={13} className="text-muted-foreground" />
                                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Monitoring Zones</label>
                            </div>
                            <div className="space-y-1">
                                {areas.map((area) => {
                                    const isChecked = selectedAreas.includes(area.value);
                                    return (
                                        <label
                                            key={area.id}
                                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/30 cursor-pointer text-sm transition-all duration-150 border border-transparent hover:border-border/30"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleToggleArea(area.value)}
                                                className="w-4 h-4 rounded border-border bg-muted/20 text-primary focus:ring-primary/30 focus:ring-offset-0 focus:ring-1 transition-all cursor-pointer"
                                            />
                                            <span className={isChecked ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                                                {area.label}
                                            </span>
                                        </label>
                                    );
                                })}
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
                                onChange={(e) => setConfidenceMin(Number(e.target.value))}
                                className="w-full accent-primary cursor-pointer"
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

                    {/* Apply footer
          <div className="border-t border-border p-4 shrink-0 flex items-center gap-2 bg-muted/10">
            <button
              onClick={() => setOpen(false)}
              className="btn-primary flex-1 text-sm py-2 cursor-pointer font-medium text-center"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="btn-ghost flex-1 text-sm py-2 cursor-pointer font-medium text-center hover:bg-muted/40"
            >
              Reset Filters
            </button>
          </div> */}
                </div>
            )}
        </>
    );
}
//             <button onClick={resetFilters} className="btn-ghost flex-1 text-sm">
//               Reset Filters
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }