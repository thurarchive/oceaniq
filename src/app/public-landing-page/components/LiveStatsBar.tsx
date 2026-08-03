'use client';
import React from 'react';
import { Activity, MapPin, Users, Brain, TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface Stat {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: string;
  icon: LucideIcon;
  color: string;
  borderColor: string;
}

const stats: Stat[] = [
  {
    id: 'stat-observations',
    label: 'Total Observations',
    value: '24,831',
    change: '+312 this week',
    trend: 'up',
    icon: Activity,
    color: 'text-primary',
    borderColor: 'border-primary/30',
  },
  {
    id: 'stat-zones',
    label: 'Monitoring Zones',
    value: '847',
    change: '+14 new zones',
    trend: 'up',
    icon: MapPin,
    color: 'text-accent',
    borderColor: 'border-accent/30',
  },
  {
    id: 'stat-reports',
    label: 'Citizen Reports',
    value: '6,204',
    change: '+89 approved',
    trend: 'up',
    icon: Users,
    color: 'text-positive',
    borderColor: 'border-positive/30',
  },
  {
    id: 'stat-predictions',
    label: 'ML Predictions',
    value: '3,517',
    change: 'Avg 81% confidence',
    trend: 'neutral',
    icon: Brain,
    color: 'text-warning',
    borderColor: 'border-warning/30',
  },
];

export default function LiveStatsBar() {
  return (
    <section className="relative z-10 px-6 lg:px-10 pb-16 -mt-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats?.map((stat) => {
            const IconComponent = stat?.icon;
            return (
              <div
                key={stat?.id}
                suppressHydrationWarning
                className={`glass-card-elevated border ${stat?.borderColor} p-5 rounded-xl hover:border-opacity-60 transition-all duration-300 group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`${stat?.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                    {IconComponent && <IconComponent size={20} />}
                  </div>
                  {stat?.trend === 'up' ? (
                    <TrendingUp size={14} className="text-positive" />
                  ) : stat?.trend === 'down' ? (
                    <TrendingDown size={14} className="text-danger" />
                  ) : null}
                </div>
                <p className={`stat-value ${stat?.color}`}>{stat?.value}</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{stat?.label}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{stat?.change}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}