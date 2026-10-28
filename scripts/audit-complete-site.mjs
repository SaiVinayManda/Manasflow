import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { sanitizeText } from "./sanitize-manasflow-content.mjs";

const required = "n8n-agency claude-code-agency cursor-agency codex-agency lovable-agency bubble-agency framer-agency supabase-agency flutterflow-agency replit-agency v0-agency salesforce-consultants hubspot-consultants zoho-consultants pipedrive-consultants attio-crm-agency clay-agency cold-email-agency linkedin-outreach-agency ai-strategy-consulting ai-agent-development workflow-automation custom-automation rag-pipeline-development saas-mvp-development ai-workshops engineer-placement hire-ai-developers custom-training maintenance-support openclaw-nemoclaw-setup ai-automation-agency ai-chatbot-development-agency workflow-automation-agency saas-development-agency no-code-development-agency marketing-automation-agency nextjs-ai-app-development directory ai-model-comparison ai-model-pricing-index roi-calculator ai-readiness-assessment ai-budget-planner workflow-audit ai-maturity-quiz ai-use-case-generator ai-tool-selector digital-transformation-scorecard ai-job-description-generator".split(" ").map(slug => `/${slug}`);
const forbidden = /ay[\s-]*automate|ayautomate\.(?:com|dev)|\bayrank\b|\baydesign\b|\bayn8n\b|\bayclaude\b|\bAY\b|\bwalid\b|boulanouar|dahani|ay-skills|ay-framework/ig;
// Minified framework identifiers such as `ay` are unrelated to brand copy.
const compiledForbidden = /ay[\s-]*automate|ayautomate\.(?:com|dev)|\bayrank\b|\baydesign\b|\bayn8n\b|\bayclaude\b|["'`]AY["'`]|\bwalid\b|boulanouar|dahani|ay-skills|ay-framework/ig;
const walk = async dir => {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
};
const files = [...await walk("src"), ...await walk("public")];
const sourceLeaks = [];
for (const file of files) {
  if (!/\.(?:tsx?|css|json|svg|txt|webmanifest|html|js)$/.test(file)) continue;
  const text = await fs.readFile(file, "utf8");
  const matches = [...text.matchAll(forbidden)].map(match => match[0]);
  if (matches.length) sourceLeaks.push({ file, matches: [...new Set(matches)] });
}
const manifest = JSON.parse(await fs.readFile(".next/prerender-manifest.json", "utf8"));
const builtRoutes = new Set(Object.keys(manifest.routes));
const requiredMissing = required.filter(route => !builtRoutes.has(route));
const sourceXml = await fs.readFile("temp/route-audit/sitemap.xml", "utf8");
const sourceRoutes = [...new Set([...sourceXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => sanitizeText(new URL(match[1]).pathname)))];
const sourceMissing = sourceRoutes.filter(route => !builtRoutes.has(route) && route !== "/blog");
const htmlFiles = (await walk(".next/server/app")).filter(file => file.endsWith(".html"));
const missingMetadata = [];
const brokenLinks = new Map();
const missingAssets = new Map();
const builtLeaks = [];
const collect = (map, value, file) => { if (!map.has(value)) map.set(value, []); if (map.get(value).length < 3) map.get(value).push(file); };
for (const file of htmlFiles) {
  if (/\\(?:_not-found|_global-error)\.html$/.test(file)) continue;
  const html = await fs.readFile(file, "utf8");
  if (forbidden.test(html)) builtLeaks.push(file);
  forbidden.lastIndex = 0;
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
  if (!title.includes("ManasFlow") || !/<meta name="description" content="[^"]+"/.test(html) || !/<meta property="og:title" content="[^"]*ManasFlow/.test(html)) missingMetadata.push({ file, title });
  for (const match of html.matchAll(/href="(\/(?!\/)[^"#?]*)(?:[^"<]*)?"/g)) {
    const href = match[1].replace(/\/$/, "") || "/";
    if (href.startsWith("/_next/") || /\.[a-z0-9]+$/i.test(href)) continue;
    if (!builtRoutes.has(href) && href !== "/blog") collect(brokenLinks, href, file);
  }
  for (const match of html.matchAll(/(?:src|poster)="(\/(?!\/)[^"?]+)(?:[^"<]*)?"/g)) {
    const asset = match[1];
    if (asset.startsWith("/_next/")) continue;
    if (!await fs.stat(`public${decodeURIComponent(asset)}`).catch(() => false)) collect(missingAssets, asset, file);
  }
}
const staticFiles = (await walk(".next/static")).filter(file => /\.(?:js|css|json)$/.test(file));
for (const file of staticFiles) {
  const text = await fs.readFile(file, "utf8");
  if (compiledForbidden.test(text)) builtLeaks.push(file);
  compiledForbidden.lastIndex = 0;
}
const catalogImages = files.filter(file => /[\\/]catalog-[^\\/]+\.(?:png|webp|jpg)$/i.test(file));
const report = {
  generatedAt: new Date().toISOString(), requiredRoutes: required.length, requiredMissing,
  sourceSitemapRoutes: sourceRoutes.length, sourceMissing, prerenderedRoutes: builtRoutes.size,
  htmlPagesAudited: htmlFiles.length, sourceLeaks, builtLeaks, missingMetadata,
  brokenLinks: Object.fromEntries(brokenLinks), missingAssets: Object.fromEntries(missingAssets),
  originalEditorialRasterFilesInPublic: catalogImages,
};
await fs.mkdir("docs/research/manasflow/completion", { recursive: true });
await fs.writeFile("docs/research/manasflow/completion/build-audit.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, sourceLeaks: sourceLeaks.length, builtLeaks: builtLeaks.length, missingMetadata: missingMetadata.slice(0, 5), brokenLinks: Object.keys(report.brokenLinks), missingAssets: Object.keys(report.missingAssets), originalEditorialRasterFilesInPublic: catalogImages.length }, null, 2));
assert.equal(requiredMissing.length, 0, "Missing requested routes");
assert.equal(sourceMissing.length, 0, "Missing source sitemap routes");
assert.equal(sourceLeaks.length + builtLeaks.length, 0, "Source brand remains in active content/build");
assert.equal(missingMetadata.length, 0, "Incomplete branded metadata");
assert.equal(brokenLinks.size, 0, "Broken local navigation destinations");
assert.equal(missingAssets.size, 0, "Missing rendered assets");
assert.equal(catalogImages.length, 0, "Original branded raster covers remain public");
