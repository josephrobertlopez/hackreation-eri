-- Run in Supabase SQL editor (or `supabase db push`). Synthetic data only.
create table if not exists public.job_postings (
  posting_id text primary key,
  employer text, title text, category text, neighborhood text, zip text,
  lat numeric(9,5), lon numeric(9,5),
  hours_per_week int, wage_per_hour numeric(6,2),
  health_insurance boolean, shift text, remote boolean, near_bus_line boolean,
  description text, posted_date date, synthetic boolean default true
);
alter table public.job_postings enable row level security;
create policy "public read synthetic postings" on public.job_postings for select using (synthetic = true);
-- Load data: Table editor > job_postings > Insert > Import CSV > data/job_postings.csv
