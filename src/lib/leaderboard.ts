import { supabase } from './supabase';

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string;
  is_public_name: boolean;
  verified_reports: number;
  total_weight_kg: number;
  unique_sites: number;
  top_badge_icon: string;
  top_badge_title: string;
  tier_name: string;
  tier_icon: string;
  rank: number;
}

export interface LeaderboardPayload {
  entries: LeaderboardEntry[];
  viewerUserId: string | null;
  viewerRank: number | null;
}

/**
 * Fetch community rankings. Requires an authenticated session.
 * Data is loaded from a server API so anonymous clients never receive ranking rows.
 *
 * TODO: Persist leaderboard opt-out (is_public_leaderboard) and exclude opted-out users.
 * The BadgeCard privacy toggle is currently local-only and is not applied here.
 */
export async function getCommunityLeaderboard(
  timeframe: 'all_time' | 'this_month' = 'all_time'
): Promise<LeaderboardPayload> {
  const empty: LeaderboardPayload = { entries: [], viewerUserId: null, viewerRank: null };

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return empty;
  }

  const res = await fetch(`/api/leaderboard?timeframe=${timeframe}`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    return empty;
  }

  const data = (await res.json()) as LeaderboardPayload;
  return {
    entries: Array.isArray(data.entries) ? data.entries : [],
    viewerUserId: data.viewerUserId ?? session.user.id,
    viewerRank: data.viewerRank ?? null,
  };
}
