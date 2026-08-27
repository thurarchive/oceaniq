'use client';
import React from 'react';
import { Activity, MapPin, Users, Brain, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LiveStatsBar() {
  const { language, t } = useLanguage();

  const stats = [
    {
      id: 'stat-observations',
      label: t.landing.stats.totalWasteLogged,
      value: '24,831 kg',
      change: language === 'id' ? '+312 kg pekan ini' : '+312 kg this week',
      trend: 'up',
      icon: Activity,
      color: 'text-primary',
      borderColor: 'border-primary/30',
    },
    {
      id: 'stat-zones',
      label: t.landing.stats.monitoredZones,
      value: '847',
      change: language === 'id' ? '+14 zona baru' : '+14 new zones',
      trend: 'up',
      icon: MapPin,
      color: 'text-accent',
      borderColor: 'border-accent/30',
    },
    {
      id: 'stat-reports',
      label: t.landing.stats.citizenReports,
      value: '6,204',
      change: language === 'id' ? '+89 disetujui' : '+89 approved',
      trend: 'up',
      icon: Users,
      color: 'text-positive',
      borderColor: 'border-positive/30',
    },
    {
      id: 'stat-predictions',
      label: t.landing.stats.mlAccuracy,
      value: '86.4%',
      change: language === 'id' ? 'Model XGBoost v1.3' : 'XGBoost Tuned Model',
      trend: 'up',
      icon: Brain,
      color: 'text-warning',
      borderColor: 'border-warning/30',
    },
  ];

  return (
    <section className="relative z-10 px-6 lg:px-10 pb-16 -mt-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className={`glass-card-elevated border ${stat.borderColor} p-5 rounded-xl hover:border-opacity-60 transition-all duration-300 group shadow-sm hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`${stat.color} p-2 rounded-lg bg-card/80 border border-border/60`}>
                    <IconComponent size={20} />
                  </div>
                  {stat.trend === 'up' ? (
                    <TrendingUp size={16} className="text-positive" />
                  ) : stat.trend === 'down' ? (
                    <TrendingDown size={16} className="text-danger" />
                  ) : null}
                </div>
                <p className={`stat-value ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-foreground mt-1.5 font-semibold">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.change}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}