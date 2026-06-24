import { supabase } from './supabase';
import { EnvironmentalRecord } from '@/types/environmental';

/**
 * Fetch environmental records from the database, with optional filters for station name
 * and date ranges.
 */
export async function getEnvironmentalRecords(params?: {
  stationName?: string;
  startDate?: string;
  endDate?: string;
}) {
  let query = supabase
    .from('environmental_records')
    .select('*')
    .order('record_date', { ascending: true });

  if (params?.stationName) {
    query = query.eq('station_name', params.stationName);
  }
  if (params?.startDate) {
    query = query.gte('record_date', params.startDate);
  }
  if (params?.endDate) {
    query = query.lte('record_date', params.endDate);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching environmental records:', error);
    throw error;
  }
  return data as EnvironmentalRecord[];
}
