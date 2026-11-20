import fs from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const reportPath = "docs/research/manasflow/performance-audit.json";
const routes = ["/", "/contact", "/services", "/platform", "/roi-calculator"];
const pages = [];
const legacyUrls = new Set();
for (const route of routes) {
  const html = await fs.readFile(`.next/server/app/${route === "/" ? "index" : route.slice(1)}.html`, "utf8");
  const scripts = [...new Set([...html.matchAll(/<script\b[^>]*src="([^"?]+\.js)(?:\?[^"]*)?"/g)].map(match => match[1]))];
  for (const tag of html.matchAll(/<script\b[^>]*>/g)) if (/\bnoModule\b/i.test(tag[0])) {
    const url = tag[0].match(/src="([^"?]+)/)?.[1];
    if (url) legacyUrls.add(url);
  }
  const files = await Promise.all(scripts.map(async url => {
    assertLocalChunk(url);
    const bytes = await fs.readFile(path.join(".next", url.replace(/^\/_next\//, "")));
    return { url, bytes: bytes.length, gzipBytes: gzipSync(bytes).length };
  }));
  const markup = html.replace(/<script\b[\s\S]*?<\/script>/g, "");
  const header = markup.match(/<header class="mf-header"[\s\S]*?<\/header>/)?.[0] || "";
  pages.push({ route, initialJsBytes: files.reduce((sum, file) => sum + file.bytes, 0), initialJsGzipBytes: files.reduce((sum, file) => sum + file.gzipBytes, 0), initialScriptCount: files.length, htmlBytes: Buffer.byteLength(html), domElements: [...markup.matchAll(/<[a-z][\w-]*(?:\s|>)/g)].length, headerElements: [...header.matchAll(/<[a-z][\w-]*(?:\s|>)/g)].length, headerAnchors: [...header.matchAll(/<a\b/g)].length, menuCopies: [...header.matchAll(/class="mf-mega-menu"/g)].length, toolMarqueeCopies: [...markup.matchAll(/class="mf-tools-group"/g)].length, files });
}
function assertLocalChunk(url) {
  if (!url.startsWith("/_next/static/") || url.includes("..")) throw new Error(`Unexpected script URL: ${url}`);
}
const sample = { measuredAt: new Date().toISOString(), pages };
function normalize(measurement) {
  for (const page of measurement.pages) {
    page.legacyFiles = page.legacyFiles || page.files.filter(file => legacyUrls.has(file.url));
    page.files = page.files.filter(file => !legacyUrls.has(file.url));
    page.initialJsBytes = page.files.reduce((sum, file) => sum + file.bytes, 0);
    page.initialJsGzipBytes = page.files.reduce((sum, file) => sum + file.gzipBytes, 0);
    page.initialScriptCount = page.files.length;
  }
  const shared = measurement.pages[0].files.filter(file => measurement.pages.every(page => page.files.some(candidate => candidate.url === file.url)));
  measurement.sharedInitialJsBytes = shared.reduce((sum, file) => sum + file.bytes, 0);
  measurement.sharedInitialJsGzipBytes = shared.reduce((sum, file) => sum + file.gzipBytes, 0);
  measurement.sharedFiles = shared;
  measurement.measurement = "Unique modern script chunks referenced by production SSR HTML; gzip calculated per file. Includes Next/React runtime. Excludes nomodule compatibility scripts, lazy chunks, and network/RSC prefetch traffic. Shared means the intersection across these five sampled routes. The unchanged hashed legacy script is excluded from both snapshots.";
}
normalize(sample);
let report = {};
try { report = JSON.parse(await fs.readFile(reportPath, "utf8")); } catch { /* First measurement. */ }
if (process.argv.includes("--record-baseline")) report = { before: sample };
else report.after = sample;
if (report.before) normalize(report.before);
if (report.before && report.after) {
  const beforeFiles = report.before.sharedFiles;
  const afterFiles = report.after.sharedFiles;
  const removed = beforeFiles.filter(file => !afterFiles.some(after => after.url === file.url));
  const added = afterFiles.filter(file => !beforeFiles.some(before => before.url === file.url));
  report.comparison = { sharedInitialJsGzipBytesSaved: report.before.sharedInitialJsGzipBytes - report.after.sharedInitialJsGzipBytes, changedSharedChunksBeforeGzipBytes: removed.reduce((sum, file) => sum + file.gzipBytes, 0), changedSharedChunksAfterGzipBytes: added.reduce((sum, file) => sum + file.gzipBytes, 0), removedSharedChunks: removed, addedSharedChunks: added };
}
await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ phase: process.argv.includes("--record-baseline") ? "before" : "after", sharedInitialJsGzipKiB: +(sample.sharedInitialJsGzipBytes / 1024).toFixed(1), pages: pages.map(({ route, initialJsGzipBytes, domElements, headerElements, menuCopies }) => ({ route, initialJsGzipKiB: +(initialJsGzipBytes / 1024).toFixed(1), domElements, headerElements, menuCopies })) }, null, 2));
