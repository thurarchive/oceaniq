'use client';
import React from 'react';
import { Plus, Waves, Trophy } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { getUserTier } from '@/lib/badges';

interface DashboardHeaderProps {
  user: SupabaseUser;
  onNewReport: () => void;
  verifiedReportsCount?: number;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getRoleLabel(role?: string): string {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'analyst':
      return 'Verified Analyst';
    default:
      return 'Contributor';
  }
}

export default function DashboardHeader({
  user,
  onNewReport,
  verifiedReportsCount = 1,
}: DashboardHeaderProps) {
  const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Contributor';
  const firstName = name.split(' ')[0];
  const role = (user.app_metadata?.role || user.user_metadata?.role) as string | undefined;
  const tier = getUserTier(verifiedReportsCount);

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      {/* Left: greeting */}
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Waves size={14} className="animate-pulse" />
            {getRoleLabel(role)}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span>{tier.badgeIcon}</span>
            <span>{tier.name}</span>
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()},{' '}
          <span className="text-gradient-ocean">{firstName}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your impact, earn achievement badges, and manage your coastal reports.
        </p>
      </div>

      {/* Right: CTA */}
      <button
        id="btn-new-report"
        onClick={onNewReport}
        className="btn-primary flex items-center gap-2 text-sm self-start sm:self-auto shrink-0"
      >
        <Plus size={16} />
        New Report
      </button>
    </div>
  );
}
