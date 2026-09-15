// Case practice: filterable case bank, timed attempts, requestable exhibits,
// framework hints, model reveal, self and AI scoring, and progress history.
import { CASES, FRAMEWORKS, CALIBRATION } from './cases.data.js';
import { md, esc } from './md.js';
import { store, uid } from './store.js';
import { app, post, toast, fmt, $, $$ } from './core.js';

const FORMAT_NAME = {
  'interviewer-led': 'Interviewer-led (McKinsey style)',
  'candidate-led': 'Candidate-led (BCG, Bain, Deloitte style)',
  engineering: 'Engineering consulting (ADL, Roland Berger, AECOM style)',
};
const DRIVER_NAME = { 'multi-stage': 'Multi-stage', 'messy-data': 'Messy data', 'second-order': 'Second-order effects', trap: 'Contains a trap', discounting: 'Discounting', 'what-must-be-true': 'What must be true', 'unit-conversion': 'Unit conversion' };
const DIMS = [
  ['structure', 'Structure', 'MECE tree tailored to this problem'],
  ['hypothesis', 'Hypothesis', 'Early view, right branch first'],
  ['math', 'Math', 'Equation first, units, sanity check'],
  ['synthesis', 'Synthesis', 'Answer first, numbers, risks, next steps'],
];
const FW_FOR_TYPE = [
  [/sizing/i, 'Market sizing'], [/profit/i, 'Profitability tree'], [/breakeven/i, 'Breakeven'], [/pricing/i, 'Pricing'],
  [/entry/i, 'Market entry'], [/m&a|acqui/i, 'M&A / acquisition'], [/go\/no-go|npv|lcoe|capex|energy project/i, 'Go/no-go investment'],
  [/operations|capacity|debottleneck|efficiency|logistics/i, 'Operations / capacity'],
];

let root, cur = null, tick = null;
const F = { difficulty: 'entry', track: 'all', format: 'all', ...store.get('pfilters', {}) };

export function initPractice(el) {
  root = el;
  root.innerHTML = `
    <div class="prac">
      <aside>
        <section class="panel">
          <h2>Cases</h2>
          <div class="filters">
            <div class="seg" role="radiogroup" aria-label="Difficulty">
              <button type="button" role="radio" data-f="difficulty" data-v="entry">Entry-level</button>
              <button type="button" role="radio" data-f="difficulty" data-v="advanced">Advanced</button>
            </div>
            <div class="seg" role="radiogroup" aria-label="Track">
              <button type="button" role="radio" data-f="track" data-v="all">All</button>
              <button type="button" role="radio" data-f="track" data-v="strategy">Strategy</button>
              <button type="button" role="radio" data-f="track" data-v="technical">Technical</button>
            </div>
            <label class="sr-only" for="fFormat">Interview format</label>
            <select id="fFormat" class="field"><option value="all">All interview formats</option>
              ${Object.entries(FORMAT_NAME).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('')}</select>
          </div>
          <ul class="case-list" id="caseList"></ul>
        </section>
        <section class="panel fw-ref">
          <h2>Framework library</h2>
          ${FRAMEWORKS.map(f => `<details><summary>${esc(f.title)}</summary><div class="md">${md(f.md)}</div></details>`).join('')}
          <details><summary>Entry-level vs advanced: how cases are calibrated</summary><div class="md">${md(CALIBRATION)}</div></details>
        </section>
      </aside>
      <div class="case-main" id="caseMain"></div>
      <aside class="prac-side" id="pracSide"></aside>
    </div>`;
  $$('[data-f]', root).forEach(b => b.addEventListener('click', () => { F[b.dataset.f] = b.dataset.v; saveFilters(); renderList(); }));
  $('#fFormat', root).addEventListener('change', e => { F.format = e.target.value; saveFilters(); renderList(); });
  renderList();
  const list = filtered();
  open(store.get('pcase', null) && CASES.find(c => c.id === store.get('pcase')) ? store.get('pcase') : (list[0] || CASES[0]).id);
  renderSide();
}

function saveFilters() { store.set('pfilters', F); }
function filtered() {
  return CASES.filter(c => c.difficulty === F.difficulty && (F.track === 'all' || c.track === F.track) && (F.format === 'all' || c.format === F.format));
}

function renderList() {
  $$('[data-f]', root).forEach(b => b.setAttribute('aria-checked', String(F[b.dataset.f] === b.dataset.v)));
  $('#fFormat', root).value = F.format;
  const attempts = store.get('attempts', []);
  const list = filtered();
  $('#caseList', root).innerHTML = list.length ? list.map(c => {
    const n = attempts.filter(a => a.caseId === c.id).length;
    return `<li><button type="button" class="case-item" data-id="${c.id}" aria-current="${cur?.c.id === c.id}">
      <span class="ci-title">${esc(c.title)}</span>${n ? `<span class="ci-done">✓ ${n}</span>` : '<span></span>'}
      <span class="ci-meta">${esc(c.type.split('(')[0].trim())} · ${esc(c.setting.split('(')[0].trim())} · ~${c.minutes} min</span></button></li>`;
  }).join('') : '<li class="empty-state" style="padding:8px">No case matches these filters.</li>';
  $$('.case-item', root).forEach(b => b.addEventListener('click', () => open(b.dataset.id)));
}

function exhibitLabel(x) {
  if (x.trim().startsWith('|')) return 'Data table';
  const first = x.split('\n')[0].replace(/^[-*]\s*/, '').replace(/[*`]/g, '').replace(/^\*?Distractor:\*?\s*/i, '');
  const cut = first.split(/[:(]/)[0].trim();
  return cut.length > 52 ? `${cut.slice(0, 50)}…` : cut;
}

function open(id) {
  stopTimer();
  const c = CASES.find(x => x.id === id);
  const draft = store.get('drafts', {})[id] || {};
  cur = { c, elapsed: 0, running: false, startedAt: 0, hints: 0, asked: new Set(), revealed: false, self: {}, coach: null, attemptId: null, structure: draft.structure || '', answer: draft.answer || '' };
  store.set('pcase', id);
  renderList();
  renderCase();
}

function renderCase() {
  const { c } = cur;
  const tags = [
    c.type.split('(')[0].trim(), c.difficulty === 'entry' ? 'Entry-level' : 'Advanced', c.track === 'strategy' ? 'Strategy' : 'Technical',
    FORMAT_NAME[c.format].split(' (')[0], c.setting.split('(')[0].trim(), ...c.drivers.map(d => DRIVER_NAME[d] || d),
  ];
  $('#caseMain', root).innerHTML = `
    <div class="case-head">
      <div>
        <h2>${esc(c.title)}</h2>
        <div class="case-tags">${tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
      </div>
      <div class="timer" id="timer"><span id="tClock" aria-live="off">00:00</span><span class="kpi-note">/ ${c.minutes}:00</span>
        <button type="button" class="btn" id="tToggle">Start clock</button></div>
    </div>
    <blockquote class="prompt-card"><span class="who">Interviewer · ${esc(FORMAT_NAME[c.format])}</span><div class="md">${md(c.prompt)}</div></blockquote>
    <section class="exhibits" aria-labelledby="exh">
      <div class="exhibits-head"><h3 id="exh">Data you can ask for</h3><small id="askCount"></small></div>
      <div id="exList"></div>
    </section>
    <div class="work">
      <label>Your structure (issue tree)<textarea class="field" id="wStructure" spellcheck="false" placeholder="Market value = cups × price&#10;  Cups = population × buyers × frequency&#10;    ..."></textarea></label>
      <label>Math, answer and recommendation<textarea class="field" id="wAnswer" spellcheck="false" placeholder="Set up the equation first, then compute. End with the answer-first recommendation."></textarea></label>
    </div>
    <div class="case-actions">
      <button type="button" class="btn" id="hintBtn">Get a framework hint</button>
      <button type="button" class="btn btn-primary" id="revealBtn">Submit and reveal the model approach</button>
      <span class="kpi-note" id="hintCount"></span>
    </div>
    <div id="hintBox"></div>
    <div id="reveal"></div>`;
  $('#wStructure', root).value = cur.structure;
  $('#wAnswer', root).value = cur.answer;
  renderExhibits(); renderHints();
  $('#tToggle', root).addEventListener('click', toggleTimer);
  ['wStructure', 'wAnswer'].forEach(id => $(`#${id}`, root).addEventListener('input', e => {
    cur[id === 'wStructure' ? 'structure' : 'answer'] = e.target.value;
    if (!cur.running && !cur.revealed && !cur.elapsed) toggleTimer();
    const drafts = store.get('drafts', {});
    drafts[cur.c.id] = { structure: cur.structure, answer: cur.answer };
    store.set('drafts', drafts);
  }));
  $('#hintBtn', root).addEventListener('click', hint);
  $('#revealBtn', root).addEventListener('click', reveal);
  if (cur.revealed) renderReveal();
}

function renderExhibits() {
  const { c } = cur;
  $('#askCount', root).textContent = `${c.exhibitsNote ? `${c.exhibitsNote} · ` : ''}${cur.asked.size} of ${c.exhibits.length} requested`;
  $('#exList', root).innerHTML = c.exhibits.map((x, i) => {
    const shown = cur.asked.has(i) || cur.revealed;
    return `<div class="ex-item">${shown
      ? `<div class="ex-body md"><span class="exhibit-no">Exhibit ${i + 1}</span>${md(x)}</div>`
      : `<button type="button" data-ex="${i}">Ask for exhibit ${i + 1}: ${esc(exhibitLabel(x))}</button>`}</div>`;
  }).join('');
  $$('[data-ex]', root).forEach(b => b.addEventListener('click', () => { cur.asked.add(Number(b.dataset.ex)); if (!cur.running && !cur.elapsed) toggleTimer(); renderExhibits(); }));
}

function renderHints() {
  $('#hintCount', root).textContent = cur.hints ? `Hints used: ${cur.hints}` : 'No hints used';
  const box = $('#hintBox', root);
  if (!cur.hints) { box.innerHTML = ''; return; }
  const fwTitle = FW_FOR_TYPE.find(([re]) => re.test(cur.c.type))?.[1];
  const fw = fwTitle && FRAMEWORKS.find(f => f.title.toLowerCase().startsWith(fwTitle.toLowerCase().split(' ')[0]));
  box.innerHTML = `<div class="hint-box"><b>Hint.</b> ${esc(cur.c.hint)}</div>`
    + (cur.hints > 1 && fw ? `<div class="hint-box" style="margin-top:8px"><b>Framework: ${esc(fw.title)}.</b><div class="md" style="margin-top:6px">${md(fw.md)}</div></div>` : '');
  $('#hintBtn', root).textContent = cur.hints > 1 ? 'No more hints' : 'Show the framework';
  $('#hintBtn', root).disabled = cur.hints > 1;
}

function hint() { cur.hints = Math.min(2, cur.hints + 1); renderHints(); }

function toggleTimer() {
  if (cur.revealed) return;
  if (cur.running) { cur.elapsed += Date.now() - cur.startedAt; cur.running = false; stopTimer(); }
  else { cur.startedAt = Date.now(); cur.running = true; tick = setInterval(paintClock, 500); }
  $('#tToggle', root).textContent = cur.running ? 'Pause' : cur.elapsed ? 'Resume' : 'Start clock';
  paintClock();
}
function stopTimer() { clearInterval(tick); tick = null; }
function elapsedMs() { return cur.elapsed + (cur.running ? Date.now() - cur.startedAt : 0); }
function paintClock() {
  const s = Math.floor(elapsedMs() / 1000);
  const el = $('#tClock', root);
  if (!el) return;
  el.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  $('#timer', root).classList.toggle('over', s > cur.c.minutes * 60);
}

function reveal() {
  if (cur.revealed) return;
  const empty = !cur.structure.trim() && !cur.answer.trim();
  if (empty && !window.confirm('Reveal the model approach without an attempt? It will be logged as a peek, not an attempt.')) return;
  if (cur.running) toggleTimer();
  cur.revealed = true;
  cur.peek = empty;
  cur.minutes = elapsedMs() / 60000;
  $('#tToggle', root).disabled = true;
  $('#revealBtn', root).disabled = true;
  renderExhibits();
  renderReveal();
  if (empty) saveAttempt(true);
  $('#reveal', root).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderReveal() {
  const { c } = cur;
  $('#reveal', root).innerHTML = `
    <section class="reveal">
      <div class="panel"><h3>How a consultant would structure it</h3><div class="tree md">${md(c.structure)}</div></div>
      <div class="panel"><h3>Model reasoning</h3><div class="md">${md(c.walkthrough)}</div></div>
      <div class="panel">
        <h3>Answer</h3><p class="answer-line">${md(c.answer).replace(/^<p>|<\/p>$/g, '')}</p>
        <h3 style="margin-top:16px">How a partner would say it</h3>
        <blockquote class="synthesis">${esc(c.synthesis)}</blockquote>
        <div class="case-tags" style="margin-top:12px">${c.frameworks.map(f => `<span class="chip">${esc(f)}</span>`).join('')}</div>
      </div>
      ${cur.peek ? '' : `<div class="panel">
        <h3>Score your attempt against the rubric</h3>
        <div class="rubric">${DIMS.map(([k, label, help]) => `<div class="rubric-row"><span title="${esc(help)}">${label}<br><small style="color:var(--ink-3)">${esc(help)}</small></span>
          <div class="dots" role="group" aria-label="${label} score">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-dim="${k}" data-n="${n}" aria-pressed="${cur.self[k] === n}">${n}</button>`).join('')}</div></div>`).join('')}</div>
        <div class="case-actions">
          <button type="button" class="btn btn-primary" id="saveAttempt">${cur.attemptId ? 'Update attempt' : 'Save attempt'}</button>
          <button type="button" class="btn" id="coachBtn">Get interviewer feedback · ≈ $0.03</button>
        </div>
        <div id="coachOut">${cur.coach ? coachHtml(cur.coach) : ''}</div>
      </div>`}
    </section>`;
  $$('[data-dim]', root).forEach(b => b.addEventListener('click', () => { cur.self[b.dataset.dim] = Number(b.dataset.n); renderReveal(); }));
  $('#saveAttempt', root)?.addEventListener('click', () => saveAttempt());
  $('#coachBtn', root)?.addEventListener('click', coach);
}

function saveAttempt(peek = false) {
  const { c } = cur;
  const list = store.get('attempts', []);
  const rec = {
    id: cur.attemptId || uid(), caseId: c.id, title: c.title, track: c.track, difficulty: c.difficulty, ts: Date.now(),
    minutes: Math.round((cur.minutes || 0) * 10) / 10, hints: cur.hints, exhibits: cur.asked.size, frameworks: c.frameworks,
    self: { ...cur.self }, coach: cur.coach ? { scores: cur.coach.scores, verdict: cur.coach.verdict } : null, peek,
  };
  const i = list.findIndex(a => a.id === rec.id);
  if (i >= 0) list[i] = rec; else list.unshift(rec);
  store.set('attempts', list.slice(0, 300));
  cur.attemptId = rec.id;
  if (!peek) {
    const drafts = store.get('drafts', {}); delete drafts[c.id]; store.set('drafts', drafts);
    toast('Attempt saved to your practice history.');
    renderReveal();
  }
  renderList(); renderSide();
}

async function coach() {
  if (!app.live) { toast('Interviewer feedback needs a live server with an API key. Self-scoring still works.'); return; }
  const btn = $('#coachBtn', root);
  btn.disabled = true; btn.textContent = 'The interviewer is reading your work…';
  try {
    const { c } = cur;
    const res = await post('/api/coach', {
      caseId: c.id, prompt: c.prompt, track: c.track, difficulty: c.difficulty,
      modelStructure: c.structure, modelAnswer: c.answer,
      userStructure: cur.structure, userAnswer: cur.answer,
      hintsUsed: cur.hints, exhibitsAsked: cur.asked.size, minutes: Math.round(cur.minutes || 0), tier: app.tier,
    });
    cur.coach = res.feedback;
    saveAttempt();
  } catch (e) {
    toast(e.message);
    btn.disabled = false; btn.textContent = 'Get interviewer feedback · ≈ $0.03';
  }
}

function coachHtml(f) {
  const verdict = { strong_pass: 'Strong pass', pass: 'Pass', borderline: 'Borderline', not_yet: 'Not yet' }[f.verdict];
  return `<div class="coach">
    <h3>Interviewer debrief: ${verdict}</h3>
    <div class="coach-scores">${DIMS.map(([k, label]) => `<div><b>${f.scores[k]}</b>${label}</div>`).join('')}</div>
    <strong>What worked</strong><ul>${f.strengths.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    <strong>What to fix</strong><ul>${f.gaps.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    <p style="margin:0 0 6px"><strong>Partner’s take:</strong> ${esc(f.partner_comment)}</p>
    <p style="margin:0;color:var(--ink-2)"><strong>Next drill:</strong> ${esc(f.next_drill)}</p></div>`;
}

function renderSide() {
  const all = store.get('attempts', []);
  const real = all.filter(a => !a.peek);
  const done = new Set(real.map(a => a.caseId)).size;
  const avgMin = real.length ? real.reduce((s, a) => s + a.minutes, 0) / real.length : 0;
  const avgHints = real.length ? real.reduce((s, a) => s + a.hints, 0) / real.length : 0;
  const dimAvg = DIMS.map(([k, label]) => {
    const xs = real.map(a => a.coach?.scores?.[k] ?? a.self?.[k]).filter(Boolean);
    return [label, xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null];
  });
  const fwCount = {}, fwTrack = {};
  real.forEach(a => a.frameworks.forEach(f => { fwCount[f] = (fwCount[f] || 0) + 1; fwTrack[f] = a.track; }));
  const fws = Object.entries(fwCount).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const maxFw = fws[0]?.[1] || 1;
  $('#pracSide', root).innerHTML = `
    <section class="panel"><h2>Your progress</h2>
      <div class="stat-grid">
        <div class="stat"><div class="stat-label">Attempts</div><div class="stat-value">${real.length}</div></div>
        <div class="stat"><div class="stat-label">Cases done</div><div class="stat-value">${done}<span class="kpi-note"> / ${CASES.length}</span></div></div>
        <div class="stat"><div class="stat-label">Avg time</div><div class="stat-value">${avgMin ? `${avgMin.toFixed(0)}<span class="kpi-note"> min</span>` : '–'}</div></div>
        <div class="stat"><div class="stat-label">Hints / attempt</div><div class="stat-value">${real.length ? avgHints.toFixed(1) : '–'}</div></div>
      </div></section>
    <section class="panel"><h2>Rubric average</h2>
      ${dimAvg.some(([, v]) => v) ? `<div class="dim-scores">${dimAvg.map(([l, v]) => `<div><span>${l}</span><span class="track"><i style="width:${v ? v / 5 * 100 : 0}%"></i></span><output>${v ? v.toFixed(1) : '–'}</output></div>`).join('')}</div>
        <p class="kpi-note" style="margin:8px 0 0">Interviewer scores where you asked for feedback, your own scores otherwise.</p>`
        : '<p class="empty-state">Score an attempt to see where you are strong and where you lose points.</p>'}</section>
    <section class="panel"><h2>Frameworks practised</h2>
      ${fws.length ? `<div class="fw-bars">${fws.map(([f, n]) => `<div class="fw-bar"><span>${esc(f)}</span><output>${n}</output><span class="track"><i class="${fwTrack[f] === 'technical' ? 'tech' : ''}" style="width:${n / maxFw * 100}%"></i></span></div>`).join('')}</div>
        <p class="kpi-note" style="margin:8px 0 0">Blue: strategy cases. Teal: technical cases.</p>`
        : '<p class="empty-state">Frameworks from each case you complete are tallied here.</p>'}</section>
    <section class="panel"><h2>Recent attempts</h2>
      ${all.length ? `<ul class="attempts">${all.slice(0, 8).map(a => {
        const xs = Object.values(a.coach?.scores || a.self || {});
        const avg = xs.length ? (xs.reduce((s, x) => s + x, 0) / xs.length).toFixed(1) : '–';
        return `<li><span>${esc(a.title)}</span><span class="mono">${a.peek ? 'peek' : avg}</span>
          <span class="fw">${fmt.date(a.ts)} · ${a.difficulty === 'entry' ? 'entry' : 'advanced'} · ${a.minutes} min · ${a.hints} hint${a.hints === 1 ? '' : 's'}${a.coach ? ' · AI feedback' : ''}</span></li>`;
      }).join('')}</ul>` : '<p class="empty-state">Your attempts are saved in this browser, so progress carries across sessions.</p>'}</section>`;
}
