'use client';
import React, { useState } from 'react';
import { Search, Download, RefreshCw, Clock } from 'lucide-react';

export default function MapHeader() {
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className="glass-card-elevated border-b border-border px-4 py-2.5 flex items-center gap-3 shrink-0 z-20">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e?.target?.value)}
          placeholder="Search zone, location, or report ID..."
          className="w-full bg-muted/60 border border-border rounded-lg pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40"
        />
      </div>
      {/* Last updated */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock size={12} />
        <span>Updated 17 Jun 2026, 06:32 WIB</span>
        <span className="w-1.5 h-1.5 bg-positive rounded-full animate-pulse ml-1"></span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-border rounded-lg px-3 py-1.5 transition-all duration-200"
          title="Refresh map data"
        >
          <RefreshCw size={13} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
        <button
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-border rounded-lg px-3 py-1.5 transition-all duration-200"
          title="Export visible data as GeoJSON"
        >
          <Download size={13} />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
}