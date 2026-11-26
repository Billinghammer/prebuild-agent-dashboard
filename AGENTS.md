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

## Next steps
1. Move tabs into React components.
2. Add login (Supabase Auth).
3. Read contacts, tasks, deals, alerts and preferences from the client's DB.
