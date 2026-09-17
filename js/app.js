// Entry point: routing between the three modes, server health, header controls.
import { app, $, $$, emit } from './core.js';
import { store } from './store.js';
import { initSimulation } from './sim.js';

const loaded = {};
const VIEWS = ['simulation', 'calculator', 'practice'];

async function route() {
  const hash = location.hash.slice(1);
  const mode = VIEWS.includes(hash) ? hash : 'simulation';
  const prev = document.body.dataset.route;
  document.body.dataset.route = mode;
  for (const v of VIEWS) $(`#view-${v}`).hidden = v !== mode;
  // Mode links start at the top; in-page anchors (#notes, #builder…) scroll once
  // their view is visible again.
  if (VIEWS.includes(hash) && (prev !== mode || hash === 'simulation')) window.scrollTo(0, 0);
  else if (hash && prev && prev !== mode) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView());
  $$('.modes a').forEach(a => a.setAttribute('aria-current', a.dataset.mode === mode ? 'page' : 'false'));
  document.title = { simulation: 'Capital Committee', calculator: 'Calculator · Capital Committee', practice: 'Case practice · Capital Committee' }[mode];
  if (!loaded[mode]) {
    loaded[mode] = true;
    if (mode === 'calculator') (await import('./calc.js')).initCalculator($('#calcRoot'));
    if (mode === 'practice') (await import('./practice.js')).initPractice($('#practiceRoot'));
  }
  emit('route', mode);
}

async function health() {
  const badge = $('#liveBadge');
  try {
    const r = await fetch('/api/health', { cache: 'no-store' });
    const h = r.ok ? await r.json() : null;
    app.live = !!h?.live;
    app.passcodeRequired = !!h?.passcode;
  } catch { app.live = false; }
  badge.dataset.state = app.live ? 'live' : 'demo';
  badge.querySelector('.live-text').textContent = app.live ? 'Live · Claude API' : 'Demo · no API key';
  badge.title = app.live
    ? 'Department calls run live through the server-side proxy.'
    : 'This deployment has no ANTHROPIC_API_KEY. Sample decisions replay recorded committees.';
  emit('health', app.live);
}

// The hero fills the screen below the header, so it needs the header's real height.
function trackTopbar() {
  const bar = document.querySelector('.topbar');
  const set = () => document.documentElement.style.setProperty('--topbar-h', `${Math.round(bar.getBoundingClientRect().height)}px`);
  set();
  new ResizeObserver(set).observe(bar);
}

function initHeader() {
  const tier = $('#tier');
  tier.value = app.tier;
  tier.addEventListener('change', () => { app.tier = tier.value; store.set('tier', app.tier); emit('tier', app.tier); });
  $('#sessionCost').textContent = `$${app.cost.toFixed(3)} spent`;
}

// ?clean renders the 3D committee with no UI chrome: used to make reference
// images for concept art without any text in frame.
if (new URLSearchParams(location.search).has('clean')) document.documentElement.classList.add('clean');

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mono ticker of the project's real figures (estimates are labelled as such).
function initTicker() {
  const el = document.getElementById('ticker');
  if (!el) return;
  const items = [['7', 'AI departments'], ['1', 'Company Brain'], ['NPV +$1.71M', '@ 8% WACC'], ['IRR 11.2%', 'solar preset'],
    ['SAR 0.20', 'per kWh tariff'], ['16', 'consulting cases'], ['12', 'Gulf settings'], ['≈$0.41', 'est. per committee'], ['5/5', 'engine tests']];
  const row = items.map(([b, s]) => `<span><b>${b}</b> ${s.toUpperCase()}</span>`).join('');
  el.innerHTML = row + row;
}

// Cursor-following light in the hero, one rAF per frame at most.
function initHeroLight() {
  const hero = document.querySelector('.mhero');
  if (!hero || reduceMotion) return;
  let raf = 0, x = 0, y = 0;
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    x = ((e.clientX - r.left) / r.width) * 100;
    y = ((e.clientY - r.top) / r.height) * 100;
    if (!raf) raf = requestAnimationFrame(() => { hero.style.setProperty('--mx', `${x}%`); hero.style.setProperty('--my', `${y}%`); raf = 0; });
  });
}

// Translate-only reveal; content is visible even if this never runs.
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach(el => io.observe(el));
}

initTicker();
initHeroLight();
initReveal();
trackTopbar();
initHeader();
initSimulation();
window.addEventListener('hashchange', route);
route();
health();
