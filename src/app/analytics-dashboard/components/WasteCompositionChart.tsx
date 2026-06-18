'use client';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  } from 'recharts';

// Backend integration point: GET /api/v1/analytics/composition?groupBy=zone
const compositionData = [
  { zone: 'N. Jakarta', plastic: 62, organic: 14, fishingGear: 12, mixed: 12 },
  { zone: 'Bekasi', plastic: 55, organic: 22, fishingGear: 8, mixed: 15 },
  { zone: 'Citarum', plastic: 48, organic: 28, fishingGear: 10, mixed: 14 },
  { zone: 'Karawang', plastic: 38, organic: 18, fishingGear: 32, mixed: 12 },
  { zone: 'Subang', plastic: 44, organic: 20, fishingGear: 22, mixed: 14 },
  { zone: 'Indramayu', plastic: 35, organic: 15, fishingGear: 38, mixed: 12 },
];

const categories = [
  { key: 'plastic', label: 'Plastic', color: 'var(--primary)' },
  { key: 'organic', label: 'Organic', color: 'var(--positive)' },
  { key: 'fishingGear', label: 'Fishing Gear', color: 'var(--accent)' },
  { key: 'mixed', label: 'Mixed', color: 'var(--muted-foreground)' },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; fill: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-elevated border border-border rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={`comp-tt-${entry.name}`} className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: entry.fill }} />
            <span className="text-xs text-muted-foreground">{entry.name}</span>
          </div>
          <span className="font-mono text-xs font-semibold text-foreground">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function WasteCompositionChart() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="glass-card-elevated border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Waste Composition by Zone</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Category breakdown (% of total) — Jun 2026</p>
        </div>
      </div>

      {/* Category legend / filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={`comp-cat-${cat.key}`}
            onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
              activeCategory === null || activeCategory === cat.key
                ? 'border-border/60 text-foreground'
                : 'border-border/20 text-muted-foreground/40'
            }`}
          >
            <div className="w-2 h-2 rounded-sm" style={{ background: cat.color }} />
            {cat.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={compositionData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal vertical={false} />
          <XAxis
            dataKey="zone"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          {categories.map((cat) => (
            <Bar
              key={`bar-${cat.key}`}
              dataKey={cat.key}
              name={cat.label}
              stackId="composition"
              fill={cat.color}
              opacity={activeCategory === null || activeCategory === cat.key ? 1 : 0.15}
              radius={cat.key === 'mixed' ? [3, 3, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}