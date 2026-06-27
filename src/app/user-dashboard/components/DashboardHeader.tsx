'use client';
import React from 'react';
import { Plus, Waves } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: SupabaseUser;
  onNewReport: () => void;
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

export default function DashboardHeader({ user, onNewReport }: DashboardHeaderProps) {
  const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Contributor';
  const firstName = name.split(' ')[0];
  const role = (user.app_metadata?.role || user.user_metadata?.role) as string | undefined;

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      {/* Left: greeting */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Waves size={16} className="text-primary animate-pulse" />
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">
            {getRoleLabel(role)}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()},{' '}
          <span className="text-gradient-ocean">{firstName}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your impact and manage your marine waste reports.
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
