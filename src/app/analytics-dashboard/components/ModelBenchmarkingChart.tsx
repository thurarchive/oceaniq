'use client';
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Brain, Trophy, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface MetricDetail {
  mae: number;
  rmse: number;
}

interface BenchmarkSite {
  site_id: number;
  site_name: string;
  lat: number;
  lng: number;
  metrics: {
    xgboost: MetricDetail;
    chronos: MetricDetail;
    chronos_tuned: MetricDetail;
  };
  series: Array<{
    date: string;
    actual: number;
    xgboost: number;
    chronos: number;
    chronos_tuned: number;
    weather: string;
    tides_in_number: number;
    debris_coverage: number;
  }>;
}

interface BenchmarkingData {
  overall_metrics: {
    xgboost: MetricDetail;
    chronos: MetricDetail;
    chronos_tuned: MetricDetail;
  };
  sites: {
    [key: string]: BenchmarkSite;
  };
  last_updated: string;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({ active, payload, label, unit }: { active?: boolean; payload?: TooltipPayload[]; label?: string; unit?: string }) {
  if (!active || !payload?.length) return null;

  const dateStr = label ? new Date(label).toLocaleDateString('id-ID', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  return (
    <div className="glass-card-elevated border border-border rounded-xl px-4 py-3 shadow-2xl min-w-48 bg-card/95">
      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{dateStr || label}</p>
      {payload.map((entry) => (
        <div key={`tt-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
            <span className="text-xs text-muted-foreground">{entry.name}</span>
          </div>
          <span className="font-mono text-xs font-semibold text-foreground">
            {entry.value.toLocaleString()} {unit || 'item'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ModelBenchmarkingChart() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<BenchmarkingData | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('1');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/model_benchmarking.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load benchmarking data file');
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching benchmarking data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="glass-card-elevated border border-border rounded-xl p-6 h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card-elevated border border-border rounded-xl p-6 h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <AlertCircle className="text-danger w-10 h-10" />
          <h3 className="text-sm font-semibold text-foreground">
            {language === 'id' ? 'Gagal Memuat Tolok Ukur AI' : 'Benchmark Loading Failed'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {language === 'id' ? 'Silakan jalankan skrip perbandingan model AI terlebih dahulu.' : 'Please run the benchmarking script to train models and generate results first.'}
          </p>
        </div>
      </div>
    );
  }

  const selectedSite = data.sites[selectedSiteId];
  if (!selectedSite) return null;

  const xgbMae = selectedSite.metrics.xgboost.mae;
  const xgbRmse = selectedSite.metrics.xgboost.rmse;
  const chronosMae = selectedSite.metrics.chronos.mae;
  const chronosRmse = selectedSite.metrics.chronos.rmse;
  const chronosTunedMae = selectedSite.metrics.chronos_tuned.mae;
  const chronosTunedRmse = selectedSite.metrics.chronos_tuned.rmse;

  // Determine winner for current site
  const minMae = Math.min(xgbMae, chronosMae, chronosTunedMae);
  const maeWinner = minMae === xgbMae ? 'xgboost' : minMae === chronosMae ? 'chronos' : 'chronos_tuned';

  // Average comparison
  const overallXgbMae = data.overall_metrics.xgboost.mae;
  const overallChronosMae = data.overall_metrics.chronos.mae;
  const overallChronosTunedMae = data.overall_metrics.chronos_tuned.mae;

  const minOverallMae = Math.min(overallXgbMae, overallChronosMae, overallChronosTunedMae);
  const overallWinner = minOverallMae === overallXgbMae
    ? 'XGBoost (Tuned Tabular)'
    : minOverallMae === overallChronosMae
      ? 'Chronos-T5 (Zero-Shot Tiny)'
      : 'Chronos-T5 (Fine-Tuned Small)';
  const overallWinnerMae = minOverallMae;

  return (
    <div className="glass-card-elevated border border-border rounded-xl p-6 h-full flex flex-col justify-between shadow-sm">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="text-primary" size={20} />
            <h3 className="text-base font-bold text-foreground">
              {t.analytics.mlBenchmarkTitle}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t.analytics.mlBenchmarkSub}
          </p>
        </div>

        {/* Dropdown site switcher */}
        <div className="flex items-center gap-2">
          <label htmlFor="site-select" className="text-xs text-muted-foreground font-medium">
            {language === 'id' ? 'Stasiun Terpilih:' : 'Active Station:'}
          </label>
          <select
            id="site-select"
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="bg-card hover:bg-card/80 text-xs font-semibold text-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer min-w-[200px]"
          >
            {Object.keys(data.sites).map((sId) => (
              <option key={sId} value={sId}>
                {data.sites[sId].site_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Stats comparing MAE & RMSE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Card 1: XGBoost Metrics */}
        <div className="border border-border/60 bg-card/40 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Global XGBoost (Tuned)</span>
            {maeWinner === 'xgboost' && (
              <span className="text-[10px] font-bold text-positive bg-positive/10 border border-positive/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Trophy size={10} /> TERBAIK
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">MAE (Error)</p>
              <p className="text-xl font-mono font-bold text-foreground mt-0.5">{xgbMae.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">RMSE (Varians)</p>
              <p className="text-xl font-mono font-bold text-foreground mt-0.5">{xgbRmse.toFixed(1)}</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            {language === 'id' ? 'Memanfaatkan lag + cuaca & pasang surut maritim' : 'Uses lags + local environmental factors (weather, tides)'}
          </p>
        </div>

        {/* Card 2: Chronos Zero-Shot Metrics */}
        <div className="border border-border/60 bg-card/40 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Chronos T5 (Zero-Shot)</span>
            {maeWinner === 'chronos' && (
              <span className="text-[10px] font-bold text-positive bg-positive/10 border border-positive/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Trophy size={10} /> TERBAIK
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">MAE (Error)</p>
              <p className="text-xl font-mono font-bold text-foreground mt-0.5">{chronosMae.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">RMSE (Varians)</p>
              <p className="text-xl font-mono font-bold text-foreground mt-0.5">{chronosRmse.toFixed(1)}</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            {language === 'id' ? 'Prediksi univariat zero-shot murni dari deret waktu' : 'Zero-Shot univariate forecast (past sequences only)'}
          </p>
        </div>

        {/* Card 3: Chronos Fine-Tuned Metrics */}
        <div className="border border-border/60 bg-card/40 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Chronos T5 (Fine-Tuned)</span>
            {maeWinner === 'chronos_tuned' && (
              <span className="text-[10px] font-bold text-positive bg-positive/10 border border-positive/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Trophy size={10} /> TERBAIK
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">MAE (Error)</p>
              <p className="text-xl font-mono font-bold text-foreground mt-0.5">{chronosTunedMae.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">RMSE (Varians)</p>
              <p className="text-xl font-mono font-bold text-foreground mt-0.5">{chronosTunedRmse.toFixed(1)}</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            {language === 'id' ? 'Adaptasi domain khusus model transformer T5-Small' : 'Domain-adapted T5-Small on mock waste observations'}
          </p>
        </div>

        {/* Card 4: Summary Insights */}
        <div className="border border-border/60 bg-primary/5 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-primary">
              {language === 'id' ? 'Ringkasan Evaluasi Regional' : 'Regional Performance Summary'}
            </span>
            <p className="text-xs text-foreground mt-2 leading-relaxed">
              {language === 'id'
                ? <>Di seluruh stasiun, <span className="font-semibold text-accent">{overallWinner}</span> menghasilkan MAE terendah sebesar <span className="font-semibold">{overallWinnerMae.toFixed(1)}</span>.</>
                : <>Across all sites, <span className="font-semibold text-accent">{overallWinner}</span> wins the forecast with an overall MAE of <span className="font-semibold">{overallWinnerMae.toFixed(1)}</span>.</>}
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 border-t border-border/30 pt-2 flex items-center justify-between">
            <span>{t.map.lastUpdated}: {data.last_updated}</span>
            <span className="text-primary font-bold">{language === 'id' ? 'Iterasi Teroptimasi' : 'Fine-Tuned Run'}</span>
          </p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="h-80 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={selectedSite.series}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(str) => {
                const parts = str.split('-');
                return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : str;
              }}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip content={<CustomTooltip unit={language === 'id' ? 'item' : 'units'} />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', color: 'var(--muted-foreground)' }}
            />
            <Line
              type="monotone"
              name={language === 'id' ? 'Observasi Aktual' : 'Actual observations'}
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              name="XGBoost (Tuned Tabular)"
              dataKey="xgboost"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              name="Chronos (Zero-Shot Tiny)"
              dataKey="chronos"
              stroke="#a855f7"
              strokeWidth={1.8}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              name="Chronos (Fine-Tuned Small)"
              dataKey="chronos_tuned"
              stroke="#f59e0b"
              strokeWidth={1.8}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Explanation / Why this model fits */}
      <div className="border border-border/50 bg-card/40 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
          <AlertCircle size={14} className="text-accent" /> {language === 'id' ? 'Analisis Kesesuaian Model:' : 'Why this model fits:'}
        </h4>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {maeWinner === 'xgboost' ? (
            <span>
              <strong>XGBoost lebih unggul</strong> {language === 'id'
                ? 'pada lokasi ini karena model memperhitungkan kovariat meteorologi maritim (seperti curah hujan dan pasang surut) secara langsung terhadap lonjakan sampah.'
                : 'on this site because it actively incorporates environmental covariates (like rainfall runoff and tides).'}
            </span>
          ) : maeWinner === 'chronos_tuned' ? (
            <span>
              <strong>Fine-Tuned Chronos lebih unggul</strong> {language === 'id'
                ? 'karena arsitektur transformer seq2seq telah disesuaikan secara khusus dengan pola distribusi observasi sampah di pesisir ini.'
                : 'here because the pre-trained seq2seq transformer has been adapted specifically to the mock waste observations distribution.'}
            </span>
          ) : (
            <span>
              <strong>Zero-Shot Chronos lebih unggul</strong> {language === 'id'
                ? 'karena stasiun ini memiliki siklus pasang surut dan musiman yang sangat teratur tanpa anomali ekstrem.'
                : 'here because the site exhibits extremely strong baseline cycles (tides, seasonality) and fewer weather-dependent anomalies.'}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
