'use client';

import React, { useState } from 'react';
import { getAllBadges, getUserTier, Badge } from '@/lib/badges';
import { Trophy, Award, Eye, EyeOff, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface BadgeCardProps {
  verifiedReportsCount: number;
  totalWeightKg: number;
  uniqueSites: number;
  hasPlastic?: boolean;
}

export default function BadgeCard({
  verifiedReportsCount,
  totalWeightKg,
  uniqueSites,
  hasPlastic = true,
}: BadgeCardProps) {
  const badges = getAllBadges(verifiedReportsCount, totalWeightKg, uniqueSites, hasPlastic);
  const tier = getUserTier(verifiedReportsCount);
  const [isPublicName, setIsPublicName] = useState(true);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const togglePrivacy = () => {
    const nextState = !isPublicName;
    setIsPublicName(nextState);
    if (nextState) {
      toast.success('Leaderboard visibility updated: Public Display Name');
    } else {
      toast.info('Leaderboard visibility updated: Anonymized Handle');
    }
  };

  return (
    <div className="glass-card-elevated border border-border p-6 rounded-2xl space-y-6">
      {/* Tier & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border shadow-sm ${tier.color}`}>
            {tier.badgeIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                Contributor Tier • Level {tier.level}
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
            {tier.nextTierName && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {tier.reportsNeededForNextTier} more verified report{tier.reportsNeededForNextTier > 1 ? 's' : ''} to unlock{' '}
                <strong className="text-foreground">{tier.nextTierName}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-xl border border-border/40 shrink-0 self-start sm:self-auto">
          <div className="text-left">
            <span className="text-[11px] text-muted-foreground block">Leaderboard Privacy</span>
            <span className="text-xs font-semibold text-foreground">
              {isPublicName ? 'Public Profile' : 'Anonymized Handle'}
            </span>
          </div>
          <button
            onClick={togglePrivacy}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${
              isPublicName
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-muted text-muted-foreground border border-border'
            }`}
            title="Toggle leaderboard display name privacy"
          >
            {isPublicName ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      {/* Badges Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-amber-400" />
          <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Achievement Badges ({unlockedCount}/{badges.length})
          </h4>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {Math.round((unlockedCount / badges.length) * 100)}% Unlocked
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
              badge.unlocked
                ? `${badge.bgColor} ${badge.borderColor}`
                : 'bg-muted/10 border-border/40 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{badge.icon}</span>
                {badge.unlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 size={10} /> Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full border border-border">
                    <Lock size={10} /> Locked
                  </span>
                )}
              </div>
              <h5 className="font-bold text-sm text-foreground mb-1">{badge.title}</h5>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                {badge.description}
              </p>
            </div>

            {/* Requirement / Progress */}
            <div className="space-y-1 pt-2 border-t border-border/30">
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>{badge.requirementText}</span>
                <span>{Math.round(badge.progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    badge.unlocked ? 'bg-emerald-400' : 'bg-primary/50'
                  }`}
                  style={{ width: `${badge.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
