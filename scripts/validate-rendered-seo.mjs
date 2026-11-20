import fs from "node:fs";
import assert from "node:assert/strict";
import { loadTypescript } from "./lib/load-typescript.mjs";

const base = process.env.SEO_BASE_URL || "http://127.0.0.1:3108";
const { seoContent, indexableRoutes, pageBreadcrumbs } = loadTypescript("src/lib/seo.ts");
const { canonicalRoute, ROUTE_ALIASES, NOINDEX_ROUTES } = loadTypescript("src/lib/seo-routes.ts");
const hubMetadata = JSON.parse(fs.readFileSync("src/data/manasflow/hub-metadata.json", "utf8"));
const faviconFiles = [["favicon-48x48.png", 48], ["favicon-96x96.png", 96], ["apple-touch-icon.png", 180]];
for (const [file, size] of faviconFiles) {
  const png = fs.readFileSync(`public/${file}`);
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", `Invalid PNG: ${file}`);
  assert.equal(png.readUInt32BE(16), size, `Incorrect width: ${file}`);
  assert.equal(png.readUInt32BE(20), size, `Incorrect height: ${file}`);
}
const ico = fs.readFileSync("public/favicon.ico");
assert.equal(ico.readUInt16LE(0), 0);
assert.equal(ico.readUInt16LE(2), 1);
assert.equal(ico.readUInt16LE(4), 3);
for (const [index, size] of [16, 32, 48].entries()) {
  const entry = 6 + index * 16;
  assert.equal(ico[entry], size);
  assert.equal(ico[entry + 1], size);
  const offset = ico.readUInt32LE(entry + 12);
  assert.ok(offset + ico.readUInt32LE(entry + 8) <= ico.length);
  assert.equal(ico.readInt32LE(offset + 4), size);
  assert.equal(ico.readInt32LE(offset + 8), size * 2);
  assert.equal(ico.readUInt16LE(offset + 14), 32);
}
const decode = value => value.replace(/&#x([a-f\d]+);|&#(\d+);|&(amp|quot|apos|lt|gt|nbsp);/gi, (_, hex, dec, named) => hex || dec ? String.fromCodePoint(Number.parseInt(hex || dec, hex ? 16 : 10)) : ({ amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " })[named.toLowerCase()]);
const plain = value => decode(value.replace(/<!--[\s\S]*?-->/g, "").replace(/<\/?(?:p|div|section|article|h[1-6]|li|ul|ol|nav|header|footer|br)\b[^>]*>/g, " ").replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
const errors = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();
const links = new Map();
let checked = 0;
let schemaCount = 0;
let faqCount = 0;
function check(route, html) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1] || "";
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || "";
  const title = plain(head.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "");
  assert.ok(title, "Missing title in head");
  assert.ok(!titles.has(title), `Duplicate rendered title also on ${titles.get(title)}`);
  titles.set(title, route);
  assert.ok(/<meta name="description" content="[^"]+"/.test(head), "Missing description");
  const description = decode(head.match(/<meta name="description" content="([^"]+)"/)?.[1] || "");
  assert.ok(!descriptions.has(description), `Duplicate rendered description also on ${descriptions.get(description)}`);
  descriptions.set(description, route);
  if (hubMetadata[route]) {
    assert.ok(title.length < 60, `Hub title exceeds limit: ${title.length}`);
    assert.ok(description.length >= (route === "/" ? 145 : 120) && description.length <= 155, `Hub description outside requested length: ${description.length}`);
    assert.equal(description, hubMetadata[route].description);
  }
  for (const href of ["/favicon.ico", "/favicon-48x48.png", "/favicon-96x96.png", "/apple-touch-icon.png", "/logo.svg"]) {
    assert.ok(head.includes(`href="${href}"`), `Icon absent from SSR head: ${href}`);
  }
  assert.ok(/<meta property="og:title"/.test(head) && /<meta name="twitter:card"/.test(head), "Missing social metadata");
  const canonical = decode(head.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || "");
  assert.equal(new URL(canonical).href, new URL(route, "https://manasflow.com").href, "Incorrect canonical");
  const headings = [...main.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)];
  assert.equal(headings.filter(match => match[1] === "1").length, 1, "Expected one H1");
  let level = 0;
  for (const heading of headings) {
    assert.ok(Number(heading[1]) <= level + 1, `Heading skips H${level} to H${heading[1]}: ${plain(heading[2]).slice(0, 80)}`);
    level = Number(heading[1]);
  }
  const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, "Expected one consolidated JSON-LD graph");
  const graph = JSON.parse(scripts[0][1]);
  const website = graph["@graph"].find(node => node["@type"] === "WebSite");
  assert.equal(website.name, "ManasFlow");
  assert.equal(website.alternateName, "manasflow.com");
  schemaCount += graph["@graph"].length;
  const text = plain(main.replace(/<script\b[\s\S]*?<\/script>/g, "").replace(/<svg\b[\s\S]*?<\/svg>/g, ""));
  const crumbs = pageBreadcrumbs(route);
  if (crumbs.length) {
    assert.ok(/aria-label="Breadcrumb"/.test(main), "Missing visible breadcrumb navigation");
    for (const crumb of crumbs) assert.ok(text.includes(plain(crumb.name)), `Breadcrumb missing from HTML: ${crumb.name}`);
  }
  for (const node of graph["@graph"]) if (node["@type"] === "FAQPage") {
    for (const faq of node.mainEntity) {
      assert.ok(text.includes(faq.name.replace(/\s+/g, " ").trim()), `FAQ question absent from SSR HTML: ${faq.name}`);
      assert.ok(text.includes(faq.acceptedAnswer.text.replace(/\s+/g, " ").trim()), `FAQ answer differs from SSR HTML: ${faq.name}`);
      faqCount++;
    }
  }
  for (const landmark of ["header", "footer"]) {
    const markup = landmark === "header" ? html.slice(0, html.indexOf('<main')) : html.slice(html.lastIndexOf('<footer'));
    assert.ok(markup.includes('<nav'), `Missing ${landmark} navigation`);
    const navigation = markup.match(new RegExp(`<nav[^>]*class="seo-hub-navigation seo-hub-navigation-${landmark}"[^>]*>([\\s\\S]*?)<\\/nav>`));
    assert.ok(navigation, `Missing static ${landmark} hub navigation`);
    assert.ok(!navigation[0].includes("hidden="), `Hidden ${landmark} hub navigation`);
    for (const [href, hub] of Object.entries(hubMetadata)) if (hub.label) {
      assert.ok(navigation[1].includes(`href="${href}"`), `Missing static ${landmark} link: ${href}`);
      assert.ok(plain(navigation[1]).includes(hub.label), `Incorrect ${landmark} anchor text: ${href}`);
    }
  }
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = decode(match[1]);
    if (href.startsWith("#") && href.length > 1) assert.ok(html.includes(`id="${href.slice(1)}"`), `Broken page fragment: ${href}`);
    if (href.startsWith("/") || href.startsWith("https://manasflow.com")) {
      const url = new URL(href, "https://manasflow.com");
      const target = `${url.pathname}${url.search}`;
      if (!links.has(target)) links.set(target, route);
    }
  }
  checked++;
}

for (const route of indexableRoutes()) {
  try {
    const file = `.next/server/app/${route === "/" ? "index" : route.slice(1)}.html`;
    const html = !route.includes("?") && fs.existsSync(file) ? fs.readFileSync(file, "utf8") : await fetch(`${base}${route}`, { headers: { "User-Agent": "OAI-SearchBot" } }).then(async response => { assert.equal(response.status, 200, "Non-200 response"); return response.text(); });
    check(route, html);
  } catch (error) { errors.push(`${route}: ${error.message}`); }
}
for (const [href, from] of links) {
  const path = new URL(href, "https://manasflow.com").pathname;
  const target = canonicalRoute(path);
  if (!seoContent[target] && !fs.existsSync(`public${path}`)) errors.push(`Broken internal link: ${from} -> ${href}`);
}
for (const [alias, target] of Object.entries(ROUTE_ALIASES)) {
  const response = await fetch(`${base}${alias}`, { redirect: "manual" });
  if (response.status !== 308 || response.headers.get("location") !== target) errors.push(`Redirect mismatch: ${alias} -> ${response.status} ${response.headers.get("location")}`);
}
for (const route of NOINDEX_ROUTES) {
  const html = await fetch(`${base}${route}`).then(response => response.text());
  if (!/<meta name="robots" content="noindex, follow"/.test(html)) errors.push(`Missing noindex: ${route}`);
}
const missing = await fetch(`${base}/seo-validation-nonexistent-route`, { headers: { "User-Agent": "OAI-SearchBot" } });
if (missing.status !== 404) errors.push(`Unknown route returns ${missing.status}, expected 404`);
const robots = await fetch(`${base}/robots.txt`).then(response => response.text());
for (const bot of ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Googlebot", "Bingbot", "Applebot"]) if (!robots.includes(`User-Agent: ${bot}`)) errors.push(`Missing robot: ${bot}`);
assert.ok(robots.includes("https://manasflow.com/sitemap.xml"));
for (const route of ["/llms.txt", "/llms-full.txt"]) {
  const response = await fetch(`${base}${route}`);
  const text = await response.text();
  assert.equal(response.status, 200);
  assert.ok(response.headers.get("content-type").includes("text/plain"));
  assert.ok(text.startsWith("# ManasFlow\n"));
  for (const section of ["Core Services", "Platform & Frameworks", "Free AI Tools", "AI Tools Directory", "Playbooks & Research"]) assert.ok(text.includes(`## ${section}`));
}
const report = { checkedPages: checked, schemaEntities: schemaCount, matchedVisibleFaqs: faqCount, internalLinkTargets: links.size, checkedRedirects: Object.keys(ROUTE_ALIASES).length, errors, warnings };
fs.writeFileSync("docs/seo-validation.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
