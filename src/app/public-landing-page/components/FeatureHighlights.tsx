'use client';
import React from 'react';
import Link from 'next/link';
import { Map, BarChart3, Brain, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FeatureHighlights() {
  const { language, t } = useLanguage();

  const features = [
    {
      id: 'feature-map',
      icon: Map,
      title: t.landing.features.f1Title,
      description: t.landing.features.f1Desc,
      href: '/interactive-map',
      cta: language === 'id' ? 'Buka Peta' : 'Open Map',
      accent: 'text-primary',
      accentBg: 'bg-primary/10',
      borderColor: 'border-primary/20 hover:border-primary/40',
      tags: language === 'id' ? ['Peta Panas', 'Kluster Data', 'Layer Interaktif'] : ['Heatmap', 'Clustering', 'Layer Toggles'],
    },
    {
      id: 'feature-analytics',
      icon: BarChart3,
      title: t.landing.features.f2Title,
      description: t.landing.features.f2Desc,
      href: '/analytics-dashboard',
      cta: language === 'id' ? 'Buka Analisis' : 'View Analytics',
      accent: 'text-accent',
      accentBg: 'bg-accent/10',
      borderColor: 'border-accent/20 hover:border-accent/40',
      tags: language === 'id' ? ['Tren Waktu', 'Komposisi', 'Korelasi Cuaca'] : ['Time-Series', 'Composition', 'Correlation'],
    },
    {
      id: 'feature-ml',
      icon: Brain,
      title: t.landing.features.f3Title,
      description: t.landing.features.f3Desc,
      href: '/contribute',
      cta: language === 'id' ? 'Kirim Laporan' : 'Contribute Now',
      accent: 'text-positive',
      accentBg: 'bg-positive/10',
      borderColor: 'border-positive/20 hover:border-positive/40',
      tags: language === 'id' ? ['Geo-Tagging', 'Bukti Foto', 'Verifikasi Ahli'] : ['Geo-Tagged', 'Photo Upload', 'Moderated'],
    },
    {
      id: 'feature-composition',
      icon: Users,
      title: t.landing.features.f4Title,
      description: t.landing.features.f4Desc,
      href: '/leaderboard',
      cta: language === 'id' ? 'Lihat Peringkat' : 'Explore Community',
      accent: 'text-warning',
      accentBg: 'bg-warning/10',
      borderColor: 'border-warning/20 hover:border-warning/40',
      tags: language === 'id' ? ['Standar UNEP', 'Sains Warga', 'Gamifikasi'] : ['UNEP Standard', 'Citizen Science', 'Gamification'],
    },
  ];

  return (
    <section className="px-6 lg:px-10 py-16">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-primary tracking-widest uppercase mb-3 block">
            {t.landing.features.tag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.landing.features.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.landing.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className={`glass-card-elevated border ${feature.borderColor} p-6 rounded-xl transition-all duration-300 group flex flex-col shadow-sm hover:shadow-md`}
              >
                <div className={`${feature.accentBg} ${feature.accent} w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent size={26} />
                </div>
                <h3 className="text-base text-foreground mb-2 font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{feature.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {feature.tags.map((tag) => (
                    <span
                      key={`${feature.id}-tag-${tag}`}
                      className="text-xs px-2 py-0.5 rounded-md glass-card border border-border text-muted-foreground font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={feature.href}
                  className={`flex items-center gap-1.5 text-sm font-semibold ${feature.accent} group-hover:gap-2.5 transition-all duration-200`}
                >
                  {feature.cta}
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}