'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/lib/supabase';
import {
  getUserCitizenReports,
  getCitizenContributionStats,
  getAllModeratedCitizenReports,
} from '@/lib/citizen-reports';
import { getCommunityLeaderboard, LeaderboardEntry } from '@/lib/leaderboard';
import { CitizenReport, UserContributionStats } from '@/types/citizen-reports';
import DashboardHeader from './components/DashboardHeader';
import DashboardActions from './components/DashboardActions';
import ImpactCards from './components/ImpactCards';

import MapContextCard from './components/MapContextCard';
import DashboardHelpCard from './components/DashboardHelpCard';
import CommunityProgress from './components/CommunityProgress';
import SubmissionTabs from './components/SubmissionTabs';
import NewReportModal from './components/NewReportModal';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function UserDashboardPage() {
  const { language, t } = useLanguage();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [stats, setStats] = useState<UserContributionStats>({
    total_submissions: 0,
    total_weight_kg: 0,
    unique_sites: 0,
    verified_submissions: 0,
  });
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [reviewQueue, setReviewQueue] = useState<CitizenReport[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [viewerRank, setViewerRank] = useState<number | null>(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<CitizenReport | null>(null);

  const role = (user?.app_metadata?.role || user?.user_metadata?.role) as string | undefined;

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

  const loadData = useCallback(async (userId: string, userRole?: string) => {
    setDataLoading(true);
    try {
      const isModerator = userRole === 'analyst' || userRole === 'admin';
      const [fetchedStats, fetchedReports] = await Promise.all([
        getCitizenContributionStats(userId),
        getUserCitizenReports(userId),
      ]);

      const verifiedCount = fetchedReports.filter((r) => r.status === 'approved').length;

      setStats({ ...fetchedStats, verified_submissions: verifiedCount });
      setReports(fetchedReports);

      if (isModerator) {
        const allModerated = await getAllModeratedCitizenReports();
        setReviewQueue(allModerated.filter((r) => r.status === 'pending_moderation'));
      } else {
        setReviewQueue([]);
      }
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

  useEffect(() => {
    if (!user) {
      setLeaderboardEntries([]);
      setViewerRank(null);
      return;
    }

    let isMounted = true;
    setLeaderboardLoading(true);

    getCommunityLeaderboard('all_time')
      .then((data) => {
        if (!isMounted) return;
        setLeaderboardEntries(data.entries.slice(0, 3));
        setViewerRank(data.viewerRank ?? null);
      })
      .catch((error) => {
        console.error('Failed to load leaderboard preview:', error);
        if (isMounted) {
          setLeaderboardEntries([]);
          setViewerRank(null);
        }
      })
      .finally(() => {
        if (isMounted) setLeaderboardLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (authLoading) {
    return (
      <AppLayout currentPath="/user-dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={32} className="animate-spin text-primary" />
          <span className="sr-only">{t.common.loading}</span>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout currentPath="/user-dashboard">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-16 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center text-muted-foreground">
            <Lock size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground mb-2">
              {language === 'id' ? 'Masuk untuk melihat dasbor Anda' : 'Sign in to view your dashboard'}
            </h1>
            <p className="text-sm text-muted-foreground max-w-85">
              {language === 'id'
                ? 'Dasbor kontribusi hanya dapat diakses saat Anda telah masuk ke akun Anda.'
                : 'Your contribution dashboard is only visible when you are logged in.'}
            </p>
          </div>
          <Link href="/auth?next=/user-dashboard" className="btn-primary flex items-center gap-2 text-sm">
            {t.nav.signIn}
          </Link>
        </div>
      </AppLayout>
    );
  }

  const isModerator = role === 'analyst' || role === 'admin';

  return (
    <AppLayout currentPath="/user-dashboard">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 wave-bg min-h-screen space-y-6">
        <DashboardHeader user={user} />

        <DashboardActions onSubmit={() => setModalOpen(true)} />

        <ImpactCards stats={stats} loading={dataLoading} />

        <section className="space-y-3" aria-labelledby="my-submissions-heading">
          <div className="flex items-center justify-between gap-3">
            <h2 id="my-submissions-heading" className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {language === 'id' ? 'MY SUBMISSIONS' : 'MY SUBMISSIONS'}
            </h2>
            <span className="text-xs text-muted-foreground">{reports.length} total</span>
          </div>
          <SubmissionTabs
            reports={reports}
            userId={user.id}
            user={user}
            userRole={role}
            loading={dataLoading}
            onRefresh={() => loadData(user.id, role)}
            onEdit={(r) => setSelectedDraft(r)}
            reviewOnly={false}
          />
        </section>

        <CommunityProgress
          topEntries={leaderboardEntries}
          viewerRank={viewerRank}
          loading={leaderboardLoading}
        />

        {isModerator && (
          <section className="space-y-3" aria-labelledby="review-queue-heading">
            <h2 id="review-queue-heading" className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {language === 'id' ? 'Antrian tinjauan' : 'Review queue'}
            </h2>
            <SubmissionTabs
              reports={reviewQueue}
              userId={user.id}
              user={user}
              userRole={role}
              loading={dataLoading}
              onRefresh={() => loadData(user.id, role)}
              onEdit={(r) => setSelectedDraft(r)}
              reviewOnly
            />
          </section>
        )}

        <MapContextCard />

        <DashboardHelpCard />
      </div>

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
