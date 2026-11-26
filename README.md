# Prebuild Agent Dashboard

Mobile-first dashboard a Prebuild Media client agent sees: daily brief, alerts, contacts and follow-ups, tasks, deals and deadlines, the assistant's inbox, and preferences.

v0.1 runs on sample data. Nothing is sent and nothing is saved.

## Run locally
```
npm install
npm run dev
```

## Deploy
Import this repo in Vercel (framework: Next.js, default settings). No environment variables are needed yet.

## Sign-in (Google + email link)
Sign-in uses Supabase Auth. With no Supabase values set, the app runs in demo mode with no sign-in.

One-time setup (done by Travis, keys never go in the repo):

1. **Supabase** (Prebuild Jason Pilot project, never Travis HQ): Project Settings → API. Copy the Project URL and the anon (publishable) key.
2. **Supabase** → Authentication → URL Configuration. Site URL = the production vercel.app address. Redirect URLs: add `https://<production domain>/auth/callback` and `https://*-travis-2758s-projects.vercel.app/auth/callback` (previews).
3. **Google Cloud Console**: create a project, set up the OAuth consent screen (External, Testing) and add each tester's Gmail as a test user. Then Credentials → Create OAuth client ID → Web application, with authorized redirect URI `https://<supabase project ref>.supabase.co/auth/v1/callback`.
4. **Supabase** → Authentication → Sign In / Providers → Google: turn on, paste the Client ID and Client secret, save.
5. **Vercel** → Settings → Environment Variables: add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for all environments, then redeploy.

Notes:
- Email links only work for existing users (`shouldCreateUser: false`). A client signs in with Google first, or is invited from Supabase → Authentication → Users.
- Sign-in asks Google only for name and email. Drive and Gmail access will be a separate consent step later.
- While the Google app is in Testing mode, only listed test users (up to 100) can sign in.
