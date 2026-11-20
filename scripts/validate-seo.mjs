import fs from "node:fs";
import assert from "node:assert/strict";
import { loadTypescript } from "./lib/load-typescript.mjs";

const { SITE_ROUTES } = loadTypescript("src/lib/routes.ts");
const { canonicalRoute, ROUTE_ALIASES, NOINDEX_ROUTES } = loadTypescript("src/lib/seo-routes.ts");
const { seoContent, pageGraph, pageBreadcrumbs, indexableRoutes } = loadTypescript("src/lib/seo.ts");
const { pageMetadata } = loadTypescript("src/lib/metadata.ts");
const titles = new Map();
const descriptions = new Map();
const map = [];
for (const route of [...new Set([...SITE_ROUTES, ...Object.keys(seoContent)])].sort()) {
  const canonical = canonicalRoute(route);
  const page = seoContent[canonical];
  assert.ok(page, `Missing metadata record: ${route} -> ${canonical}`);
  const indexable = canonical === route && !NOINDEX_ROUTES.has(route);
  if (indexable) {
    const metadata = pageMetadata(page.title, page.description, route);
    const title = metadata.title.absolute;
    assert.ok(!titles.has(title), `Duplicate title: ${title} on ${route} and ${titles.get(title)}`);
    titles.set(title, route);
    assert.ok(!descriptions.has(metadata.description), `Duplicate description: ${route} and ${descriptions.get(metadata.description)}`);
    descriptions.set(metadata.description, route);
    assert.ok(page.description.trim(), `Empty description: ${route}`);
    assert.equal(metadata.alternates.canonical, `https://manasflow.com${route === "/" ? "/" : route}`);
  }
  const graph = pageGraph(canonical);
  const ids = new Set();
  function defined(value) {
    assert.notEqual(value, undefined, `Undefined schema value on ${route}`);
    assert.notEqual(value, null, `Null schema value on ${route}`);
    if (Array.isArray(value)) value.forEach(defined);
    else if (typeof value === "object") Object.values(value).forEach(defined);
  }
  defined(graph);
  assert.deepEqual(JSON.parse(JSON.stringify(graph)), graph);
  for (const node of graph["@graph"]) {
    assert.ok(!ids.has(node["@id"]), `Duplicate entity ID on ${route}`);
    ids.add(node["@id"]);
  }
  for (const crumb of pageBreadcrumbs(canonical)) assert.ok(seoContent[crumb.route], `Broken breadcrumb: ${route} -> ${crumb.route}`);
  map.push({ route, canonical, indexable, title: page.seoTitle || page.title, description: page.seoDescription || page.description, breadcrumbs: pageBreadcrumbs(canonical), source: page.source, ...(page.modified ? { lastModified: page.modified, dateProvenance: "Git content-source history" } : {}), ...(page.published ? { datePublished: page.published, publicationProvenance: "Editorial catalog" } : {}) });
}
for (const [alias, target] of Object.entries(ROUTE_ALIASES)) {
  assert.notEqual(alias, target);
  assert.equal(canonicalRoute(target), target, `Redirect chain: ${alias}`);
  assert.ok(seoContent[target], `Broken redirect: ${alias}`);
}
const sitemap = loadTypescript("src/app/sitemap.ts").default();
assert.equal(sitemap.length, indexableRoutes().length);
assert.equal(new Set(sitemap.map(item => item.url)).size, sitemap.length);
assert.ok(sitemap.every(item => !NOINDEX_ROUTES.has(new URL(item.url).pathname)));
fs.writeFileSync("docs/seo-route-map.json", `${JSON.stringify(map, null, 2)}\n`);
console.log(`Validated ${map.length} URLs, ${sitemap.length} indexable pages, unique titles, canonical targets, breadcrumbs, redirects, sitemap, and all JSON-LD graphs.`);
