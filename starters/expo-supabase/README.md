# Expo (React Native) + Supabase starter

A mobile and web app with one codebase. The suggested option for phone-first prototypes.

```bash
cd starters/expo-supabase
npm install
npx expo start          # press w for web, or scan the QR with Expo Go on your phone
```

You'll see "Hello, ERI!" and a searchable list of 60 synthetic jobs (bundled in `data/job_postings.json`).

## Connect Supabase (optional, ~5 min)
1. Create a free project at supabase.com.
2. In the SQL editor, run `supabase/migrations/0001_job_postings.sql`.
3. Import `../../data/job_postings.csv` into the `job_postings` table.
4. Copy `.env.example` to `.env`, then paste your project URL and publishable (anon) key.
5. Restart `npx expo start`. The header changes to "data: Supabase".

Row Level Security is on, and the policy only lets anyone read rows marked synthetic. **Never put real client data in a hackathon project.**

Built on Expo SDK 58. Use `npx expo install <pkg>` (not `npm install`) so versions match the SDK. See `AGENTS.md` for Expo notes written for AI coding tools.

**Good for:** a phone version of PRD 02.
