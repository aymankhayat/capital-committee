// The committee map: seven department hubs radiating constellation branches
// around the Company Brain, a particle cluster at the centre.
import { DEPTS } from './departments.js';

const NS = 'http://www.w3.org/2000/svg';
const W = 1200, H = 1040, CX = 600, CY = 500, R = 238, HUB = 24;
const START = -115.714, STEP = 360 / 7;

// Label anchor per ring slot (hand-placed so long names never clip).
const LABEL_POS = [[398, 96], [802, 96], [1040, 338], [1020, 930], [600, 985], [205, 930], [165, 338]];

function el(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const rad = d => d * Math.PI / 180;

const GLYPH = {
  support: 'M-3.6 0.2l2.4 2.5 4.8-5.2',
  oppose: 'M-3 -3l6 6M3 -3l-6 6',
  conditional: 'M0 -4.2a4.2 4.2 0 0 1 0 8.4z',
};

export function createConstellation(svg, { onSelect, tipEl, tipContent }) {
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = '';
  const defs = el('defs', {}, svg);
  const pat = el('pattern', { id: 'dotgrid', width: 22, height: 22, patternUnits: 'userSpaceOnUse' }, defs);
  el('circle', { cx: 11, cy: 11, r: 1, fill: '#4A5277' }, pat);
  const fade = el('radialGradient', { id: 'gridfade', cx: '50%', cy: '48%', r: '55%' }, defs);
  el('stop', { offset: '0%', 'stop-color': '#fff', 'stop-opacity': '.9' }, fade);
  el('stop', { offset: '100%', 'stop-color': '#fff', 'stop-opacity': '0' }, fade);
  const mask = el('mask', { id: 'gridmask' }, defs);
  el('rect', { width: W, height: H, fill: 'url(#gridfade)' }, mask);
  const glow = el('filter', { id: 'soft', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
  el('feGaussianBlur', { stdDeviation: 5 }, glow);

  el('rect', { width: W, height: H, fill: 'url(#dotgrid)', mask: 'url(#gridmask)', opacity: '.55' }, svg);
  const gLinks = el('g', { class: 'c-links' }, svg);
  const gConf = el('g', { class: 'c-conflicts' }, svg);
  const gBranches = el('g', { class: 'c-branches' }, svg);
  const gBrain = el('g', { class: 'c-brain' }, svg);
  const gHubs = el('g', { class: 'c-hubs' }, svg);
  const gLabels = el('g', { class: 'c-labels' }, svg);
  const gStamp = el('g', { class: 'c-stamp' }, svg);

  const hubs = DEPTS.map((d, i) => {
    const a = rad(START + i * STEP);
    return { d, i, a, x: CX + R * Math.cos(a), y: CY + R * Math.sin(a), lx: LABEL_POS[i][0], ly: LABEL_POS[i][1] };
  });
  const boxes = hubs.map(h => {
    const w = h.d.label.length * 21 + 40;
    return { x0: h.lx - w / 2, x1: h.lx + w / 2, y0: h.ly - 40, y1: h.ly + 36 };
  });
  const ok = (x, y, self) => {
    if (x < 30 || x > W - 30 || y < 30 || y > H - 70) return false;
    const dc = Math.hypot(x - CX, y - CY);
    if (dc < 165 || dc > 480) return false;
    if (boxes.some(b => x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1)) return false;
    return !hubs.some(h => h !== self && Math.hypot(x - h.x, y - h.y) < 70);
  };

  // --- Brain -----------------------------------------------------------------
  const core = el('g', { class: 'brain-core' }, gBrain);
  const r = rng(42);
  const gauss = () => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const pts = [];
  for (let k = 0; k < 520; k++) {
    let px, py;
    do { px = gauss() * 44; py = gauss() * 44; } while (Math.hypot(px, py) > 112);
    pts.push([CX + px, CY + py]);
  }
  for (let k = 0; k < 30; k++) {
    const [px, py] = pts[Math.floor(r() * pts.length)];
    el('line', { x1: CX, y1: CY, x2: px, y2: py, class: 'brain-ray' }, core);
  }
  pts.forEach(([px, py], k) => {
    const t = r();
    const fill = t < .72 ? '#E8E4F4' : t < .86 ? '#F0B7C8' : t < .95 ? '#F4D8A6' : DEPTS[k % 7].color;
    el('circle', { cx: px.toFixed(1), cy: py.toFixed(1), r: (0.7 + r() * 1.7).toFixed(2), fill, class: k % 9 === 0 ? 'twinkle' : '' }, core);
  });
  el('circle', { cx: CX, cy: CY, r: 9, fill: '#F0B7C8', opacity: '.85', filter: 'url(#soft)' }, core);
  el('circle', { cx: CX, cy: CY, r: 3.5, fill: '#FFF7F2' }, core);
  const brainRing = el('circle', { cx: CX, cy: CY, r: 128, class: 'brain-ring' }, gBrain);

  // --- Hubs, branches, labels --------------------------------------------------
  const nodes = {};
  hubs.forEach(h => {
    const { d } = h;
    const col = d.color;
    // connector to the brain
    const ex = CX + 124 * Math.cos(h.a), ey = CY + 124 * Math.sin(h.a);
    const link = el('line', { x1: h.x - (HUB + 6) * Math.cos(h.a), y1: h.y - (HUB + 6) * Math.sin(h.a), x2: ex, y2: ey, stroke: col, class: 'c-link' }, gLinks);

    // branches fanning outward
    const rr = rng(1000 + h.i * 97);
    const gB = el('g', { class: 'c-branch-set' }, gBranches);
    const branches = [];
    const n = 6;
    for (let b = 0; b < n; b++) {
      const g = el('g', { class: 'c-branch' }, gB);
      let a0 = h.a + rad(150) * (b / (n - 1) - 0.5) + rad((rr() - .5) * 12);
      let px = h.x + (HUB + 2) * Math.cos(a0), py = h.y + (HUB + 2) * Math.sin(a0);
      const segs = 2 + Math.floor(rr() * 3);
      for (let s = 0; s < segs; s++) {
        let placed = false;
        for (let tries = 0; tries < 5 && !placed; tries++) {
          const a = a0 + rad((rr() - .5) * 64);
          const len = (s === 0 ? 34 : 40) + rr() * 36;
          const nx = px + len * Math.cos(a), ny = py + len * Math.sin(a);
          if (!ok(nx, ny, h)) continue;
          el('line', { x1: px.toFixed(1), y1: py.toFixed(1), x2: nx.toFixed(1), y2: ny.toFixed(1), class: 'br-line' }, g);
          const kind = s === 0 ? 'lead' : rr() < .22 ? 'hollow' : rr() < .2 ? 'small' : 'star';
          el('circle', {
            cx: nx.toFixed(1), cy: ny.toFixed(1),
            r: kind === 'lead' ? 3.2 : kind === 'small' ? 3 : kind === 'hollow' ? 5 : 4.8,
            class: `br-dot br-${kind}`, ...(kind === 'lead' ? { fill: col } : {}),
          }, g);
          px = nx; py = ny; a0 = a; placed = true;
        }
        if (!placed) break;
      }
      branches.push(g);
    }

    // hub
    const hub = el('g', { class: 'c-hub', tabindex: 0, role: 'button', 'data-id': d.id, 'aria-label': `${d.name}: waiting` }, gHubs);
    el('circle', { cx: h.x, cy: h.y, r: HUB + 20, class: 'hub-hit' }, hub);
    el('circle', { cx: h.x, cy: h.y, r: HUB + 9, stroke: col, class: 'hub-halo' }, hub);
    el('circle', { cx: h.x, cy: h.y, r: HUB, stroke: col, class: 'hub-ring' }, hub);
    const icon = el('g', { transform: `translate(${h.x - 11} ${h.y - 11}) scale(0.92)`, fill: 'none', stroke: col, 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, hub);
    icon.innerHTML = d.icon;
    const badge = el('g', { class: 'hub-badge', transform: `translate(${h.x + 20} ${h.y - 20})` }, hub);
    el('circle', { r: 9 }, badge);
    const glyph = el('path', { d: '' }, badge);

    // label
    const lab = el('g', { class: 'c-label' }, gLabels);
    const t1 = el('text', { x: h.lx, y: h.ly, class: 'lab-name' }, lab);
    t1.textContent = d.label.toUpperCase();
    const t2 = el('text', { x: h.lx, y: h.ly + 27, class: 'lab-sub' }, lab);
    t2.textContent = d.sub;

    hub.addEventListener('click', () => onSelect?.(d.id));
    hub.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(d.id); } });
    const show = () => showTip(d.id, h);
    hub.addEventListener('mouseenter', show);
    hub.addEventListener('focus', show);
    hub.addEventListener('mouseleave', hideTip);
    hub.addEventListener('blur', hideTip);

    nodes[d.id] = { h, hub, link, branches, gB, lab, t2, glyph, badge, state: 'idle' };
  });

  // decision stamp over the brain
  const stampBg = el('rect', { class: 'stamp-bg', rx: 4 }, gStamp);
  const stampText = el('text', { x: CX, y: CY + 6, class: 'stamp-text' }, gStamp);

  function showTip(id, h) {
    if (!tipEl || !tipContent) return;
    const html = tipContent(id);
    if (!html) return;
    tipEl.innerHTML = html;
    tipEl.hidden = false;
    const box = svg.getBoundingClientRect();
    const s = box.width / W;
    const wrap = svg.parentElement.getBoundingClientRect();
    const x = box.left - wrap.left + h.x * s;
    const y = box.top - wrap.top + h.y * s;
    const tw = tipEl.offsetWidth;
    tipEl.style.left = `${Math.max(8, Math.min(wrap.width - tw - 8, x - tw / 2))}px`;
    tipEl.style.top = `${y + 36 * s + 10}px`;
  }
  function hideTip() { if (tipEl) tipEl.hidden = true; }

  const api = {
    setDept(id, state, v) {
      const n = nodes[id];
      n.state = state;
      n.hub.dataset.state = state;
      n.gB.dataset.state = state;
      n.lab.dataset.state = state;
      n.link.dataset.state = state;
      n.hub.dataset.stance = v?.stance || '';
      n.link.dataset.stance = v?.stance || '';
      const d = n.h.d;
      if (state === 'done' && v) {
        n.glyph.setAttribute('d', GLYPH[v.stance]);
        n.t2.textContent = `${v.stance} · ${v.confidence}% confident`;
        n.hub.setAttribute('aria-label', `${d.name}: ${v.stance}, ${v.confidence}% confident. Open verdict`);
        const lit = Math.max(1, Math.round((v.confidence / 100) * n.branches.length));
        n.branches.forEach((b, k) => b.classList.toggle('lit', k < lit));
      } else {
        n.glyph.setAttribute('d', '');
        n.branches.forEach(b => b.classList.remove('lit'));
        n.t2.textContent = state === 'off' ? 'not on this committee'
          : state === 'pending' ? 'deliberating…'
          : state === 'error' ? 'no verdict — retry' : d.sub;
        n.hub.setAttribute('aria-label', `${d.name}: ${n.t2.textContent}`);
      }
    },
    setBrain(state, decision) {
      gBrain.dataset.state = state;
      gStamp.dataset.state = decision ? 'on' : 'off';
      if (decision) {
        stampText.textContent = decision.label.toUpperCase();
        gStamp.dataset.tone = decision.tone;
        const w = decision.label.length * 13.5 + 44;
        Object.entries({ x: CX - w / 2, y: CY - 20, width: w, height: 38 }).forEach(([k, v]) => stampBg.setAttribute(k, v));
      }
      brainRing.dataset.tone = decision?.tone || '';
    },
    setConflicts(pairs) {
      gConf.innerHTML = '';
      const involved = new Set();
      pairs.forEach(({ a, b, issue }) => {
        const A = nodes[a]?.h, B = nodes[b]?.h;
        if (!A || !B) return;
        involved.add(a); involved.add(b);
        const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
        const qx = CX + (mx - CX) * 0.15, qy = CY + (my - CY) * 0.15;
        const p = el('path', { d: `M${A.x} ${A.y} Q${qx} ${qy} ${B.x} ${B.y}`, class: 'conf-arc' }, gConf);
        const t = el('title', {}, p); t.textContent = issue;
        const midx = 0.25 * A.x + 0.5 * qx + 0.25 * B.x, midy = 0.25 * A.y + 0.5 * qy + 0.25 * B.y;
        el('circle', { cx: midx, cy: midy, r: 5, class: 'conf-mid' }, gConf);
      });
      svg.classList.toggle('focus-conflict', pairs.length > 0);
      Object.entries(nodes).forEach(([id, n]) => {
        const dim = pairs.length > 0 && !involved.has(id);
        [n.hub, n.gB, n.lab, n.link].forEach(e => e.classList.toggle('dim', dim));
      });
    },
    reset() {
      DEPTS.forEach(d => api.setDept(d.id, nodes[d.id].state === 'off' ? 'off' : 'idle'));
      api.setBrain('idle', null);
      api.setConflicts([]);
    },
    hideTip,
  };
  return api;
}
