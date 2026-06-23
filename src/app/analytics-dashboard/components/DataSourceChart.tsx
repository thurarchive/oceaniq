'use client';
import React from 'react';
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer, } from 'recharts';

// Backend integration point: GET /api/v1/analytics/summary?breakdown=source
const sourceData = [
  {
    id: 'src-verified',
    name: 'Verified Obs.',
    value: 52,
    count: 12847,
    fill: 'var(--positive)',
  },
  {
    id: 'src-citizen',
    name: 'Citizen Reports',
    value: 25,
    count: 6204,
    fill: 'var(--accent)',
  },
  {
    id: 'src-ml',
    name: 'ML Estimates',
    value: 23,
    count: 3517,
    fill: 'var(--warning)',
  },
];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: { name: string; value: number; count: number } }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card-elevated border border-border rounded-xl px-3 py-2.5 shadow-xl">
      <p className="text-xs font-semibold text-foreground mb-1">{d.name}</p>
      <p className="font-mono text-xs text-primary">{d.value}% of dataset</p>
      <p className="font-mono text-xs text-muted-foreground">{d.count.toLocaleString('en-US')} records</p>
    </div>
  );
}

export default function DataSourceChart() {
  return (
    <div className="glass-card-elevated border border-border rounded-xl p-5 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Data Source Breakdown</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Total dataset composition by source type</p>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="30%"
            outerRadius="90%"
            data={sourceData}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={4}
              background={{ fill: 'var(--muted)' }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Source breakdown list */}
        <div className="space-y-2.5 mt-2">
          {sourceData.map((source) => (
            <div key={source.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: source.fill }} />
                <span className="text-xs text-muted-foreground">{source.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{source.count.toLocaleString('en-US')}</span>
                <span className="font-mono text-xs font-semibold text-foreground w-8 text-right">{source.value}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total records</span>
            <span className="font-mono text-sm font-bold text-foreground">22,568</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Last ingestion: 17 Jun 2026, 06:00 WIB</p>
        </div>
      </div>
    </div>
  );
}