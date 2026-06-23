'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, Download, RefreshCw, Clock, ChevronDown, MapPin } from 'lucide-react';
import { ZONES } from '@/constants/zones';

type MapHeaderProps = {
  selectedZone: string;
  onZoneChange: (zone: string) => void;
  onRefresh: () => void;
};

export default function MapHeader({ selectedZone, onZoneChange, onRefresh }: MapHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredZones = ZONES.filter((zone) =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="glass-card-elevated border-b border-border px-4 py-2.5 flex items-center gap-3 shrink-0 z-20">
      {/* Searchable Zone Dropdown */}
      <div className="relative flex-1 max-w-sm" ref={dropdownRef}>
        <button
          onClick={() => {
            setDropdownOpen(!dropdownOpen);
            setSearchQuery('');
          }}
          className="w-full flex items-center justify-between gap-2 bg-muted/60 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground hover:border-primary/45 hover:bg-muted/70 focus:outline-none transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin size={14} className="text-primary shrink-0 animate-pulse" />
            <span className="truncate font-medium">{selectedZone}</span>
          </div>
          <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 mt-1.5 w-full glass-card-elevated border border-border rounded-xl shadow-2xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Search Input inside Dropdown */}
            <div className="p-2 border-b border-border bg-muted/20">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter zones..."
                  className="w-full bg-muted/80 border border-border rounded-md pl-7 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30"
                  autoFocus
                />
              </div>
            </div>

            {/* Zones List */}
            <div className="max-h-60 overflow-y-auto scrollbar-ocean py-1">
              {filteredZones.length > 0 ? (
                filteredZones.map((zone) => (
                  <button
                    key={zone.name}
                    onClick={() => {
                      onZoneChange(zone.name);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                      selectedZone === zone.name
                        ? 'bg-primary/10 text-primary font-semibold font-medium'
                        : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    }`}
                  >
                    <MapPin size={12} className={selectedZone === zone.name ? 'text-primary' : 'text-muted-foreground/50'} />
                    <span className="truncate">{zone.name}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-3 text-xs text-muted-foreground text-center">
                  No zones match search
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Last updated */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock size={12} />
        <span>Updated 17 Jun 2026, 06:32 WIB</span>
        <span className="w-1.5 h-1.5 bg-positive rounded-full animate-pulse ml-1"></span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-border rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer"
          title="Refresh map data"
        >
          <RefreshCw size={13} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
        <button
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-border rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer"
          title="Export visible data as GeoJSON"
        >
          <Download size={13} />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
}