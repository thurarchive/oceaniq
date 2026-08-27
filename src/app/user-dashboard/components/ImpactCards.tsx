'use client';
import React from 'react';
import { FileText, Scale, MapPin, CheckCircle2, TrendingUp } from 'lucide-react';
import { UserContributionStats } from '@/types/citizen-reports';
import { useLanguage } from '@/context/LanguageContext';

interface ImpactCardsProps {
  stats: UserContributionStats;
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="glass-card-elevated border border-border/40 rounded-xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-muted/60" />
        <div className="w-16 h-4 rounded bg-muted/40" />
      </div>
      <div className="w-20 h-3 rounded bg-muted/40 mb-2" />
      <div className="w-24 h-8 rounded bg-muted/50 mb-1" />
      <div className="w-28 h-3 rounded bg-muted/30" />
    </div>
  );
}

export default function ImpactCards({ stats, loading = false }: ImpactCardsProps) {
  const { language } = useLanguage();
  const isId = language === 'id';

  const cardDefs = [
    {
      id: 'card-submissions',
      label: isId ? 'Total Laporan' : 'Total Submissions',
      icon: <FileText size={18} />,
      key: 'total_submissions' as keyof UserContributionStats,
      unit: isId ? 'laporan' : 'reports',
      color: 'text-primary',
      bgColor: 'bg-primary/8',
      borderColor: 'border-primary/20',
      trend: isId ? 'Total catatan' : 'Total field logs',
    },
    {
      id: 'card-verified',
      label: isId ? 'Terverifikasi & Disetujui' : 'Verified & Approved',
      icon: <CheckCircle2 size={18} />,
      key: 'verified_submissions' as keyof UserContributionStats,
      unit: isId ? 'terverifikasi' : 'verified',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/8',
      borderColor: 'border-emerald-500/20',
      trend: isId ? 'Tervalidasi' : 'Quality assured',
    },
    {
      id: 'card-weight',
      label: isId ? 'Sampah Terverifikasi' : 'Debris Documented',
      icon: <Scale size={18} />,
      key: 'total_weight_kg' as keyof UserContributionStats,
      unit: 'kg',
      color: 'text-positive',
      bgColor: 'bg-positive/8',
      borderColor: 'border-positive/20',
      trend: isId ? 'Estimasi berat' : 'Estimated weight',
    },
    {
      id: 'card-sites',
      label: isId ? 'Lokasi Disurvei' : 'Sites Surveyed',
      icon: <MapPin size={18} />,
      key: 'unique_sites' as keyof UserContributionStats,
      unit: isId ? 'lokasi' : 'locations',
      color: 'text-accent',
      bgColor: 'bg-accent/8',
      borderColor: 'border-accent/20',
      trend: isId ? 'Titik rawan' : 'Coastal hotspots',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardDefs.map((card) => {
        const rawValue = stats[card.key] ?? (card.key === 'verified_submissions' ? Math.max(1, stats.total_submissions) : stats[card.key as keyof UserContributionStats]);
        const displayValue =
          card.key === 'total_weight_kg'
            ? Number(rawValue).toFixed(1)
            : String(rawValue ?? 0);

        return (
          <div
            key={card.id}
            className={`glass-card-elevated border ${card.borderColor} rounded-xl p-5 transition-all duration-300 hover:brightness-110 group`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-lg ${card.bgColor} ${card.color} flex items-center justify-center border ${card.borderColor} transition-transform duration-200 group-hover:scale-110`}
              >
                {card.icon}
              </div>
              <div className="flex items-center gap-1 text-positive">
                <TrendingUp size={12} />
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {card.trend}
                </span>
              </div>
            </div>

            {/* Label */}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {card.label}
            </p>

            {/* Big number */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-foreground font-mono">
                {displayValue}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {card.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
