// Dashboard UI logic. Sample data only: replace with Supabase reads when the per-client DB is ready.
(function(){
const S = {
  tab: 'today', tier: 'Core',
  persona: { name:'Maren', tone:'Warm and brief', signoff:'— Maren, assistant to Jason' },
  proactivity: 'Balanced',
  quiet: { on:true, from:'21:00', to:'07:00' },
  alertTypes: { deadline:true, lead:true, reply:true, showing:true, weekly:false },
  channels: { app:true, email:true, sms:false },
  contactFilter:'All', taskFilter:'Open', q:'',
  look: { theme:'harbor', custom:'#C2410C', mode:'auto', density:'comfortable', start:'today', home:{brief:true, stats:true, alerts:true, follow:true} }
};
const SAMPLE = 'Sample data for review. No real clients.';

const contacts = [
  {n:'Dana & Chris Moreau', type:'Buyer', stage:'Under contract', last:'2d', next:'Inspection debrief call', due:'Today', heat:'acc', note:'Buying 14 Pleasant St, Exeter. Pre-approved with local credit union.'},
  {n:'Priya Shah', type:'Seller', stage:'Listing prep', last:'6d', next:'Send pricing range', due:'Overdue', heat:'crit', note:'Cape in Kittery Point. Wants to list before February.'},
  {n:'Tom Arsenault', type:'Lead', stage:'New · Zillow', last:'3h', next:'First reply sent by Maren', due:'Today', heat:'warn', note:'Asked about waterfront under $1.2M in Rye or New Castle.'},
  {n:'Linda Gagnon', type:'Past client', stage:'Sphere', last:'92d', next:'Home-anniversary note', due:'Fri', heat:'ok', note:'Bought in Dover 2023. Refers often.'},
  {n:'Marcus & Jo Bell', type:'Buyer', stage:'Showing', last:'1d', next:'Confirm Sat showings', due:'Thu', heat:'acc', note:'Relocating from Boston. 4BR, Portsmouth or Stratham.'},
  {n:'Kevin O\'Rourke', type:'Lead', stage:'Open house', last:'5d', next:'Second follow-up', due:'Tomorrow', heat:'warn', note:'Signed in at Hampton open house. Renting now.'},
  {n:'Ellen Fitch', type:'Seller', stage:'Active listing', last:'1d', next:'Weekly seller update', due:'Fri', heat:'acc', note:'Listed 22 Shore Rd, York. 11 days on market.'}
];
const tasks = [
  {t:'Call Dana & Chris re: inspection report', c:'Moreau', due:'Today 10:00', src:'CRM', done:false, pri:'crit'},
  {t:'Send Priya a pricing range for Kittery Point', c:'Shah', due:'Overdue · Mon', src:'CRM', done:false, pri:'crit'},
  {t:'Approve Maren\'s reply to Tom Arsenault', c:'Arsenault', due:'Today', src:'Inbox', done:false, pri:'warn'},
  {t:'Confirm Saturday showings with listing agents', c:'Bell', due:'Thu', src:'CRM', done:false, pri:'warn'},
  {t:'Upload signed disclosure to transaction file', c:'Fitch', due:'Fri', src:'Vault', done:false, pri:'acc'},
  {t:'Order sign post for Kittery Point', c:'Shah', due:'Next week', src:'CRM', done:false, pri:'acc'},
  {t:'Send weekly seller update to Ellen', c:'Fitch', due:'Done Tue', src:'CRM', done:true, pri:'ok'}
];
const deals = [
  {a:'14 Pleasant St, Exeter', who:'Moreau · buyer side', price:'$612,000', step:3, closing:'Dec 30',
   d:[['Inspection contingency','Nov 28','soon'],['Financing commitment','Dec 12',''],['Appraisal','Dec 9',''],['Closing','Dec 30','']]},
  {a:'22 Shore Rd, York', who:'Fitch · listing', price:'$1,145,000', step:1, closing:'—',
   d:[['Listing photos refresh','Dec 1',''],['Price review with seller','Dec 5','']]},
  {a:'8 Bow St #3, Portsmouth', who:'Leary · buyer side', price:'$489,000', step:4, closing:'Dec 4',
   d:[['Final walkthrough','Dec 3','soon'],['Clear-to-close from lender','Nov 25','late'],['Closing','Dec 4','soon']]},
  {a:'Lot 7 Harbor View, Eliot', who:'New construction · buyer side', price:'$739,900', step:2, closing:'Apr 2027',
   d:[['Builder selections due','Dec 15',''],['Deposit #2','Jan 10','']]}
];
const STEPS = ['Offer','Accepted','Inspection','Financing','Closing'];
let mail = [
  {f:'Tom Arsenault', s:'Waterfront in Rye?', p:'Hi, saw a few listings on Zillow. Is anything coming up under 1.2...', t:'7:42a', unread:true, tag:'Draft ready', tagc:'warn',
   draft:'Hi Tom, thanks for reaching out. A few waterfront homes in Rye and New Castle fit your range, and one more is likely to come on next week. Jason can walk you through them. Would a 15-minute call Thursday or Friday work?\n\n— Maren, assistant to Jason'},
  {f:'Seacoast Title', s:'Bow St: lender CTC still pending', p:'We have not received clear-to-close from the lender for 8 Bow St...', t:'Yesterday', unread:true, tag:'Deadline risk', tagc:'crit',
   draft:'Thanks for the heads up. Jason is calling the loan officer this morning and will confirm by noon.\n\n— Maren, assistant to Jason'},
  {f:'Ellen Fitch', s:'Re: showing feedback', p:'Thanks for the update! Did the couple from Saturday say anything about...', t:'Mon', unread:false, tag:'Answered', tagc:'ok', draft:''},
  {f:'Zillow Premier Agent', s:'New lead: Kevin O\'Rourke', p:'A new lead has requested information about 41 High St, Hampton...', t:'Sat', unread:false, tag:'Logged to CRM', tagc:'acc', draft:''}
];
const alerts = [
  {t:'Bow St clear-to-close is 1 day late', s:'Closing is Dec 4. Title is waiting on the lender.', c:'crit', when:'8:02a'},
  {t:'Inspection contingency ends Friday', s:'14 Pleasant St, Exeter. Debrief call is on today\'s list.', c:'warn', when:'7:30a'},
  {t:'New lead replied: Tom Arsenault', s:'Maren drafted a reply. Waiting for your OK.', c:'acc', when:'7:42a'},
  {t:'Priya Shah follow-up is overdue', s:'Last touch 6 days ago. Pricing range was promised Monday.', c:'warn', when:'Yesterday'}
];

const ICONS = {
  today:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  people:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.8.7 3 2.5 3.5 5.2"/></svg>',
  tasks:'<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="m8 12 3 3 5-6"/></svg>',
  deals:'<svg viewBox="0 0 24 24"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/></svg>',
  inbox:'<svg viewBox="0 0 24 24"><path d="M3 13l2.5-8h13L21 13v6H3z"/><path d="M3 13h5l1.5 2.5h5L16 13h5"/></svg>',
  settings:'<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>'
};
const TABS = [['today','Today'],['people','Contacts'],['tasks','Tasks'],['deals','Deals'],['inbox','Inbox'],['settings','Settings']];

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function toast(msg){
  const el = document.createElement('div'); el.className='toast'; el.textContent=msg; document.body.appendChild(el);
  setTimeout(()=>el.remove(), 2200);
}
function sheet(html){
  $('#overlay').innerHTML = `<div class="sheet-bg" id="sbg"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;
  $('#sbg').addEventListener('click', e => { if(e.target.id==='sbg' || e.target.dataset.close!==undefined) $('#overlay').innerHTML=''; });
}

// Color themes. Core gets the first three. Pro unlocks the rest plus a custom color.
const THEMES = [
  {k:'harbor', n:'Harbor', pro:false, l:['#1D6A70','#DCECEC'], d:['#5FB7BC','#1E3A3C']},
  {k:'granite', n:'Granite', pro:false, l:['#3D4F66','#E1E6EE'], d:['#9DB0CC','#26303D']},
  {k:'pine', n:'Pine', pro:false, l:['#2F6B3F','#DDEBDF'], d:['#79C08C','#1E3426']},
  {k:'cranberry', n:'Cranberry', pro:true, l:['#9B2F4A','#F4DEE4'], d:['#E68AA1','#3A1E26']},
  {k:'brass', n:'Brass', pro:true, l:['#8A6416','#F3E9D2'], d:['#D9B25E','#362B15']},
  {k:'midnight', n:'Midnight', pro:true, l:['#2B3A8F','#E0E3F5'], d:['#9AA8F0','#22264A']},
  {k:'sand', n:'Driftwood', pro:true, l:['#7A5C48','#EFE6DF'], d:['#CFAE96','#33281F']}
];
const PRO_START = ['deals','inbox'];
const hostTheme = document.documentElement.getAttribute('data-theme');
const mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
function mix(hex, other, t){
  const a=hex.match(/\w\w/g).map(x=>parseInt(x,16)), b=other.match(/\w\w/g).map(x=>parseInt(x,16));
  return '#'+a.map((v,i)=>Math.round(v+(b[i]-v)*t).toString(16).padStart(2,'0')).join('');
}
function isDark(){
  const m=S.look.mode, root=document.documentElement.getAttribute('data-theme');
  if(m==='dark') return true; if(m==='light') return false;
  if(root==='dark') return true; if(root==='light') return false;
  return !!(mq && mq.matches);
}
function lockToTier(){
  if(S.tier==='Pro') return;
  const th=THEMES.find(t=>t.k===S.look.theme);
  if(S.look.theme==='custom' || (th && th.pro)) S.look.theme='harbor';
  if(PRO_START.includes(S.look.start)) S.look.start='today';
  S.look.home={brief:true, stats:true, alerts:true, follow:true};
}
function applyLook(){
  const root=document.documentElement;
  if(S.look.mode==='auto'){ if(hostTheme) root.setAttribute('data-theme',hostTheme); else root.removeAttribute('data-theme'); }
  else root.setAttribute('data-theme', S.look.mode);
  const dark=isDark();
  let acc, soft;
  if(S.look.theme==='custom'){
    const c=S.look.custom; acc= dark? mix(c,'#ffffff',.35) : c; soft= dark? mix(c,'#0F1615',.78) : mix(c,'#ffffff',.85);
  } else { const t=THEMES.find(x=>x.k===S.look.theme)||THEMES[0]; [acc,soft]= dark? t.d : t.l; }
  root.style.setProperty('--accent',acc); root.style.setProperty('--accent-soft',soft);
  root.style.setProperty('--accent-ink', dark? '#0B1413' : '#FFFFFF');
  document.body.classList.toggle('compact', S.look.density==='compact');
  try{ localStorage.setItem('pb-look', JSON.stringify(S.look)); }catch(e){}
}
if(mq && mq.addEventListener) mq.addEventListener('change', applyLook);

function header(){
  $('#av').textContent = S.persona.name.charAt(0).toUpperCase() || 'A';
  $('#pname').textContent = S.persona.name || 'Assistant';
  $('#psub').textContent = `Your assistant · ${S.proactivity} · watching ${deals.length} deals`;
  $('#tierName').textContent = S.tier;
}
function renderTabs(){
  const unread = mail.filter(m=>m.unread).length;
  $('#tabs').innerHTML = TABS.map(([k,l]) => `<button data-tab="${k}" class="${S.tab===k?'on':''}" aria-current="${S.tab===k?'page':'false'}">${ICONS[k]}${l}${k==='inbox'&&unread?`<span class="badge">${unread}</span>`:''}</button>`).join('');
}

const V = {};
V.today = () => {
  const open = tasks.filter(t=>!t.done).length;
  const h=S.look.home;
  return `
  <div class="demo-note">${SAMPLE}</div>
  ${h.brief?`<div class="card brief">
    <div class="k">Thursday brief · from ${esc(S.persona.name)}</div>
    <p>Good morning, Jason. Two things need you before noon. The rest I've handled or queued.</p>
    <ul>
      <li>Bow St closing is at risk. The lender hasn't sent clear-to-close.</li>
      <li>Moreau inspection window ends Friday. Debrief call at 10.</li>
      <li>I drafted a reply to a new Rye waterfront lead. Tap to approve.</li>
    </ul>
    <div class="btn-row"><button class="btn" data-go="inbox">Review draft</button><button class="btn" data-go="deals">Open deals</button></div>
  </div>`:''}
  ${h.stats?`<div class="stats">
    <button class="stat" data-go="tasks"><b>${open}</b><span>Open tasks</span></button>
    <button class="stat" data-go="people"><b>3</b><span>Follow-ups</span></button>
    <button class="stat" data-go="deals"><b>${deals.length}</b><span>Active deals</span></button>
    <button class="stat" data-go="inbox"><b>${mail.filter(m=>m.unread).length}</b><span>Unread</span></button>
  </div>`:''}
  ${h.alerts?`<h3>Alerts</h3>
  <div class="list">${alerts.map((a,i)=>`
    <button class="row" data-alert="${i}"><span class="dot d-${a.c}"></span><span class="main"><span class="t">${esc(a.t)}</span><span class="s" style="display:block">${esc(a.s)}</span></span><span class="side">${a.when}</span></button>`).join('')}
  </div>`:''}
  ${h.follow?`<h3>Today's follow-ups</h3>
  <div class="list">${contacts.filter(c=>['Today','Overdue'].includes(c.due)).map(c=>`
    <button class="row" data-contact="${contacts.indexOf(c)}"><span class="main"><span class="t">${esc(c.n)}</span><span class="s" style="display:block">${esc(c.next)}</span></span><span class="pill ${c.due==='Overdue'?'p-crit':'p-warn'}">${c.due}</span></button>`).join('')}
  </div>`:''}`;
};
V.people = () => {
  const types = ['All','Lead','Buyer','Seller','Past client'];
  const list = contacts.filter(c => (S.contactFilter==='All'||c.type===S.contactFilter) && c.n.toLowerCase().includes(S.q.toLowerCase()));
  return `<h2>Contacts</h2>
  <input class="search" id="q" type="search" placeholder="Search contacts" value="${esc(S.q)}" aria-label="Search contacts">
  <div class="seg">${types.map(t=>`<button data-cf="${t}" class="${S.contactFilter===t?'on':''}">${t}</button>`).join('')}</div>
  <div class="list">${list.length?list.map(c=>`
    <button class="row" data-contact="${contacts.indexOf(c)}"><span class="dot d-${c.heat}"></span><span class="main"><span class="t">${esc(c.n)}</span><span class="s" style="display:block">${c.type} · ${esc(c.stage)} · last touch ${c.last}</span><span class="s" style="display:block">Next: ${esc(c.next)}</span></span><span class="side">${c.due}</span></button>`).join(''):'<div class="row"><span class="s">No contacts match.</span></div>'}
  </div>`;
};
V.tasks = () => {
  const list = tasks.filter(t => S.taskFilter==='Open' ? !t.done : t.done);
  return `<h2>Tasks</h2>
  <div class="seg"><button data-tf="Open" class="${S.taskFilter==='Open'?'on':''}">Open (${tasks.filter(t=>!t.done).length})</button><button data-tf="Done" class="${S.taskFilter==='Done'?'on':''}">Done (${tasks.filter(t=>t.done).length})</button></div>
  <div class="list">${list.map(t=>{const i=tasks.indexOf(t);return `
    <div class="row ${t.done?'done':''}"><button class="check ${t.done?'on':''}" data-task="${i}" aria-label="Mark ${t.done?'open':'done'}"></button><span class="main"><span class="t">${esc(t.t)}</span><span class="s" style="display:block">${esc(t.c)} · from ${t.src}</span></span><span class="side">${esc(t.due)}</span></div>`}).join('') || '<div class="row"><span class="s">Nothing here.</span></div>'}
  </div>
  <div class="btn-row"><button class="btn primary" id="addTask">Add task</button></div>`;
};
V.deals = () => `<h2>Deals & deadlines</h2>
  <div class="stack">${deals.map(d=>`
    <div class="card deal">
      <div class="deal-top"><div><div class="t">${esc(d.a)}</div><div class="s">${esc(d.who)} · ${d.price}</div></div><span class="pill p-acc">${STEPS[d.step]}</span></div>
      <div class="steps" aria-label="Stage ${d.step+1} of 5">${STEPS.map((s,i)=>`<i class="${i<d.step?'on':i===d.step?'now':''}" title="${s}"></i>`).join('')}</div>
      <div class="deadlines">${d.d.map(([n,dt,st])=>`<div><span>${esc(n)}</span><span class="${st}">${st==='late'?'Late · ':st==='soon'?'Soon · ':''}${dt}</span></div>`).join('')}</div>
    </div>`).join('')}
  </div>`;
V.inbox = () => `<h2>${esc(S.persona.name)}'s inbox</h2>
  <div class="inbox-addr"><code>${esc(S.persona.name.toLowerCase()||'assistant')}.jason@agentmail.to</code><span class="pill p-acc">Inbox only</span></div>
  <div class="list">${mail.map((m,i)=>`
    <button class="row ${m.unread?'unread':''}" data-mail="${i}"><span class="main"><span class="t">${esc(m.f)}</span><span class="s" style="display:block;color:var(--fg)">${esc(m.s)}</span><span class="s" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(m.p)}</span></span><span class="side">${m.t}<br><span class="pill p-${m.tagc}" style="margin-top:6px">${m.tag}</span></span></button>`).join('')}
  </div>`;
V.settings = () => {
  const pro = S.tier==='Pro';
  const sw = (id, on, dis=false) => `<span class="switch"><input type="checkbox" id="${id}" ${on?'checked':''} ${dis?'disabled':''}><span></span></span>`;
  const lv = [['Quiet','Only urgent items. You ask, I act.'],['Balanced','Daily brief, flags risks, drafts replies.'],['Hands-on','Nudges often, preps everything ahead.']];
  const L=S.look, lockP = pro?'':'disabled';
  const proTag = pro?'':' <span class="pill p-pro">Pro</span>';
  return `<h2>Preferences</h2>
  <h3>Color theme</h3>
  <div class="list"><div class="swatches">${THEMES.map(t=>{const dis=t.pro&&!pro;return `<button class="sw ${L.theme===t.k?'on':''}" data-theme-k="${t.k}" ${dis?'disabled':''} aria-label="${t.n}${dis?' (Pro)':''}"><i style="background:${t.l[0]}"></i>${t.n}${dis?'<span class="lock">PRO</span>':''}</button>`}).join('')}
    <label class="sw ${L.theme==='custom'?'on':''}" ${pro?'':'aria-disabled="true" style="opacity:.55;cursor:not-allowed"'}><input type="color" id="lk-custom" value="${L.custom}" ${lockP} aria-label="Custom color${pro?'':' (Pro)'}">Custom${pro?'':'<span class="lock">PRO</span>'}</label>
  </div></div>
  <h3>Light or dark</h3>
  <div class="list"><div class="opt3">${[['auto','Match phone'],['light','Light'],['dark','Dark']].map(([k,n])=>`<button data-mode="${k}" class="${L.mode===k?'on':''}">${n}</button>`).join('')}</div></div>
  <h3>Layout</h3>
  <div class="list">
    <div class="setting"><label>Spacing<span class="s">Compact fits more on one screen</span></label><span class="seg" style="margin:0;flex:none">${['comfortable','compact'].map(k=>`<button data-density="${k}" class="${L.density===k?'on':''}">${k==='comfortable'?'Roomy':'Compact'}</button>`).join('')}</span></div>
    <div class="setting"><label for="lk-start">Opens to${proTag}<span class="s">${pro?'The screen you see when you open the app':'Core opens to Today. Pro can open to Deals or Inbox.'}</span></label><select id="lk-start">${[['today','Today'],['deals','Deals'],['inbox','Inbox']].map(([k,n])=>`<option value="${k}" ${L.start===k?'selected':''} ${!pro&&k!=='today'?'disabled':''}>${n}</option>`).join('')}</select></div>
  </div>
  <h3>Today screen${proTag}</h3>
  <div class="list">
    ${[['brief','Morning brief'],['stats','Quick counts'],['alerts','Alerts'],['follow','Today\'s follow-ups']].map(([k,n])=>`<div class="setting"><label for="hm-${k}">${n}${pro?'':'<span class="s">Pro can hide sections it doesn\'t need</span>'}</label>${sw('hm-'+k, L.home[k], !pro)}</div>`).join('')}
  </div>
  ${pro?'':'<div class="upsell">Pro unlocks four more color themes, a custom brand color, the start screen, and a Today screen you can trim down.</div>'}
  <h3>Assistant</h3>
  <div class="list">
    <div class="setting"><label for="pn">Name<span class="s">What your assistant signs as</span></label><input type="text" id="pn" value="${esc(S.persona.name)}" maxlength="20" style="width:130px"></div>
    <div class="setting"><label for="pt">Tone</label><select id="pt">${['Warm and brief','Formal','Upbeat','Straight to the point'].map(o=>`<option ${o===S.persona.tone?'selected':''}>${o}</option>`).join('')}</select></div>
  </div>
  <h3>Proactivity</h3>
  <div class="list"><div class="levels">${lv.map(([k,d])=>`<button data-lv="${k}" class="${S.proactivity===k?'on':''}"><b>${k}</b><span>${d}</span></button>`).join('')}</div></div>
  <h3>Alert types</h3>
  <div class="list">
    <div class="setting"><label for="at-deadline">Deadlines and contingencies<span class="s">Inspection, financing, closing dates</span></label>${sw('at-deadline',S.alertTypes.deadline)}</div>
    <div class="setting"><label for="at-lead">New leads<span class="s">Portals, website, open house sign-ins</span></label>${sw('at-lead',S.alertTypes.lead)}</div>
    <div class="setting"><label for="at-reply">Replies needing you<span class="s">Drafts waiting for approval</span></label>${sw('at-reply',S.alertTypes.reply)}</div>
    <div class="setting"><label for="at-showing">Showing changes</label>${sw('at-showing',S.alertTypes.showing)}</div>
    <div class="setting"><label for="at-weekly">Weekly pipeline summary</label>${sw('at-weekly',S.alertTypes.weekly)}</div>
  </div>
  <h3>Channels</h3>
  <div class="list">
    <div class="setting"><label for="ch-app">In-app<span class="s">Home-screen notifications</span></label>${sw('ch-app',S.channels.app)}</div>
    <div class="setting"><label for="ch-email">Email</label>${sw('ch-email',S.channels.email)}</div>
    <div class="setting"><label for="ch-sms">Text message <span class="pill p-pro">Pro</span><span class="s">${pro?'Sent from your assistant\'s number':'Upgrade to Pro to get alerts by text'}</span></label>${sw('ch-sms',pro&&S.channels.sms,!pro)}</div>
  </div>
  ${pro?'':'<div class="upsell">Text alerts are part of Pro ($399/mo). Tap the plan button at the top to preview Pro.</div>'}
  <h3>Quiet hours</h3>
  <div class="list">
    <div class="setting"><label for="qh">Hold non-urgent alerts<span class="s">Deadline risks still come through</span></label>${sw('qh',S.quiet.on)}</div>
    <div class="setting"><span class="quiet"><label for="qf">From</label><input type="time" id="qf" value="${S.quiet.from}" ${S.quiet.on?'':'disabled'}><label for="qt">to</label><input type="time" id="qt" value="${S.quiet.to}" ${S.quiet.on?'':'disabled'}></span></div>
  </div>
  <h3>Account</h3>
  <div class="list">${(()=>{const r=document.getElementById('appRoot'); const em=r?r.dataset.userEmail:''; const on=r&&r.dataset.auth==='on';
    return on ? `<div class="setting"><label>Signed in<span class="s" style="overflow-wrap:anywhere">${esc(em||'Signed in')}</span></label><button class="btn" id="signOut">Sign out</button></div>`
              : `<div class="setting"><label>Demo mode<span class="s">Sign-in turns on once it's set up in Vercel</span></label><span class="pill p-warn">Demo</span></div>`;})()}
  </div>
  <h3>Your data</h3>
  <div class="list">
    <div class="setting"><label>Support access<span class="s">Off. You approve any time-limited access, and it is logged.</span></label><span class="pill p-ok">Off</span></div>
    <div class="setting"><label>Backups<span class="s">Daily · last run 3:00 AM</span></label><span class="pill p-ok">On</span></div>
  </div>
  <div class="demo-note" style="margin-top:16px">${SAMPLE} Changes here are not saved.</div>`;
};

function render(){
  applyLook(); header(); renderTabs();
  $('#main').innerHTML = `<div class="view">${V[S.tab]()}</div>`;
  const q = $('#q'); if(q){ q.addEventListener('input', e => { S.q = e.target.value; const pos=e.target.selectionStart; render(); const n=$('#q'); n.focus(); n.setSelectionRange(pos,pos); }); }
}
function go(tab){ S.tab = tab; render(); window.scrollTo(0,0); }

document.addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b) return;
  if(b.dataset.tab) return go(b.dataset.tab);
  if(b.dataset.go) return go(b.dataset.go);
  if(b.id==='tierBtn'){ S.tier = S.tier==='Core'?'Pro':'Core'; if(S.tier==='Core'){ S.channels.sms=false; lockToTier(); } render(); return toast(`Previewing ${S.tier}`); }
  if(b.dataset.cf){ S.contactFilter=b.dataset.cf; return render(); }
  if(b.dataset.tf){ S.taskFilter=b.dataset.tf; return render(); }
  if(b.dataset.themeK){ S.look.theme=b.dataset.themeK; render(); return; }
  if(b.dataset.mode){ S.look.mode=b.dataset.mode; return render(); }
  if(b.dataset.density){ S.look.density=b.dataset.density; return render(); }
  if(b.dataset.lv){ S.proactivity=b.dataset.lv; render(); return toast(`Proactivity set to ${b.dataset.lv}`); }
  if(b.dataset.task){ const t=tasks[+b.dataset.task]; t.done=!t.done; render(); return toast(t.done?'Task done':'Task reopened'); }
  if(b.id==='addTask'){ return sheet(`<h4>Add task</h4><div class="body"><input type="text" id="nt" placeholder="e.g. Call Priya about pricing" style="width:100%"><div class="btn-row"><button class="btn primary" id="saveTask">Add</button><button class="btn" data-close>Cancel</button></div></div>`); }
  if(b.id==='saveTask'){ const v=$('#nt').value.trim(); if(!v){ $('#nt').focus(); return; } tasks.unshift({t:v,c:'—',due:'No date',src:'You',done:false,pri:'acc'}); $('#overlay').innerHTML=''; S.taskFilter='Open'; render(); return toast('Task added'); }
  if(b.dataset.contact){ const c=contacts[+b.dataset.contact]; return sheet(`<h4>${esc(c.n)}</h4><div class="s">${c.type} · ${esc(c.stage)} · last touch ${c.last}</div><div class="body">${esc(c.note)}</div><div class="draft"><b>Next step:</b> ${esc(c.next)} (${c.due})</div><div class="btn-row"><button class="btn primary" data-close>Log a touch</button><button class="btn" data-close>Ask ${esc(S.persona.name)} to draft</button></div>`); }
  if(b.dataset.alert){ const a=alerts[+b.dataset.alert]; return sheet(`<h4>${esc(a.t)}</h4><div class="body">${esc(a.s)}</div><div class="btn-row"><button class="btn primary" data-go="deals">Open deal</button><button class="btn" data-close>Snooze 2 hours</button></div>`); }
  if(b.dataset.mail){ const i=+b.dataset.mail, m=mail[i]; m.unread=false; renderTabs(); return sheet(`<h4>${esc(m.s)}</h4><div class="s">From ${esc(m.f)} · ${m.t}</div><div class="body">${esc(m.p)}</div>${m.draft?`<h3>${esc(S.persona.name)}'s draft reply</h3><div class="draft">${esc(m.draft)}</div><div class="btn-row"><button class="btn primary" data-approve="${i}">Approve and send</button><button class="btn" data-close>Edit</button></div>`:''}`); }
  if(b.id==='signOut'){ const f=document.getElementById('signoutForm'); if(f) f.submit(); return; }
  if(b.dataset.approve){ const m=mail[+b.dataset.approve]; m.tag='Sent'; m.tagc='ok'; m.draft=''; $('#overlay').innerHTML=''; render(); return toast('Demo only. Nothing was sent.'); }
});
document.addEventListener('change', e => {
  const id = e.target.id; if(!id) return;
  if(id.startsWith('at-')) S.alertTypes[id.slice(3)] = e.target.checked;
  else if(id.startsWith('ch-')) S.channels[id.slice(3)] = e.target.checked;
  else if(id==='qh'){ S.quiet.on=e.target.checked; render(); }
  else if(id==='qf') S.quiet.from=e.target.value;
  else if(id==='qt') S.quiet.to=e.target.value;
  else if(id==='pt') S.persona.tone=e.target.value;
  else if(id==='lk-custom'){ if(S.tier!=='Pro') return; S.look.custom=e.target.value; S.look.theme='custom'; render(); }
  else if(id==='lk-start'){ S.look.start=e.target.value; toast('Saved. Applies next time you open the app.'); }
  else if(id.startsWith('hm-')){ S.look.home[id.slice(3)]=e.target.checked; }
  else if(id==='pn'){ S.persona.name=e.target.value.trim()||'Assistant'; header(); toast('Name updated'); }
});
try{ const saved=JSON.parse(localStorage.getItem('pb-look')||'null'); if(saved){ Object.assign(S.look, saved); S.look.home=Object.assign({brief:true,stats:true,alerts:true,follow:true}, saved.home||{}); } }catch(e){}
lockToTier();
if(S.look.start && S.look.start!=='today') S.tab=S.look.start;
render();
})();
