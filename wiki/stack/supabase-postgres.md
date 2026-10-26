---
title: Supabase and Postgres
summary: How to use Supabase safely in a 4-hour prototype. Covers RLS on every table, policies, publishable/anon key vs secret/service_role key, auth basics, migrations, CSV import, free-plan limits, synthetic data only, and a plain-Postgres fallback.
tags: [stack, supabase, postgres, rls, security, auth, migrations]
last_verified: 2026-10-23
next_review: 2027-01-05
review_owner: ERI web team lead
confidence: medium
sources:
  - title: Supabase, API keys
    url: https://supabase.com/docs/guides/getting-started/api-keys
    accessed: 2026-10-23
  - title: Supabase, Row Level Security
    url: https://supabase.com/docs/guides/database/postgres/row-level-security
    accessed: 2026-10-23
  - title: Supabase, Securing your API
    url: https://supabase.com/docs/guides/api/securing-your-api
    accessed: 2026-10-23
  - title: Supabase, Database migrations
    url: https://supabase.com/docs/guides/deployment/database-migrations
    accessed: 2026-10-23
  - title: Supabase, Import data
    url: https://supabase.com/docs/guides/database/import-data
    accessed: 2026-10-23
  - title: Supabase, Use Supabase with Expo React Native (quickstart)
    url: https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native
    accessed: 2026-10-23
  - title: Supabase, Auth quickstart for React Native
    url: https://supabase.com/docs/guides/auth/quickstarts/react-native
    accessed: 2026-10-23
  - title: Supabase pricing
    url: https://supabase.com/pricing.md
    accessed: 2026-10-23
  - title: Expo, Using Supabase
    url: https://docs.expo.dev/guides/using-supabase.md
    accessed: 2026-10-23
---

# Supabase and Postgres

## TL;DR
- **Turn on RLS on every table.** Tables made in the Dashboard get RLS by default. **Tables made in the SQL editor or migrations do not**, so always write `alter table … enable row level security;`. With RLS on and no policy, the API returns nothing.
- **The publishable key (`sb_publishable_…`, legacy `anon`) is public** and safe in the app. **The secret key (`sb_secret_…`, legacy `service_role`) bypasses RLS and never ships** in a browser, an app, a repo or a chat. Supabase is "deprecating the `anon` and `service_role` keys by the end of 2026".
- **Free plan (2026-10-23):** 2 active projects, 500 MB database, 1 GB file storage, 5 GB egress, 50,000 MAU, and projects **pause after 1 week of inactivity**.
- **Synthetic data only.** Keep the `synthetic boolean default true` column and filter on it in the policy, as the starter does.

## Minimal working example
The starter's migration, `starters/expo-supabase/supabase/migrations/0001_job_postings.sql`, as it is in the repo:

```sql
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
```

A per-user table, such as saved jobs, with owner-only policies. This is the docs' pattern, with `(select auth.uid())` for caching:

```sql
create table public.saved_jobs (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  posting_id text not null references public.job_postings(posting_id),
  note text,                                   -- synthetic notes only
  created_at timestamptz default now()
);
alter table public.saved_jobs enable row level security;
create index on public.saved_jobs (user_id);   -- index every column a policy filters on

create policy "owners read"   on public.saved_jobs for select to authenticated using ((select auth.uid()) = user_id);
create policy "owners add"    on public.saved_jobs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "owners delete" on public.saved_jobs for delete to authenticated using ((select auth.uid()) = user_id);
```

Client, as in `starters/expo-supabase/lib/supabase.js` (supabase-js v2 with AsyncStorage):
```js
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;   // publishable or legacy anon key
export const supabase = url && anonKey
  ? createClient(url, anonKey, { auth: { storage: AsyncStorage, persistSession: true, autoRefreshToken: true } })
  : null;                                                     // null means use the bundled sample data
```
Optional additions from Supabase's React Native auth quickstart: `detectSessionInUrl: false`, and an `AppState` listener that calls `supabase.auth.startAutoRefresh()` when the app is active and `stopAutoRefresh()` otherwise. Both quickstarts current on 2026-10-23 (Supabase's Expo one and Expo's Supabase guide) use `expo-sqlite`'s `localStorage` instead of AsyncStorage, and name the variable `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. The starter's AsyncStorage setup still matches Supabase's React Native auth quickstart, so you don't need to switch mid-hackathon.

Query with error handling:
```js
const { data, error } = await supabase.from('job_postings').select('posting_id,title,employer').ilike('title', `%${q}%`).limit(25);
if (error) setStatus(`Could not load jobs (${error.message}). Showing sample data.`);
```

Auth basics (only if your PRD truly needs sign-in):
```js
const { error } = await supabase.auth.signInWithPassword({ email, password });
const { data: { session }, error: e2 } = await supabase.auth.signUp({ email, password }); // no session = check email
```
Use test emails on a domain you control (or `+test` aliases). Never use a client's email.

### Migrations and seed
```bash
supabase migration new saved_jobs     # creates supabase/migrations/<timestamp>_saved_jobs.sql
supabase db reset                     # local: reapply migrations + supabase/seed.sql
supabase link                         # pick your remote project
supabase db push                      # apply migrations remotely (add --include-seed to seed)
```
No CLI? Paste the SQL into the Dashboard SQL editor, and still commit the `.sql` file.

### CSV import
- **Dashboard:** Table Editor > your table > Insert > Import data from CSV (limit 100 MB). `data/job_postings.csv` fits easily. The column headers must match the table's column names.
- **psql:** `\copy public.job_postings from 'data/job_postings.csv' with (format csv, header true)` (verify against your connection string). Postgres `COPY` is the bulk path the docs point to.

## Do / Don't checklist
- [ ] **Do** write one policy per operation (select, insert, update, delete), scoped with `to anon` or `to authenticated`.
- [ ] **Do** test policies as a real client. In the app or `curl`, use the publishable key only and confirm another user's rows come back empty.
- [ ] **Do** keep every schema change in a migration file in the repo.
- [ ] **Don't** use `to anon using (true)` except on data that is truly public. Here, that's only synthetic job postings.
- [ ] **Don't** disable RLS "to get it working". Add the missing policy instead.
- [ ] **Don't** store files with real documents in Storage. Synthetic only, and Storage needs its own policies.
- [ ] **Don't** leave a demo project with open write policies after the event. Pause or delete it.

## Security
- **Key handling:** the publishable/anon key goes in `EXPO_PUBLIC_*`. The secret/service_role key lives only in server-side env vars (an Edge Function or PHP). Keep it out of `.env` files in a mobile project, out of URLs, and out of chat. A secret key used from a browser is rejected with 401, but a leaked key still works from other tools, so rotate it if it leaks.
- **RLS is the only wall** between the public key and your data. On UPDATE, `using` picks the rows a user can target and `with check` validates the new row. Leave out `with check` and `using` applies to both.
- With a user token present, RLS applies even to requests made with the secret key.
- Consider turning off "Automatically expose new tables" in the Data API settings, so a forgotten table isn't reachable.
- **Data:** synthetic only. ERI's real systems hold SSA, DVR and health-related information that must never go into a hackathon project (see `wiki/domain/privacy-and-data.md`).

## Accessibility
Not a database concern directly, but:
- Surface errors as plain-language text in a status region, never as a raw Postgres error code alone.
- Auth screens must allow paste and password managers (WCAG 2.2 SC 3.3.8). Use magic links or no login at all if the PRD allows.

## Common AI-assistant mistakes to watch for
- Putting `SUPABASE_SERVICE_ROLE_KEY` in the Expo app "to fix permission errors". **Reject this every time.**
- `create table` in a migration without `enable row level security`, or `alter table … disable row level security`.
- `using (auth.uid() = user_id)` on an insert policy. Inserts need `with check`.
- supabase-js v1 syntax: `supabase.auth.signIn(...)`, `supabase.from(...).select().then(r => r.body)`. v2 uses `signInWithPassword` and returns `{ data, error }`.
- Assuming a `public.users` table exists. Auth users are in `auth.users`.
- Out-of-date free-plan numbers. Check the [pricing page](https://supabase.com/pricing).

## Plain Postgres fallback
No account, or the venue network is bad? The app already falls back to bundled JSON. For SQL practice, run Postgres locally and apply the same migration. Strip the Supabase-only parts (`auth.uid()`, `to authenticated`, and policies that reference `auth`):
```bash
docker run --rm -d --name eri-pg -e POSTGRES_PASSWORD=eri -p 127.0.0.1:5432:5432 postgres:18
psql postgresql://postgres:eri@127.0.0.1:5432/postgres -f starters/expo-supabase/supabase/migrations/0001_job_postings.sql
```
(The image tag `postgres:18` is the one Docker's own docs used on 2026-10-23. Pin whatever you test with.) ERI's hosting is PHP + MySQL, so for a staff web tool, `starters/php-mysql` is usually the better fallback.

## How to hand off to ERI
1. Commit `supabase/migrations/*.sql` and a `seed.sql` or CSV of **synthetic** rows only.
2. In the README, list every table, its RLS status and each policy in one line, plus which key the client uses.
3. Hand off **no keys at all**. ERI creates its own project and keys, and the team's project is paused or deleted after judging.
4. Note the Supabase-specific bits (auth, policies) that would need rework to move to ERI's MySQL hosting.

## Sources
- [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys): key types, RLS bypass, legacy key deprecation by end of 2026
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) · [Securing your API](https://supabase.com/docs/guides/api/securing-your-api)
- [Database migrations](https://supabase.com/docs/guides/deployment/database-migrations) · [Import data](https://supabase.com/docs/guides/database/import-data)
- [Expo React Native quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native) · [React Native auth quickstart](https://supabase.com/docs/guides/auth/quickstarts/react-native) · [Expo: Using Supabase](https://docs.expo.dev/guides/using-supabase.md)
- [Supabase pricing](https://supabase.com/pricing.md): free-plan limits as of 2026-10-23
