'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, ArrowRight } from 'lucide-react';
import { getCommunityLeaderboard, LeaderboardEntry } from '@/lib/leaderboard';
import { useLanguage } from '@/context/LanguageContext';

export default function LeaderboardPreview() {
  const { language, t } = useLanguage();
  const [topEntries, setTopEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommunityLeaderboard('all_time').then((data) => {
      setTopEntries(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  return (
    <section className="px-6 lg:px-10 py-16 relative bg-card/40 border-y border-border/50">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
              <Trophy size={14} /> {t.landing.leaderboardPreview.tag}
            </span>
            <h2 className="text-3xl font-bold text-foreground">{t.landing.leaderboardPreview.title}</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              {t.landing.leaderboardPreview.subtitle}
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors self-start md:self-auto"
          >
            {t.landing.leaderboardPreview.viewFull}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Podium Preview */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-muted/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topEntries.map((entry, idx) => {
              const ranks = [
                { color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/40', badgeColor: 'bg-amber-500 text-black' },
                { color: 'from-slate-400/20 to-slate-400/5', border: 'border-slate-400/40', badgeColor: 'bg-slate-300 text-black' },
                { color: 'from-amber-700/20 to-amber-700/5', border: 'border-amber-700/40', badgeColor: 'bg-amber-700 text-white' },
              ];
              const style = ranks[idx] || ranks[2];

              return (
                <div
                  key={entry.id}
                  className={`glass-card-elevated border ${style.border} bg-gradient-to-b ${style.color} p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between group hover:scale-[1.02] transition-all shadow-sm`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-background/80 border border-border flex items-center justify-center text-2xl shrink-0 shadow-sm">
                        {entry.top_badge_icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                          {entry.display_name}
                        </h3>
                        <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                          <span>{entry.tier_icon}</span> {entry.tier_name}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${style.badgeColor} shadow-sm`}>
                      #{entry.rank}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">{t.common.verified} {t.landing.leaderboardPreview.reportsCount}</span>
                      <span className="font-bold text-foreground text-sm">{entry.verified_reports} {language === 'id' ? 'laporan' : 'reports'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">{language === 'id' ? 'Sampah Terdokumentasi' : 'Waste Documented'}</span>
                      <span className="font-bold text-positive text-sm">{entry.total_weight_kg} kg</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
