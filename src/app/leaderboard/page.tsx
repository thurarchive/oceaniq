'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { getCommunityLeaderboard, LeaderboardEntry } from '@/lib/leaderboard';
import { getAllBadges, getUserTier } from '@/lib/badges';
import { Trophy, Award, Medal, ShieldCheck, MapPin, Scale, Sparkles, Filter, ChevronRight, Info, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<'all_time' | 'this_month'>('all_time');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const sampleBadges = getAllBadges(10, 300, 5, true);

  useEffect(() => {
    setLoading(true);
    getCommunityLeaderboard(timeframe).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [timeframe]);

  const top3 = entries.slice(0, 3);
  const remaining = entries.slice(3);

  return (
    <AppLayout currentPath="/leaderboard">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-10 space-y-12 wave-bg min-h-screen">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <Trophy size={14} />
            Community Leaderboard & Badges
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            Indonesia Coastal <span className="text-gradient-sky">Defenders</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Recognizing dedicated citizen scientists, coastal monitors, and environmental advocates turn field reports into actionable ocean data.
          </p>

          {/* Timeframe Filter */}
          <div className="inline-flex items-center p-1 rounded-xl bg-card border border-border mt-4">
            <button
              onClick={() => setTimeframe('all_time')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                timeframe === 'all_time'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All-Time Leaders
            </button>
            <button
              onClick={() => setTimeframe('this_month')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                timeframe === 'this_month'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Podium Top 3 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-card/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {top3.map((entry, idx) => {
              const podiumStyles = [
                {
                  rankText: '1st Place',
                  badge: '🥇',
                  border: 'border-amber-500/50',
                  glow: 'from-amber-500/20 via-card to-card',
                  badgeBg: 'bg-amber-500 text-black',
                },
                {
                  rankText: '2nd Place',
                  badge: '🥈',
                  border: 'border-slate-400/50',
                  glow: 'from-slate-400/20 via-card to-card',
                  badgeBg: 'bg-slate-300 text-black',
                },
                {
                  rankText: '3rd Place',
                  badge: '🥉',
                  border: 'border-amber-700/50',
                  glow: 'from-amber-700/20 via-card to-card',
                  badgeBg: 'bg-amber-700 text-white',
                },
              ];
              const p = podiumStyles[idx] || podiumStyles[2];

              return (
                <div
                  key={entry.id}
                  className={`glass-card-elevated border ${p.border} bg-gradient-to-b ${p.glow} p-7 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-all`}
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
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                          {entry.display_name}
                        </h3>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${p.badgeBg}`}>
                      {p.rankText}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/40 text-center">
                    <div className="bg-background/40 p-2.5 rounded-xl border border-border/30">
                      <span className="text-[10px] text-muted-foreground block uppercase font-mono">Reports</span>
                      <span className="font-bold text-foreground text-sm">{entry.verified_reports}</span>
                    </div>
                    <div className="bg-background/40 p-2.5 rounded-xl border border-border/30">
                      <span className="text-[10px] text-muted-foreground block uppercase font-mono">Waste kg</span>
                      <span className="font-bold text-positive text-sm">{entry.total_weight_kg}</span>
                    </div>
                    <div className="bg-background/40 p-2.5 rounded-xl border border-border/30">
                      <span className="text-[10px] text-muted-foreground block uppercase font-mono">Sites</span>
                      <span className="font-bold text-sky-400 text-sm">{entry.unique_sites}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="glass-card-elevated border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Medal size={20} className="text-primary" />
              Community Rankings
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              Showing top {entries.length} contributors
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-xs font-mono uppercase text-muted-foreground bg-muted/20">
                  <th className="py-3 px-4 rounded-l-xl">Rank</th>
                  <th className="py-3 px-4">Contributor</th>
                  <th className="py-3 px-4">Tier Rank</th>
                  <th className="py-3 px-4 text-center">Verified Reports</th>
                  <th className="py-3 px-4 text-center">Waste Documented</th>
                  <th className="py-3 px-4 text-center rounded-r-xl">Unique Sites</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-sans">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-base">
                      {entry.rank === 1 ? (
                        <span className="text-amber-400">🥇 #1</span>
                      ) : entry.rank === 2 ? (
                        <span className="text-slate-300">🥈 #2</span>
                      ) : entry.rank === 3 ? (
                        <span className="text-amber-600">🥉 #3</span>
                      ) : (
                        <span className="text-muted-foreground">#{entry.rank}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{entry.top_badge_icon}</span>
                        <div>
                          <span>{entry.display_name}</span>
                          {!entry.is_public_name && (
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">
                              Anonymized Handle
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-muted/40 border border-border">
                        <span>{entry.tier_icon}</span>
                        <span>{entry.tier_name}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-foreground">
                      {entry.verified_reports}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-positive">
                      {entry.total_weight_kg} kg
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-sky-400">
                      {entry.unique_sites} sites
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Badge Showcase Gallery */}
        <div className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
              Achievement Gallery
            </span>
            <h2 className="text-2xl font-bold text-foreground">Unlockable Contributor Badges</h2>
            <p className="text-xs text-muted-foreground">
              Every verified submission brings you closer to unlocking specialized badges and elevating your community standing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sampleBadges.map((badge) => (
              <div
                key={badge.id}
                className={`glass-card-elevated border ${badge.borderColor} ${badge.bgColor} p-5 rounded-2xl space-y-3`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-background/80 border border-border flex items-center justify-center text-2xl shrink-0">
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-foreground">{badge.title}</h4>
                    <span className={`text-[11px] font-mono font-semibold ${badge.color}`}>
                      Requirement: {badge.requirementText}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="glass-card-elevated border border-primary/30 p-8 rounded-2xl text-center space-y-4 bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <h3 className="text-2xl font-bold text-foreground">Want to see your name on the Leaderboard?</h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Log your coastal observations, help map marine debris hotspots, and get recognized as an official Ocean Defender.
          </p>
          <div className="pt-2">
            <Link
              href="/contribute"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              Submit a Coastal Report
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
