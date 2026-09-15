// Deterministic committee arithmetic. LLMs are unreliable at weighted sums
// across seven inputs, so the lean is computed here, live, and handed to the Brain.
import { byId } from './departments.js';

export const STANCE_SCORE = { support: 1, conditional: 0.35, oppose: -1 };

export const DECISIONS = {
  go: { label: 'Go', tone: 'good' },
  go_with_conditions: { label: 'Go with conditions', tone: 'good' },
  pilot_first: { label: 'Pilot first', tone: 'warn' },
  defer: { label: 'Defer', tone: 'warn' },
  no_go: { label: 'No-go', tone: 'bad' },
};

export function weightedScore(verdicts, weights) {
  let num = 0, den = 0;
  for (const [id, v] of Object.entries(verdicts)) {
    const w = weights[id] ?? 1;
    if (!v || !w) continue;
    num += w * STANCE_SCORE[v.stance] * (v.confidence / 100);
    den += w;
  }
  return den ? num / den : 0;
}

// RAPID "Agree" vetoes: a Legal red line, or a high-severity flag from Legal or
// Operations (safety), can't be averaged away by enthusiastic departments.
export function vetoes(verdicts, weights) {
  const out = [];
  for (const [id, v] of Object.entries(verdicts)) {
    if (!v || !(weights[id] ?? 1)) continue;
    const high = v.risk_flag?.severity === 'high' && (id === 'legal' || id === 'operations');
    if (v.red_line || high) out.push({ dept: id, department: byId[id].name, issue: v.risk_flag?.title || 'Red line', red_line: !!v.red_line });
  }
  return out;
}

export function lean(score, vetoList = []) {
  let id = score >= 0.45 ? 'go' : score >= 0.15 ? 'go_with_conditions' : score > -0.15 ? 'pilot_first' : score > -0.45 ? 'defer' : 'no_go';
  const capped = vetoList.length > 0 && id === 'go';
  if (capped) id = 'go_with_conditions';
  if (vetoList.some(v => v.red_line) && (id === 'go_with_conditions')) id = 'defer';
  return { id, ...DECISIONS[id], capped };
}

export const fmtScore = s => (s >= 0 ? '+' : '−') + Math.abs(s).toFixed(2);
