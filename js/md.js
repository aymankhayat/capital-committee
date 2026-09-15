// Minimal markdown for the case bank: paragraphs, nested lists, tables,
// bold/italic/code. Input is escaped first, so it is safe to inject.
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
}

function table(lines) {
  const rows = lines.filter(l => !/^\s*\|?\s*:?-{2,}/.test(l)).map(l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
  const [head, ...body] = rows;
  return `<div class="md-table"><table><thead><tr>${head.map(h => `<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>${
    body.map(r => `<tr>${r.map((c, i) => `<td${i ? ' class="num"' : ''}>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function list(lines) {
  // Build a nested tree from indentation.
  const root = { children: [], ordered: /^\s*\d+\./.test(lines[0]) };
  const stack = [{ indent: -1, node: root }];
  for (const line of lines) {
    const m = line.match(/^(\s*)(?:[-*]|\d+\.)\s+(.*)$/);
    if (!m) { const last = stack[stack.length - 1].node; if (last.text != null) last.text += ' ' + line.trim(); continue; }
    const indent = m[1].length;
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
    const parent = stack[stack.length - 1].node;
    const node = { text: m[2], children: [], ordered: false };
    if (!parent.children.length) parent.ordered = /^\s*\d+\./.test(line);
    parent.children.push(node);
    stack.push({ indent, node });
  }
  const render = n => {
    const tag = n.ordered ? 'ol' : 'ul';
    return `<${tag}>${n.children.map(c => `<li>${inline(c.text)}${c.children.length ? render(c) : ''}</li>`).join('')}</${tag}>`;
  };
  return render(root);
}

export function md(src) {
  const lines = String(src ?? '').replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.trim().startsWith('```')) {
      const buf = []; i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) buf.push(lines[i++]);
      i++; out.push(`<pre class="md-pre">${esc(buf.join('\n'))}</pre>`); continue;
    }
    if (line.trim().startsWith('|')) {
      const buf = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) buf.push(lines[i++]);
      out.push(table(buf)); continue;
    }
    if (/^\s*(?:[-*]|\d+\.)\s+/.test(line)) {
      const buf = [];
      while (i < lines.length && lines[i].trim() && (/^\s*(?:[-*]|\d+\.)\s+/.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) buf.push(lines[i++]);
      out.push(list(buf)); continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^\s*(?:[-*]|\d+\.)\s+/.test(lines[i]) && !lines[i].trim().startsWith('|')) buf.push(lines[i++].trim());
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('');
}
