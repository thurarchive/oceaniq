-- Fix is_admin() to use auth.jwt() which is the correct Supabase way
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin' OR
    coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
