'use client';
import React from 'react';
import { CheckCircle, AlertTriangle, Brain, Users, Clock, ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function RecentActivityFeed() {
  const { language, t } = useLanguage();

  const activities = [
    {
      id: 'act-001',
      type: 'approval',
      icon: <CheckCircle size={14} />,
      iconColor: 'text-positive',
      iconBg: 'bg-positive/10',
      title: language === 'id' ? 'Laporan warga disetujui' : 'Citizen report approved',
      detail: language === 'id' ? 'Laporan #CR-2847 dari Ahmad Fauzi — Zona Pesisir Bekasi' : 'Report #CR-2847 from Ahmad Fauzi — Bekasi Coastal Zone',
      meta: language === 'id' ? 'Moderator: Sari Dewi' : 'Moderator: Sari Dewi',
      time: language === 'id' ? '5 mnt lalu' : '5 min ago',
      badge: <StatusBadge variant="approved" />,
    },
    {
      id: 'act-002',
      type: 'alert',
      icon: <AlertTriangle size={14} />,
      iconColor: 'text-danger',
      iconBg: 'bg-danger/10',
      title: language === 'id' ? 'Peringatan titik rawan terpicu' : 'Hotspot alert triggered',
      detail: language === 'id' ? 'Teluk Jakarta Zona A — densitas melebihi 80 kg/km²' : 'North Jakarta Bay Zone A — density exceeded 80 kg/km²',
      meta: language === 'id' ? 'Peringatan ambang batas otomatis' : 'Auto-generated threshold alert',
      time: language === 'id' ? '18 mnt lalu' : '18 min ago',
      badge: <StatusBadge variant="hotspot" />,
    },
    {
      id: 'act-003',
      type: 'prediction',
      icon: <Brain size={14} />,
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
      title: language === 'id' ? 'Prediksi model AI selesai' : 'ML prediction completed',
      detail: language === 'id' ? 'pred_3517 — Zona Lepas Pantai Karawang, keyakinan 78%' : 'pred_3517 — Karawang Offshore Zone, confidence 78%',
      meta: 'Model: XGBoost (Tuned Tabular)',
      time: language === 'id' ? '1 jam lalu' : '1 hr ago',
      badge: <StatusBadge variant="estimated" />,
    },
    {
      id: 'act-004',
      type: 'report',
      icon: <Users size={14} />,
      iconColor: 'text-accent',
      iconBg: 'bg-accent/10',
      title: language === 'id' ? 'Laporan sains warga baru masuk' : 'New citizen report submitted',
      detail: language === 'id' ? 'Laporan #CR-2848 dari Dewi Santoso — Pesisir Tangerang' : 'Report #CR-2848 from Dewi Santoso — Tangerang Coastal Strip',
      meta: language === 'id' ? 'Menunggu moderasi' : 'Awaiting moderation',
      time: language === 'id' ? '2 jam lalu' : '2 hr ago',
      badge: <StatusBadge variant="pending" />,
    },
    {
      id: 'act-005',
      type: 'approval',
      icon: <CheckCircle size={14} />,
      iconColor: 'text-positive',
      iconBg: 'bg-positive/10',
      title: language === 'id' ? 'Observasi lapangan diterbitkan' : 'Field observation published',
      detail: language === 'id' ? 'OBS-12847 — Muara Sungai Subang — Tim Survei 1' : 'OBS-12847 — Subang River Mouth — Field Survey Team 1',
      meta: language === 'id' ? 'Kualitas data: Tinggi' : 'Data quality: High',
      time: language === 'id' ? '3 jam lalu' : '3 hr ago',
      badge: <StatusBadge variant="verified" />,
    },
    {
      id: 'act-006',
      type: 'alert',
      icon: <AlertTriangle size={14} />,
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
      title: language === 'id' ? 'Laporan ditandai untuk tinjauan' : 'Report flagged for review',
      detail: language === 'id' ? 'Laporan #CR-2831 — koordinat perlu pemeriksaan ulang' : 'Report #CR-2831 — coordinates appear inconsistent with photo metadata',
      meta: language === 'id' ? 'Oleh: Auto-validator' : 'Flagged by: Auto-validator',
      time: language === 'id' ? '4 jam lalu' : '4 hr ago',
      badge: <StatusBadge variant="flagged" />,
    },
  ];

  return (
    <div className="glass-card-elevated border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">{t.analytics.recentActivityTitle}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t.analytics.recentActivitySub}</p>
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-1 text-xs text-primary font-semibold hover:text-accent transition-colors"
        >
          {t.common.viewAll}
          <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50 cursor-pointer bg-card/40"
          >
            <div className={`w-7 h-7 rounded-lg ${activity.iconBg} ${activity.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-xs font-semibold text-foreground truncate">{activity.title}</p>
                {activity.badge}
              </div>
              <p className="text-xs text-muted-foreground truncate mb-1">{activity.detail}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground/70">{activity.meta}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground/70 shrink-0">
                  <Clock size={10} />
                  {activity.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}