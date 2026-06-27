-- Migration to add contributor_name and reviewer_name to public.citizen_reports
ALTER TABLE public.citizen_reports 
ADD COLUMN IF NOT EXISTS contributor_name TEXT,
ADD COLUMN IF NOT EXISTS reviewer_name TEXT;
