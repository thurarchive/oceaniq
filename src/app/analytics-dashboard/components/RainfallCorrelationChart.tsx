'use client';
import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';

const correlationData = [
  { rainfallMm: 45, wasteDensity: 28.4, zone: 'Subang' },
  { rainfallMm: 72, wasteDensity: 31.2, zone: 'Indramayu' },
  { rainfallMm: 95, wasteDensity: 33.8, zone: 'Karawang' },
  { rainfallMm: 118, wasteDensity: 36.1, zone: 'Karawang' },
  { rainfallMm: 142, wasteDensity: 38.4, zone: 'Bekasi' },
  { rainfallMm: 165, wasteDensity: 41.2, zone: 'Bekasi' },
  { rainfallMm: 178, wasteDensity: 42.6, zone: 'Citarum' },
  { rainfallMm: 195, wasteDensity: 44.8, zone: 'Citarum' },
  { rainfallMm: 210, wasteDensity: 43.1, zone: 'Teluk Jakarta' },
  { rainfallMm: 230, wasteDensity: 45.3, zone: 'Teluk Jakarta' },
  { rainfallMm: 248, wasteDensity: 47.8, zone: 'Teluk Jakarta' },
  { rainfallMm: 265, wasteDensity: 50.2, zone: 'Teluk Jakarta' },
  { rainfallMm: 282, wasteDensity: 52.4, zone: 'Teluk Jakarta' },
  { rainfallMm: 301, wasteDensity: 54.1, zone: 'Teluk Jakarta' },
  { rainfallMm: 155, wasteDensity: 38.9, zone: 'Bekasi' },
  { rainfallMm: 88, wasteDensity: 30.5, zone: 'Subang' },
  { rainfallMm: 125, wasteDensity: 35.2, zone: 'Karawang' },
  { rainfallMm: 312, wasteDensity: 58.9, zone: 'Teluk Jakarta' },
  { rainfallMm: 58, wasteDensity: 29.1, zone: 'Subang' },
  { rainfallMm: 220, wasteDensity: 46.5, zone: 'Citarum' },
];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: { rainfallMm: number; wasteDensity: number; zone: string } }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card-elevated border border-border rounded-xl px-3 py-2.5 shadow-xl bg-card/95">
      <p className="text-xs font-semibold text-foreground mb-1.5">{d.zone}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Curah Hujan</span>
          <span className="font-mono text-xs text-primary font-semibold">{d.rainfallMm} mm</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Densitas Sampah</span>
          <span className="font-mono text-xs text-accent font-semibold">{d.wasteDensity} kg/m²</span>
        </div>
      </div>
    </div>
  );
}

export default function RainfallCorrelationChart() {
  const { language, t } = useLanguage();

  return (
    <div className="glass-card-elevated border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">{t.analytics.rainfallCorrTitle}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t.analytics.rainfallCorrSub}</p>
        </div>
        <div className="glass-card border border-positive/30 px-2.5 py-1 rounded-lg">
          <span className="text-xs font-semibold text-positive">r = 0.87</span>
          <span className="text-xs text-muted-foreground ml-1">{language === 'id' ? 'kuat' : 'strong'}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <ScatterChart margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="rainfallMm"
            name="Rainfall"
            type="number"
            domain={[0, 350]}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            label={{ value: language === 'id' ? 'Curah Hujan (mm)' : 'Rainfall (mm)', position: 'insideBottom', offset: -2, fontSize: 10, fill: 'var(--muted-foreground)' }}
          />
          <YAxis
            dataKey="wasteDensity"
            name="Waste Density"
            type="number"
            domain={[20, 65]}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'kg/km²', angle: -90, position: 'insideLeft', offset: 8, fontSize: 10, fill: 'var(--muted-foreground)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={40} stroke="var(--muted-foreground)" strokeDasharray="4 3" strokeOpacity={0.4} />
          <Scatter
            data={correlationData}
            fill="var(--primary)"
            fillOpacity={0.7}
            shape={(props: { cx?: number; cy?: number }) => (
              <circle
                cx={props.cx}
                cy={props.cy}
                r={5}
                fill="var(--primary)"
                fillOpacity={0.75}
                stroke="var(--accent)"
                strokeWidth={0.8}
                strokeOpacity={0.5}
              />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>

      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
        <span className="w-3 h-px border-t border-dashed border-muted-foreground inline-block" />
        {language === 'id' ? 'Garis putus-putus = Ambang batas waspada 40 kg/km²' : 'Dashed line = 40 kg/km² alert threshold'}
      </p>
    </div>
  );
}