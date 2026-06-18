'use client';
import React, { useState, useEffect } from 'react';
import { Activity, MapPin, Users, Brain, TrendingUp, TrendingDown } from 'lucide-react';

const stats = [
  {
    id: 'stat-observations',
    label: 'Total Observations',
    value: '24,831',
    change: '+312 this week',
    trend: 'up',
    icon: <Activity size={20} />,
    color: 'text-primary',
    borderColor: 'border-primary/30',
  },
  {
    id: 'stat-zones',
    label: 'Monitoring Zones',
    value: '847',
    change: '+14 new zones',
    trend: 'up',
    icon: <MapPin size={20} />,
    color: 'text-accent',
    borderColor: 'border-accent/30',
  },
  {
    id: 'stat-reports',
    label: 'Citizen Reports',
    value: '6,204',
    change: '+89 approved',
    trend: 'up',
    icon: <Users size={20} />,
    color: 'text-positive',
    borderColor: 'border-positive/30',
  },
  {
    id: 'stat-predictions',
    label: 'ML Predictions',
    value: '3,517',
    change: 'Avg 81% confidence',
    trend: 'neutral',
    icon: <Brain size={20} />,
    color: 'text-warning',
    borderColor: 'border-warning/30',
  },
];

export default function LiveStatsBar() {
  return (
    <section className="relative z-10 px-6 lg:px-10 pb-16 -mt-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats?.map((stat) => (
            <div
              key={stat?.id}
              className={`glass-card-elevated border ${stat?.borderColor} p-5 rounded-xl hover:border-opacity-60 transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${stat?.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                  {stat?.icon}
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
          ))}
        </div>
      </div>
    </section>
  );
}