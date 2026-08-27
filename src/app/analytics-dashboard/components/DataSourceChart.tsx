'use client';
import React from 'react';
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/context/LanguageContext';

export default function DataSourceChart() {
  const { language, t } = useLanguage();

  const sourceData = [
    {
      id: 'src-verified',
      name: language === 'id' ? 'Observasi Terverifikasi' : 'Verified Obs.',
      value: 52,
      count: 12847,
      fill: 'var(--positive)',
    },
    {
      id: 'src-citizen',
      name: language === 'id' ? 'Laporan Sains Warga' : 'Citizen Reports',
      value: 25,
      count: 6204,
      fill: 'var(--accent)',
    },
    {
      id: 'src-ml',
      name: language === 'id' ? 'Estimasi Model AI' : 'ML Estimates',
      value: 23,
      count: 3517,
      fill: 'var(--warning)',
    },
  ];

  function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: { name: string; value: number; count: number } }[] }) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="glass-card-elevated border border-border rounded-xl px-3 py-2.5 shadow-xl bg-card/95">
        <p className="text-xs font-semibold text-foreground mb-1">{d.name}</p>
        <p className="font-mono text-xs text-primary">{d.value}% dari dataset</p>
        <p className="font-mono text-xs text-muted-foreground">{d.count.toLocaleString('id-ID')} catatan</p>
      </div>
    );
  }

  return (
    <div className="glass-card-elevated border border-border rounded-xl p-5 h-full flex flex-col shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-foreground">{t.analytics.dataSourcesTitle}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{t.analytics.dataSourcesSub}</p>
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
                <span className="font-mono text-xs text-muted-foreground">{source.count.toLocaleString('id-ID')}</span>
                <span className="font-mono text-xs font-semibold text-foreground w-8 text-right">{source.value}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{language === 'id' ? 'Total observasi' : 'Total records'}</span>
            <span className="font-mono text-sm font-bold text-foreground">22.568</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{language === 'id' ? 'Pembaruan terakhir: Hari ini, 06:00 WIB' : 'Last ingestion: Today, 06:00 WIB'}</p>
        </div>
      </div>
    </div>
  );
}