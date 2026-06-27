-- Create policy to allow all users (including anonymous/public) to read approved citizen reports
create policy "Allow public to read approved reports" on public.citizen_reports
  for select using (status = 'approved');
