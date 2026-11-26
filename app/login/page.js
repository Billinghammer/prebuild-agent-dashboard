import { authEnabled } from '../../lib/supabase/config';
import LoginForm from './LoginForm';

export const metadata = { title: 'Sign in · Prebuild Assistant' };

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="avatar" aria-hidden="true">P</div>
        <h1>Sign in to your assistant</h1>
        <p className="auth-sub">Prebuild Media</p>
        {authEnabled ? (
          <LoginForm error={params?.error === 'signin'} />
        ) : (
          <p className="auth-note">
            Sign-in isn&apos;t set up yet. Add the Supabase URL and key in Vercel to turn it on.{' '}
            <a href="/">Open the demo</a>
          </p>
        )}
      </div>
    </div>
  );
}
