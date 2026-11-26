# AGENTS.md

Instructions for AI coding agents working in this repo.

## What this is
Client-facing dashboard for the Prebuild Media AI assistant service for real estate agents. Mobile-first home-screen web app (Next.js on Vercel).

## Rules
- Brand as Prebuild Media. No brokerage branding.
- Sample data only until a client's own Supabase DB is wired. Never connect to Travis HQ Supabase (zxmhpgfiuhgcjqwyjuxz).
- Never commit keys. Supabase keys are entered by Travis in Vercel environment variables. See `.env.example` for names.
- Use AGENTS.md for agent instructions. Do not add a CLAUDE.md.
- Text (SMS) alerts are Pro only. Core gets in-app and email.
- Keep it simple: robust, not complex.

## Layout
- `app/` Next.js app router (layout, page, globals.css)
- `public/dashboard.js` current UI logic and sample data (v0.1)
- `public/manifest.json`, `public/icon.svg` home-screen install

## Sign-in
- Supabase Auth with Google OAuth and email magic links (`lib/supabase/`, `middleware.js`, `app/login`, `app/auth/*`).
- No env vars set = demo mode, no sign-in gate. Setup steps are in README.md.
- Sign-in scopes are basic (name, email). Request Drive/Gmail scopes in a separate, explicit consent step.

## Next steps
1. Move tabs into React components.
2. Read contacts, tasks, deals, alerts and preferences from the client's DB.
3. Per-client access rules (row level security) before any real client data.
