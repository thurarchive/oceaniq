import React from 'react';
import {
  TrendingUp, TrendingDown, Minus,
  Activity, Users, Brain, MapPin, Trash2, AlertTriangle
} from 'lucide-react';

// 6 cards → grid-cols-3 × 2 rows
// Row 1: Waste Density (hero, col-span-1), Approved Reports, ML Confidence
// Row 2: Active Zones, Plastic Fraction, Hotspot Alerts (warning state)

const kpis = [
  {
    id: 'kpi-density',
    label: 'Avg Waste Density',
    value: '47.3',
    unit: 'kg/m²',
    change: '+6.2%',
    changeTrend: 'up-bad',
    subtext: 'vs. 44.5 last period',
    icon: <Activity size={18} />,
    color: 'text-danger',
    bgColor: 'bg-danger/8',
    borderColor: 'border-danger/20',
    isHero: true,
    sparkData: [38, 41, 39, 43, 42, 45, 44, 47, 46, 48, 47, 47.3],
  },
  {
    id: 'kpi-reports',
    label: 'Approved Reports',
    value: '6,204',
    unit: 'this month',
    change: '+312',
    changeTrend: 'up-good',
    subtext: '+89 approved this week',
    icon: <Users size={18} />,
    color: 'text-positive',
    bgColor: 'bg-positive/8',
    borderColor: 'border-positive/20',
    isHero: false,
    sparkData: [480, 510, 490, 530, 560, 540, 580, 600, 590, 610, 620, 624],
  },
  {
    id: 'kpi-confidence',
    label: 'ML Avg Confidence',
    value: '81.4',
    unit: '%',
    change: '-1.2%',
    changeTrend: 'down-warn',
    subtext: 'Model v1.3.0 — 3,517 predictions',
    icon: <Brain size={18} />,
    color: 'text-warning',
    bgColor: 'bg-warning/8',
    borderColor: 'border-warning/20',
    isHero: false,
    sparkData: [84, 83, 85, 82, 83, 81, 82, 80, 83, 82, 81, 81.4],
  },
  {
    id: 'kpi-zones',
    label: 'Active Monitoring Zones',
    value: '847',
    unit: 'zones',
    change: '+14',
    changeTrend: 'up-good',
    subtext: '23 new zones added this quarter',
    icon: <MapPin size={18} />,
    color: 'text-accent',
    bgColor: 'bg-accent/8',
    borderColor: 'border-accent/20',
    isHero: false,
    sparkData: [810, 815, 820, 822, 825, 828, 830, 835, 838, 840, 844, 847],
  },
  {
    id: 'kpi-plastic',
    label: 'Plastic Fraction',
    value: '62.1',
    unit: '%',
    change: '+0.8%',
    changeTrend: 'up-bad',
    subtext: 'of total waste composition',
    icon: <Trash2 size={18} />,
    color: 'text-primary',
    bgColor: 'bg-primary/8',
    borderColor: 'border-primary/20',
    isHero: false,
    sparkData: [59, 60, 61, 60, 61, 62, 61, 62, 62, 62, 62, 62.1],
  },
  {
    id: 'kpi-alerts',
    label: 'Active Hotspot Alerts',
    value: '3',
    unit: 'zones critical',
    change: '+1',
    changeTrend: 'up-bad',
    subtext: 'North Jakarta Bay — CRITICAL',
    icon: <AlertTriangle size={18} />,
    color: 'text-danger',
    bgColor: 'bg-danger/12',
    borderColor: 'border-danger/40',
    isHero: false,
    isAlert: true,
    sparkData: [0, 1, 1, 2, 1, 2, 2, 3, 2, 3, 3, 3],
  },
];

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-grad-${color.replace(/[^a-z]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#spark-grad-${color.replace(/[^a-z]/gi, '')})`}
        className={color}
      />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={color}
      />
    </svg>
  );
}

export default function KPIBentoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className={`glass-card-elevated border ${kpi.borderColor} ${kpi.bgColor} rounded-xl p-5 transition-all duration-300 hover:brightness-110 ${kpi.isAlert ? 'ring-1 ring-danger/30' : ''
            }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-lg ${kpi.bgColor} ${kpi.color} flex items-center justify-center border ${kpi.borderColor}`}>
              {kpi.icon}
            </div>
            <div className="flex items-center gap-1">
              {kpi.changeTrend === 'up-good' && (
                <TrendingUp size={13} className="text-positive" />
              )}
              {kpi.changeTrend === 'up-bad' && (
                <TrendingUp size={13} className="text-danger" />
              )}
              {kpi.changeTrend === 'down-warn' && (
                <TrendingDown size={13} className="text-warning" />
              )}
              {kpi.changeTrend === 'neutral' && (
                <Minus size={13} className="text-muted-foreground" />
              )}
              <span className={`text-xs font-semibold font-mono ${kpi.changeTrend === 'up-good' ? 'text-positive' :
                kpi.changeTrend === 'up-bad' ? 'text-danger' :
                  kpi.changeTrend === 'down-warn' ? 'text-warning' : 'text-muted-foreground'
                }`}>
                {kpi.change}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {kpi.label}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className={`kpi-value ${kpi.color}`}>{kpi.value}</span>
                <span className="text-sm text-muted-foreground">{kpi.unit}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.subtext}</p>
            </div>
            <div className="opacity-70">
              <MiniSparkline data={kpi.sparkData} color={kpi.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}