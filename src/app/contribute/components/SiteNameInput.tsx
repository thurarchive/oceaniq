'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Waves, Plus, Check, ChevronDown } from 'lucide-react';
import siteLags from '@/data/site_lags.json';

interface SiteNameInputProps {
  value: string;
  onChange: (val: string) => void;
  id?: string;
  placeholder?: string;
}

const DEFAULT_BEACH_SUGGESTIONS = [
  'Ancol Beach, North Jakarta',
  'Muara Angke Coastal Area',
  'Marunda Beach, North Jakarta',
  'Tanjung Pasir Beach, Tangerang',
  'Pantai Indah Kapuk (PIK) Coast',
  'Kuta Beach, Bali',
  'Pangandaran Beach, West Java',
  'Kepulauan Seribu (Thousand Islands)',
  'Semarang Port & Wetland',
  'Kenjeran Beach, Surabaya',
];

export default function SiteNameInput({
  value,
  onChange,
  id = 'field-site-name',
  placeholder = 'e.g., Ancol Beach, Dermaga 3, Muara Angke…',
}: SiteNameInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customSuggestions, setCustomSuggestions] = useState<string[]>([]);
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

  // Filter combined suggestions based on current input text
  const siteLagsNames = (siteLags as any[]).map((s) => s.site_name).filter(Boolean);
  const allSuggestions = Array.from(
    new Set([...customSuggestions, ...DEFAULT_BEACH_SUGGESTIONS, ...siteLagsNames])
  );

  const filtered = value.trim()
    ? allSuggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
    : allSuggestions.slice(0, 8);

  const showAddCustom =
    value.trim() && !allSuggestions.some((s) => s.toLowerCase() === value.trim().toLowerCase());

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
  };

  const handleAddCustomSuggestion = () => {
    if (!value.trim()) return;
    const newName = value.trim();
    if (!customSuggestions.includes(newName)) {
      setCustomSuggestions((prev) => [newName, ...prev]);
    }
    onChange(newName);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="auth-input w-full pr-8"
          style={{ paddingLeft: '0.75rem' }}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2.5 text-slate-400 hover:text-slate-200 transition-colors p-1"
        >
          <ChevronDown size={15} className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-100 divide-y divide-slate-800">
          <div className="p-1.5 space-y-0.5">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-sky-500/15 hover:text-sky-300 rounded-lg flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Waves size={13} className="text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="truncate">{item}</span>
                  </div>
                  {value === item && <Check size={13} className="text-sky-400 shrink-0" />}
                </button>
              ))
            ) : (
              <div className="p-2 text-center text-xs text-slate-400">No matching site suggestions found.</div>
            )}
          </div>

          {showAddCustom && (
            <div className="p-1.5 bg-sky-950/30">
              <button
                type="button"
                onClick={handleAddCustomSuggestion}
                className="w-full px-3 py-2 text-left text-xs text-sky-300 hover:bg-sky-500/20 rounded-lg flex items-center gap-2 transition-colors font-medium"
              >
                <Plus size={14} className="text-sky-400 shrink-0" />
                <span>Use custom site name: <strong className="text-white">"{value}"</strong></span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
