'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useLanguage } from '@/context/LanguageContext';

const trendData = [
  { week: 'W1 Apr', wasteDensity: 38.4, rainfallMm: 142, baseline: 40 },
  { week: 'W2 Apr', wasteDensity: 41.2, rainfallMm: 168, baseline: 40 },
  { week: 'W3 Apr', wasteDensity: 39.8, rainfallMm: 95, baseline: 40 },
  { week: 'W4 Apr', wasteDensity: 43.1, rainfallMm: 210, baseline: 40 },
  { week: 'W1 May', wasteDensity: 42.6, rainfallMm: 185, baseline: 40 },
  { week: 'W2 May', wasteDensity: 45.3, rainfallMm: 230, baseline: 40 },
  { week: 'W3 May', wasteDensity: 44.7, rainfallMm: 178, baseline: 40 },
  { week: 'W4 May', wasteDensity: 47.1, rainfallMm: 255, baseline: 40 },
  { week: 'W1 Jun', wasteDensity: 46.4, rainfallMm: 198, baseline: 40 },
  { week: 'W2 Jun', wasteDensity: 48.2, rainfallMm: 270, baseline: 40 },
  { week: 'W3 Jun', wasteDensity: 46.9, rainfallMm: 215, baseline: 40 },
  { week: 'W4 Jun', wasteDensity: 47.3, rainfallMm: 240, baseline: 40 },
];

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-elevated border border-border rounded-xl px-4 py-3 shadow-2xl min-w-44 bg-card/95">
      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{label}</p>
      {payload.map((entry) => (
        <div key={`tt-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-xs text-muted-foreground">{entry.name}</span>
          </div>
          <span className="font-mono text-xs font-semibold text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function WasteTrendChart() {
  const { language, t } = useLanguage();

  return (
    <div className="glass-card-elevated border border-border rounded-xl p-5 h-full shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-sm font-bold text-foreground">{t.analytics.trendChartTitle}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {language === 'id' ? 'Tren bergulir 12 pekan — kg/km² dengan lapisan curah hujan (mm)' : '12-week rolling — kg/km² with rainfall overlay (mm)'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">{language === 'id' ? 'Densitas' : 'Density'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full bg-accent/60" />
            <span className="text-xs text-muted-foreground">{language === 'id' ? 'Hujan (BMKG)' : 'Rainfall'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-px border-t border-dashed border-muted-foreground" />
            <span className="text-xs text-muted-foreground">{language === 'id' ? 'Ambang Batas' : 'Baseline'}</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
          <defs>
            <linearGradient id="gradDensity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradRainfall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="density"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            domain={[30, 55]}
          />
          <YAxis
            yAxisId="rainfall"
            orientation="right"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 350]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            yAxisId="density"
            y={40}
            stroke="var(--muted-foreground)"
            strokeDasharray="3 3"
            strokeOpacity={0.5}
          />
          <Area
            yAxisId="rainfall"
            type="monotone"
            dataKey="rainfallMm"
            name={language === 'id' ? 'Curah Hujan (mm)' : 'Rainfall (mm)'}
            stroke="var(--accent)"
            strokeOpacity={0.4}
            fill="url(#gradRainfall)"
            strokeWidth={1.5}
          />
          <Area
            yAxisId="density"
            type="monotone"
            dataKey="wasteDensity"
            name={language === 'id' ? 'Densitas Sampah (kg/km²)' : 'Waste Density (kg/km²)'}
            stroke="var(--primary)"
            fill="url(#gradDensity)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}