'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Waves } from 'lucide-react';
import siteLags from '@/data/site_lags.json';

interface SearchResult {
  id: string;
  name: string;
  subtext?: string;
  lat: number;
  lng: number;
  type: 'local_site' | 'geocoded' | 'custom';
}

interface LocationSearchInputProps {
  onSelectLocation: (location: { lat: number; lng: number; placeName: string }) => void;
  placeholder?: string;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Known popular coastal sites for quick suggestions
const POPULAR_COASTAL_SITES: SearchResult[] = [
  { id: 'pop-1', name: 'Ancol Beach, Jakarta', subtext: 'North Jakarta Coast', lat: -6.1176, lng: 106.8488, type: 'local_site' },
  { id: 'pop-2', name: 'Muara Angke, Jakarta', subtext: 'Fisheries Port & Wetland', lat: -6.1098, lng: 106.7725, type: 'local_site' },
  { id: 'pop-3', name: 'Marunda Beach, North Jakarta', subtext: 'Coastal Debris Area', lat: -6.0967, lng: 106.9583, type: 'local_site' },
  { id: 'pop-4', name: 'Kuta Beach, Bali', subtext: 'Badung Coast', lat: -8.7176, lng: 115.1691, type: 'local_site' },
  { id: 'pop-5', name: 'Pangandaran Beach, West Java', subtext: 'Southern Ocean Bay', lat: -7.7025, lng: 108.4912, type: 'local_site' },
  { id: 'pop-6', name: 'Thousand Islands (Kepulauan Seribu)', subtext: 'Marine National Park', lat: -5.6122, lng: 106.5654, type: 'local_site' },
];

export default function LocationSearchInput({
  onSelectLocation,
  placeholder = 'Type area name, beach, city, or landmark…',
}: LocationSearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const qLower = query.toLowerCase();

      // 1. Local site lags matches
      const localMatches: SearchResult[] = (siteLags as any[])
        .filter((s) => s.site_name && s.site_name.toLowerCase().includes(qLower))
        .slice(0, 3)
        .map((s) => ({
          id: `site-${s.site_id}`,
          name: s.site_name,
          subtext: `Monitoring Zone #${s.site_id}`,
          lat: s.lat,
          lng: s.lng,
          type: 'local_site',
        }));

      // 2. Popular coastal site matches
      const popMatches = POPULAR_COASTAL_SITES.filter((p) =>
        p.name.toLowerCase().includes(qLower) || p.subtext?.toLowerCase().includes(qLower)
      );

      // 3. Geocoding API fetch (Mapbox or Nominatim fallback)
      let apiMatches: SearchResult[] = [];
      try {
        if (MAPBOX_TOKEN) {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              query
            )}.json?access_token=${MAPBOX_TOKEN}&limit=5&autocomplete=true`
          );
          if (res.ok) {
            const data = await res.json();
            apiMatches = (data.features || []).map((f: any) => ({
              id: f.id,
              name: f.place_name_en || f.place_name,
              subtext: f.context ? f.context.map((c: any) => c.text).join(', ') : undefined,
              lat: f.center[1],
              lng: f.center[0],
              type: 'geocoded',
            }));
          }
        } else {
          // OpenStreetMap Nominatim Fallback
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
            { headers: { 'User-Agent': 'Oceaniq-App/1.0' } }
          );
          if (res.ok) {
            const data = await res.json();
            apiMatches = data.map((item: any, idx: number) => ({
              id: `nom-${idx}-${item.place_id}`,
              name: item.display_name,
              subtext: item.type ? `Location (${item.type})` : undefined,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              type: 'geocoded',
            }));
          }
        }
      } catch (err) {
        console.error('Geocoding search failed:', err);
      }

      // Combine unique results
      const combined = [...localMatches, ...popMatches];
      apiMatches.forEach((item) => {
        if (!combined.some((c) => Math.abs(c.lat - item.lat) < 0.001 && Math.abs(c.lng - item.lng) < 0.001)) {
          combined.push(item);
        }
      });

      setResults(combined);
      setLoading(false);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: SearchResult) => {
    onSelectLocation({ lat: item.lat, lng: item.lng, placeName: item.name });
    setQuery(item.name);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-sky-400 pointer-events-none">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim() || results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-9 py-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all shadow-inner"
        />
        {loading ? (
          <div className="absolute right-3 text-slate-400">
            <Loader2 size={16} className="animate-spin text-sky-400" />
          </div>
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X size={15} />
          </button>
        ) : null}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-slate-900 border border-sky-500/30 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          {loading && results.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin text-sky-400" /> Searching location database & geocoder…
            </div>
          ) : results.length > 0 ? (
            <div className="py-1 divide-y divide-slate-800/60">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-sky-500/10 transition-colors flex items-start gap-2.5 group"
                >
                  <div className="mt-0.5 shrink-0 text-sky-400 group-hover:scale-110 transition-transform">
                    {item.type === 'local_site' ? <Waves size={16} /> : <MapPin size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 truncate flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.type === 'local_site' && (
                        <span className="bg-sky-500/20 text-sky-300 text-[10px] px-1.5 py-0.2 rounded-md border border-sky-500/30">
                          Monitoring Site
                        </span>
                      )}
                    </div>
                    {item.subtext && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtext}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-3 text-center text-xs text-slate-400">
              No matching geocoded places found.
              <p className="text-[11px] text-sky-400 mt-1">You can still drop a pin directly on the interactive map!</p>
            </div>
          ) : (
            <div className="p-3 text-left">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Suggested Marine Areas</p>
              <div className="space-y-1">
                {POPULAR_COASTAL_SITES.slice(0, 4).map((pop) => (
                  <button
                    key={pop.id}
                    type="button"
                    onClick={() => handleSelect(pop)}
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-sky-500/15 hover:text-sky-300 text-left flex items-center gap-2 transition-colors"
                  >
                    <Waves size={13} className="text-sky-400 shrink-0" />
                    <span className="truncate">{pop.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
