-- 1. Enable Row Level Security (RLS) on spatial_ref_sys and configure a read-only policy for all users
alter table public.spatial_ref_sys enable row level security;

create policy "Allow select for all users" on public.spatial_ref_sys
  for select using (true);

-- 2. Drop existing policies on citizen_reports that reference user_metadata
drop policy if exists "Allow moderators to read all reports" on public.citizen_reports;
drop policy if exists "Allow moderators to update all reports" on public.citizen_reports;

-- 3. Recreate policies utilizing app_metadata
create policy "Allow moderators to read all reports" on public.citizen_reports
  for select using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('analyst', 'admin')
  );

create policy "Allow moderators to update all reports" on public.citizen_reports
  for update using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('analyst', 'admin')
  );

-- 4. One-time data migration: copy role from raw_user_meta_data to raw_app_meta_data
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', raw_user_meta_data->>'role')
where raw_user_meta_data->>'role' is not null;
