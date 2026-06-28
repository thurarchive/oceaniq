'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, Download, RefreshCw, Clock, ChevronDown, MapPin, Brain } from 'lucide-react';
import { ZONES } from '@/constants/zones';
import { supabase } from '@/lib/supabase';

const formatDateToWIB = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(date);
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';
    const hour = parts.find(p => p.type === 'hour')?.value || '';
    const minute = parts.find(p => p.type === 'minute')?.value || '';

    return `${day} ${month} ${year}, ${hour}:${minute} WIB`;
  } catch {
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
  }
};

type MapHeaderProps = {
  selectedZone: string;
  onZoneChange: (zone: string) => void;
  onRefresh: () => void;
  isExperimental: boolean;
  onToggleExperimental: () => void;
};

export default function MapHeader({ selectedZone, onZoneChange, onRefresh, isExperimental, onToggleExperimental }: MapHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [lastUpdatedText, setLastUpdatedText] = useState<string>('17 Jun 2026, 06:32 WIB');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLastUpdated = async () => {
    try {
      const tableName = isExperimental ? 'waste_observations_test' : 'waste_observations';
      const [wasteRes, citizenRes] = await Promise.all([
        supabase
          .from(tableName)
          .select('observation_time')
          .not('observation_time', 'is', null)
          .order('observation_time', { ascending: false })
          .limit(1),
        supabase
          .from('citizen_reports')
          .select('observation_time')
          .eq('status', 'approved')
          .not('observation_time', 'is', null)
          .order('observation_time', { ascending: false })
          .limit(1)
      ]);

      if (wasteRes.error) throw wasteRes.error;
      if (citizenRes.error) throw citizenRes.error;

      const wasteTime = wasteRes.data?.[0]?.observation_time;
      const citizenTime = citizenRes.data?.[0]?.observation_time;

      let latestTime = null;
      if (wasteTime && citizenTime) {
        latestTime = new Date(wasteTime) > new Date(citizenTime) ? wasteTime : citizenTime;
      } else {
        latestTime = wasteTime || citizenTime;
      }

      if (latestTime) {
        setLastUpdatedText(formatDateToWIB(latestTime));
      }
    } catch (err) {
      console.warn('Error fetching observation time:', err);
    }
  };

  const [siteNames, setSiteNames] = useState<string[]>([]);

  const fetchSiteNames = async () => {
    try {
      const tableName = isExperimental ? 'waste_observations_test' : 'waste_observations';
      let query = supabase
        .from(tableName)
        .select('site_name')
        .not('site_name', 'is', null);

      if (isExperimental) {
        query = query.eq('observation_time', '2025-12-31T12:00:00Z');
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const uniqueNames = Array.from(new Set(data.map(item => item.site_name)));
        setSiteNames(uniqueNames.filter(Boolean) as string[]);
      }
    } catch (err) {
      console.warn('Error fetching site names:', err);
    }
  };

  useEffect(() => {
    fetchLastUpdated();
    fetchSiteNames();
  }, [isExperimental]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchLastUpdated();
      fetchSiteNames();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      onRefresh();
      await Promise.all([fetchLastUpdated(), fetchSiteNames()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFilteredOptions = () => {
    if (!searchQuery.trim()) {
      return ZONES.map(z => ({ name: z.name, isSite: false }));
    }

    const query = searchQuery.toLowerCase();

    const zoneMatches = ZONES.filter(z =>
      z.name.toLowerCase().includes(query)
    ).map(z => ({ name: z.name, isSite: false }));

    const siteMatches = siteNames.filter(name =>
      name.toLowerCase().includes(query) &&
      !ZONES.some(z => z.name.toLowerCase() === name.toLowerCase())
    ).map(name => ({ name, isSite: true }));

    return [...zoneMatches, ...siteMatches];
  };

  const filteredOptions = getFilteredOptions();

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
          <span className="flex items-center gap-2 truncate">
            <MapPin size={14} className="text-primary shrink-0 animate-pulse" />
            <span className="truncate font-medium">{selectedZone}</span>
          </span>
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
                  placeholder="Search monitoring zones and recorded sites..."
                  className="w-full bg-muted/80 border border-border rounded-md pl-7 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30"
                  autoFocus
                />
              </div>
            </div>

            {/* Zones & Sites List */}
            <div className="max-h-60 overflow-y-auto scrollbar-ocean py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => {
                      onZoneChange(option.name);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors cursor-pointer ${selectedZone === option.name
                      ? 'bg-primary/10 text-primary font-semibold font-medium'
                      : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                      }`}
                  >
                    <MapPin size={12} className={selectedZone === option.name ? 'text-primary' : 'text-muted-foreground/50'} />
                    <span className="truncate flex-1">{option.name}</span>
                    {option.isSite && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0 scale-90 origin-right">
                        Recorded Site
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-3 text-xs text-muted-foreground text-center">
                  No zones or sites match search
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Last updated */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock size={14} />
        <span>Updated {lastUpdatedText}</span>
        <span className="w-1.5 h-1.5 bg-positive rounded-full animate-pulse ml-1"></span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onToggleExperimental}
          className={`flex items-center gap-1.5 text-xs border rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer ${
            isExperimental
              ? 'bg-warning/20 hover:bg-warning/30 border-warning text-warning font-semibold shadow-[0_0_8px_rgba(245,158,11,0.2)]'
              : 'bg-muted/40 hover:bg-muted/70 border-border text-muted-foreground hover:text-foreground'
          }`}
          title="Toggle Experimental ML Pipeline mode"
        >
          <Brain size={13} className={isExperimental ? 'animate-pulse' : ''} />
          <span>{isExperimental ? 'ML Mode (Active) (Experimental)' : 'ML Mode (Experimental)'}</span>
        </button>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-border rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer disabled:opacity-50"
          title="Refresh map data"
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
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