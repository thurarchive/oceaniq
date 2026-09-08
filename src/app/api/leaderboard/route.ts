import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAllBadges, getUserTier } from '@/lib/badges';
import type { LeaderboardEntry } from '@/lib/leaderboard';

function getUserScopedClient(accessToken: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function privacySafeName(raw: string | null, userId: string): { display_name: string; is_public_name: boolean } {
  const name = (raw ?? '').trim();
  if (!name || name.includes('@')) {
    return { display_name: `Contributor ${userId.slice(0, 6)}`, is_public_name: false };
  }
  if (name.startsWith('CitizenScientist_') || name.startsWith('CoastScout_') || name.startsWith('OceanPatrol_')) {
    return { display_name: name, is_public_name: false };
  }
  return { display_name: name, is_public_name: true };
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  }

  const timeframe = request.nextUrl.searchParams.get('timeframe') === 'this_month' ? 'this_month' : 'all_time';

  try {
    const supabase = getUserScopedClient(token);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    }

    const { data: dbReports, error } = await supabase
      .from('citizen_reports')
      .select('user_id, contributor_name, weight_estimate_kg, site_name, status, created_at')
      .eq('status', 'approved');

    if (error) {
      console.error('Leaderboard query error:', error.message);
      return NextResponse.json({ error: 'Unable to load leaderboard' }, { status: 500 });
    }

    if (!dbReports || dbReports.length === 0) {
      return NextResponse.json({ entries: [] as LeaderboardEntry[], viewerUserId: user.id });
    }

    let filtered = dbReports;
    if (timeframe === 'this_month') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      filtered = dbReports.filter((r) => r.created_at >= firstDay);
    }

    const userStatsMap = new Map<
      string,
      {
        user_id: string;
        contributor_name: string;
        reports_count: number;
        total_weight: number;
        sites: Set<string>;
      }
    >();

    for (const r of filtered) {
      if (!r.user_id) continue;
      const existing = userStatsMap.get(r.user_id) || {
        user_id: r.user_id,
        contributor_name: r.contributor_name || '',
        reports_count: 0,
        total_weight: 0,
        sites: new Set<string>(),
      };

      existing.reports_count += 1;
      existing.total_weight += r.weight_estimate_kg || 0;
      if (r.site_name) existing.sites.add(r.site_name);
      userStatsMap.set(r.user_id, existing);
    }

    const calculatedEntries: LeaderboardEntry[] = Array.from(userStatsMap.values()).map((u) => {
      const tier = getUserTier(u.reports_count);
      const badges = getAllBadges(u.reports_count, u.total_weight, u.sites.size, true);
      const topBadge = badges.find((b) => b.unlocked) || badges[0];
      const names = privacySafeName(u.contributor_name, u.user_id);

      return {
        id: u.user_id,
        user_id: u.user_id,
        display_name: names.display_name,
        is_public_name: names.is_public_name,
        verified_reports: u.reports_count,
        total_weight_kg: Math.round(u.total_weight * 10) / 10,
        unique_sites: u.sites.size,
        top_badge_icon: topBadge.icon,
        top_badge_title: topBadge.title,
        tier_name: tier.name,
        tier_icon: tier.badgeIcon,
        rank: 0,
      };
    });

    calculatedEntries.sort(
      (a, b) => b.verified_reports - a.verified_reports || b.total_weight_kg - a.total_weight_kg
    );

    const entries = calculatedEntries.map((entry, index) => ({ ...entry, rank: index + 1 }));
    const viewerRank = entries.find((e) => e.user_id === user.id)?.rank ?? null;

    return NextResponse.json({ entries, viewerUserId: user.id, viewerRank });
  } catch (err) {
    console.error('Leaderboard API error:', err);
    return NextResponse.json({ error: 'Unable to load leaderboard' }, { status: 500 });
  }
}
