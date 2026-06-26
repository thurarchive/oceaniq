'use client';
import React from 'react';
import { MapPin, Clock, Trash2, ExternalLink } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { WasteObservation } from '@/types/waste-observations';

interface SubmissionRowProps {
  observation: WasteObservation;
  onDelete?: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusVariant(
  status: WasteObservation['status']
): 'approved' | 'pending' | 'rejected' | 'flagged' {
  switch (status) {
    case 'published':
      return 'approved';
    case 'pending_moderation':
      return 'pending';
    case 'rejected':
      return 'rejected';
    case 'draft':
      return 'flagged';
    default:
      return 'pending';
  }
}

function getStatusLabel(status: WasteObservation['status']): string {
  switch (status) {
    case 'published':
      return 'Approved';
    case 'pending_moderation':
      return 'Pending Review';
    case 'rejected':
      return 'Rejected';
    case 'draft':
      return 'Draft';
    default:
      return status;
  }
}

export default function SubmissionRow({ observation, onDelete }: SubmissionRowProps) {
  const title =
    observation.site_name ??
    (observation.volume_estimate
      ? `${observation.volume_estimate} — Citizen Report`
      : 'Untitled Report');

  const locationStr =
    observation.location_lat && observation.location_lng
      ? `${observation.location_lat.toFixed(4)}°, ${observation.location_lng.toFixed(4)}°`
      : 'Location not recorded';

  const typeLabel = observation.submission_type === 'expert' ? 'Scientific' : 'Citizen';
  const typeBg =
    observation.submission_type === 'expert'
      ? 'bg-accent/10 text-accent border-accent/20'
      : 'bg-primary/10 text-primary border-primary/20';

  return (
    <div className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-border transition-all duration-200">
      {/* Left: icon */}
      <div className="shrink-0 w-9 h-9 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
        <Trash2 size={16} />
      </div>

      {/* Middle: main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-foreground truncate">{title}</p>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border uppercase tracking-wide ${typeBg}`}>
            {typeLabel}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {locationStr}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {formatDate(observation.created_at)}
          </span>
        </div>
      </div>

      {/* Right: status + actions */}
      <div className="shrink-0 flex items-center gap-2">
        <StatusBadge
          variant={getStatusVariant(observation.status)}
          label={getStatusLabel(observation.status)}
        />
        {observation.status === 'draft' && onDelete && (
          <button
            onClick={() => onDelete(observation.id)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all duration-150 opacity-0 group-hover:opacity-100"
            aria-label="Delete draft"
            title="Delete draft"
          >
            <Trash2 size={13} />
          </button>
        )}
        <button
          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-150 opacity-0 group-hover:opacity-100"
          aria-label="View details"
          title="View details"
        >
          <ExternalLink size={13} />
        </button>
      </div>
    </div>
  );
}
