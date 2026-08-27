'use client';
import React, { useState } from 'react';
import { CheckCircle2, Clock, FileEdit, Inbox, XCircle } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { CitizenReport, CitizenReportStatus } from '@/types/citizen-reports';
import { deleteDraftCitizenReport, updateCitizenReport } from '@/lib/citizen-reports';
import { toast } from 'sonner';
import { MapPin, Clock as ClockIcon, Scale, ExternalLink, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// ─────────────────────────────────────────────
// SubmissionRow (inlined for citizen_reports)
// ─────────────────────────────────────────────
function formatDate(iso: string, lang: 'id' | 'en'): string {
  return new Date(iso).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusVariant(
  status: CitizenReportStatus
): 'approved' | 'pending' | 'rejected' | 'flagged' {
  switch (status) {
    case 'approved': return 'approved';
    case 'pending_moderation': return 'pending';
    case 'rejected': return 'rejected';
    case 'draft': return 'flagged';
  }
}

function getStatusLabel(status: CitizenReportStatus, isId: boolean): string {
  switch (status) {
    case 'approved': return isId ? 'Terverifikasi' : 'Approved';
    case 'pending_moderation': return isId ? 'Dalam Peninjauan' : 'Pending Review';
    case 'rejected': return isId ? 'Ditolak' : 'Rejected';
    case 'draft': return isId ? 'Draft' : 'Draft';
  }
}

interface RowProps {
  report: CitizenReport;
  isModerator?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (report: CitizenReport) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

function CitizenReportRow({ report, isModerator, onDelete, onEdit, onApprove, onReject }: RowProps) {
  const { language } = useLanguage();
  const isId = language === 'id';

  const title = report.site_name ?? report.volume_estimate ?? (isId ? 'Laporan Tanpa Judul' : 'Untitled Report');
  const locationStr =
    report.lat && report.lng
      ? `${report.lat.toFixed(4)}°, ${report.lng.toFixed(4)}°`
      : (isId ? 'Lokasi tidak tercatat' : 'Location not recorded');
  const weightStr = report.weight_estimate_kg
    ? `~${report.weight_estimate_kg} kg`
    : report.weight_range ?? null;

  return (
    <div className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-border transition-all duration-200">
      {/* Icon */}
      <div className="shrink-0 w-9 h-9 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
        {report.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={report.photo_url} alt="" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <Trash2 size={16} />
        )}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-foreground truncate">{title}</p>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border uppercase tracking-wide bg-primary/10 text-primary border-primary/20">
            {isId ? 'Warga' : 'Citizen'}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {locationStr}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon size={11} />
            {formatDate(report.created_at, language)}
          </span>
          {weightStr && (
            <span className="flex items-center gap-1">
              <Scale size={11} />
              {weightStr}
            </span>
          )}
        </div>
      </div>

      {/* Status + actions */}
      <div className="shrink-0 flex items-center gap-2">
        <StatusBadge
          variant={getStatusVariant(report.status)}
          label={getStatusLabel(report.status, isId)}
        />
        {report.status === 'draft' && onEdit && (
          <button
            onClick={() => onEdit(report)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-150 opacity-0 group-hover:opacity-100"
            aria-label={isId ? 'Ubah draft' : 'Edit draft'}
            title={isId ? 'Ubah draft' : 'Edit draft'}
          >
            <FileEdit size={13} />
          </button>
        )}
        {report.status === 'draft' && onDelete && (
          <button
            onClick={() => onDelete(report.id)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all duration-150 opacity-0 group-hover:opacity-100"
            aria-label={isId ? 'Hapus draft' : 'Delete draft'}
            title={isId ? 'Hapus draft' : 'Delete draft'}
          >
            <Trash2 size={13} />
          </button>
        )}
        {report.status === 'pending_moderation' && isModerator && onApprove && (
          <button
            onClick={() => onApprove(report.id)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-positive hover:bg-positive/10 transition-all duration-150 opacity-0 group-hover:opacity-100"
            aria-label={isId ? 'Setujui laporan' : 'Approve report'}
            title={isId ? 'Setujui laporan' : 'Approve report'}
          >
            <CheckCircle2 size={13} />
          </button>
        )}
        {report.status === 'pending_moderation' && isModerator && onReject && (
          <button
            onClick={() => onReject(report.id)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all duration-150 opacity-0 group-hover:opacity-100"
            aria-label={isId ? 'Tolak laporan' : 'Reject report'}
            title={isId ? 'Tolak laporan' : 'Reject report'}
          >
            <XCircle size={13} />
          </button>
        )}
        {report.status === 'approved' && report.lat && report.lng && (
          <a
            href={`/interactive-map?id=${report.id}&lat=${report.lat}&lng=${report.lng}`}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-150 opacity-0 group-hover:opacity-100"
            aria-label={isId ? 'Tampilkan di Peta' : 'Show on Map'}
            title={isId ? 'Tampilkan di Peta' : 'Show on Map'}
          >
            <MapPin size={13} />
          </a>
        )}
        {(report.status === 'approved' || report.status === 'pending_moderation') && onEdit && (
          <button
            onClick={() => onEdit(report)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-150 opacity-0 group-hover:opacity-100"
            aria-label={isId ? 'Lihat rincian' : 'View details'}
            title={isId ? 'Lihat rincian' : 'View details'}
          >
            <ExternalLink size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab definitions
// ─────────────────────────────────────────────
type TabKey = 'approved' | 'pending' | 'draft';

function filterByTab(reports: CitizenReport[], tab: TabKey): CitizenReport[] {
  switch (tab) {
    case 'approved': return reports.filter((r) => r.status === 'approved');
    case 'pending': return reports.filter((r) => r.status === 'pending_moderation');
    case 'draft': return reports.filter((r) => r.status === 'draft');
  }
}

// ─────────────────────────────────────────────
// Empty & skeleton
// ─────────────────────────────────────────────
function EmptyState({ tab }: { tab: TabKey }) {
  const { language } = useLanguage();
  const isId = language === 'id';

  const EMPTY_MESSAGES: Record<TabKey, { title: string; subtitle: string }> = {
    approved: {
      title: isId ? 'Belum ada laporan terverifikasi' : 'No approved submissions yet',
      subtitle: isId
        ? 'Laporan yang telah ditinjau dan disetujui oleh moderator akan muncul di sini.'
        : 'Submissions reviewed and accepted by moderators appear here.',
    },
    pending: {
      title: isId ? 'Tidak ada yang menunggu peninjauan' : 'Nothing awaiting review',
      subtitle: isId
        ? 'Laporan yang dikirimkan akan diperiksa oleh tim moderasi — laporan tersebut akan muncul di sini.'
        : "Submitted reports are checked by the moderation team — they'll show here.",
    },
    draft: {
      title: isId ? 'Tidak ada draft tersimpan' : 'No saved drafts',
      subtitle: isId
        ? 'Laporan belum selesai yang Anda simpan akan muncul di sini.'
        : 'Unfinished reports you save will appear here.',
    },
  };

  const { title, subtitle } = EMPTY_MESSAGES[tab];
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground">
        <Inbox size={22} />
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground max-w-[280px]">{subtitle}</p>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-16 rounded-xl bg-muted/30 animate-pulse"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────
interface SubmissionTabsProps {
  reports: CitizenReport[];
  userId: string;
  user?: any;
  userRole?: string;
  loading?: boolean;
  onRefresh?: () => void;
  onEdit?: (report: CitizenReport) => void;
}

export default function SubmissionTabs({
  reports,
  userId,
  user,
  userRole,
  loading = false,
  onRefresh,
  onEdit,
}: SubmissionTabsProps) {
  const { language, t } = useLanguage();
  const isId = language === 'id';

  const [activeTab, setActiveTab] = useState<TabKey>('approved');

  const isModerator = userRole === 'analyst' || userRole === 'admin';

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'approved', label: t.dashboard.tabApproved, icon: <CheckCircle2 size={14} /> },
    { key: 'pending', label: t.dashboard.tabPending, icon: <Clock size={14} /> },
    { key: 'draft', label: isId ? 'Draft' : 'Drafts', icon: <FileEdit size={14} /> },
  ];

  const filtered = filterByTab(reports, activeTab);
  const counts: Record<TabKey, number> = {
    approved: filterByTab(reports, 'approved').length,
    pending: filterByTab(reports, 'pending').length,
    draft: filterByTab(reports, 'draft').length,
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDraftCitizenReport(id, userId);
      toast.success(isId ? 'Draft berhasil dihapus' : 'Draft deleted');
      onRefresh?.();
    } catch {
      toast.error(isId ? 'Gagal menghapus draft' : 'Could not delete draft');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const reviewer_name = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Moderator';
      await updateCitizenReport(id, {
        status: 'approved',
        reviewed_by: userId,
        reviewer_name,
        reviewed_at: new Date().toISOString(),
      });
      toast.success(isId ? 'Laporan disetujui dan dipublikasikan ke peta' : 'Report approved and published to map');
      onRefresh?.();
    } catch (err: any) {
      toast.error(err?.message || (isId ? 'Gagal menyetujui laporan' : 'Could not approve report'));
    }
  };

  const handleReject = async (id: string) => {
    try {
      const reviewer_name = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Moderator';
      await updateCitizenReport(id, {
        status: 'rejected',
        reviewed_by: userId,
        reviewer_name,
        reviewed_at: new Date().toISOString(),
      });
      toast.success(isId ? 'Laporan ditolak' : 'Report rejected');
      onRefresh?.();
    } catch (err: any) {
      toast.error(err?.message || (isId ? 'Gagal menolak laporan' : 'Could not reject report'));
    }
  };

  return (
    <div className="glass-card-elevated border border-border/40 rounded-2xl overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border/50 bg-card/20">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px flex-1 justify-center ${isActive
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              {counts[tab.key] > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                    }`}
                >
                  {counts[tab.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <SkeletonRows />
        ) : filtered.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((report) => (
              <CitizenReportRow
                key={report.id}
                report={report}
                isModerator={isModerator}
                onDelete={activeTab === 'draft' ? handleDelete : undefined}
                onEdit={onEdit}
                onApprove={activeTab === 'pending' ? handleApprove : undefined}
                onReject={activeTab === 'pending' ? handleReject : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
