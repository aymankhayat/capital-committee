// Local dev server: serves the static site and routes /api/* to the same
// handlers Vercel runs in production. Usage: npm run dev
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 5173);

// Minimal .env.local loader so the API key never has to be typed into a shell.
for (const f of ['.env.local', '.env']) {
  const p = path.join(root, f);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};

function adapt(res) {
  res.status = code => { res.statusCode = code; return res; };
  res.json = obj => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); return res; };
  return res;
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith('/api/')) {
      const name = url.pathname.slice(5).replace(/[^a-z0-9-]/gi, '');
      const file = path.join(root, 'api', `${name}.js`);
      if (!existsSync(file)) { res.statusCode = 404; return res.end('Not found'); }
      let body = '';
      for await (const chunk of req) body += chunk;
      req.body = body ? JSON.parse(body) : {};
      req.query = Object.fromEntries(url.searchParams);
      const mod = await import(pathToFileURL(file).href + `?t=${Date.now()}`);
      return await mod.default(req, adapt(res));
    }
    let p = path.join(root, decodeURIComponent(url.pathname));
    if (!p.startsWith(root)) { res.statusCode = 403; return res.end(); }
    if ((await stat(p).catch(() => null))?.isDirectory()) p = path.join(p, 'index.html');
    const data = await readFile(p);
    res.setHeader('Content-Type', types[path.extname(p)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store'); // dev: always serve the file on disk
    res.end(data);
  } catch (e) {
    if (e.code === 'ENOENT') { res.statusCode = 404; return res.end('Not found'); }
    console.error(e);
    res.statusCode = 500; res.end(String(e.message || e));
  }
}).listen(port, () => console.log(`Dev server on http://localhost:${port}`));
