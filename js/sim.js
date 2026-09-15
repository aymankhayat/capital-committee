// Company Simulation: seven departments in parallel, then the Company Brain.
import { DEPTS, byId, idByName, iconSvg, CULTURES } from './departments.js';
import { createConstellation } from './constellation.js';
import { weightedScore, vetoes, lean, DECISIONS, fmtScore } from './score.js';
import { store, uid } from './store.js';
import { esc } from './md.js';
import { app, $, $$, post, toast, on, fmt, setPasscode } from './core.js';
import { SAMPLES, DEFAULT_CONTEXT, SAMPLE_RUNS } from './demo.js';

// Rough per-call cost from measured token counts (≈1.3K in / 1.5K out per department).
const EST = { standard: 0.045, economy: 0.017, brain: 0.09 };
const TIER_NAME = { standard: 'Opus 5', economy: 'Sonnet 5 + Opus 5 Brain' };
const GLYPH = { support: 'M-3.4 0.2l2.3 2.4 4.6-5', oppose: 'M-3 -3l6 6M3 -3l-6 6' };
const sleep = ms => new Promise(r => setTimeout(r, ms));

const S = {
  culture: store.get('culture', 'balanced'),
  weights: { ...CULTURES[0].w, ...store.get('weights', {}) },
  enabled: { ...Object.fromEntries(DEPTS.map(d => [d.id, true])), ...store.get('enabled', {}) },
  run: null,
  view: 'boardroom',
  conflict: false,
  pack: null,
  busy: false,
  focus: null,
};
// Calls made before the scene finishes loading land here harmlessly.
const NOOP_MAP = { setDept() {}, setBrain() {}, setConflicts() {}, focus() {}, reset() {} };
let map = NOOP_MAP;

export function initSimulation() {
  initMap();
  $('#context').value = store.get('context', DEFAULT_CONTEXT);

  const ta = $('#decision');
  const grow = () => {
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`;
    ta.style.overflowY = ta.scrollHeight > 180 ? 'auto' : 'hidden';
  };
  ta.addEventListener('input', grow);
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); convene(); } });
  $('#askForm').addEventListener('submit', e => { e.preventDefault(); convene(); });
  $('#contextToggle').addEventListener('click', () => toggleContext());
  $('#context').addEventListener('change', e => store.set('context', e.target.value));
  $('#packChip').addEventListener('click', e => { if (e.target.closest('[data-act="drop-pack"]')) attachPack(null); });
  $('#resetWeights').addEventListener('click', () => applyCulture('balanced'));

  $$('#boardBar [data-view-mode]').forEach(b => b.addEventListener('click', () => {
    S.view = b.dataset.viewMode;
    $$('#boardBar [data-view-mode]').forEach(x => x.setAttribute('aria-checked', String(x === b)));
    renderBoard();
  }));
  $('#showConflict').addEventListener('change', e => { S.conflict = e.target.checked; renderBoard(); });
  $('#exportMemo').addEventListener('click', exportMemo);
  $('#reconvene').addEventListener('click', () => reconvene());
  $('#brainCard').addEventListener('click', e => { if (e.target.closest('[data-act="retry-brain"]')) reconvene(); });
  $('#staleNote').addEventListener('click', e => { if (e.target.closest('[data-act="reconvene"]')) reconvene(); });
  $('#deptGrid').addEventListener('click', e => {
    const b = e.target.closest('[data-act="retry"]');
    if (b) retryDept(b.dataset.id);
  });
  $('#focusPanel').addEventListener('click', e => {
    if (e.target.closest('[data-act="close-focus"]')) { S.focus = null; map.focus?.(null); renderFocusPanel(); }
    if (e.target.closest('[data-act="open-card"]')) focusCard(S.focus);
  });
  $('#yourCall').addEventListener('click', e => {
    const b = e.target.closest('[data-pick]');
    if (!b || !S.run) return;
    S.run.yourCall = b.dataset.pick;
    saveRun();
    renderYourCall();
  });

  renderSamples(); renderCulture(); renderWeights(); updateLean(); updateEstimate(); renderHistory(); idleCaption();
  on('pack', attachPack);
  on('tier', updateEstimate);
  on('health', () => { renderSamples(); updateEstimate(); idleCaption(); });
}

// ---------------------------------------------------------------- the map

async function initMap() {
  const host = $('#scene');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let webgl = false;
  try { webgl = !!document.createElement('canvas').getContext('webgl2'); } catch { webgl = false; }
  if (webgl && !reduce) {
    try {
      const { createScene3D } = await import('./scene3d.js');
      map = await createScene3D(host, { depts: DEPTS, onSelect: selectDept, onHover: showTip, onHoverEnd: hideTip });
    } catch (e) {
      console.warn('3D scene unavailable, falling back to the flat map:', e);
    }
  }
  if (map === NOOP_MAP) {
    const svg = $('#constellation');
    svg.hidden = false;
    map = createConstellation(svg, { onSelect: selectDept, tipEl: $('#mapTip'), tipContent });
  }
  // Re-apply whatever state already exists (a restored run, or departments switched off).
  DEPTS.forEach(d => {
    const v = S.run?.verdicts[d.id];
    map.setDept(d.id, !S.enabled[d.id] ? 'off' : v ? 'done' : S.run?.errors[d.id] ? 'error' : 'idle', v);
  });
  if (S.run?.brain) map.setBrain('done', DECISIONS[S.run.brain.decision]);
}

function showTip(id, x, y) {
  const tip = $('#mapTip');
  tip.innerHTML = tipContent(id);
  tip.hidden = false;
  const box = $('.hero').getBoundingClientRect();
  const w = tip.offsetWidth, h = tip.offsetHeight;
  tip.style.left = `${Math.max(12, Math.min(box.width - w - 12, x - box.left - w / 2))}px`;
  tip.style.top = `${Math.max(12, y - box.top - h - 20)}px`;
}
function hideTip() { $('#mapTip').hidden = true; }

function selectDept(id) {
  // id === null arrives when the scene is clicked away from a hub.
  S.focus = !id ? null : S.focus === id ? null : id;
  map.focus?.(S.focus);
  hideTip();
  renderFocusPanel();
}

window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && S.focus) selectDept(null);
});

// The zoomed-in view: the department's standing agents, or, once it has
// reported, what each agent contributed to the verdict.
function renderFocusPanel() {
  const el = $('#focusPanel');
  const id = S.focus;
  if (!id) { el.hidden = true; return; }
  const d = byId[id];
  const v = S.run?.verdicts[id];
  el.hidden = false;
  el.style.setProperty('--dc', d.color);
  el.innerHTML = `<h3>${iconSvg(d, 16)} ${esc(d.name)}</h3>
    <p class="fp-sub">${v ? `${esc(v.stance)} · ${v.confidence}% confident` : !S.enabled[id] ? 'not on this committee' : S.run ? 'still deliberating' : 'no verdict yet'}</p>
    ${v ? `<p class="fp-line">${esc(v.headline)}</p>` : ''}
    <ul class="fp-agents">${d.agents.map((a, i) => `<li><b>${esc(a.name)}</b><span>${esc(v?.reasons?.[i] || a.watches)}</span></li>`).join('')}</ul>
    ${v ? `<p class="fp-sub">${esc(v.key_metric.label)}: <b class="num">${esc(v.key_metric.value)}</b></p>` : ''}
    <div class="fp-actions">${v ? '<button type="button" class="btn" data-act="open-card">Open full verdict</button>' : ''}
      <button type="button" class="btn btn-quiet" data-act="close-focus">Close</button></div>`;
}

// ---------------------------------------------------------------- inputs

function toggleContext(open) {
  const p = $('#contextPanel');
  const show = open ?? p.hidden;
  p.hidden = !show;
  $('#contextToggle').setAttribute('aria-expanded', String(show));
}

function renderSamples() {
  $('#samples').innerHTML = SAMPLES.map(s =>
    `<button type="button" class="sample-chip" data-id="${s.id}">${esc(s.title)}${!app.live && SAMPLE_RUNS[s.id] ? '<span class="rec">sample run</span>' : ''}</button>`).join('');
  $$('#samples .sample-chip').forEach(b => b.addEventListener('click', () => {
    const s = SAMPLES.find(x => x.id === b.dataset.id);
    const ta = $('#decision');
    ta.value = s.decision;
    ta.dispatchEvent(new Event('input'));
    if (s.pack) attachPack({ label: s.pack.label, text: s.pack.text, decision: s.decision });
    if (!app.live && !SAMPLE_RUNS[s.id]) toast('Demo mode has a sample run for the solar and HVAC decisions only. Add an API key to run this one live.');
    $('#convene').focus();
  }));
}

function attachPack(p) {
  S.pack = p;
  const chip = $('#packChip');
  if (!p) { chip.hidden = true; return; }
  chip.hidden = false;
  chip.innerHTML = `<strong>Committee pack attached</strong><span>${esc(p.label)}</span><button type="button" class="link-btn" data-act="drop-pack">Remove</button>`;
  if (p.decision && !$('#decision').value.trim()) { $('#decision').value = p.decision; $('#decision').dispatchEvent(new Event('input')); }
  // Leave the context panel closed: on a short screen it would cover the tree.
}

function renderCulture() {
  $('#culture').innerHTML = CULTURES.map(c =>
    `<button type="button" role="radio" aria-checked="${S.culture === c.id}" data-id="${c.id}">${c.name}</button>`).join('');
  $$('#culture button').forEach(b => b.addEventListener('click', () => applyCulture(b.dataset.id)));
}

function applyCulture(id) {
  S.culture = id;
  S.weights = { ...CULTURES.find(c => c.id === id).w };
  persistWeights();
  renderCulture(); renderWeights(); updateLean(); renderStale();
}

function renderWeights() {
  $('#weights').innerHTML = DEPTS.map(d => {
    const on = S.enabled[d.id], w = S.weights[d.id];
    return `<div class="w-row${on ? '' : ' off'}" style="--dc:${d.color}">
      <input type="checkbox" data-en="${d.id}" ${on ? 'checked' : ''} aria-label="${esc(d.name)} sits on the committee">
      <label class="w-name" for="w-${d.id}">${iconSvg(d, 15)}${esc(d.label)}</label>
      <input type="range" id="w-${d.id}" data-w="${d.id}" min="0.1" max="2" step="0.1" value="${w}" ${on ? '' : 'disabled'} aria-label="${esc(d.name)} weight">
      <output for="w-${d.id}">${w.toFixed(1)}×</output></div>`;
  }).join('');
  $$('#weights [data-w]').forEach(r => r.addEventListener('input', () => {
    S.weights[r.dataset.w] = Number(r.value);
    r.nextElementSibling.textContent = `${Number(r.value).toFixed(1)}×`;
    if (S.culture !== 'custom') { S.culture = 'custom'; renderCulture(); }
    persistWeights(); updateLean(); renderStale();
  }));
  $$('#weights [data-en]').forEach(c => c.addEventListener('change', () => {
    const id = c.dataset.en;
    S.enabled[id] = c.checked;
    if (Object.values(S.enabled).filter(Boolean).length < 2) { S.enabled[id] = true; c.checked = true; toast('Keep at least two departments on the committee.'); return; }
    persistWeights(); renderWeights();
    const v = S.run?.verdicts[id];
    map.setDept(id, !S.enabled[id] ? 'off' : v ? 'done' : 'idle', v);
    updateLean(); updateEstimate(); renderStale();
  }));
}

function persistWeights() {
  store.set('weights', S.weights); store.set('enabled', S.enabled); store.set('culture', S.culture);
}

// Weights that actually count right now: enabled departments that have a verdict.
function activeWeights(run = S.run) {
  const w = {};
  for (const d of DEPTS) w[d.id] = S.enabled[d.id] && run?.verdicts[d.id] ? S.weights[d.id] : 0;
  return w;
}

// ---------------------------------------------------------------- running

async function convene() {
  if (S.busy) return;
  const decision = $('#decision').value.trim();
  const context = $('#context').value.trim();
  if (decision.length < 12) { toast('Describe the decision in a sentence or two first.'); $('#decision').focus(); return; }
  const seats = DEPTS.filter(d => S.enabled[d.id]);
  const sample = SAMPLES.find(s => s.decision === decision);

  if (!app.live) {
    if (sample && SAMPLE_RUNS[sample.id]) return replay(sample, seats);
    toast('Live runs need an API key on the server. Pick the solar or HVAC sample to replay a sample committee.', 6500);
    return;
  }
  if (app.passcodeRequired && !ensurePasscode()) return;

  startRun({ decision, context, seats });
  const t0 = performance.now();
  await Promise.allSettled(seats.map(d => callDept(d.id)));
  if (Object.keys(S.run.verdicts).length < 2) {
    map.setBrain('idle', null);
    setBusy(false);
    renderBoard();
    toast('Fewer than two departments returned a verdict, so the Brain did not rule. Retry the failed departments.');
    return;
  }
  await callBrain();
  S.run.elapsed = (performance.now() - t0) / 1000;
  saveRun();
  setBusy(false);
  updateEstimate();
}

function ensurePasscode() {
  let pc = '';
  try { pc = sessionStorage.getItem('cc.passcode') || ''; } catch { /* ignore */ }
  if (pc) return true;
  const v = window.prompt('This deployment asks for a passcode before live runs (it protects the owner’s API budget).');
  if (!v) return false;
  setPasscode(v.trim());
  return true;
}

function startRun({ decision, context, seats, demo = false }) {
  S.run = {
    id: uid(), ts: Date.now(), decision, context, demo,
    analysis: S.pack?.text || '', packLabel: S.pack?.label || '',
    tier: app.tier, enabled: Object.fromEntries(seats.map(d => [d.id, true])),
    verdicts: {}, meta: {}, errors: {}, brain: null, brainMeta: null, brainWeights: null, brainScore: null,
    brainPending: false, brainError: null, yourCall: null, elapsed: 0, culture: S.culture,
  };
  setBusy(true);
  DEPTS.forEach(d => map.setDept(d.id, S.run.enabled[d.id] ? 'pending' : 'off'));
  map.setBrain('thinking', null);
  map.setConflicts([]);
  $('#mapCaption').textContent = `${seats.length} departments deliberating in parallel. The Company Brain rules when all have reported.`;
  $('#boardBar').hidden = false;
  renderBoard(); updateLean();
}

async function callDept(id) {
  const r = S.run;
  try {
    const res = await post('/api/department', { dept: id, decision: r.decision, context: r.context, analysis: r.analysis, tier: r.tier });
    if (S.run !== r) return;
    r.verdicts[id] = res.verdict; r.meta[id] = res.meta; delete r.errors[id];
    map.setDept(id, 'done', res.verdict);
  } catch (e) {
    if (S.run !== r) return;
    if (e.status === 401) setPasscode('');
    r.errors[id] = e.message;
    map.setDept(id, 'error');
  }
  renderBoard(); updateLean();
  const n = Object.keys(r.verdicts).length, total = Object.keys(r.enabled).length;
  if (!r.brain) $('#mapCaption').textContent = `${n} of ${total} departments have reported.`;
}

async function callBrain() {
  const r = S.run;
  const weights = activeWeights(r);
  const score = weightedScore(r.verdicts, weights);
  const v = vetoes(r.verdicts, weights);
  r.brainPending = true; r.brainError = null;
  map.setBrain('thinking', null);
  $('#mapCaption').textContent = 'All departments have reported. The Company Brain is weighing the verdicts.';
  renderBoard();
  try {
    const res = await post('/api/brain', { decision: r.decision, context: r.context, analysis: r.analysis, verdicts: r.verdicts, weights, score, vetoes: v });
    if (S.run !== r) return;
    r.brain = res.brain; r.brainMeta = res.meta; r.brainWeights = { ...weights }; r.brainScore = score;
  } catch (e) {
    r.brainError = e.message;
  }
  r.brainPending = false;
  finishBrain();
}

function finishBrain() {
  const r = S.run;
  map.setBrain(r.brain ? 'done' : 'idle', r.brain ? DECISIONS[r.brain.decision] : null);
  $('#mapCaption').textContent = r.brain
    ? `The Company Brain ruled: ${DECISIONS[r.brain.decision].label.toLowerCase()}, ${r.brain.confidence}% confident.`
    : 'The Brain could not rule. Retry it from the card below.';
  renderBoard(); updateLean();
}

async function retryDept(id) {
  if (!app.live || !S.run || S.busy) return;
  setBusy(true);
  map.setDept(id, 'pending');
  delete S.run.errors[id];
  renderBoard();
  await callDept(id);
  setBusy(false);
  if (S.run.brain) renderStale();
  else if (Object.keys(S.run.verdicts).length >= 2 && !Object.keys(S.run.errors).length) { setBusy(true); await callBrain(); setBusy(false); saveRun(); }
}

async function reconvene() {
  if (!S.run || S.busy) return;
  if (!app.live || S.run.demo) { toast('Re-convening the Brain needs a live server. The live lean in the side panel already reflects your weights.'); return; }
  setBusy(true);
  await callBrain();
  setBusy(false);
  saveRun(); updateEstimate();
}

async function replay(sample, seats) {
  const rec = structuredClone(SAMPLE_RUNS[sample.id]);
  const inRun = seats.filter(d => rec.verdicts[d.id]);
  if (sample.pack) S.pack = { label: sample.pack.label, text: sample.pack.text };
  startRun({ decision: sample.decision, context: $('#context').value.trim(), seats: inRun, demo: true });
  const r = S.run;
  await Promise.all(inRun.map(async (d, i) => {
    await sleep(700 + ((i * 577) % 2600) + Math.random() * 500);
    if (S.run !== r) return;
    r.verdicts[d.id] = rec.verdicts[d.id];
    map.setDept(d.id, 'done', rec.verdicts[d.id]);
    renderBoard(); updateLean();
    $('#mapCaption').textContent = `${Object.keys(r.verdicts).length} of ${inRun.length} departments have reported.`;
  }));
  if (S.run !== r) return;
  r.brainPending = true;
  map.setBrain('thinking', null);
  $('#mapCaption').textContent = 'All departments have reported. The Company Brain is weighing the verdicts.';
  renderBoard();
  await sleep(2000);
  if (S.run !== r) return;
  r.brain = rec.brain; r.brainWeights = { ...CULTURES[0].w };
  for (const d of DEPTS) if (!r.verdicts[d.id]) r.brainWeights[d.id] = 0;
  r.brainScore = weightedScore(r.verdicts, r.brainWeights);
  r.brainPending = false;
  finishBrain();
  saveRun();
  setBusy(false);
}

function setBusy(b) {
  S.busy = b;
  const btn = $('#convene');
  btn.disabled = b;
  btn.textContent = b ? 'Committee in session…' : 'Convene committee';
}

function idleCaption() {
  if (S.run) return;
  $('#mapCaption').textContent = app.live
    ? 'Seven departments assess independently and in parallel; the Company Brain rules once all have spoken.'
    : 'Demo mode: choose the solar or HVAC sample and press Convene to replay a sample committee.';
}

// ---------------------------------------------------------------- lean & cost

function updateLean() {
  const g = $('#gauge');
  const verdicts = S.run?.verdicts || {};
  const weights = activeWeights();
  const n = Object.values(weights).filter(Boolean).length;
  if (!n) {
    g.dataset.empty = 'true';
    g.innerHTML = gaugeHtml(0);
    $('#leanText').textContent = 'The lean appears as verdicts arrive: a weighted sum you steer with the sliders. The Brain’s ruling is separate.';
    return;
  }
  const score = weightedScore(verdicts, weights);
  const v = vetoes(verdicts, weights);
  const l = lean(score, v);
  g.dataset.empty = 'false';
  g.innerHTML = gaugeHtml(score);
  $('#leanText').innerHTML = `<strong>${l.label}</strong> at <span class="num">${fmtScore(score)}</span> across ${n} verdict${n > 1 ? 's' : ''}.`
    + (v.length ? ` ${v.map(x => esc(x.department)).join(' and ')} hold${v.length === 1 ? 's' : ''} a veto on “${esc(v[0].issue)}”${l.capped ? ', which caps the lean below a plain go' : ''}.` : '');
}

function gaugeHtml(score) {
  const zones = [['no_go', 27.5, 'bad', .55], ['defer', 15, 'warn', .45], ['pilot_first', 15, 'warn', .25], ['go_with_conditions', 15, 'good', .35], ['go', 27.5, 'good', .6]];
  return `<div class="g-track" aria-hidden="true">${zones.map(([id, w, t, o]) =>
    `<span class="g-zone" title="${DECISIONS[id].label}" style="width:${w}%;background:color-mix(in srgb, var(--${t}) ${o * 100}%, transparent)"></span>`).join('')}</div>
    <span class="g-zero" aria-hidden="true"></span>
    <span class="g-marker" style="left:${((score + 1) / 2) * 100}%" role="img" aria-label="Lean ${fmtScore(score)} on a scale from −1 to +1"></span>
    <div class="g-ticks" aria-hidden="true"><span>−1 oppose</span><span>0</span><span>+1 support</span></div>`;
}

function updateEstimate() {
  const n = DEPTS.filter(d => S.enabled[d.id]).length;
  const est = n * EST[app.tier] + EST.brain;
  let html = app.live
    ? `${n} department calls in parallel, then one Brain call. Estimated <span class="num">≈ $${est.toFixed(2)}</span> on ${TIER_NAME[app.tier]}.`
    : `Demo mode: sample runs cost nothing. A live run of ${n} departments would cost about <span class="num">$${est.toFixed(2)}</span> on ${TIER_NAME[app.tier]}.`;
  const r = S.run;
  if (r && !r.demo && r.brain) {
    const actual = Object.values(r.meta).reduce((s, m) => s + (m?.cost_usd || 0), 0) + (r.brainMeta?.cost_usd || 0);
    html += `<br>Last run: <span class="num">$${actual.toFixed(3)}</span>${r.elapsed ? ` in <span class="num">${r.elapsed.toFixed(0)} s</span>` : ''}.`;
  }
  $('#runEstimate').innerHTML = html;
}

// ---------------------------------------------------------------- board

function renderBoard() {
  renderBrain(); renderYourCall(); renderCards(); renderStale(); renderFocusPanel();
  map.setConflicts(S.conflict ? conflictPairs() : []);
}

function deptName(name) {
  const id = idByName(name);
  const d = byId[id];
  return d ? `<span class="dept-dot" style="background:${d.color}" aria-hidden="true"></span>${esc(d.name)}` : esc(name);
}

function renderBrain() {
  const el = $('#brainCard');
  const r = S.run;
  if (!r) { el.hidden = true; return; }
  el.hidden = false;
  el.classList.toggle('quick', S.view === 'quick');
  if (!r.brain) {
    el.classList.add('pending');
    const n = Object.keys(r.verdicts).length, total = Object.keys(r.enabled).length;
    el.innerHTML = `<div class="bc-kicker">THE COMPANY BRAIN</div>
      <div class="bc-decision">${r.brainError ? 'No ruling yet' : r.brainPending ? 'Deliberating' : 'Waiting for the committee'}</div>
      <p class="bc-rationale">${r.brainError
        ? `${esc(r.brainError)} <button type="button" class="btn" data-act="retry-brain">Retry the Brain</button>`
        : r.brainPending ? `Weighing ${n} verdicts against the company’s weights, vetoes and each function’s known biases.`
        : `${n} of ${total} departments have reported. The Brain rules only once every department has spoken.`}</p>`;
    return;
  }
  el.classList.remove('pending');
  const b = r.brain, dec = DECISIONS[b.decision];
  const rev = { one_way: 'One-way door', two_way: 'Two-way door', mixed: 'Mixed reversibility' }[b.reversibility];
  const list = (arr, cls = '') => arr?.length ? `<ul class="${cls}">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p>None recorded.</p>';
  const h = b.hinge_tradeoff;
  const disagreements = `<section class="bc-sec"><h3>Where departments clash</h3>${b.disagreements?.length
    ? `<ul class="disagree">${b.disagreements.map(x => `<li><div class="pair">${x.between.map(deptName).join(' <span aria-hidden="true">×</span> ')}</div>
        <div>${esc(x.issue)}</div><div><em>Resolved:</em> ${esc(x.resolution)}</div></li>`).join('')}</ul>`
    : '<p>No material disagreement.</p>'}</section>`;
  const consensus = `<section class="bc-sec"><h3>Where they agree</h3>${list(b.consensus)}</section>`;
  el.innerHTML = `
    <div class="bc-top">
      <div>
        <div class="bc-kicker">THE COMPANY BRAIN</div>
        <div class="bc-decision" data-tone="${dec.tone}">${dec.label}</div>
      </div>
      <div class="bc-chips">
        <span class="chip">Confidence <b>${b.confidence}%</b></span>
        <span class="chip">${rev}</span>
        <span class="chip">Lean at ruling <b>${fmtScore(r.brainScore ?? 0)}</b></span>
        ${b.vetoes?.length ? `<span class="chip tone-warn">${b.vetoes.length} veto${b.vetoes.length > 1 ? 'es' : ''} raised</span>` : ''}
        ${r.demo ? '<span class="chip">Sample run</span>' : ''}
      </div>
    </div>
    <p class="bc-headline">${esc(b.headline)}</p>
    <p class="bc-rationale">${esc(b.rationale)}</p>
    <p class="bc-hinge-quick"><b>Hinges on:</b> ${esc(h.title)}</p>
    <div class="bc-grid">
      <section class="hinge">
        <div class="hinge-label">The trade-off this decision hinges on</div>
        <div class="hinge-title">${esc(h.title)}</div>
        <div class="hinge-sides"><div class="hinge-side">${esc(h.side_a)}</div><div class="hinge-vs">VS</div><div class="hinge-side">${esc(h.side_b)}</div></div>
        <div class="hinge-foot"><div><b>What would have to be true</b>${esc(h.what_would_have_to_be_true)}</div><div><b>Why it decides</b>${esc(h.why_it_decides)}</div></div>
      </section>
      ${S.conflict ? disagreements + consensus : consensus + disagreements}
      <section class="bc-sec" style="grid-column:1/-1"><h3>Conditions, owners and gates</h3>
        ${b.conditions?.length ? `<table class="cond-table"><thead><tr><th>Condition</th><th>Owner</th><th>Gate</th></tr></thead><tbody>
          ${b.conditions.map(c => `<tr><td>${esc(c.condition)}</td><td>${deptName(c.owner)}</td><td>${esc(c.gate)}</td></tr>`).join('')}</tbody></table>` : '<p>Unconditional.</p>'}
      </section>
      <section class="bc-sec"><h3>Kill criteria</h3>${list(b.kill_criteria)}</section>
      <section class="bc-sec"><h3>Vetoes</h3>${b.vetoes?.length
        ? `<ul>${b.vetoes.map(v => `<li>${deptName(v.department)}: ${esc(v.issue)}${v.cleared_by ? ` <em>Cleared by:</em> ${esc(v.cleared_by)}` : ''}</li>`).join('')}</ul>` : '<p>No department holds a veto.</p>'}</section>
      <section class="bc-sec"><h3>Pre-mortem</h3><p>${esc(b.premortem_top_failure)}</p></section>
      <section class="bc-sec"><h3>Dissent on record</h3>${b.dissent_recorded?.length
        ? `<ul>${b.dissent_recorded.map(x => `<li>${deptName(x.department)}: ${esc(x.view)} <em>Would change their mind:</em> ${esc(x.what_would_change_their_mind)}</li>`).join('')}</ul>` : '<p>None.</p>'}</section>
      <section class="bc-sec"><h3>Next steps</h3>${b.next_steps?.length ? `<ol>${b.next_steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : '<p>None.</p>'}</section>
    </div>
    <div class="bc-foot">${r.brainMeta
      ? `<span>${esc(r.brainMeta.model)}</span><span>${fmt.int(r.brainMeta.input_tokens + r.brainMeta.cache_read_tokens)} in / ${fmt.int(r.brainMeta.output_tokens)} out</span><span>$${r.brainMeta.cost_usd.toFixed(4)}</span>`
      : '<span>Sample run written for the demo; convene live for model output</span>'}
      <span>Weights at ruling: ${DEPTS.filter(d => r.brainWeights?.[d.id]).map(d => `${d.label} ${r.brainWeights[d.id].toFixed(1)}×`).join(', ')}</span></div>`;
}

function renderYourCall() {
  const el = $('#yourCall');
  const yc = S.run?.brain?.your_call;
  if (!yc?.needed) { el.hidden = true; return; }
  el.hidden = false;
  const pick = S.run.yourCall;
  el.innerHTML = `<h3>Your call</h3>
    <p>${esc(yc.question)} The Brain made a call, but this one turns on risk appetite, so it is flagged for you. <em>The Brain leans:</em> ${esc(yc.brain_lean)}</p>
    <div class="yc-sides">
      <button type="button" class="yc-opt" data-pick="a" aria-pressed="${pick === 'a'}"><small>Option A</small>${esc(yc.side_a)}</button>
      <button type="button" class="yc-opt" data-pick="b" aria-pressed="${pick === 'b'}"><small>Option B</small>${esc(yc.side_b)}</button>
    </div>
    ${pick ? `<p class="yc-result">Recorded in the minutes: you chose option ${pick.toUpperCase()}. It is saved with this committee and printed on the memo.</p>` : ''}`;
}

function conflictPairs() {
  const r = S.run;
  if (!r) return [];
  const pairs = [];
  const seen = new Set();
  const add = (a, b, issue) => {
    if (!a || !b || a === b || !r.verdicts[a] || !r.verdicts[b]) return;
    const k = [a, b].sort().join('|');
    if (seen.has(k)) return;
    seen.add(k); pairs.push({ a, b, issue });
  };
  if (r.brain?.disagreements?.length) {
    for (const d of r.brain.disagreements) {
      const ids = [...new Set(d.between.map(idByName).filter(Boolean))];
      for (let i = 1; i < ids.length; i++) add(ids[0], ids[i], d.issue);
    }
  } else {
    const ids = Object.keys(r.verdicts);
    for (const a of ids) for (const b of ids) {
      if (r.verdicts[a].stance === 'support' && r.verdicts[b].stance === 'oppose') add(a, b, `${byId[a].label} supports, ${byId[b].label} opposes`);
    }
  }
  return pairs;
}

function stanceChip(s) {
  const g = s === 'conditional'
    ? '<circle r="4.4" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M0 -4.4a4.4 4.4 0 0 1 0 8.8z" fill="currentColor"/>'
    : `<path d="${GLYPH[s]}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<span class="stance" data-s="${s}"><svg viewBox="-6 -6 12 12" aria-hidden="true">${g}</svg>${s}</span>`;
}

function renderCards() {
  const grid = $('#deptGrid');
  const r = S.run;
  if (!r) { grid.innerHTML = ''; return; }
  const ids = DEPTS.filter(d => r.enabled[d.id]).map(d => d.id);
  if (S.view === 'quick') {
    grid.innerHTML = `<ul class="quick-list">${ids.map(id => {
      const d = byId[id], v = r.verdicts[id];
      return `<li><span class="q-name">${iconSvg(d, 16)}${esc(d.name)}</span><span class="q-stance">${v ? `${v.stance} · ${v.confidence}%` : r.errors[id] ? 'no verdict' : 'deliberating'}</span><span class="q-line">${v ? esc(v.headline) : ''}</span></li>`;
    }).join('')}</ul>`;
    return;
  }
  const pairs = S.conflict ? conflictPairs() : [];
  const involved = new Set(pairs.flatMap(p => [p.a, p.b]));
  const shown = S.conflict && pairs.length ? ids.filter(id => involved.has(id)) : ids;
  const aligned = S.conflict && pairs.length ? ids.filter(id => !involved.has(id)) : [];
  grid.innerHTML = shown.map(id => card(id, pairs)).join('')
    + (aligned.length ? `<p class="aligned-note">Not in conflict: ${aligned.map(id => esc(byId[id].name)).join(', ')}. Turn off “Show disagreement” to see their cards.</p>` : '')
    + (S.conflict && !pairs.length && Object.keys(r.verdicts).length ? '<p class="aligned-note">No department pair is in open conflict on this decision.</p>' : '');
}

function card(id, pairs) {
  const r = S.run, d = byId[id], v = r.verdicts[id], err = r.errors[id], m = r.meta[id];
  const style = `style="--dc:${d.color}"`;
  if (!v) {
    return `<article class="dept-card ${err ? 'error' : 'pending'}" id="card-${id}" ${style}>
      <div class="dc-head">${iconSvg(d)}<span class="dc-name">${esc(d.name)}</span></div>
      ${err ? `<p class="dc-headline">${esc(err)}</p><div><button type="button" class="btn" data-act="retry" data-id="${id}">Retry ${esc(d.label)}</button></div>`
        : '<div class="pending-bar"></div><p class="dc-headline">Reading the proposal…</p>'}
    </article>`;
  }
  const clashes = pairs.filter(p => p.a === id || p.b === id)
    .map(p => `<div class="dc-clash">Clashes with ${esc(byId[p.a === id ? p.b : p.a].name)}: ${esc(p.issue)}</div>`).join('');
  return `<article class="dept-card" id="card-${id}" ${style}>
    <div class="dc-head">${iconSvg(d)}<h3 class="dc-name">${esc(d.name)}</h3>${stanceChip(v.stance)}</div>
    <div class="conf"><div class="conf-bar" role="img" aria-label="Confidence ${v.confidence}%"><i style="width:${v.confidence}%"></i></div><span class="num">${v.confidence}%</span></div>
    <p class="dc-headline">${esc(v.headline)}</p>
    <ul class="dc-reasons">${v.reasons.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    <div class="risk"><div class="risk-title"><span class="sev sev-${v.risk_flag.severity}">${v.risk_flag.severity === 'med' ? 'medium' : v.risk_flag.severity}</span>${esc(v.risk_flag.title)}</div>
      <p>${esc(v.risk_flag.detail)}</p>${v.red_line ? '<p class="red-line">Red line: this department cannot sign off under any mitigation.</p>' : ''}</div>
    ${v.conditions?.length ? `<div class="dc-conds"><b>Conditions</b><ul>${v.conditions.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>` : ''}
    ${clashes}
    <div class="dc-metric"><span>${esc(v.key_metric.label)}</span><b>${esc(v.key_metric.value)}</b></div>
    ${v.assumptions?.length ? `<p class="dc-assume">Assumed: ${v.assumptions.map(esc).join('; ')}</p>` : ''}
    ${m ? `<div class="dc-meta"><span>${esc(m.model)}</span><span>${fmt.int(m.input_tokens + m.cache_read_tokens)} in / ${fmt.int(m.output_tokens)} out</span><span>$${m.cost_usd.toFixed(4)}</span></div>`
      : r.demo ? '<div class="dc-meta"><span>sample run</span></div>' : ''}
  </article>`;
}

function renderStale() {
  const el = $('#staleNote');
  const r = S.run;
  const btn = $('#reconvene');
  if (!r?.brain || !r.brainWeights) { el.hidden = true; btn.hidden = true; return; }
  const now = activeWeights();
  const changed = DEPTS.some(d => Math.abs((now[d.id] || 0) - (r.brainWeights[d.id] || 0)) > 1e-9);
  el.hidden = !changed;
  btn.hidden = !changed || !app.live || r.demo;
  if (!changed) return;
  const score = weightedScore(r.verdicts, now);
  const l = lean(score, vetoes(r.verdicts, now));
  el.innerHTML = `<span>Weights changed since the Brain ruled. The live lean now reads <strong>${l.label}</strong> (<span class="num">${fmtScore(score)}</span>); the ruling below reflects the earlier weights.</span>`
    + (app.live && !r.demo ? `<button type="button" class="btn" data-act="reconvene">Re-convene the Brain · ≈ $${EST.brain.toFixed(2)}</button>` : '<span>Re-convening needs a live server.</span>');
}

function focusCard(id) {
  const c = $(`#card-${id}`);
  if (!c) { if (!S.run) toast(`${byId[id].name} will report here once you convene the committee.`); return; }
  c.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  c.classList.add('flash');
  setTimeout(() => c.classList.remove('flash'), 1400);
}

function tipContent(id) {
  const d = byId[id];
  const v = S.run?.verdicts[id];
  if (v) return `<b>${esc(d.name)}</b><span class="tip-stance">${v.stance} · ${v.confidence}% confident</span><div>${esc(v.headline)}</div>`;
  if (!S.enabled[id]) return `<b>${esc(d.name)}</b><span class="tip-stance">Off this committee. Switch it on in the side panel.</span>`;
  return `<b>${esc(d.name)}</b><span class="tip-stance">${esc(d.sub)}</span>`;
}

// ---------------------------------------------------------------- history & memo

function saveRun() {
  const r = S.run;
  if (!r?.brain) return;
  const list = store.get('sims', []).filter(x => x.id !== r.id);
  list.unshift(r);
  store.set('sims', list.slice(0, 20));
  renderHistory();
}

function renderHistory() {
  const list = store.get('sims', []);
  const el = $('#simHistory');
  if (!list.length) { el.innerHTML = '<li class="empty">Committees you convene are kept here in this browser, so you can reopen one without paying for it again.</li>'; return; }
  el.innerHTML = list.map(r => `<li><button type="button" data-id="${r.id}">
    <span class="h-date mono">${fmt.date(r.ts)}</span><span class="h-dec">${esc(r.decision)}</span>
    <span>${r.brain ? DECISIONS[r.brain.decision].label : 'no ruling'}${r.demo ? ' · sample' : ''}</span>
    <span class="h-cost mono">${r.demo ? '—' : `$${(Object.values(r.meta).reduce((s, m) => s + (m?.cost_usd || 0), 0) + (r.brainMeta?.cost_usd || 0)).toFixed(2)}`}</span></button></li>`).join('');
  $$('#simHistory button').forEach(b => b.addEventListener('click', () => loadRun(list.find(x => x.id === b.dataset.id))));
}

function loadRun(r) {
  if (!r || S.busy) return;
  S.run = structuredClone(r);
  $('#decision').value = r.decision; $('#decision').dispatchEvent(new Event('input'));
  DEPTS.forEach(d => map.setDept(d.id, !r.enabled[d.id] ? 'off' : r.verdicts[d.id] ? 'done' : 'error', r.verdicts[d.id]));
  finishBrain();
  $('#boardBar').hidden = false;
  updateEstimate();
  $('#brainCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function exportMemo() {
  const r = S.run;
  if (!r?.brain) { toast('Convene the committee first; the memo records the Brain’s ruling.'); return; }
  const b = r.brain;
  const rows = DEPTS.filter(d => r.verdicts[d.id]).map(d => {
    const v = r.verdicts[d.id];
    return `<tr><td>${esc(d.name)}</td><td>${(r.brainWeights?.[d.id] ?? 1).toFixed(1)}×</td><td>${v.stance} (${v.confidence}%)</td><td>${esc(v.headline)}</td><td>${esc(v.risk_flag.title)} [${v.risk_flag.severity}]</td></tr>`;
  }).join('');
  const yc = b.your_call?.needed ? `<h2>Board member’s call</h2><p>${esc(b.your_call.question)}</p><p>${r.yourCall ? `Chosen: ${esc(r.yourCall === 'a' ? b.your_call.side_a : b.your_call.side_b)}` : 'Not yet decided.'}</p>` : '';
  $('#memo').innerHTML = `
    <h1>Investment Committee Memo</h1>
    <p class="meta">${new Date(r.ts).toLocaleString('en-GB')} · ${r.demo ? 'Sample run' : `Models: ${esc([...new Set(Object.values(r.meta).map(m => m.model))].join(', '))} + ${esc(r.brainMeta?.model || '')}`} · Simulated committee, not advice</p>
    <h2>Proposal</h2><p>${esc(r.decision)}</p>
    ${r.packLabel ? `<p class="meta">Committee pack: ${esc(r.packLabel)}</p>` : ''}
    <h2>Ruling</h2><p class="verdict">${DECISIONS[b.decision].label} · ${b.confidence}% confidence</p><p>${esc(b.headline)}</p><p>${esc(b.rationale)}</p>
    <h2>Hinge trade-off: ${esc(b.hinge_tradeoff.title)}</h2><p>${esc(b.hinge_tradeoff.side_a)}<br>vs. ${esc(b.hinge_tradeoff.side_b)}</p><p>What would have to be true: ${esc(b.hinge_tradeoff.what_would_have_to_be_true)}</p>
    <h2>Conditions</h2><table><tr><th>Condition</th><th>Owner</th><th>Gate</th></tr>${b.conditions.map(c => `<tr><td>${esc(c.condition)}</td><td>${esc(c.owner)}</td><td>${esc(c.gate)}</td></tr>`).join('')}</table>
    <h2>Kill criteria</h2><ul>${b.kill_criteria.map(k => `<li>${esc(k)}</li>`).join('')}</ul>
    <h2>Department verdicts</h2><table><tr><th>Department</th><th>Weight</th><th>Stance</th><th>Headline</th><th>Risk flag</th></tr>${rows}</table>
    <h2>Dissent on record</h2><ul>${b.dissent_recorded.map(x => `<li>${esc(x.department)}: ${esc(x.view)}</li>`).join('') || '<li>None</li>'}</ul>
    ${yc}
    <h2>Next steps</h2><ol>${b.next_steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>`;
  window.print();
}
