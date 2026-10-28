import fs from 'node:fs/promises';
import path from 'node:path';

const origin = process.env.MANASFLOW_SOURCE_ORIGIN;
if (!origin) throw new Error('Set MANASFLOW_SOURCE_ORIGIN before collecting reference assets.');
await fs.mkdir('temp', { recursive: true });
let html;
try { html = await fs.readFile('temp/manasflow-source.html', 'utf8'); }
catch {
  const response = await fetch(origin);
  if (!response.ok) throw new Error(`Source page HTTP ${response.status}`);
  html = await response.text();
  await fs.writeFile('temp/manasflow-source.html', html);
}
const dir = 'public/sites/manasflow';
await fs.mkdir(`${dir}/fonts`, { recursive: true });
await fs.mkdir('temp/ay-reference', { recursive: true });
const decode = (s) => s.replaceAll('&amp;', '&');
const queue = new Map();
const excluded = /logo|favicon|og-image|faces\/|team\/|testimonial|walid|adel|david|arnaux|boulanouar|dahani|headshot|founder|profile|portrait/i;
for (const match of html.matchAll(/<img\b[^>]*>/g)) {
  const attrs = Object.fromEntries([...match[0].matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], decode(m[2])]));
  let src = attrs.src;
  if (!src) continue;
  if (src.startsWith('/_next/image')) src = new URL(src, origin).searchParams.get('url');
  if (!src || excluded.test(src)) continue;
  const url = new URL(src, origin);
  const name = url.hostname === 'img.logo.dev' ? `tool-${url.pathname.slice(1).replaceAll('.', '-')}.png` : path.basename(url.pathname);
  queue.set(url.href, { local: `${dir}/${name}`, alt: attrs.alt || '' });
}
for (const m of html.matchAll(/<link\b[^>]*>/g)) {
  const href = m[0].match(/href="([^"]+)"/)?.[1];
  if (!href) continue;
  if (/as="font"/.test(m[0])) queue.set(new URL(decode(href), origin).href, { local: `${dir}/fonts/${path.basename(href)}` });
  if (/rel="stylesheet"/.test(m[0])) queue.set(new URL(decode(href), origin).href, { local: `temp/ay-reference/${path.basename(href.split('?')[0])}` });
}
// Bundles are inspection evidence only; never imported into the implementation.
for (const m of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
  if (/chunks\/(?:app\/(?:page|layout)|(?:[\w]+)-)/.test(m[1]) && !/4bd1b696|polyfills|main-app|webpack|9da6db1e/.test(m[1])) queue.set(new URL(decode(m[1]), origin).href, { local: `temp/ay-reference/${path.basename(m[1].split('?')[0])}` });
}
const entries = [...queue.entries()];
for (const name of ['hero-pixel-mountains.webp', 'cursor-agent.webm', 'n8n-hero.webm', 'make-hero.webm']) {
  entries.push([`${origin}/${name}`, { local: `${dir}/${name}` }]);
}
for (const name of ['browserbase-consulting.webp', 'ai-implementation-browserbase.webp', 'ai-training-placement-browserbase.webp']) {
  entries.push([`${origin}/images/generated/${name}`, { local: `${dir}/${name}` }]);
}
entries.push([`${origin}/bg-mountain-pixel.webp`, { local: `${dir}/bg-mountain-pixel.webp` }]);
let cursor = 0;
const results = [];
await Promise.all(Array.from({ length: 8 }, async () => {
  while (cursor < entries.length) {
    const [url, item] = entries[cursor++];
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(item.local, buffer);
      results.push({ url, ...item, bytes: buffer.length, type: response.headers.get('content-type') });
    } catch (error) { results.push({ url, ...item, error: String(error) }); }
  }
}));
await fs.writeFile('temp/manasflow-asset-map.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify({ downloaded: results.filter(x => !x.error).length, failed: results.filter(x => x.error) }, null, 2));
