import { test } from 'node:test';
import assert from 'node:assert/strict';
import { npv, irr, payback, evaluate, tornado, breakeven, signChanges, mirr } from '../js/finance.js';
import { PRESETS } from '../js/presets.js';

const close = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} not within ${tol} of ${b}`);

test('textbook NPV / IRR', () => {
  const flows = [-1000, 300, 400, 500];
  close(npv(0.10, flows), 1000 * 0 + (300 / 1.1 + 400 / 1.21 + 500 / 1.331 - 1000), 1e-9);
  close(irr(flows), 0.0890, 0.0005);          // NPV @10% is −21, so IRR < 10%
  close(npv(irr(flows), flows), 0, 1e-6);
  close(payback(flows), 2.6, 1e-9);
  assert.equal(irr([100, 200]), null); // no sign change → no IRR
  assert.equal(signChanges([-5, 3, 3, -1, 2]), 3);
  close(mirr(flows, 0.1, 0.1), Math.cbrt(1303 / 1000) - 1, 1e-9); // FV of inflows @10% = 1,303
});

// Research sanity checks (docs/RESEARCH.md §2)
test('solar preset matches research sanity check', () => {
  const r = evaluate(PRESETS.find(p => p.id === 'solar').p);
  close(r.npv / 1e6, 1.7, 0.25);
  close(r.irr, 0.112, 0.006);
  close(r.payback, 8.1, 0.6);
});

test('waste-heat preset matches research sanity check', () => {
  const r = evaluate(PRESETS.find(p => p.id === 'whr').p);
  close(r.npv / 1e6, 1.9, 0.35);
  close(r.irr, 0.126, 0.008);
});

test('tornado is sorted by swing and breakeven lies inside capex range', () => {
  const pr = PRESETS.find(p => p.id === 'whr');
  const t = tornado(pr.p, pr.drivers);
  for (let i = 1; i < t.bars.length; i++) assert.ok(t.bars[i - 1].swing >= t.bars[i].swing);
  const be = breakeven(pr.p, 'capex', 7_500_000, 15_000_000);
  assert.ok(be > 10_000_000 && be < 13_000_000, `breakeven capex ${be}`);
});

test('battery preset is the negative-NPV example', () => {
  assert.ok(evaluate(PRESETS.find(p => p.id === 'bess').p).npv < 0);
});
