import Script from 'next/script';
import { authEnabled } from '../lib/supabase/config';
import { createClient } from '../lib/supabase/server';

// The dashboard UI is rendered by /public/dashboard.js from sample data.
// Next step: move each tab into React components and read from the client's Supabase DB.
export default async function Page() {
  let email = '';
  if (authEnabled) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    email = user?.email || '';
  }

  return (
    <>
      <div className="app" id="appRoot" data-user-email={email} data-auth={authEnabled ? 'on' : 'demo'}>
        <header className="top">
          <div className="avatar" id="av">M</div>
          <div className="who">
            <h1 id="pname">Maren</h1>
            <p id="psub">Your assistant</p>
          </div>
          <button className="tier" id="tierBtn" aria-label="Switch plan for demo">
            Plan: <b id="tierName">Core</b>
          </button>
        </header>
        <main id="main" />
      </div>
      <nav className="tabs" aria-label="Sections">
        <div className="in" id="tabs" />
      </nav>
      <div id="overlay" />
      <form id="signoutForm" action="/auth/signout" method="post" hidden />
      <Script src="/dashboard.js" strategy="afterInteractive" />
    </>
  );
}
