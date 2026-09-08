'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, FileText, Inbox } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { CitizenReport, CitizenReportStatus } from '@/types/citizen-reports';
import { useLanguage } from '@/context/LanguageContext';

function formatDate(iso: string, lang: 'id' | 'en'): string {
  return new Date(iso).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function userSafeStatus(status: CitizenReportStatus, isId: boolean): { label: string; variant: 'approved' | 'pending' | 'rejected' | 'flagged' } {
  switch (status) {
    case 'approved':
      return { label: isId ? 'Disetujui' : 'Approved', variant: 'approved' };
    case 'pending_moderation':
      return { label: isId ? 'Sedang ditinjau' : 'Under review', variant: 'pending' };
    case 'rejected':
      return { label: isId ? 'Perlu pembaruan' : 'Needs update', variant: 'rejected' };
    case 'draft':
      return { label: isId ? 'Terkirim (draf)' : 'Submitted', variant: 'flagged' };
    default:
      return { label: isId ? 'Ditutup' : 'Closed', variant: 'pending' };
  }
}

function categoryLabel(report: CitizenReport, isId: boolean): string {
  const types: string[] = [];
  if (report.has_plastic) types.push(isId ? 'Plastik' : 'Plastic');
  if (report.has_organic) types.push(isId ? 'Organik' : 'Organic');
  if (report.has_fishing_gear) types.push(isId ? 'Alat tangkap' : 'Fishing gear');
  if (report.has_styrofoam) types.push('Styrofoam');
  if (report.has_glass_metal) types.push(isId ? 'Kaca/logam' : 'Glass/metal');
  if (types.length === 0) return report.volume_estimate ?? (isId ? 'Observasi' : 'Observation');
  return types.slice(0, 2).join(', ');
}

interface RecentReportsListProps {
  reports: CitizenReport[];
  loading?: boolean;
  onSubmitFirst: () => void;
}

export default function RecentReportsList({ reports, loading, onSubmitFirst }: RecentReportsListProps) {
  const { language } = useLanguage();
  const isId = language === 'id';
  const recent = reports.slice(0, 5);

  return (
    <section className="space-y-3" aria-labelledby="recent-reports-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="recent-reports-heading" className="text-sm font-semibold text-foreground uppercase tracking-wider">
          {isId ? 'Laporan terbaru saya' : 'My recent reports'}
        </h2>
        <Link href="/my-reports" className="text-xs font-semibold text-primary hover:underline">
          {isId ? 'Lihat semua laporan' : 'View all reports'}
        </Link>
      </div>

      <div className="glass-card-elevated border border-border/40 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
            <Inbox size={22} className="text-muted-foreground" aria-hidden />
            <p className="text-sm font-semibold text-foreground">
              {isId ? 'Belum ada observasi' : 'No observations yet'}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              {isId
                ? 'Kiriman Anda akan muncul di sini setelah Anda mengirim observasi pertama.'
                : 'Your submissions will appear here after you send your first observation.'}
            </p>
            <button type="button" onClick={onSubmitFirst} className="btn-primary text-sm">
              {isId ? 'Kirim observasi pertama' : 'Submit your first observation'}
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {recent.map((report) => {
              const status = userSafeStatus(report.status, isId);
              const ref = report.id.slice(0, 8).toUpperCase();
              return (
                <li key={report.id} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground">
                    <FileText size={16} aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {report.site_name ?? (isId ? 'Observasi tanpa nama lokasi' : 'Observation without site name')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-mono">#{ref}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} aria-hidden />
                        {formatDate(report.created_at, language)}
                      </span>
                      <span>{categoryLabel(report, isId)}</span>
                    </p>
                  </div>
                  <StatusBadge variant={status.variant} label={status.label} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
