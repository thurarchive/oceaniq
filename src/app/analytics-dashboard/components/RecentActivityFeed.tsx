import React from 'react';
import { CheckCircle, AlertTriangle, Brain, Users, Clock, ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';

const activities = [
  {
    id: 'act-001',
    type: 'approval',
    icon: <CheckCircle size={14} />,
    iconColor: 'text-positive',
    iconBg: 'bg-positive/10',
    title: 'Citizen report approved',
    detail: 'Report #CR-2847 from Ahmad Fauzi — Bekasi Coastal Zone',
    meta: 'Moderator: Sari Dewi',
    time: '5 min ago',
    badge: <StatusBadge variant="approved" />,
  },
  {
    id: 'act-002',
    type: 'alert',
    icon: <AlertTriangle size={14} />,
    iconColor: 'text-danger',
    iconBg: 'bg-danger/10',
    title: 'Hotspot alert triggered',
    detail: 'North Jakarta Bay Zone A — density exceeded 80 kg/km²',
    meta: 'Auto-generated threshold alert',
    time: '18 min ago',
    badge: <StatusBadge variant="hotspot" />,
  },
  {
    id: 'act-003',
    type: 'prediction',
    icon: <Brain size={14} />,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
    title: 'ML prediction completed',
    detail: 'pred_3517 — Karawang Offshore Zone, confidence 78%',
    meta: 'Model: XGBoost (Tuned Tabular)',
    time: '1 hr ago',
    badge: <StatusBadge variant="estimated" />,
  },
  {
    id: 'act-004',
    type: 'report',
    icon: <Users size={14} />,
    iconColor: 'text-accent',
    iconBg: 'bg-accent/10',
    title: 'New citizen report submitted',
    detail: 'Report #CR-2848 from Dewi Santoso — Tangerang Coastal Strip',
    meta: 'Awaiting moderation',
    time: '2 hr ago',
    badge: <StatusBadge variant="pending" />,
  },
  {
    id: 'act-005',
    type: 'approval',
    icon: <CheckCircle size={14} />,
    iconColor: 'text-positive',
    iconBg: 'bg-positive/10',
    title: 'Field observation published',
    detail: 'OBS-12847 — Subang River Mouth — Field Survey Team 1',
    meta: 'Data quality: High',
    time: '3 hr ago',
    badge: <StatusBadge variant="verified" />,
  },
  {
    id: 'act-006',
    type: 'alert',
    icon: <AlertTriangle size={14} />,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
    title: 'Report flagged for review',
    detail: 'Report #CR-2831 — coordinates appear inconsistent with photo metadata',
    meta: 'Flagged by: Auto-validator',
    time: '4 hr ago',
    badge: <StatusBadge variant="flagged" />,
  },
];

export default function RecentActivityFeed() {
  return (
    <div className="glass-card-elevated border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Moderation events, predictions, and alerts</p>
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-1 text-xs text-primary font-semibold hover:text-accent transition-colors"
        >
          View all
          <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {activities?.map((activity) => (
          <div
            key={activity?.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50 cursor-pointer"
          >
            <div className={`w-7 h-7 rounded-lg ${activity?.iconBg} ${activity?.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
              {activity?.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-xs font-semibold text-foreground truncate">{activity?.title}</p>
                {activity?.badge}
              </div>
              <p className="text-xs text-muted-foreground truncate mb-1">{activity?.detail}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground/60">{activity?.meta}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground/60 shrink-0">
                  <Clock size={10} />
                  {activity?.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}