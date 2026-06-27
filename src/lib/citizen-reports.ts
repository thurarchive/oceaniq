import { supabase } from './supabase';
import {
  CitizenReport,
  CitizenReportInsert,
  CitizenReportStatus,
  UserContributionStats,
} from '@/types/citizen-reports';

/**
 * Fetch all citizen reports for a given user, newest first.
 */
export async function getUserCitizenReports(userId: string): Promise<CitizenReport[]> {
  const { data, error } = await supabase
    .from('citizen_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching citizen reports:', error);
    throw error;
  }
  return (data ?? []) as CitizenReport[];
}

/**
 * Fetch citizen reports filtered by status.
 */
export async function getCitizenReportsByStatus(
  userId: string,
  status: CitizenReportStatus
): Promise<CitizenReport[]> {
  const { data, error } = await supabase
    .from('citizen_reports')
    .select('*')
    .eq('user_id', userId)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reports by status:', error);
    throw error;
  }
  return (data ?? []) as CitizenReport[];
}

/**
 * Aggregate contribution stats for a user across citizen_reports.
 * Total submissions = pending + approved (not drafts/rejected).
 * Total weight = sum of approved weight_estimate_kg.
 * Unique sites = distinct site_name values.
 */
export async function getCitizenContributionStats(
  userId: string
): Promise<UserContributionStats> {
  const { data, error } = await supabase
    .from('citizen_reports')
    .select('weight_estimate_kg, site_name, status')
    .eq('user_id', userId)
    .in('status', ['pending_moderation', 'approved']);

  if (error) {
    console.error('Error fetching contribution stats:', error);
    throw error;
  }

  const rows = data ?? [];
  const total_submissions = rows.length;
  const total_weight_kg = rows.reduce((acc, r) => acc + (r.weight_estimate_kg ?? 0), 0);
  const unique_sites = new Set(rows.map((r) => r.site_name).filter(Boolean)).size;

  return { total_submissions, total_weight_kg, unique_sites };
}

/**
 * Insert a new citizen report.
 */
export async function insertCitizenReport(
  payload: CitizenReportInsert
): Promise<CitizenReport> {
  const { data, error } = await supabase
    .from('citizen_reports')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error inserting citizen report:', error);
    throw error;
  }
  return data as CitizenReport;
}

/**
 * Upload a site photo to Supabase Storage.
 * Bucket: `report-photos` (create with public read policy).
 */
export async function uploadCitizenPhoto(
  userId: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `citizen/${userId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('report-photos')
    .upload(path, file, { upsert: false });

  if (uploadError) {
    console.error('Error uploading photo:', uploadError);
    throw uploadError;
  }

  const { data: urlData } = supabase.storage
    .from('report-photos')
    .getPublicUrl(path);

  return urlData.publicUrl;
}

/**
 * Delete a draft report (only if owned by the user and in 'draft' status).
 */
export async function deleteDraftCitizenReport(
  id: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('citizen_reports')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .eq('status', 'draft');

  if (error) {
    console.error('Error deleting draft report:', error);
    throw error;
  }
}

/**
 * Update an existing citizen report.
 */
export async function updateCitizenReport(
  id: string,
  payload: Partial<CitizenReport>
): Promise<CitizenReport> {
  const { data, error } = await supabase
    .from('citizen_reports')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating citizen report:', error);
    throw error;
  }
  return data as CitizenReport;
}

/**
 * Fetch all citizen reports across all users that are not drafts (approved, pending_moderation, rejected).
 */
export async function getAllModeratedCitizenReports(): Promise<CitizenReport[]> {
  const { data, error } = await supabase
    .from('citizen_reports')
    .select('*')
    .neq('status', 'draft')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all moderated citizen reports:', error);
    throw error;
  }
  return (data ?? []) as CitizenReport[];
}

