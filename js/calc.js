// Calculator: an assumptions sheet, live WACC, KPI strip, tornado exhibit,
// NPV profile, breakevens and the cash-flow schedule.
import { PRESETS, WACC_BANDS } from './presets.js';
import { evaluate, tornado, breakeven, lcoe, signChanges, npv, irr } from './finance.js';
import { $, $$, fmt, emit, toast } from './core.js';
import { store } from './store.js';
import { esc } from './md.js';

const CUSTOM = {
  id: 'custom', name: 'Your own project', place: 'Custom inputs', unit: '$/unit',
  blurb: 'Type your own costs and savings into the blue cells.',
  p: { capex: 1_000_000, energyY1: 0, revenue: 220_000, growth: 0.02, degradation: 0, rampY1: 1, opex: 30_000, opexEsc: 0.025, replacements: [], taxRate: 0.2, deprYears: 10, life: 15, wacc: 0.09, salvagePct: 0 },
  drivers: [
    { key: 'wacc', label: 'Discount rate (WACC)', low: 0.07, high: 0.11, fmt: 'pct' },
    { key: 'capex', label: 'Initial cost', low: 800_000, high: 1_300_000, fmt: 'usd' },
    { key: 'priceMult', label: 'Annual savings / revenue', low: 0.8, high: 1.2, fmt: 'mult', note: '−20% / +20%' },
    { key: 'growth', label: 'Revenue growth', low: 0, high: 0.04, fmt: 'pct' },
    { key: 'opex', label: 'O&M cost', low: 20_000, high: 45_000, fmt: 'usd' },
    { key: 'life', label: 'Asset life', low: 10, high: 20, fmt: 'yrs' },
  ],
  source: 'User inputs.',
};
const ALL = [...PRESETS, CUSTOM];

// Which cells the sheet shows, and how to display/parse them.
const ROWS = [
  ['Investment'],
  ['capex', 'Initial cost', 'usd', '$'],
  ['life', 'Asset life', 'int', 'years'],
  ['salvagePct', 'Salvage at end of life', 'pct', '% of cost'],
  ['Operations'],
  ['revenue', 'Year-1 savings or revenue', 'usd', '$ / yr'],
  ['growth', 'Revenue growth (price escalation)', 'pct', '% / yr'],
  ['rampY1', 'Year-1 ramp-up', 'pct', '% of steady'],
  ['degradation', 'Output degradation', 'pct', '% / yr'],
  ['opex', 'O&M cost, year 1', 'usd', '$ / yr'],
  ['opexEsc', 'O&M escalation', 'pct', '% / yr'],
  ['energyY1', 'Annual output (for LCOE)', 'int', 'kWh / yr'],
  ['Tax'],
  ['taxRate', 'Tax rate', 'pct', '%'],
  ['deprYears', 'Straight-line depreciation', 'int', 'years'],
];

const DRIVER_BOUNDS = {
  wacc: [0, 0.6], capex: [1, null], priceMult: [0, 6], volumeMult: [0, 6], growth: [-0.3, 0.3],
  opex: [0, null], life: [1, 60], degradation: [0, 0.3], rampY1: [0, 1],
};

let root, preset, P, mode = 'range', lastT, lastR;

export function initCalculator(el) {
  root = el;
  const saved = store.get('calc', null);
  mode = saved?.mode || 'range';
  select(saved?.presetId || 'solar', saved?.p);
  // Charts are drawn at the container's real pixel width so text never scales.
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => { if (!root.closest('[hidden]') && lastT) { drawTornado($('#tornado', root), lastT); drawProfile($('#profile', root), lastR); } }, 120);
  });
}

function select(id, overrides) {
  preset = ALL.find(x => x.id === id) || PRESETS[0];
  P = structuredClone({ ...preset.p, ...(overrides || {}) });
  render();
}

function persist() { store.set('calc', { presetId: preset.id, p: P, mode }); }

function drivers() {
  if (mode === 'range') return preset.drivers;
  // ±20% of each base value (the simpler, less honest convention; shown for comparison)
  return preset.drivers.map(d => {
    const base = d.key === 'priceMult' || d.key === 'volumeMult' ? (P[d.key] ?? 1) : P[d.key];
    let low = base * 0.8, high = base * 1.2;
    if (d.key === 'life') { low = Math.round(low); high = Math.round(high); }
    if (d.key === 'rampY1') high = Math.min(1, high);
    return { ...d, low, high, note: '−20% / +20%' };
  });
}

const show = (v, kind) => kind === 'usd' ? fmt.int(v) : kind === 'pct' ? (v * 100).toFixed(2).replace(/\.?0+$/, '') : fmt.int(v);
function parse(str, kind) {
  let s = String(str).trim().replace(/,/g, '').replace(/\$/g, '');
  let mult = 1;
  if (/m$/i.test(s)) { mult = 1e6; s = s.slice(0, -1); } else if (/k$/i.test(s)) { mult = 1e3; s = s.slice(0, -1); }
  s = s.replace('%', '');
  const n = Number(s) * mult;
  if (!isFinite(n)) return null;
  return kind === 'pct' ? n / 100 : n;
}

function rangeText(d) {
  if (d.note) return d.note;
  const f = v => d.fmt === 'pct' ? fmt.pct(v, 1) : d.fmt === 'usd' ? fmt.usd(v, 2) : d.fmt === 'yrs' ? `${Math.round(v)} yrs` : `${v.toFixed(2)}×`;
  return `${f(d.low)} – ${f(d.high)}`;
}

function render() {
  const r = evaluate(P);
  const t = tornado(P, drivers());
  const lc = lcoe(P);
  const multi = signChanges(r.flows) > 1;
  const top = t.bars.slice(0, 2).map(b => b.label.toLowerCase().replace(/\s*\(.*\)/, ''));
  const beCapex = breakeven(P, 'capex', P.capex * 0.2, P.capex * 5);
  const title = r.npv >= 0
    ? `${preset.name} clears a ${fmt.pct(P.wacc)} discount rate with NPV ${fmt.signedUsd(r.npv)}; ${top[0]} and ${top[1]} carry most of the risk`
    : `${preset.name} loses ${fmt.usd(-r.npv)} of value at ${fmt.pct(P.wacc)}; ${top[0]} is the lever that could rescue it`;

  root.innerHTML = `
  <div class="calc">
    <div class="calc-top">
      <div class="preset-tabs" role="group" aria-label="Project preset">
        ${ALL.map(x => `<button type="button" data-preset="${x.id}" aria-pressed="${x.id === preset.id}">${esc(x.name)}</button>`).join('')}
      </div>
      <button type="button" class="btn btn-primary" id="toCommittee">Send to the committee</button>
    </div>
    <header class="exhibit-head">
      <div class="exhibit-no">${esc(preset.place)}</div>
      <h2 class="action-title">${esc(title)}</h2>
      <p class="exhibit-sub">${esc(preset.blurb)} After-tax nominal USD cash flows, end-of-year discounting.</p>
    </header>

    <div>
      <section class="wacc" aria-labelledby="wacc-h">
        <div class="wacc-row"><h2 id="wacc-h">Discount rate (WACC)</h2><span class="wacc-val" id="waccVal">${fmt.pct(P.wacc, 1)}</span></div>
        <input type="range" id="waccSlider" min="0.02" max="0.16" step="0.001" value="${P.wacc}" aria-label="Discount rate">
        <div class="wacc-bands" aria-hidden="true">${WACC_BANDS.map((b, i) => {
          const L = (b.low - 0.02) / 0.14 * 100, Wd = (b.high - b.low) / 0.14 * 100;
          return `<span class="wacc-band" title="${esc(b.label)}: ${fmt.pct(b.low)}–${fmt.pct(b.high)}" style="left:${L}%;width:${Wd}%;top:${(i % 4) * 7}px"></span>`;
        }).join('')}</div>
        <div class="wacc-scale" aria-hidden="true"><span>2%</span><span>6%</span><span>10%</span><span>14%</span><span>16%</span></div>
        <label class="sr-only" for="waccRef">Reference discount rates</label>
        <select id="waccRef" class="field"><option value="">Reference ranges (nominal USD)…</option>
          ${WACC_BANDS.map((b, i) => `<option value="${i}">${esc(b.label)}: ${fmt.pct(b.low)}–${fmt.pct(b.high)}, base ${fmt.pct(b.base)}</option>`).join('')}</select>
      </section>

      <section class="sheet" aria-labelledby="sheet-h">
        <h2 id="sheet-h">Assumptions <small>blue = input</small></h2>
        <table class="sheet-table"><tbody>
          ${ROWS.map(row => row.length === 1
            ? `<tr class="grp"><th colspan="3">${row[0]}</th></tr>`
            : `<tr><th scope="row"><label for="in-${row[0]}">${row[1]}</label></th><td><input class="cell-input" id="in-${row[0]}" data-key="${row[0]}" data-kind="${row[2]}" inputmode="decimal" value="${show(P[row[0]] ?? 0, row[2])}"></td><td class="unit">${row[3]}</td></tr>`).join('')}
          ${(P.replacements || []).map((rp, i) => `<tr><th scope="row">${esc(rp.label || 'Replacement')} <span class="mono" style="color:var(--ink-3)">yr</span> <input class="cell-input" style="width:48px;display:inline-block" data-rep="${i}" data-field="year" value="${rp.year}" aria-label="Replacement year"></th><td><input class="cell-input" data-rep="${i}" data-field="cost" value="${fmt.int(rp.cost)}" aria-label="Replacement cost"></td><td class="unit">$</td></tr>`).join('')}
        </tbody></table>
        <p class="sheet-note">Type <span class="blue">6.5M</span>, <span class="blue">350k</span> or <span class="blue">8%</span>. Source: ${esc(preset.source)}</p>
      </section>
    </div>

    <div>
      <div class="kpis" role="group" aria-label="Key results">
        ${kpi('NPV at WACC', fmt.signedUsd(r.npv), r.npv >= 0 ? 'pos' : 'neg', `PI ${r.pi ? r.pi.toFixed(2) : 'n/a'}`)}
        ${kpi('IRR', r.irr == null ? 'n/a' : fmt.pct(r.irr), '', r.irr == null ? 'no sign change' : `${r.irr >= P.wacc ? '+' : '−'}${Math.abs((r.irr - P.wacc) * 100).toFixed(1)} pts vs WACC`)}
        ${kpi('MIRR', r.mirr == null ? 'n/a' : fmt.pct(r.mirr), '', 'reinvest at WACC')}
        ${kpi('Payback', fmt.yrs(r.payback), '', 'simple')}
        ${kpi('Discounted payback', fmt.yrs(r.discountedPayback), '', `at ${fmt.pct(P.wacc)}`)}
        ${lc ? kpi('LCOE', `$${lc.toFixed(4)}`, '', 'per kWh') : kpi('Breakeven cost', beCapex ? fmt.usd(beCapex) : 'n/a', '', 'NPV = 0')}
      </div>
      ${multi ? '<p class="warn-line">Cash flows change sign more than once (a mid-life replacement), so more than one IRR can exist. Rely on NPV and MIRR.</p>' : ''}

      <section class="exhibit" aria-labelledby="ex1-t">
        <div class="ex-no">Exhibit 1 · Sensitivity</div>
        <h3 class="ex-title" id="ex1-t">${esc(t.bars[0].label)} and ${esc(t.bars[1].label.toLowerCase())} swing NPV by ${fmt.usd(t.bars[0].swing)} and ${fmt.usd(t.bars[1].swing)}</h3>
        <p class="ex-sub">NPV at ${fmt.pct(P.wacc)} WACC, $M; base case ${fmt.signedUsd(t.base)}. Each input moved alone between its low and high value.</p>
        <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center">
          <div class="ex-legend"><span><i style="background:var(--t-low)"></i>Low input value</span><span><i style="background:var(--t-high)"></i>High input value</span></div>
          <div class="seg" role="radiogroup" aria-label="Range method">
            <button type="button" role="radio" data-mode="range" aria-checked="${mode === 'range'}">Engineering ranges</button>
            <button type="button" role="radio" data-mode="pct" aria-checked="${mode === 'pct'}">±20%</button>
          </div>
        </div>
        <div id="tornado"></div>
        <div class="ex-foot">
          <span>1. One-at-a-time sensitivity; all other inputs at base. Colour shows the input level, not whether the outcome is good (lower cost raises NPV).</span>
          <span>2. ${mode === 'range' ? 'Ranges are engineering low/high values from benchmarks and tender data, not a flat ±%.' : 'Every input moved ±20% of base, which treats all inputs as equally uncertain.'} Circles mark where a bar crosses NPV = 0.</span>
          <span>Source: ${esc(preset.source)}</span>
        </div>
      </section>

      <div class="two-col">
        <section class="exhibit" aria-labelledby="ex2-t">
          <div class="ex-no">Exhibit 2 · NPV profile</div>
          <h3 class="ex-title" id="ex2-t">${r.irr == null ? 'NPV never crosses zero in this range' : `NPV falls to zero at ${fmt.pct(r.irr)}, the IRR`}</h3>
          <p class="ex-sub">NPV ($M) against discount rate; marker at the current WACC.</p>
          <div id="profile"></div>
        </section>
        <section class="exhibit" aria-labelledby="ex3-t">
          <div class="ex-no">Exhibit 3 · Breakevens</div>
          <h3 class="ex-title" id="ex3-t">How far each input can move before NPV hits zero</h3>
          <table class="be-table"><thead><tr><th>Input</th><th class="num">Base</th><th class="num">Breakeven</th><th class="num">Headroom</th></tr></thead><tbody id="beRows"></tbody></table>
        </section>
      </div>

      <section class="exhibit" aria-labelledby="ex4-t">
        <div class="ex-no">Exhibit 4 · Cash-flow schedule</div>
        <h3 class="ex-title" id="ex4-t">Year-by-year cash flows, $k</h3>
        <div class="scroll-x" tabindex="0" aria-label="Cash-flow table, scrolls horizontally">${cfTable(r)}</div>
      </section>
    </div>
  </div>`;

  lastT = t; lastR = r;
  drawTornado($('#tornado', root), t);
  drawProfile($('#profile', root), r);
  fillBreakevens(t);
  bind();
}

const kpi = (label, value, cls, note) =>
  `<div class="kpi"><div class="kpi-label">${label}</div><div class="kpi-value ${cls}">${value}</div><div class="kpi-note">${note}</div></div>`;

function cfTable(r) {
  const k = v => { const x = Math.round(v / 1000); return x === 0 ? '–' : x < 0 ? `(${fmt.int(-x)})` : fmt.int(x); };
  const neg = v => (Math.round(v / 1000) < 0 ? ' class="neg"' : '');
  let cum = 0, dcum = 0;
  const cumRow = [], dRow = [];
  r.rows.forEach((row, t) => { cum += row.net; dcum += row.net / Math.pow(1 + P.wacc, t); cumRow.push(cum); dRow.push(dcum); });
  const line = (label, vals, cls = '') => `<tr class="${cls}"><th scope="row">${label}</th>${vals.map(v => `<td${neg(v)}>${k(v)}</td>`).join('')}</tr>`;
  return `<table class="cf-table"><thead><tr><th scope="col">Year</th>${r.rows.map(x => `<th scope="col" style="text-align:right">${x.year}</th>`).join('')}</tr></thead><tbody>
    ${line('Savings / revenue', r.rows.map(x => x.revenue))}
    ${line('O&M', r.rows.map(x => x.opex))}
    ${line('EBITDA', r.rows.map(x => x.ebitda))}
    ${line('Tax', r.rows.map(x => x.tax))}
    ${line('Capex & replacements', r.rows.map(x => x.capex))}
    ${line('Net cash flow', r.rows.map(x => x.net), 'total')}
    ${line('Cumulative', cumRow)}
    ${line('Discounted cumulative', dRow)}
  </tbody></table>`;
}

function fillBreakevens(t) {
  const rows = t.bars.map(d => {
    const base = d.key === 'priceMult' || d.key === 'volumeMult' ? (P[d.key] ?? 1) : P[d.key];
    const [lo0, hi0] = DRIVER_BOUNDS[d.key] || [0, null];
    const lo = lo0, hi = hi0 ?? Math.max(base * 8, 1);
    const be = breakeven(P, d.key, lo, hi);
    const f = v => d.fmt === 'pct' ? fmt.pct(v, 1) : d.fmt === 'usd' ? fmt.usd(v, 2) : d.fmt === 'yrs' ? `${v.toFixed(1)} yrs` : `${v.toFixed(2)}×`;
    // Rates move in percentage points; everything else as % of base.
    const head = be == null ? 'none in range'
      : d.fmt === 'pct' ? `${be > base ? '+' : '−'}${Math.abs((be - base) * 100).toFixed(1)} pts`
      : `${be > base ? '+' : '−'}${Math.abs((be / base - 1) * 100).toFixed(0)}%`;
    return `<tr><td>${esc(d.label)}</td><td class="num mono">${f(base)}</td><td class="num mono">${be == null ? '–' : f(be)}</td><td class="num mono">${head}</td></tr>`;
  });
  $('#beRows', root).innerHTML = rows.join('');
}

// ---------------------------------------------------------------- charts

let tipEl;
function tip(html, x, y) {
  if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'chart-tip'; document.body.appendChild(tipEl); }
  if (!html) { tipEl.hidden = true; return; }
  tipEl.hidden = false; tipEl.innerHTML = html;
  const w = tipEl.offsetWidth;
  tipEl.style.left = `${Math.min(window.innerWidth - w - 12, x + 14)}px`;
  tipEl.style.top = `${y + 14}px`;
}

function niceTicks(min, max, n = 5) {
  const span = max - min, step0 = span / n;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => span / s <= n + 1);
  const out = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) out.push(v);
  return out;
}
const $M = v => { const m = v / 1e6; return `${m < 0 ? '−' : ''}${Math.abs(m).toFixed(Math.abs(m) >= 10 ? 0 : 1)}`; };

// Bar with a 4px rounded data end and a square end on the base line.
function barPath(x0, x1, y, h) {
  const r = Math.min(4, Math.abs(x1 - x0) / 2);
  if (x1 >= x0) return `M${x0} ${y}H${x1 - r}Q${x1} ${y} ${x1} ${y + r}V${y + h - r}Q${x1} ${y + h} ${x1 - r} ${y + h}H${x0}Z`;
  return `M${x0} ${y}H${x1 + r}Q${x1} ${y} ${x1} ${y + r}V${y + h - r}Q${x1} ${y + h} ${x1 + r} ${y + h}H${x0}Z`;
}

function drawTornado(host, t) {
  const W = Math.max(320, Math.round(host.clientWidth || 760));
  const LAB = W < 600 ? Math.round(W * 0.4) : 228, RIGHT = 48, ROW = 40, BAR = 20, TOP = 8;
  const H = TOP + t.bars.length * ROW + 34;
  const vals = t.bars.flatMap(b => [b.lowNpv, b.highNpv]).concat(t.base, 0);
  let min = Math.min(...vals), max = Math.max(...vals);
  const pad = (max - min) * 0.08; min -= pad; max += pad;
  // 44px inner gutter so a value label at the left bar tip never meets the row label.
  const x = v => LAB + 44 + (v - min) / (max - min) * (W - LAB - RIGHT - 44);
  const ticks = niceTicks(min, max, 6);
  let s = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tornado chart of NPV sensitivity">`;
  ticks.forEach(v => { s += `<line class="tn-grid" x1="${x(v)}" x2="${x(v)}" y1="${TOP}" y2="${H - 26}"/><text class="tn-axis" x="${x(v)}" y="${H - 10}" text-anchor="middle">${$M(v)}</text>`; });
  t.bars.forEach((b, i) => {
    const y = TOP + i * ROW + (ROW - BAR) / 2;
    const xb = x(t.base);
    const segs = [[b.lowNpv, 'var(--t-low)', 'low'], [b.highNpv, 'var(--t-high)', 'high']].sort((a, c) => Math.abs(c[0] - t.base) - Math.abs(a[0] - t.base));
    s += `<g class="tn-row" data-i="${i}"><rect class="tn-hit" x="0" y="${TOP + i * ROW}" width="${W}" height="${ROW}"/>`;
    s += `<text class="tn-label" x="${LAB - 12}" y="${y + 9}" text-anchor="end">${esc(b.label)}</text><text class="tn-range" x="${LAB - 12}" y="${y + 23}" text-anchor="end">${esc(rangeText(b))}</text>`;
    segs.forEach(([v, col]) => { s += `<path d="${barPath(xb, x(v), y, BAR)}" fill="${col}"/>`; });
    // value labels at the bar tips
    [[b.lowNpv], [b.highNpv]].forEach(([v]) => {
      const right = v >= t.base;
      s += `<text class="tn-val" x="${x(v) + (right ? 6 : -6)}" y="${y + 14}" text-anchor="${right ? 'start' : 'end'}">${$M(v)}</text>`;
    });
    if ((b.lowNpv < 0) !== (b.highNpv < 0) && min < 0 && max > 0) s += `<circle class="tn-be" cx="${x(0)}" cy="${y + BAR / 2}" r="4.5"/>`;
    s += '</g>';
  });
  s += `<line class="tn-base" x1="${x(t.base)}" x2="${x(t.base)}" y1="${TOP - 4}" y2="${H - 26}"/>`;
  if (min < 0 && max > 0) s += `<line class="tn-zero" x1="${x(0)}" x2="${x(0)}" y1="${TOP - 4}" y2="${H - 26}"/>`;
  s += '</svg>';
  host.innerHTML = s;
  $$('.tn-row', host).forEach(g => {
    const b = t.bars[g.dataset.i];
    const f = v => b.fmt === 'pct' ? fmt.pct(v, 1) : b.fmt === 'usd' ? fmt.usd(v, 2) : b.fmt === 'yrs' ? `${Math.round(v)} yrs` : `${v.toFixed(2)}×`;
    g.addEventListener('mousemove', e => tip(`<div>${esc(b.label)}</div>Low ${esc(f(b.low))}: NPV <b>${fmt.signedUsd(b.lowNpv)}</b><br>High ${esc(f(b.high))}: NPV <b>${fmt.signedUsd(b.highNpv)}</b><br>Swing <b>${fmt.usd(b.swing)}</b>`, e.clientX, e.clientY));
    g.addEventListener('mouseleave', () => tip(null));
  });
}

function drawProfile(host, r) {
  const W = Math.max(280, Math.round(host.clientWidth || 460)), H = 250, L = 46, R = 14, T = 12, B = 30;
  const rates = Array.from({ length: 81 }, (_, i) => i * 0.0025);
  const pts = rates.map(k => [k, npv(k, r.flows)]);
  let min = Math.min(0, ...pts.map(p => p[1])), max = Math.max(0, ...pts.map(p => p[1]));
  const pad = (max - min) * 0.08; min -= pad; max += pad;
  const x = k => L + k / 0.2 * (W - L - R);
  const y = v => T + (max - v) / (max - min) * (H - T - B);
  const ticks = niceTicks(min, max, 5);
  let s = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="NPV profile against discount rate">`;
  ticks.forEach(v => { s += `<line class="tn-grid" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text class="tn-axis" x="${L - 6}" y="${y(v) + 3}" text-anchor="end">${$M(v)}</text>`; });
  [0, 0.05, 0.1, 0.15, 0.2].forEach(k => { s += `<text class="tn-axis" x="${x(k)}" y="${H - 10}" text-anchor="middle">${k * 100}%</text>`; });
  s += `<line class="tn-zero" x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}"/>`;
  s += `<path d="${pts.map((p, i) => `${i ? 'L' : 'M'}${x(p[0]).toFixed(1)} ${y(p[1]).toFixed(1)}`).join('')}" fill="none" stroke="var(--input)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  const irrV = irr(r.flows);
  if (irrV != null && irrV <= 0.2 && irrV >= 0) s += `<circle cx="${x(irrV)}" cy="${y(0)}" r="4.5" fill="var(--ground-0)" stroke="#FFB4A8" stroke-width="1.5"/><text class="tn-zero-label" x="${x(irrV) + 8}" y="${y(0) - 8}">IRR ${fmt.pct(irrV)}</text>`;
  if (P.wacc <= 0.2) s += `<circle cx="${x(P.wacc)}" cy="${y(npv(P.wacc, r.flows))}" r="5" fill="var(--input)" stroke="var(--surface)" stroke-width="2"/><text class="tn-val" x="${x(P.wacc) + 8}" y="${y(npv(P.wacc, r.flows)) - 8}">WACC ${fmt.pct(P.wacc)}</text>`;
  s += `<line id="pfX" class="tn-grid" x1="0" x2="0" y1="${T}" y2="${H - B}" style="display:none"/><rect id="pfHit" x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" fill="transparent"/></svg>`;
  host.innerHTML = s;
  const svg = host.querySelector('svg'), line = host.querySelector('#pfX');
  host.querySelector('#pfHit').addEventListener('mousemove', e => {
    const box = svg.getBoundingClientRect();
    const px = (e.clientX - box.left) / box.width * W;
    const k = Math.max(0, Math.min(0.2, (px - L) / (W - L - R) * 0.2));
    line.style.display = ''; line.setAttribute('x1', x(k)); line.setAttribute('x2', x(k));
    tip(`Discount rate <b>${fmt.pct(k)}</b><br>NPV <b>${fmt.signedUsd(npv(k, r.flows))}</b>`, e.clientX, e.clientY);
  });
  host.querySelector('#pfHit').addEventListener('mouseleave', () => { line.style.display = 'none'; tip(null); });
}

// ---------------------------------------------------------------- events

function bind() {
  $$('[data-preset]', root).forEach(b => b.addEventListener('click', () => { select(b.dataset.preset); persist(); }));
  $$('[data-mode]', root).forEach(b => b.addEventListener('click', () => { mode = b.dataset.mode; persist(); render(); }));
  const slider = $('#waccSlider', root);
  slider.addEventListener('input', () => { $('#waccVal', root).textContent = fmt.pct(Number(slider.value), 1); });
  slider.addEventListener('change', () => { P.wacc = Number(slider.value); persist(); rerenderKeepFocus('#waccSlider'); });
  // live NPV while dragging: update KPI + title cheaply
  slider.addEventListener('input', () => {
    const r = evaluate({ ...P, wacc: Number(slider.value) });
    const k = $$('.kpi-value', root);
    k[0].textContent = fmt.signedUsd(r.npv); k[0].className = `kpi-value ${r.npv >= 0 ? 'pos' : 'neg'}`;
    k[4].textContent = fmt.yrs(r.discountedPayback);
  });
  $('#waccRef', root).addEventListener('change', e => {
    if (e.target.value === '') return;
    P.wacc = WACC_BANDS[Number(e.target.value)].base; persist(); render();
  });
  $$('.cell-input[data-key]', root).forEach(inp => inp.addEventListener('change', () => {
    const v = parse(inp.value, inp.dataset.kind);
    if (v == null || v < 0 && inp.dataset.key !== 'growth') { toast('Enter a number, e.g. 6.5M, 350k or 8%.'); inp.value = show(P[inp.dataset.key], inp.dataset.kind); return; }
    P[inp.dataset.key] = inp.dataset.key === 'life' || inp.dataset.key === 'deprYears' ? Math.max(1, Math.round(v)) : v;
    persist(); rerenderKeepFocus(`#in-${inp.dataset.key}`);
  }));
  $$('.cell-input[data-rep]', root).forEach(inp => inp.addEventListener('change', () => {
    const v = parse(inp.value, 'usd');
    if (v == null) return;
    P.replacements[Number(inp.dataset.rep)][inp.dataset.field] = inp.dataset.field === 'year' ? Math.round(v) : v;
    persist(); render();
  }));
  $('#toCommittee', root).addEventListener('click', sendToCommittee);
}

function rerenderKeepFocus(sel) {
  const y = window.scrollY;
  render();
  window.scrollTo(0, y);
  $(sel, root)?.focus();
}

function sendToCommittee() {
  const r = evaluate(P);
  const t = tornado(P, drivers());
  const be = t.bars.slice(0, 3).map(b => {
    const base = b.key === 'priceMult' || b.key === 'volumeMult' ? (P[b.key] ?? 1) : P[b.key];
    const [lo, hi] = DRIVER_BOUNDS[b.key] || [0, null];
    const v = breakeven(P, b.key, lo, hi ?? Math.max(base * 8, 1));
    return `${b.label} swing ${fmt.usd(b.swing)} (range ${rangeText(b)})${v == null ? '' : `, NPV = 0 at ${b.fmt === 'pct' ? fmt.pct(v) : b.fmt === 'usd' ? fmt.usd(v) : b.fmt === 'yrs' ? `${v.toFixed(1)} yrs` : `${v.toFixed(2)}× base`}`}`;
  });
  const label = `${preset.name} · NPV ${fmt.signedUsd(r.npv)} @ ${fmt.pct(P.wacc)} · IRR ${r.irr == null ? 'n/a' : fmt.pct(r.irr)}`;
  const text = [
    `Calculator output for ${preset.name} (${preset.place}); after-tax nominal USD, end-of-year discounting.`,
    `Capex ${fmt.usd(P.capex)}; year-1 savings/revenue ${fmt.usd(P.revenue)} growing ${fmt.pct(P.growth)}/yr; O&M ${fmt.usd(P.opex)}/yr; life ${P.life} yrs; tax ${fmt.pct(P.taxRate, 0)}.`,
    `NPV ${fmt.signedUsd(r.npv)} at ${fmt.pct(P.wacc)}; IRR ${r.irr == null ? 'n/a' : fmt.pct(r.irr)}; MIRR ${r.mirr == null ? 'n/a' : fmt.pct(r.mirr)}; simple payback ${fmt.yrs(r.payback)}; discounted payback ${fmt.yrs(r.discountedPayback)}.`,
    `Top sensitivities: ${be.join('; ')}.`,
  ].join(' ');
  const decision = `Approve ${fmt.usd(P.capex)} capex for the ${preset.id === 'custom' ? 'project described in the committee pack' : `${preset.name} (${preset.place})`}. ${preset.id === 'custom' ? '' : preset.blurb}`.trim();
  emit('pack', { label, text, decision });
  location.hash = '#simulation';
  toast('Committee pack attached. Finance and the other departments will see these numbers.');
}
