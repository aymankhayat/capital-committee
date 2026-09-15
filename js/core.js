// Shared app state, the API client, and small UI helpers.
import { store } from './store.js';

export const app = {
  live: false,
  passcodeRequired: false,
  tier: store.get('tier', 'standard'),
  cost: 0,
};
try { app.cost = Number(sessionStorage.getItem('cc.cost')) || 0; } catch { /* storage blocked */ }

export const bus = new EventTarget();
export const emit = (type, detail) => bus.dispatchEvent(new CustomEvent(type, { detail }));
export const on = (type, fn) => bus.addEventListener(type, e => fn(e.detail));

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export class ApiError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

function passcode() {
  try { return sessionStorage.getItem('cc.passcode') || ''; } catch { return ''; }
}
export function setPasscode(v) { try { sessionStorage.setItem('cc.passcode', v); } catch { /* ignore */ } }

export async function post(path, body) {
  let res;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-app-passcode': passcode() },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'network', 'Could not reach the server. Check your connection.');
  }
  let data = null;
  try { data = await res.json(); } catch { /* non-JSON (static host 404) */ }
  if (!res.ok) throw new ApiError(res.status, data?.error || 'http', data?.message || `Server returned ${res.status}.`);
  if (data?.meta?.cost_usd) addCost(data.meta.cost_usd);
  return data;
}

export function addCost(usd) {
  app.cost += usd;
  try { sessionStorage.setItem('cc.cost', String(app.cost)); } catch { /* ignore */ }
  const el = $('#sessionCost');
  if (el) el.textContent = `$${app.cost.toFixed(3)} spent`;
}

let toastTimer;
export function toast(msg, ms = 4200) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, ms);
}

export const fmt = {
  usd(v, digits) {
    const a = Math.abs(v), s = v < 0 ? '−' : '';
    if (a >= 1e9) return `${s}$${(a / 1e9).toFixed(digits ?? 2)}B`;
    if (a >= 1e6) return `${s}$${(a / 1e6).toFixed(digits ?? 2)}M`;
    if (a >= 1e3) return `${s}$${(a / 1e3).toFixed(digits ?? 0)}k`;
    return `${s}$${a.toFixed(digits ?? 0)}`;
  },
  signedUsd(v, d) { return (v > 0 ? '+' : '') + fmt.usd(v, d); },
  pct(v, d = 1) { return v == null || !isFinite(v) ? 'n/a' : `${(v * 100).toFixed(d)}%`; },
  yrs(v, d = 1) { return v == null ? 'not reached' : `${v.toFixed(d)} yrs`; },
  int(v) { return Math.round(v).toLocaleString('en-US'); },
  date(ts) { return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); },
};
