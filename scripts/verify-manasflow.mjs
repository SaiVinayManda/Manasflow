import fs from 'node:fs/promises';

const reportDir = 'docs/research/manasflow/site-clone';
const html = await fs.readFile('.next/server/app/index.html', 'utf8');
const allIds = [...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
const ids = new Set(allIds);
const anchorTargets = [...html.matchAll(/href="(?:\/)?#([^"]+)"/g)].map(match => match[1]);
const missingAnchors = [...new Set(anchorTargets.filter(id => !ids.has(id)))];
const duplicateIds = [...new Set(allIds.filter((id, index) => allIds.indexOf(id) !== index))];
const personalMatches = html.match(/walid|boulanouar|dahani|arnaux|team-adel|team-walid|video-testimonials|clients\/faces|contact@|walid@/ig) || [];
const imagePaths = [...new Set([...html.matchAll(/(?:src|href)="(\/sites\/manasflow\/[^"?]+)"/g)].map(match => match[1]))];
const missingAssets = [];
for (const image of imagePaths) {
  try { await fs.access(`public${image}`); }
  catch { missingAssets.push(image); }
}
const routes = [];
const base = process.env.MANASFLOW_PREVIEW_URL;
if (base) {
  for (const pathname of ['/', '/contact', '/privacy', '/terms', '/cookies', '/privacy-policy', '/cookie-policy', '/site.webmanifest', '/sites/manasflow/favicon.svg', ...imagePaths]) {
    const response = await fetch(new URL(pathname, base));
    routes.push({ pathname, status: response.status, type: response.headers.get('content-type') });
  }
}
const failures = routes.filter(route => route.status !== 200);
const report = { site: 'Manasflow', route: '/', missingAnchors, duplicateIds, missingAssets, personalMatches, localAssetReferences: imagePaths.length, routes, failures, browserVerification: 'pending' };
await fs.mkdir(reportDir, { recursive: true });
await fs.writeFile(`${reportDir}/static-audit.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, routes: `${routes.length} HTTP responses checked` }, null, 2));
if (missingAnchors.length || duplicateIds.length || missingAssets.length || personalMatches.length || failures.length) process.exitCode = 1;
