'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/lib/supabase';
import {
  getUserCitizenReports,
  getCitizenContributionStats,
  getAllModeratedCitizenReports,
} from '@/lib/citizen-reports';
import { CitizenReport, UserContributionStats } from '@/types/citizen-reports';
import DashboardHeader from './components/DashboardHeader';
import ImpactCards from './components/ImpactCards';
import SubmissionTabs from './components/SubmissionTabs';
import NewReportModal from './components/NewReportModal';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

export default function UserDashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [stats, setStats] = useState<UserContributionStats>({
    total_submissions: 0,
    total_weight_kg: 0,
    unique_sites: 0,
  });
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<CitizenReport | null>(null);

  const role = (user?.app_metadata?.role || user?.user_metadata?.role) as string | undefined;

  // ── Auth ──
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

  // ── Load data ──
  const loadData = useCallback(async (userId: string, role?: string) => {
    setDataLoading(true);
    try {
      const isModerator = role === 'analyst' || role === 'admin';
      const [fetchedStats, fetchedReports] = await Promise.all([
        getCitizenContributionStats(userId),
        getUserCitizenReports(userId),
      ]);

      let finalReports = [...fetchedReports];

      if (isModerator) {
        const allModerated = await getAllModeratedCitizenReports();
        // Avoid duplicate items if the moderator themselves submitted reports
        const moderatedMap = new Map(allModerated.map(r => [r.id, r]));
        finalReports = finalReports.filter(r => !moderatedMap.has(r.id));
        finalReports = [...finalReports, ...allModerated];
      }

      setStats(fetchedStats);
      setReports(finalReports);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadData(user.id, role);
    }
  }, [user, role, loadData]);

  // ── Auth loading state ──
  if (authLoading) {
    return (
      <AppLayout currentPath="/user-dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // ── Not signed in ──
  if (!user) {
    return (
      <AppLayout currentPath="/user-dashboard">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-16 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center text-muted-foreground">
            <Lock size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Sign in to view your dashboard
            </h2>
            <p className="text-sm text-muted-foreground max-w-[340px]">
              Your contribution dashboard is only visible when you&apos;re logged in.
            </p>
          </div>
          <Link href="/auth" className="btn-primary flex items-center gap-2 text-sm">
            Sign In
          </Link>
        </div>
      </AppLayout>
    );
  }

  // ── Dashboard ──
  return (
    <AppLayout currentPath="/user-dashboard">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-12 py-6 wave-bg min-h-screen">
        {/* Header */}
        <DashboardHeader user={user} onNewReport={() => setModalOpen(true)} />

        {/* Impact cards */}
        <div className="mb-6">
          <ImpactCards stats={stats} loading={dataLoading} />
        </div>

        {/* Section heading */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            {role === 'analyst' || role === 'admin'
              ? 'Moderation & Reports'
              : 'My Reports'}
          </h2>
          <span className="text-xs text-muted-foreground">
            {reports.length} total
          </span>
        </div>

        {/* Submissions */}
        <SubmissionTabs
          reports={reports}
          userId={user.id}
          user={user}
          userRole={role}
          loading={dataLoading}
          onRefresh={() => loadData(user.id, role)}
          onEdit={(r) => setSelectedDraft(r)}
        />
      </div>

      {/* Modal */}
      {(modalOpen || selectedDraft) && (
        <NewReportModal
          user={user}
          draft={selectedDraft}
          onClose={() => {
            setModalOpen(false);
            setSelectedDraft(null);
          }}
          onSuccess={() => loadData(user.id, role)}
        />
      )}
    </AppLayout>
  );
}
