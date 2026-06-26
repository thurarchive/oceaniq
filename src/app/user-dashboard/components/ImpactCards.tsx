'use client';
import React from 'react';
import { FileText, Scale, MapPin, TrendingUp } from 'lucide-react';
import { UserContributionStats } from '@/types/citizen-reports';

interface ImpactCardsProps {
  stats: UserContributionStats;
  loading?: boolean;
}

const cardDefs = [
  {
    id: 'card-submissions',
    label: 'Total Submissions',
    icon: <FileText size={18} />,
    key: 'total_submissions' as keyof UserContributionStats,
    unit: 'reports',
    color: 'text-primary',
    bgColor: 'bg-primary/8',
    borderColor: 'border-primary/20',
    trend: '+12% this month',
  },
  {
    id: 'card-weight',
    label: 'Debris Removed',
    icon: <Scale size={18} />,
    key: 'total_weight_kg' as keyof UserContributionStats,
    unit: 'kg',
    color: 'text-positive',
    bgColor: 'bg-positive/8',
    borderColor: 'border-positive/20',
    trend: 'Estimated removal',
  },
  {
    id: 'card-sites',
    label: 'Sites Cleaned',
    icon: <MapPin size={18} />,
    key: 'unique_sites' as keyof UserContributionStats,
    unit: 'locations',
    color: 'text-accent',
    bgColor: 'bg-accent/8',
    borderColor: 'border-accent/20',
    trend: 'Unique coastal sites',
  },
];

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
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cardDefs.map((card) => {
        const rawValue = stats[card.key];
        const displayValue =
          card.key === 'total_weight_kg'
            ? Number(rawValue).toFixed(1)
            : String(rawValue);

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

            {/* Value */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className={`kpi-value ${card.color}`}>{displayValue}</span>
              <span className="text-sm text-muted-foreground">{card.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
