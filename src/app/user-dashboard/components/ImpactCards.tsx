'use client';
import React from 'react';
import { FileText, CheckCircle2, MapPin, TrendingUp, Scale } from 'lucide-react';
import { UserContributionStats } from '@/types/citizen-reports';
import { useLanguage } from '@/context/LanguageContext';

interface ImpactCardsProps {
  stats: UserContributionStats;
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="glass-card-elevated border border-border/40 rounded-xl p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-muted/60" />
        <div className="w-20 h-3 rounded bg-muted/40 mt-1" />
      </div>
      <div className="w-24 h-3 rounded bg-muted/40 mb-2" />
      <div className="w-20 h-8 rounded bg-muted/50" />
    </div>
  );
}

export default function ImpactCards({ stats, loading = false }: ImpactCardsProps) {
  const { language } = useLanguage();
  const isId = language === 'id';
  const verified = stats.verified_submissions ?? 0;

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

  const cards = [
    {
      id: 'card-submissions',
      topRight: isId ? 'Total laporan lapangan' : 'Total field logs',
      label: isId ? 'TOTAL OBSERVASI' : 'TOTAL SUBMISSIONS',
      value: String(stats.total_submissions ?? 0),
      unit: isId ? 'laporan' : 'reports',
      icon: <FileText size={18} aria-hidden />,
      color: 'text-primary',
      bgColor: 'bg-primary/8',
      borderColor: 'border-primary/20',
    },
    {
      id: 'card-verified',
      topRight: isId ? 'Terjamin kualitas' : 'Quality assured',
      label: isId ? 'VERIFIKASI & DISETUJUI' : 'VERIFIED & APPROVED',
      value: String(verified),
      unit: isId ? 'terverifikasi' : 'verified',
      icon: <CheckCircle2 size={18} aria-hidden />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/8',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'card-weight',
      topRight: isId ? 'Estimasi berat' : 'Estimated weight',
      label: isId ? 'SAMPEL DIDOKUMENTASI' : 'DEBRIS DOCUMENTED',
      value: stats.total_weight_kg ? stats.total_weight_kg.toFixed(1) : '0',
      unit: 'kg',
      icon: <Scale size={18} aria-hidden />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/8',
      borderColor: 'border-amber-500/20',
    },
    {
      id: 'card-sites',
      topRight: isId ? 'Titik rawan pesisir' : 'Coastal hotspots',
      label: isId ? 'SITUS DISURVEI' : 'SITES SURVEYED',
      value: String(stats.unique_sites ?? 0),
      unit: isId ? 'lokasi' : 'locations',
      icon: <MapPin size={18} aria-hidden />,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/8',
      borderColor: 'border-sky-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.id} className={`glass-card-elevated border ${card.borderColor} rounded-xl p-5 relative overflow-hidden group`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${card.bgColor} ${card.color} ${card.borderColor}`}>
              {card.icon}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground/80">
              <TrendingUp size={12} className={card.color} />
              <span className="text-[10px] font-semibold tracking-wider">{card.topRight}</span>
            </div>
          </div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{card.label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-foreground font-mono leading-tight">{card.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{card.unit}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
