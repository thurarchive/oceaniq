-- Create Sprints table
CREATE TABLE IF NOT EXISTS public.sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  goal TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Planned',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Issue Reports table
CREATE TABLE IF NOT EXISTS public.issue_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_reference_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_area TEXT,
  related_url TEXT,
  observation_id TEXT,
  map_location_description TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  steps_to_reproduce TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT,
  reporter_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_permission BOOLEAN DEFAULT false,
  information_checklist JSONB,
  priority TEXT NOT NULL DEFAULT 'Medium',
  status TEXT NOT NULL DEFAULT 'New',
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  triaged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

-- Create FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_issue_reports_status ON public.issue_reports(status);
CREATE INDEX IF NOT EXISTS idx_issue_reports_type ON public.issue_reports(issue_type);
CREATE INDEX IF NOT EXISTS idx_issue_reports_priority ON public.issue_reports(priority);
CREATE INDEX IF NOT EXISTS idx_issue_reports_sprint_id ON public.issue_reports(sprint_id);
CREATE INDEX IF NOT EXISTS idx_issue_reports_created_at ON public.issue_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_issue_reports_reporter_user_id ON public.issue_reports(reporter_user_id);

CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_published ON public.faqs(is_published);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    coalesce(current_setting('request.jwt.claim.app_metadata', true)::jsonb->>'role', '') = 'admin' OR
    coalesce(current_setting('request.jwt.claim.user_metadata', true)::jsonb->>'role', '') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Policies for Sprints
CREATE POLICY "Admins can do everything on sprints" ON public.sprints
  FOR ALL USING (public.is_admin());

-- Policies for Issue Reports
CREATE POLICY "Anyone can insert issue reports" ON public.issue_reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read their own issue reports" ON public.issue_reports
  FOR SELECT USING (auth.uid() = reporter_user_id);

CREATE POLICY "Admins can do everything on issue reports" ON public.issue_reports
  FOR ALL USING (public.is_admin());

-- Policies for FAQs
CREATE POLICY "Anyone can read published FAQs" ON public.faqs
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can do everything on FAQs" ON public.faqs
  FOR ALL USING (public.is_admin());
