-- Migration to create waste_observations_test table for ML pipeline simulation
CREATE TABLE IF NOT EXISTS public.waste_observations_test (
  LIKE public.waste_observations INCLUDING ALL
);

-- Enable RLS
ALTER TABLE public.waste_observations_test ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist
DROP POLICY IF EXISTS "Allow public read for test observations" ON public.waste_observations_test;
DROP POLICY IF EXISTS "Allow public insert for test observations" ON public.waste_observations_test;

-- Create policies to allow public (anon key) operations during testing
CREATE POLICY "Allow public read for test observations"
ON public.waste_observations_test
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert for test observations"
ON public.waste_observations_test
FOR INSERT
WITH CHECK (true);
