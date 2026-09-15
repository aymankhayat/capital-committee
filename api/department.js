// POST /api/department — one department's independent verdict.
// The browser fires one request per department in parallel, so each persona
// runs in its own serverless invocation and cards resolve as they land.
import { DEPARTMENTS, VERDICT_SCHEMA } from './_lib/personas.js';
import { structuredCall, guard, send, clip, HttpError, MODELS } from './_lib/llm.js';

export const config = { maxDuration: 90 };

export default function handler(req, res) {
  return send(res, async () => {
    guard(req, { max: 80 });
    const { dept, decision, context, analysis, tier } = req.body || {};
    const persona = DEPARTMENTS.find(d => d.id === dept);
    if (!persona) throw new HttpError(400, 'bad_dept', 'Unknown department.');
    if (!decision || String(decision).trim().length < 12) throw new HttpError(400, 'bad_decision', 'Describe the decision in at least a sentence.');

    const user = [
      `<proposal>\n${clip(decision, 2000)}\n</proposal>`,
      `<company_context>\n${clip(context || 'Not specified. Assume a mid-size GCC industrial company.', 1500)}\n</company_context>`,
      analysis ? `<committee_pack>\n${clip(analysis, 2500)}\n</committee_pack>` : '',
      'Give your department\'s verdict for the committee minutes.',
    ].filter(Boolean).join('\n\n');

    const model = tier === 'economy' ? MODELS.sonnet : MODELS.opus;
    const { data, meta } = await structuredCall({
      model, system: persona.system, user, schema: VERDICT_SCHEMA, effort: 'medium', maxTokens: 6000,
    });
    data.confidence = Math.max(0, Math.min(100, Math.round(data.confidence)));
    data.reasons = (data.reasons || []).slice(0, 3);
    return { dept, verdict: data, meta };
  });
}
