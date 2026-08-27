'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Map, BarChart3, ChevronRight, Waves } from 'lucide-react';
import { getQuantitativeSubmissionStats, QuantitativeStats } from '@/lib/waste-observations';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
  const { language, t } = useLanguage();
  const [stats, setStats] = useState<QuantitativeStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const res = await getQuantitativeSubmissionStats();
      setStats(res);
    }
    fetchStats();
  }, []);

  const displayRecordCount = stats ? stats.totalRecords.toLocaleString() : '171';
  const displayZoneCount = stats ? stats.totalZones.toLocaleString() : '847';

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
      />

      {/* Animated wave rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3].map((i) => (
          <div
            key={`wave-ring-${i}`}
            className="absolute rounded-full border border-primary/10"
            style={{
              width: `${i * 280}px`,
              height: `${i * 280}px`,
              animation: `pulse-ring ${2 + i * 0.8}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 glass-card border border-primary/20 px-4 py-1.5 rounded-full mb-8 shadow-xs">
          <span className="w-2 h-2 bg-positive rounded-full animate-pulse"></span>
          <span className="text-xs font-semibold text-primary tracking-wider uppercase">
            {language === 'id'
              ? `Laporan Terverifikasi — ${displayRecordCount} catatan di ${displayZoneCount} zona`
              : `Verified Submissions — ${displayRecordCount} records across ${displayZoneCount} zones`}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 text-foreground">
          {language === 'id' ? (
            <>
              Platform Sains Warga
              <br />
              <span className="text-gradient-ocean">Untuk Pemantauan Sampah Pesisir</span>
              <br />
              di Indonesia
            </>
          ) : (
            <>
              A Citizen Science Platform
              <br />
              <span className="text-gradient-ocean">for Coastal Monitoring</span>
              <br />
              in Indonesia
            </>
          )}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          {t.landing.heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/interactive-map"
            className="btn-primary flex items-center gap-2.5 text-base px-8 py-3.5 teal-glow w-full sm:w-auto justify-center"
          >
            <Map size={18} />
            {t.landing.exploreMap}
            <ChevronRight size={16} />
          </Link>
          <Link
            href="/contribute"
            className="btn-ghost flex items-center gap-2.5 text-base px-8 py-3.5 w-full sm:w-auto justify-center"
          >
            <Waves size={18} />
            {t.landing.reportWaste}
          </Link>
        </div>

        {/* Hero visual — stylized map preview */}
        <div className="glass-card-elevated border border-primary/20 rounded-2xl overflow-hidden relative float-animation shadow-2xl">
          <div className="bg-muted/40 px-4 py-2.5 border-b border-border flex items-center gap-2">
            <div className="flex gap-1.5">
              {['bg-danger/80', 'bg-warning/80', 'bg-positive/80'].map((c, i) => (
                <div key={`dot-${i}`} className={`w-2.5 h-2.5 rounded-full ${c}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-mono ml-2">oceaniq.id/map — {t.landing.liveBadge}</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-positive rounded-full animate-pulse"></span>
              <span className="text-xs text-positive font-medium">{t.common.verified}</span>
            </div>
          </div>

          <div className="h-48 md:h-64 bg-linear-to-b from-card to-background p-6 flex flex-col justify-between">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: language === 'id' ? 'Teluk Jakarta' : 'North Jakarta', status: 'Hotspot', val: '4.8 kg/m²', color: 'text-danger' },
                { label: language === 'id' ? 'Selat Bali' : 'Bali Strait', status: 'Moderate', val: '2.3 kg/m²', color: 'text-warning' },
                { label: language === 'id' ? 'Kep. Seribu' : 'Thousand Islands', status: 'Optimal', val: '0.6 kg/m²', color: 'text-positive' },
                { label: language === 'id' ? 'Teluk Ambon' : 'Ambon Bay', status: 'Hotspot', val: '3.9 kg/m²', color: 'text-danger' },
              ].map((loc) => (
                <div key={loc.label} className="glass-card p-3 rounded-lg border border-border/80 text-left bg-card/60">
                  <p className="text-xs text-muted-foreground">{loc.label}</p>
                  <p className={`font-mono font-bold text-base ${loc.color}`}>{loc.val}</p>
                  <span className="text-[10px] text-muted-foreground uppercase">{loc.status}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                {language === 'id' ? 'Stasiun BMKG & Model XGBoost Terhubung' : 'Connected to BMKG Sensors & XGBoost ML Engine'}
              </span>
              <Link href="/interactive-map" className="text-primary hover:underline flex items-center gap-1">
                {t.landing.exploreMap} <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}