// Sign-in is on only when both values are set in Vercel. Until then the app runs in demo mode.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const authEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
