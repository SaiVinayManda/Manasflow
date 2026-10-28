import fs from "node:fs/promises";
import path from "node:path";

const origin = "https://www.ayautomate.com";
const output = "temp/route-audit";
await fs.mkdir(output, { recursive: true });
const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap HTTP ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
await fs.writeFile(`${output}/sitemap.xml`, sitemap);
const homeResponse = await fetch(origin);
await fs.writeFile(`${output}/home.html`, await homeResponse.text());
const sourceRoutes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname);
const details = JSON.parse(await fs.readFile("src/data/manasflow/details-index.json", "utf8"));
const fixed = (await fs.readdir("src/app", { withFileTypes: true })).filter(entry => entry.isDirectory() && !entry.name.startsWith("[")).map(entry => `/${entry.name}`);
const known = new Set(["/", ...fixed, ...details.map(page => page.route)]);
const missing = sourceRoutes.filter(route => !known.has(route));
const additions = [...new Set([...missing.filter(route => !route.startsWith("/agency/")), "/workflows", "/golden-offer", "/consultation"])];
let cursor = 0;
const reports = [];
await Promise.all(Array.from({ length: 6 }, async () => {
  while (cursor < additions.length) {
    const route = additions[cursor++];
    const filename = path.join(output, `${encodeURIComponent(route)}.html`);
    try {
      const cached = await fs.readFile(filename, "utf8").catch(() => null);
      if (cached?.includes("<html")) { reports.push({ route, status: 200, cached: true }); continue; }
      const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(45000) });
      await fs.writeFile(filename, await response.text());
      reports.push({ route, status: response.status });
    } catch (error) { reports.push({ route, error: String(error) }); }
  }
}));
const report = { capturedAt: new Date().toISOString(), sourceRouteCount: sourceRoutes.length, missingBefore: missing, pages: reports };
await fs.writeFile(`${output}/capture-report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ sourceRouteCount: sourceRoutes.length, missing: missing.length, collected: reports.filter(page => page.status === 200).length, errors: reports.filter(page => page.status !== 200) }, null, 2));
