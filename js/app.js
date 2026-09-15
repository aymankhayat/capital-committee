// Entry point: routing between the three modes, server health, header controls.
import { app, $, $$, emit } from './core.js';
import { store } from './store.js';
import { initSimulation } from './sim.js';

const loaded = {};
const VIEWS = ['simulation', 'calculator', 'practice'];

async function route() {
  const mode = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'simulation';
  for (const v of VIEWS) $(`#view-${v}`).hidden = v !== mode;
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

function initHeader() {
  const tier = $('#tier');
  tier.value = app.tier;
  tier.addEventListener('change', () => { app.tier = tier.value; store.set('tier', app.tier); emit('tier', app.tier); });
  $('#sessionCost').textContent = `$${app.cost.toFixed(3)} spent`;
}

initHeader();
initSimulation();
window.addEventListener('hashchange', route);
route();
health();
