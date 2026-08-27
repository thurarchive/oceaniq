'use client';
import React from 'react';
import Link from 'next/link';
import { AlertTriangle, MapPin, ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HotspotBanner() {
  const { language, t } = useLanguage();

  const hotspots = [
    {
      id: 'hotspot-jakarta-bay',
      zone: language === 'id' ? 'Teluk Jakarta Utara' : 'North Jakarta Bay',
      density: '84.2 kg/km²',
      change: language === 'id' ? '+18% dibanding pekan lalu' : '+18% vs last week',
      category: language === 'id' ? 'Dominan plastik & styrofoam' : 'Plastic-dominant',
      alertLevel: 'critical',
      updatedAt: language === 'id' ? '2j lalu' : '2h ago',
    },
    {
      id: 'hotspot-citarum',
      zone: language === 'id' ? 'Muara Sungai Citarum' : 'Citarum River Mouth',
      density: '67.8 kg/km²',
      change: language === 'id' ? '+9% dibanding pekan lalu' : '+9% vs last week',
      category: language === 'id' ? 'Campuran organik & plastik' : 'Mixed organic + plastic',
      alertLevel: 'high',
      updatedAt: language === 'id' ? '4j lalu' : '4h ago',
    },
    {
      id: 'hotspot-bekasi',
      zone: language === 'id' ? 'Zona Pesisir Muara Gembong' : 'Bekasi Coastal Zone',
      density: '51.3 kg/km²',
      change: language === 'id' ? '+4% dibanding pekan lalu' : '+4% vs last week',
      category: language === 'id' ? 'Jaring nelayan & plastik' : 'Fishing gear + plastic',
      alertLevel: 'elevated',
      updatedAt: language === 'id' ? '6j lalu' : '6h ago',
    },
  ];

  const alertColors = {
    critical: {
      bg: 'bg-danger/10',
      border: 'border-danger/30',
      text: 'text-danger',
      badge: language === 'id' ? 'KRITIS' : 'CRITICAL',
    },
    high: {
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      text: 'text-warning',
      badge: language === 'id' ? 'TINGGI' : 'HIGH',
    },
    elevated: {
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      text: 'text-primary',
      badge: language === 'id' ? 'WASPADA' : 'ELEVATED',
    },
  };

  return (
    <section className="px-6 lg:px-10 py-12">
      <div className="max-w-screen-2xl mx-auto">
        <div className="glass-card-elevated border border-danger/25 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-danger/20 flex items-center justify-between bg-danger/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-danger/15 flex items-center justify-center">
                <AlertTriangle size={16} className="text-danger" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{t.landing.hotspotBanner.tag}</h3>
                <p className="text-xs text-muted-foreground">
                  {language === 'id' ? '3 zona melampaui ambang batas — diperbarui hari ini' : '3 zones above alert threshold — updated today'}
                </p>
              </div>
            </div>
            <Link
              href="/interactive-map"
              className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:text-accent transition-colors"
            >
              {t.landing.hotspotBanner.action}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
            {hotspots.map((hotspot) => {
              const colors = alertColors[hotspot.alertLevel as keyof typeof alertColors];
              return (
                <div key={hotspot.id} className={`${colors.bg} p-5 hover:brightness-105 transition-all duration-200`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className={colors.text} />
                      <span className="text-sm font-semibold text-foreground">{hotspot.zone}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colors.bg} ${colors.border} ${colors.text} uppercase tracking-wider`}>
                      {colors.badge}
                    </span>
                  </div>
                  <p className={`font-mono text-2xl font-bold ${colors.text} mb-1`}>{hotspot.density}</p>
                  <p className="text-xs text-muted-foreground mb-2">{hotspot.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-danger font-medium">{hotspot.change}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={11} />
                      {hotspot.updatedAt}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}