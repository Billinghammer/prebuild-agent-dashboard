'use client';
import { useState } from 'react';
import { createClient } from '../../lib/supabase/client';

export default function LoginForm({ error }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(error ? 'error' : 'idle');
  const [message, setMessage] = useState(error ? 'That sign-in link expired or was already used. Try again.' : '');

  const redirectTo = () => `${window.location.origin}/auth/callback`;

  async function google() {
    setStatus('working');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectTo() },
    });
    if (error) {
      setStatus('error');
      setMessage('Google sign-in did not start. Check your connection and try again.');
    }
  }

  async function magicLink(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('working');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo(), shouldCreateUser: false },
    });
    if (error) {
      setStatus('error');
      setMessage('We couldn’t send a link to that address. Use the email your account was set up with.');
    } else {
      setStatus('sent');
      setMessage(`Check ${email.trim()} for a sign-in link.`);
    }
  }

  return (
    <div className="auth-form">
      <button type="button" className="btn primary auth-btn" onClick={google} disabled={status === 'working'}>
        Continue with Google
      </button>
      <div className="auth-or"><span>or</span></div>
      <form onSubmit={magicLink}>
        <label htmlFor="email" className="auth-label">Email me a sign-in link</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="search"
          required
        />
        <button type="submit" className="btn auth-btn" disabled={status === 'working'}>
          Send link
        </button>
      </form>
      {message && <p className={`auth-msg ${status === 'error' ? 'err' : ''}`} role="status">{message}</p>}
    </div>
  );
}
