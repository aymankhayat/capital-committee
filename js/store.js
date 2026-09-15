// localStorage wrapper. Storage can be missing or throw (private windows,
// blocked site data), so every access is guarded and the app works without it.
const NS = 'cc.';

export const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(NS + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(NS + key, JSON.stringify(value)); return true; } catch { return false; }
  },
  push(key, item, max = 30) {
    const list = store.get(key, []);
    list.unshift(item);
    store.set(key, list.slice(0, max));
    return list;
  },
};

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
