'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { getCommunityLeaderboard, LeaderboardEntry } from '@/lib/leaderboard';
import { getAllBadges } from '@/lib/badges';
import { Trophy, Medal, ChevronRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

export default function LeaderboardPage() {
  const { language, t } = useLanguage();
  const [timeframe, setTimeframe] = useState<'all_time' | 'this_month'>('all_time');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authLoading || !user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getCommunityLeaderboard(timeframe).then((data) => {
      setEntries(data.entries);
      setLoading(false);
    });
  }, [timeframe, user, authLoading]);

  const sampleBadges = getAllBadges(10, 300, 5, true, language);
  const top3 = entries.slice(0, 3);

  if (authLoading) {
    return (
      <AppLayout currentPath="/leaderboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={32} className="animate-spin text-primary" />
          <span className="sr-only">{t.common.loading}</span>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout currentPath="/leaderboard">
        <div className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center text-center gap-5 min-h-[60vh] justify-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center text-muted-foreground">
            <Lock size={28} aria-hidden />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'id'
              ? 'Bergabung dengan komunitas kontributor Oceaniq'
              : 'Join the Oceaniq contributor community'}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {language === 'id'
              ? 'Masuk untuk melihat pengakuan komunitas dan melacak kemajuan kontribusi Anda.'
              : 'Sign in to view community recognition and track your contribution progress.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/auth?next=/leaderboard" className="btn-primary inline-flex items-center justify-center text-sm">
              {t.nav.signIn}
            </Link>
            <Link
              href="/contribute"
              className="inline-flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-lg border border-border hover:border-primary/40 transition-colors"
            >
              {language === 'id' ? 'Pelajari cara berkontribusi' : 'Learn about contributing'}
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout currentPath="/leaderboard">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-10 space-y-12 wave-bg min-h-screen">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <Trophy size={14} aria-hidden />
            {t.leaderboard.badge}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            {t.leaderboard.title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {language === 'id'
              ? 'Peringkat didasarkan pada kontribusi yang disetujui dan diselesaikan secara bertanggung jawab. Tujuannya mengakui mutu dan konsistensi—bukan kuantitas semata.'
              : 'Rankings are based on approved and responsibly completed contributions. They are designed to recognize quality and consistency—not quantity alone.'}
          </p>

          <div className="inline-flex items-center p-1 rounded-xl bg-card border border-border mt-4 shadow-xs" role="group" aria-label={language === 'id' ? 'Periode peringkat' : 'Leaderboard period'}>
            <button
              type="button"
              onClick={() => setTimeframe('all_time')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === 'all_time'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.leaderboard.allTime}
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('this_month')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === 'this_month'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.leaderboard.thisMonth}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-card/50" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            {language === 'id'
              ? 'Pengakuan komunitas akan muncul seiring kontribusi yang disetujui tercatat.'
              : 'Community recognition will appear as approved contributions are recorded.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {top3.map((entry, idx) => {
              const podiumStyles = [
                {
                  rankText: language === 'id' ? 'Juara 1' : '1st Place',
                  badge: '1',
                  border: 'border-amber-500/50',
                  glow: 'from-amber-500/20 via-card to-card',
                  badgeBg: 'bg-amber-500 text-black',
                },
                {
                  rankText: language === 'id' ? 'Juara 2' : '2nd Place',
                  badge: '2',
                  border: 'border-slate-400/50',
                  glow: 'from-slate-400/20 via-card to-card',
                  badgeBg: 'bg-slate-300 text-black',
                },
                {
                  rankText: language === 'id' ? 'Juara 3' : '3rd Place',
                  badge: '3',
                  border: 'border-amber-700/50',
                  glow: 'from-amber-700/20 via-card to-card',
                  badgeBg: 'bg-amber-700 text-white',
                },
              ];
              const p = podiumStyles[idx] || podiumStyles[2];

              return (
                <div
                  key={entry.id}
                  className={`glass-card-elevated border ${p.border} bg-linear-to-b ${p.glow} p-7 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-md`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center text-3xl shadow-sm">
                        {entry.top_badge_icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-mono font-bold text-accent">
                            {entry.tier_icon} {entry.tier_name}
                          </span>
                        </div>
                        <h2 className="font-bold text-lg text-foreground">{entry.display_name}</h2>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${p.badgeBg}`}>
                      {p.rankText}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/40 text-center">
                    <div className="bg-background/50 p-2.5 rounded-xl border border-border/40">
                      <span className="text-[10px] text-muted-foreground block uppercase font-mono">{t.leaderboard.reports}</span>
                      <span className="font-bold text-foreground text-sm">{entry.verified_reports}</span>
                    </div>
                    <div className="bg-background/50 p-2.5 rounded-xl border border-border/40">
                      <span className="text-[10px] text-muted-foreground block uppercase font-mono">
                        {language === 'id' ? 'Estimasi kg' : 'Est. kg'}
                      </span>
                      <span className="font-bold text-positive text-sm">{entry.total_weight_kg}</span>
                    </div>
                    <div className="bg-background/50 p-2.5 rounded-xl border border-border/40">
                      <span className="text-[10px] text-muted-foreground block uppercase font-mono">
                        {language === 'id' ? 'Lokasi' : 'Sites'}
                      </span>
                      <span className="font-bold text-sky-500 text-sm">{entry.unique_sites}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="glass-card-elevated border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Medal size={20} className="text-primary" aria-hidden />
              {language === 'id' ? 'Klasemen kontributor' : 'Community Rankings'}
            </h2>
            <span className="text-xs text-muted-foreground font-mono">
              {language === 'id' ? `${entries.length} kontributor` : `${entries.length} contributors`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-xs font-mono uppercase text-muted-foreground bg-muted/20">
                  <th className="py-3 px-4 rounded-l-xl">{t.leaderboard.rank}</th>
                  <th className="py-3 px-4">{t.leaderboard.user}</th>
                  <th className="py-3 px-4">{t.leaderboard.tier}</th>
                  <th className="py-3 px-4 text-center">{t.leaderboard.reports}</th>
                  <th className="py-3 px-4 text-center">{language === 'id' ? 'Estimasi tercatat' : 'Estimated waste'}</th>
                  <th className="py-3 px-4 text-center rounded-r-xl">{language === 'id' ? 'Lokasi unik' : 'Unique sites'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-sans">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-base text-muted-foreground">#{entry.rank}</td>
                    <td className="py-4 px-4 font-semibold text-foreground">
                      <div>
                        <span>{entry.display_name}</span>
                        {!entry.is_public_name && (
                          <span className="block text-[10px] text-muted-foreground font-mono font-normal">
                            {language === 'id' ? 'Nama disamarkan' : 'Anonymized handle'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-muted/40 border border-border">
                        <span>{entry.tier_icon}</span>
                        <span>{entry.tier_name}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-foreground">{entry.verified_reports}</td>
                    <td className="py-4 px-4 text-center font-bold text-positive">{entry.total_weight_kg} kg</td>
                    <td className="py-4 px-4 text-center font-bold text-sky-500">
                      {entry.unique_sites} {language === 'id' ? 'lokasi' : 'sites'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{t.leaderboard.allBadgesTitle}</h2>
            <p className="text-xs text-muted-foreground">{t.leaderboard.allBadgesSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sampleBadges.map((badge) => (
              <div
                key={badge.id}
                className={`glass-card-elevated border ${badge.borderColor} ${badge.bgColor} p-5 rounded-2xl space-y-3 shadow-sm`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-background/80 border border-border flex items-center justify-center text-2xl shrink-0 shadow-xs">
                    {badge.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">{badge.title}</h3>
                    <span className={`text-[11px] font-mono font-semibold ${badge.color}`}>
                      {language === 'id' ? 'Syarat:' : 'Requirement:'} {badge.requirementText}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card-elevated border border-primary/30 p-8 rounded-2xl text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {language === 'id' ? 'Kirim observasi yang cermat' : 'Submit a careful observation'}
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {language === 'id'
              ? 'Peringkat mengikuti laporan yang disetujui. Utamakan kelengkapan dan konteks, bukan jumlah kiriman.'
              : 'Rankings follow approved reports. Prioritize completeness and context, not submission count.'}
          </p>
          <Link
            href="/contribute"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
          >
            {t.landing.reportWaste}
            <ChevronRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
