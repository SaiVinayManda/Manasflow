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
    assert.ok(title.length < 60, `Title must be under 60 characters: ${route} (${title.length})`);
    assert.ok(metadata.description.length >= (route === "/" ? 145 : 125) && metadata.description.length <= 155, `Description outside requested length: ${route} (${metadata.description.length})`);
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
  const nodes = graph["@graph"];
  const organization = nodes.find(node => node["@type"] === "Organization");
  assert.equal(organization["@id"], "https://manasflow.com/#organization");
  assert.equal(organization.name, "ManasFlow");
  assert.equal(organization.logo, "https://manasflow.com/logo.svg");
  assert.equal(organization.email, "info@manasflow.com");
  for (const node of nodes) {
    if (node["@type"] === "Service") assert.equal(node.provider["@id"], organization["@id"]);
    if (node["@type"] === "WebApplication") {
      assert.equal(node.applicationCategory, "BusinessApplication");
      assert.equal(node.operatingSystem, "Web");
      assert.equal(node.offers.price, "0");
    }
    if (node["@type"] === "ItemList") {
      assert.equal(node.numberOfItems, node.itemListElement.length);
      node.itemListElement.forEach((item, index) => assert.equal(item.position, index + 1));
    }
    if (["Article", "TechArticle"].includes(node["@type"])) {
      assert.equal(node.headline, page.title);
      assert.ok(node.author);
      assert.equal(node.publisher["@id"], organization["@id"]);
      assert.equal(node.dateModified, page.modified);
      if (page.published) assert.equal(node.datePublished, page.published);
    }
  }
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
for (const item of sitemap) {
  const url = new URL(item.url);
  const record = seoContent[`${url.pathname}${url.search}`];
  assert.equal(item.lastModified, record.modified, `Sitemap lastmod differs from content history: ${item.url}`);
  assert.ok(Number.isFinite(Date.parse(item.lastModified)), `Invalid lastmod: ${item.url}`);
}
fs.writeFileSync("docs/seo-route-map.json", `${JSON.stringify(map, null, 2)}\n`);
const publicationGaps = indexableRoutes().filter(route => /^\/(blog|playbooks|resources)\//.test(route) && seoContent[route].source.includes("/details/") && !seoContent[route].published).map(route => ({ route, source: seoContent[route].source, lastModified: seoContent[route].modified, reason: "No publication date recorded in the editorial source. Git introduction dates are not treated as publication dates." }));
fs.writeFileSync("docs/seo-publication-gaps.json", `${JSON.stringify(publicationGaps, null, 2)}\n`);
console.log(`Validated ${map.length} URLs, ${sitemap.length} indexable pages, unique titles, canonical targets, breadcrumbs, redirects, sitemap, and all JSON-LD graphs.`);
