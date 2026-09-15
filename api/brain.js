// POST /api/brain — the Company Brain synthesis. Fired by the browser only
// after every department request has settled.
import { DEPARTMENTS, BRAIN_SYSTEM, BRAIN_SCHEMA } from './_lib/personas.js';
import { structuredCall, guard, send, clip, HttpError, MODELS } from './_lib/llm.js';

export const config = { maxDuration: 120 };

export default function handler(req, res) {
  return send(res, async () => {
    guard(req, { max: 40 });
    const { decision, context, analysis, verdicts, weights, score, vetoes } = req.body || {};
    if (!decision || !verdicts || typeof verdicts !== 'object') throw new HttpError(400, 'bad_input', 'Missing decision or department verdicts.');

    const board = DEPARTMENTS.map(d => {
      const v = verdicts[d.id];
      const w = Number(weights?.[d.id] ?? 1);
      if (!v || w === 0) return { department: d.name, status: 'absent' };
      return {
        department: d.name, weight: Math.round(w * 100) / 100,
        stance: v.stance, confidence: v.confidence, headline: clip(v.headline, 300),
        reasons: (v.reasons || []).map(r => clip(r, 300)), risk_flag: v.risk_flag,
        conditions: (v.conditions || []).map(c => clip(c, 300)), key_metric: v.key_metric, red_line: !!v.red_line,
      };
    });

    const user = [
      `<proposal>\n${clip(decision, 2000)}\n</proposal>`,
      `<company_context>\n${clip(context || 'Not specified. Assume a mid-size GCC industrial company.', 1500)}\n</company_context>`,
      analysis ? `<committee_pack>\n${clip(analysis, 2500)}\n</committee_pack>` : '',
      `<department_verdicts>\n${JSON.stringify(board, null, 1)}\n</department_verdicts>`,
      `<weighted_score>${Number(score ?? 0).toFixed(3)} on a -1 (unanimous oppose) to +1 (unanimous support) scale, computed as sum(weight × stance × confidence) / sum(weight) with support=+1, conditional=+0.35, oppose=-1.</weighted_score>`,
      `<veto_flags>${JSON.stringify(vetoes || [])}</veto_flags>`,
      'Chair the committee and return your decision.',
    ].filter(Boolean).join('\n\n');

    // The executive layer always runs on the stronger model, whatever tier the departments used.
    const { data, meta } = await structuredCall({
      model: MODELS.opus, system: BRAIN_SYSTEM, user, schema: BRAIN_SCHEMA, effort: 'high', maxTokens: 12000,
    });
    data.confidence = Math.max(0, Math.min(100, Math.round(data.confidence)));
    return { brain: data, meta };
  });
}
