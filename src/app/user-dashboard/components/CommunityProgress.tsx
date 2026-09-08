'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { LeaderboardEntry } from '@/lib/leaderboard';
import { useLanguage } from '@/context/LanguageContext';

interface CommunityProgressProps {
  topEntries: LeaderboardEntry[];
  viewerRank: number | null;
  loading?: boolean;
}

export default function CommunityProgress({ topEntries, viewerRank, loading }: CommunityProgressProps) {
  const { language } = useLanguage();
  const isId = language === 'id';
  const preview = topEntries.slice(0, 3);

  return (
    <section className="space-y-3" aria-labelledby="community-progress-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="community-progress-heading" className="text-sm font-semibold text-foreground uppercase tracking-wider">
          {isId ? 'Kemajuan komunitas' : 'Community progress'}
        </h2>
        <Link href="/leaderboard" className="text-xs font-semibold text-primary hover:underline">
          {isId ? 'Lihat papan peringkat lengkap' : 'View full leaderboard'}
        </Link>
      </div>

      <p className="text-xs text-muted-foreground">
        {isId
          ? 'Pengakuan mencerminkan kontribusi yang disetujui, lengkap, dan bertanggung jawab—bukan volume kiriman semata.'
          : 'Recognition reflects approved, complete, and responsible contributions—not submission volume alone.'}
      </p>

      <div className="glass-card-elevated border border-border/40 rounded-2xl p-5 space-y-4">
        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : preview.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {isId
              ? 'Pengakuan komunitas akan muncul seiring kontribusi yang disetujui tercatat.'
              : 'Community recognition will appear as approved contributions are recorded.'}
          </p>
        ) : (
          <ol className="space-y-2 list-none p-0 m-0">
            {preview.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 min-w-0">
                  <Trophy size={14} className="text-amber-400 shrink-0" aria-hidden />
                  <span className="font-mono text-muted-foreground">#{entry.rank}</span>
                  <span className="font-semibold text-foreground truncate">{entry.display_name}</span>
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {entry.verified_reports} {isId ? 'disetujui' : 'approved'}
                </span>
              </li>
            ))}
          </ol>
        )}

        {viewerRank != null && (
          <p className="text-xs text-muted-foreground border-t border-border/40 pt-3">
            {isId ? 'Posisi Anda' : 'Your position'}: #{viewerRank}
          </p>
        )}
      </div>
    </section>
  );
}
