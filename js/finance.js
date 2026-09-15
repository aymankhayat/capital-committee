// Engineering-economics engine. Pure functions, no DOM.
// Conventions: end-of-year discounting, year 0 = investment date,
// cash flows are nominal and after tax unless the preset says otherwise.

export function npv(rate, flows) {
  let v = 0;
  for (let t = 0; t < flows.length; t++) v += flows[t] / Math.pow(1 + rate, t);
  return v;
}

// IRR by bracketed bisection with a Newton polish. Returns null when the
// flows never change sign (no IRR) — callers must render that as "n/a".
export function irr(flows) {
  const signChanges = flows.slice(1).reduce((n, f, i) => n + (Math.sign(f) !== Math.sign(flows[i]) && f !== 0 ? 1 : 0), 0);
  if (signChanges === 0) return null;
  let lo = -0.99, hi = 1.0;
  let fLo = npv(lo, flows), fHi = npv(hi, flows);
  while (fLo * fHi > 0 && hi < 100) { hi *= 2; fHi = npv(hi, flows); }
  if (fLo * fHi > 0) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fMid = npv(mid, flows);
    if (Math.abs(fMid) < 1e-7) return mid;
    if (fLo * fMid < 0) { hi = mid; fHi = fMid; } else { lo = mid; fLo = fMid; }
  }
  return (lo + hi) / 2;
}

// Modified IRR: reinvest positives at `reinvest`, finance negatives at `finance`.
export function mirr(flows, finance, reinvest) {
  const n = flows.length - 1;
  let pvNeg = 0, fvPos = 0;
  flows.forEach((f, t) => {
    if (f < 0) pvNeg += f / Math.pow(1 + finance, t);
    else fvPos += f * Math.pow(1 + reinvest, n - t);
  });
  if (pvNeg === 0 || fvPos === 0) return null;
  return Math.pow(fvPos / -pvNeg, 1 / n) - 1;
}

// Payback with linear interpolation inside the crossover year.
// discounted=true uses the discount rate; returns null if never recovered.
export function payback(flows, rate = 0, discounted = false) {
  let cum = 0;
  for (let t = 0; t < flows.length; t++) {
    const f = discounted ? flows[t] / Math.pow(1 + rate, t) : flows[t];
    const prev = cum;
    cum += f;
    if (t > 0 && prev < 0 && cum >= 0) return t - 1 + (-prev / f);
  }
  return null;
}

// PI = PV(CF1..N) / |CF0| = 1 + NPV/|CF0|
export function profitabilityIndex(rate, flows) {
  const pvOut = -flows[0];
  return pvOut > 0 ? 1 + npv(rate, flows) / pvOut : null;
}

// Levelized cost of the output unit (e.g. $/kWh) when energyY1 is given.
export function lcoe(p) {
  if (!p.energyY1) return null;
  let costPv = p.capex, energyPv = 0;
  for (let t = 1; t <= Math.round(p.life); t++) {
    const d = Math.pow(1 + p.wacc, t);
    const opex = p.opex * Math.pow(1 + (p.opexEsc || 0), t - 1);
    const repl = (p.replacements || []).filter(r => r.year === t).reduce((s, r) => s + r.cost, 0);
    costPv += (opex + repl) / d;
    energyPv += p.energyY1 * (p.volumeMult ?? 1) * Math.pow(1 - (p.degradation || 0), t - 1) * (t === 1 ? (p.rampY1 ?? 1) : 1) / d;
  }
  return costPv / energyPv;
}

export function signChanges(flows) {
  let n = 0, prev = 0;
  for (const f of flows) { if (f === 0) continue; if (prev && Math.sign(f) !== Math.sign(prev)) n++; prev = f; }
  return n;
}

// Build a year-by-year cash-flow schedule from a project definition.
// p: { capex, life, revenue (yr-1 savings/revenue at steady state), growth, opex (yr-1),
//      opexEsc, degradation, rampY1, priceMult, volumeMult, taxRate, deprYears,
//      lossCredit, salvagePct, replacements: [{year, cost}] }
// priceMult / volumeMult exist so the tornado can swing tariff and yield separately
// while the user still types one "year-1 savings" figure.
export function schedule(p) {
  const rows = [];
  const life = Math.round(p.life);
  const deprAnnual = p.deprYears > 0 ? p.capex / p.deprYears : 0;
  for (let t = 0; t <= life; t++) {
    if (t === 0) {
      rows.push({ year: 0, revenue: 0, opex: 0, ebitda: 0, tax: 0, capex: -p.capex, net: -p.capex });
      continue;
    }
    const perf = Math.pow(1 - (p.degradation || 0), t - 1);
    const ramp = t === 1 ? (p.rampY1 ?? 1) : 1;
    const revenue = p.revenue * (p.priceMult ?? 1) * (p.volumeMult ?? 1)
      * Math.pow(1 + p.growth, t - 1) * perf * ramp;
    const opex = p.opex * Math.pow(1 + (p.opexEsc || 0), t - 1);
    const ebitda = revenue - opex;
    const depr = t <= p.deprYears ? deprAnnual : 0;
    // Default: a loss year creates a tax credit (corporate-owned asset offsetting group profit).
    const taxable = (ebitda - depr) * (p.taxRate || 0);
    const tax = p.lossCredit === false ? Math.max(0, taxable) : taxable;
    let capex = 0;
    (p.replacements || []).forEach(r => { if (r.year === t) capex -= r.cost; });
    if (t === life && p.salvagePct) capex += p.capex * p.salvagePct;
    rows.push({ year: t, revenue, opex: -opex, ebitda, tax: -tax, capex, net: ebitda - tax + capex });
  }
  return rows;
}

export function evaluate(p) {
  const rows = schedule(p);
  const flows = rows.map(r => r.net);
  return {
    rows, flows,
    npv: npv(p.wacc, flows),
    irr: irr(flows),
    mirr: mirr(flows, p.wacc, p.wacc),
    payback: payback(flows),
    discountedPayback: payback(flows, p.wacc, true),
    pi: profitabilityIndex(p.wacc, flows),
  };
}

// Tornado: swing each driver between its low and high value, holding the rest
// at base. Sorted by absolute swing, largest first (the consulting convention).
export function tornado(p, drivers) {
  const base = evaluate(p).npv;
  const bars = drivers.map(d => {
    const lowNpv = evaluate({ ...p, [d.key]: d.low }).npv;
    const highNpv = evaluate({ ...p, [d.key]: d.high }).npv;
    return { ...d, lowNpv, highNpv, swing: Math.abs(highNpv - lowNpv) };
  });
  bars.sort((a, b) => b.swing - a.swing);
  return { base, bars };
}

// Value of a single driver that makes NPV = 0, found by bisection across [lo, hi].
export function breakeven(p, key, lo, hi) {
  const f = x => evaluate({ ...p, [key]: x }).npv;
  let fLo = f(lo), fHi = f(hi);
  if (fLo * fHi > 0) return null;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2, fm = f(mid);
    if (fLo * fm <= 0) { hi = mid; fHi = fm; } else { lo = mid; fLo = fm; }
  }
  return (lo + hi) / 2;
}
