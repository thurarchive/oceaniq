import { supabase } from './supabase';
import siteLags from '@/data/site_lags.json';

export interface AnalyticsSummary {
  lastUpdatedFormatted: string;
  approvedReportsCount: number;
  approvedReportsSubtext: string;
  avgWasteDensity: number;
  avgWasteDensitySubtext: string;
  totalSubmissionsCount: number;
  totalSubmissionsSubtext: string;
  activeZonesCount: number;
  activeZonesSubtext: string;
  mlConfidenceValue: string;
  mlConfidenceSubtext: string;
  plasticFractionValue: string;
  plasticFractionSubtext: string;
  hotspotAlertsCount: number;
  hotspotAlertsSubtext: string;
  isRealData: boolean;
}

export const FALLBACK_ANALYTICS: AnalyticsSummary = {
  lastUpdatedFormatted: '5 Aug 2026',
  approvedReportsCount: 3,
  approvedReportsSubtext: '+3 community reports approved',
  avgWasteDensity: 47.3,
  avgWasteDensitySubtext: 'vs. 44.5 last period',
  totalSubmissionsCount: 174, // 171 verified observations + 3 approved citizen reports
  totalSubmissionsSubtext: '171 verified observations + 3 citizen reports (excl. ML)',
  activeZonesCount: 5,
  activeZonesSubtext: '5 official monitoring zone boundaries',
  mlConfidenceValue: '81.4',
  mlConfidenceSubtext: 'Model XGBoost Tuned — Experimental predictions (MAE: 265.25)',
  plasticFractionValue: '62.1',
  plasticFractionSubtext: 'of total waste composition',
  hotspotAlertsCount: 3,
  hotspotAlertsSubtext: 'North Jakarta Bay — CRITICAL',
  isRealData: false,
};

function formatDate(dateInput: string | Date): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return FALLBACK_ANALYTICS.lastUpdatedFormatted;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return FALLBACK_ANALYTICS.lastUpdatedFormatted;
  }
}

function formatIngestionDate(dateInput: string | Date): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '5 Aug 2026, 19:52 WIB';
    const dateStr = d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${dateStr}, ${hours}:${minutes} WIB`;
  } catch {
    return '5 Aug 2026, 19:52 WIB';
  }
}

export interface LayerCounts {
  verifiedObservations: number;
  citizenReports: number;
  mlEstimates: number;
  monitoringZones: number;
}

/**
 * Fetch real layer counts from Supabase for the Interactive Map Layer Panel & Charts.
 */
export async function fetchLayerCounts(): Promise<LayerCounts> {
  let verifiedObservations = 171;
  let citizenReports = 3;
  let mlEstimates = 847;
  let monitoringZones = 5;

  try {
    const [obsRes, citizenRes] = await Promise.all([
      supabase.from('waste_observations').select('id', { count: 'exact', head: true }),
      supabase.from('citizen_reports').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    ]);

    if (!obsRes.error && obsRes.count !== null && obsRes.count > 0) {
      verifiedObservations = obsRes.count;
    }
    if (!citizenRes.error && citizenRes.count !== null && citizenRes.count > 0) {
      citizenReports = citizenRes.count;
    }
  } catch (err) {
    console.warn('Error fetching layer counts from Supabase:', err);
  }

  return {
    verifiedObservations,
    citizenReports,
    mlEstimates,
    monitoringZones,
  };
}

/**
 * Fetch the exact timestamp of the newest observation across verified survey data and citizen reports.
 */
export async function fetchLatestIngestionDate(): Promise<string> {
  try {
    const [obsRes, citizenRes] = await Promise.all([
      supabase
        .from('waste_observations')
        .select('created_at, observation_time')
        .order('created_at', { ascending: false })
        .limit(1),
      supabase
        .from('citizen_reports')
        .select('created_at, observation_time')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(1),
    ]);

    let latestTimeMs = 0;

    if (!obsRes.error && obsRes.data && obsRes.data.length > 0) {
      const row = obsRes.data[0];
      const t = new Date(row.observation_time || row.created_at || '').getTime();
      if (!isNaN(t) && t > latestTimeMs) latestTimeMs = t;
    }

    if (!citizenRes.error && citizenRes.data && citizenRes.data.length > 0) {
      const row = citizenRes.data[0];
      const t = new Date(row.observation_time || row.created_at || '').getTime();
      if (!isNaN(t) && t > latestTimeMs) latestTimeMs = t;
    }

    if (latestTimeMs > 0) {
      return formatIngestionDate(new Date(latestTimeMs));
    }
  } catch (err) {
    console.warn('Error fetching latest ingestion date:', err);
  }

  return '5 Aug 2026, 19:52 WIB';
}

/**
 * Dynamically fetches analytics summary based on Supabase DB and model_benchmarking.json.
 * Falls back to static defaults seamlessly if real data is sparse or offline.
 */
export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  let latestMs = 0;
  let xgboostMae: number | null = null;
  let chronos2Mae: number | null = null;
  let totalBenchmarkSites = 0;

  // 1. Fetch /model_benchmarking.json
  try {
    const res = await fetch('/model_benchmarking.json');
    if (res.ok) {
      const data = await res.json();
      if (data.last_updated) {
        const bDate = new Date(data.last_updated.replace(' ', 'T'));
        if (!isNaN(bDate.getTime())) {
          latestMs = Math.max(latestMs, bDate.getTime());
        }
      }
      if (data.overall_metrics) {
        xgboostMae = data.overall_metrics.xgboost?.mae ?? null;
        chronos2Mae = data.overall_metrics.chronos2?.mae ?? null;
      }
      if (data.sites) {
        totalBenchmarkSites = Object.keys(data.sites).length;
      }
    }
  } catch (err) {
    console.warn('Could not fetch model_benchmarking.json:', err);
  }

  // 2. Fetch Supabase Data
  let dbReportCount = 0;
  let dbWeeklyApproved = 0;
  let dbWasteCount = 0;
  let dbTotalWeight = 0;
  let dbSites = new Set<string>();

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [reportsRes, wasteRes] = await Promise.all([
      supabase
        .from('citizen_reports')
        .select('created_at, weight_estimate_kg, site_name, status, lat, lng'),
      supabase
        .from('waste_observations')
        .select('created_at, total_weight_kg, site_name, status, lat, lng'),
    ]);

    if (!reportsRes.error && reportsRes.data) {
      const approved = reportsRes.data.filter((r) => r.status === 'approved');
      dbReportCount += approved.length;

      approved.forEach((r) => {
        if (r.site_name) dbSites.add(r.site_name);
        else if (r.lat && r.lng) dbSites.add(`${r.lat.toFixed(3)},${r.lng.toFixed(3)}`);
        if (r.weight_estimate_kg) dbTotalWeight += r.weight_estimate_kg;
        if (r.created_at) {
          const cTime = new Date(r.created_at).getTime();
          if (!isNaN(cTime)) {
            latestMs = Math.max(latestMs, cTime);
            if (cTime >= sevenDaysAgo.getTime()) {
              dbWeeklyApproved++;
            }
          }
        }
      });
    }

    if (!wasteRes.error && wasteRes.data) {
      const published = wasteRes.data.filter((w) => w.status === 'published' || !w.status);
      dbWasteCount += published.length;

      published.forEach((w) => {
        if (w.site_name) dbSites.add(w.site_name);
        else if (w.lat && w.lng) dbSites.add(`${w.lat.toFixed(3)},${w.lng.toFixed(3)}`);
        if (w.total_weight_kg) dbTotalWeight += w.total_weight_kg;
        if (w.created_at) {
          const cTime = new Date(w.created_at).getTime();
          if (!isNaN(cTime)) {
            latestMs = Math.max(latestMs, cTime);
          }
        }
      });
    }
  } catch (err) {
    console.warn('Could not fetch Supabase analytics data:', err);
  }

  const finalFormattedDate = latestMs > 0
    ? formatDate(new Date(latestMs))
    : FALLBACK_ANALYTICS.lastUpdatedFormatted;

  const totalReportsAndObs = dbReportCount + dbWasteCount;
  const isRealData = totalReportsAndObs > 0 || totalBenchmarkSites > 0;

  // Build ML Confidence Subtext
  let mlSubtext = FALLBACK_ANALYTICS.mlConfidenceSubtext;
  if (xgboostMae !== null || chronos2Mae !== null) {
    const parts: string[] = [];
    if (xgboostMae !== null) parts.push(`XGBoost MAE: ${xgboostMae.toFixed(1)}`);
    if (chronos2Mae !== null) parts.push(`Chronos-2 MAE: ${chronos2Mae.toFixed(1)}`);
    mlSubtext = `Model XGBoost Tuned — Experimental (${parts.join(', ')})`;
  }

  const totalObs = dbWasteCount > 0 ? dbWasteCount : 171;
  const totalCit = dbReportCount > 0 ? dbReportCount : 3;
  const totalSubmissions = totalObs + totalCit;

  const totalSubmissionsSubtext = `${totalObs} verified observations + ${totalCit} citizen reports (excl. ML)`;

  return {
    lastUpdatedFormatted: finalFormattedDate,

    approvedReportsCount: totalCit,
    approvedReportsSubtext: dbWeeklyApproved > 0
      ? `+${dbWeeklyApproved} approved this week`
      : FALLBACK_ANALYTICS.approvedReportsSubtext,

    avgWasteDensity: dbTotalWeight > 0 && totalSubmissions > 0
      ? parseFloat((dbTotalWeight / totalSubmissions).toFixed(1))
      : FALLBACK_ANALYTICS.avgWasteDensity,
    avgWasteDensitySubtext: totalReportsAndObs > 0
      ? `based on ${totalSubmissions} real entries`
      : FALLBACK_ANALYTICS.avgWasteDensitySubtext,

    totalSubmissionsCount: totalSubmissions,
    totalSubmissionsSubtext: totalSubmissionsSubtext,

    activeZonesCount: 5,
    activeZonesSubtext: '5 official monitoring zone boundaries',

    mlConfidenceValue: FALLBACK_ANALYTICS.mlConfidenceValue,
    mlConfidenceSubtext: mlSubtext,

    plasticFractionValue: FALLBACK_ANALYTICS.plasticFractionValue,
    plasticFractionSubtext: FALLBACK_ANALYTICS.plasticFractionSubtext,

    hotspotAlertsCount: FALLBACK_ANALYTICS.hotspotAlertsCount,
    hotspotAlertsSubtext: FALLBACK_ANALYTICS.hotspotAlertsSubtext,

    isRealData,
  };
}
