// Server-side Claude caller. The API key lives only in the server environment
// (Vercel env var / .env.local) and never reaches the browser.
import Anthropic from '@anthropic-ai/sdk';

export const MODELS = {
  opus: 'claude-opus-5',
  sonnet: 'claude-sonnet-5',
};

// USD per million tokens. Cache reads bill at 0.1x input, 5-minute cache writes at 1.25x.
const PRICES = {
  'claude-opus-5': { in: 5, out: 25 },
  'claude-sonnet-5': { in: 2, out: 10 },
  'claude-opus-4-8': { in: 5, out: 25 },
};

export class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

let client;
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) throw new HttpError(503, 'no_key', 'The server has no ANTHROPIC_API_KEY configured.');
  client ??= new Anthropic({ maxRetries: 2, timeout: 90_000 });
  return client;
}

export function costOf(model, usage) {
  const p = PRICES[model] || PRICES['claude-opus-5'];
  const input = usage.input_tokens || 0;
  const cacheRead = usage.cache_read_input_tokens || 0;
  const cacheWrite = usage.cache_creation_input_tokens || 0;
  const output = usage.output_tokens || 0;
  return (input * p.in + cacheRead * p.in * 0.1 + cacheWrite * p.in * 1.25 + output * p.out) / 1e6;
}

// One structured-output call. The system prompt is cached (stable per persona),
// the proposal goes in the user turn so the cached prefix stays byte-identical.
export async function structuredCall({ model, system, user, schema, effort = 'medium', maxTokens = 6000 }) {
  const c = getClient();
  const params = {
    model,
    max_tokens: maxTokens,
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: user }],
    thinking: { type: 'adaptive' },
    output_config: { effort, format: { type: 'json_schema', schema } },
  };

  let res;
  try {
    // Opus 5 can decline on safety classifiers; server-side fallback re-runs the
    // request on Anthropic's recommended model instead of returning a refusal.
    res = model === MODELS.opus && process.env.DISABLE_FALLBACKS !== '1'
      ? await c.beta.messages.create({ ...params, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' })
      : await c.messages.create(params);
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) throw new HttpError(429, 'rate_limited', 'Claude API rate limit reached. Wait a moment and run again.');
    if (e instanceof Anthropic.AuthenticationError) throw new HttpError(503, 'bad_key', 'The server API key was rejected.');
    if (e instanceof Anthropic.BadRequestError) throw new HttpError(400, 'bad_request', e.message);
    if (e instanceof Anthropic.APIConnectionError) throw new HttpError(502, 'network', 'Could not reach the Claude API.');
    if (e instanceof Anthropic.APIError) throw new HttpError(502, 'upstream', e.message);
    throw e;
  }

  if (res.stop_reason === 'refusal') throw new HttpError(422, 'refusal', 'The model declined this proposal. Rephrase it as a business decision.');
  if (res.stop_reason === 'max_tokens') throw new HttpError(502, 'truncated', 'The response was cut off. Run again.');

  const text = res.content.filter(b => b.type === 'text').map(b => b.text).join('');
  let data;
  try { data = JSON.parse(text); } catch { throw new HttpError(502, 'bad_json', 'The model returned malformed JSON.'); }

  return {
    data,
    meta: {
      model: res.model,
      input_tokens: res.usage.input_tokens,
      output_tokens: res.usage.output_tokens,
      cache_read_tokens: res.usage.cache_read_input_tokens || 0,
      cost_usd: costOf(res.model, res.usage),
    },
  };
}

// --- request guards shared by every endpoint -------------------------------

const hits = new Map(); // best-effort per-instance limiter; serverless instances don't share it
export function guard(req, { max = 40, windowMs = 10 * 60_000 } = {}) {
  if (req.method !== 'POST') throw new HttpError(405, 'method', 'Use POST.');
  const need = process.env.APP_PASSCODE;
  if (need && req.headers['x-app-passcode'] !== need) throw new HttpError(401, 'passcode', 'This deployment needs a passcode for live runs.');
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'local').split(',')[0].trim();
  const now = Date.now();
  const list = (hits.get(ip) || []).filter(t => now - t < windowMs);
  if (list.length >= max) throw new HttpError(429, 'local_rate', 'Too many live calls from this address. Try again in a few minutes.');
  list.push(now); hits.set(ip, list);
}

export function send(res, fn) {
  return fn().then(
    out => res.status(200).json(out),
    e => {
      const status = e.status || 500;
      if (status >= 500 && e.code !== 'no_key') console.error(e);
      res.status(status).json({ error: e.code || 'server', message: e.message || 'Server error' });
    },
  );
}

export function clip(s, n) { return String(s ?? '').slice(0, n); }
