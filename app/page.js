import Script from 'next/script';

// v0.1: the UI is rendered by /public/dashboard.js from sample data.
// Next step: move each tab into React components and read from the client's Supabase DB.
export default function Page() {
  return (
    <>
      <div className="app">
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
      <Script src="/dashboard.js" strategy="afterInteractive" />
    </>
  );
}
