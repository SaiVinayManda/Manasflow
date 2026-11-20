import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { loadTypescript } from "./lib/load-typescript.mjs";
import { INDEXNOW_KEY_PATH, indexNowPayload } from "./lib/indexnow.mjs";

const { seoContent, pageGraph } = loadTypescript("src/lib/seo.ts");
const { pageMetadata } = loadTypescript("src/lib/metadata.ts");
const { PRIMARY_NAVIGATION } = loadTypescript("src/lib/site-navigation.ts");
const { relatedInteractiveTool } = loadTypescript("src/lib/tool-recommendations.ts");
const ecosystem = JSON.parse(await fs.readFile("src/data/manasflow/ecosystem-catalogs.json", "utf8"));
const tools = JSON.parse(await fs.readFile("src/data/manasflow/tools.json", "utf8"));
const services = JSON.parse(await fs.readFile("src/data/manasflow/service-pages.json", "utf8"));
const { PRODUCT_PAGES } = loadTypescript("src/data/manasflow/products.ts");
const blogs = Object.keys(seoContent).filter(route => route.startsWith("/blog/"));
const hubs = ["/services", "/platform", "/tools", "/ai-tools", "/blog", "/contact"];
assert.deepEqual(PRIMARY_NAVIGATION.map(link => link.href), hubs);
assert.deepEqual(PRIMARY_NAVIGATION.map(link => link.label), ["Solutions", "Platform", "Free Tools", "AI Directory", "Insights", "Book a Call"]);
const homeNav = pageGraph("/")["@graph"].filter(node => node["@type"] === "SiteNavigationElement");
assert.deepEqual(homeNav.map(node => new URL(node.url).pathname), hubs);
for (const route of hubs) {
  const page = seoContent[route];
  assert.ok(page, `${route}: hub exists`);
  const metadata = pageMetadata(page.title, page.description, route);
  assert.ok(metadata.title.absolute.length < 60, `${route}: title length`);
  assert.ok(metadata.description.length >= 125 && metadata.description.length <= 155, `${route}: description length`);
}
for (const category of ecosystem.categories) {
  const route = `/ai-tools/category/${category.slug}`;
  const graph = pageGraph(route)["@graph"];
  const collection = graph.find(node => node["@type"] === "CollectionPage");
  const list = graph.find(node => node["@type"] === "ItemList");
  assert.equal(collection.mainEntity["@id"], list["@id"]);
  const expected = ecosystem.tools.filter(tool => tool.categories.includes(category.slug));
  assert.equal(list.numberOfItems, expected.length);
  assert.deepEqual(list.itemListElement.map(item => item.url), expected.map(tool => `https://manasflow.com${tool.route}`));
}
for (const route of blogs) {
  const article = pageGraph(route)["@graph"].find(node => node["@type"] === "Article");
  assert.ok(article, `${route}: article schema`);
  assert.ok(Number.isFinite(Date.parse(article.datePublished)), `${route}: published date`);
  assert.ok(Number.isFinite(Date.parse(article.dateModified)), `${route}: modified date`);
  assert.ok(Date.parse(article.dateModified) >= Date.parse(article.datePublished));
  assert.equal(article.publisher["@id"], "https://manasflow.com/#organization");
}
for (const [context, href] of [["AI governance and readiness", "/ai-readiness-assessment"], ["Workflow automation ROI", "/roi-calculator"], ["CRM tools", "/ai-tool-selector"]]) assert.equal(relatedInteractiveTool(context).href, href);
const key = (await fs.readFile(INDEXNOW_KEY_PATH, "utf8")).trim();
const payload = indexNowPayload("https://manasflow.com", key, ["/", "/services", "/services#benefits"]);
assert.deepEqual(payload.urlList, ["https://manasflow.com/", "https://manasflow.com/services"]);
assert.equal(payload.keyLocation, "https://manasflow.com/indexnow-key.txt");
assert.throws(() => indexNowPayload("https://manasflow.com", key, ["https://example.com/"]));
assert.throws(() => indexNowPayload("https://manasflow.com", "invalid!", ["/"]));
assert.throws(() => indexNowPayload("https://manasflow.com", key, []));
assert.throws(() => indexNowPayload("https://manasflow.com", key, Array.from({ length: 10001 }, (_, index) => `/${index}`)));

// Inspect actual SSR HTML while ignoring script payloads and snippet-excluded
// subtrees. This catches repeated text that a source-only string check misses.
function snippetHeadings(html) {
  html = html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/g, "");
  const stack = [];
  const headings = [];
  let text = "";
  let heading = null;
  const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
  for (const token of html.matchAll(/<[^>]+>|[^<]+/g)) {
    const value = token[0];
    if (value.startsWith("</")) {
      const tag = value.match(/^<\/([\w-]+)/)?.[1];
      if (heading && /^h[1-6]$/.test(tag)) { headings.push(heading.trim()); heading = null; }
      const position = stack.map(node => node.tag).lastIndexOf(tag);
      if (position >= 0) stack.length = position;
    } else if (value.startsWith("<")) {
      const tag = value.match(/^<([\w-]+)/)?.[1];
      if (!tag) continue;
      const excluded = Boolean(stack.at(-1)?.excluded || /\bdata-nosnippet\b|aria-hidden="true"/.test(value));
      if (!voidTags.has(tag) && !value.endsWith("/>")) stack.push({ tag, excluded });
      if (/^h[1-6]$/.test(tag) && !excluded) heading = "";
    } else if (!stack.at(-1)?.excluded) {
      text += ` ${value}`;
      if (heading !== null) heading += value;
    }
  }
  return { headings, text };
}

if (process.env.SEO_BASE_URL) {
  const base = process.env.SEO_BASE_URL;
  const getHtml = async route => {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200, route);
    return response.text();
  };
  const home = await getHtml("/");
  const navigation = home.match(/<ul class="mf-primary-links">([\s\S]*?)<\/ul>/)?.[1];
  assert.ok(navigation, "Six hubs are in the primary desktop navigation");
  const primaryLinks = [...navigation.matchAll(/<a\b[^>]*>/g)].filter(match => /class="[^"]*\bmf-hub-link\b/.test(match[0]));
  assert.deepEqual(primaryLinks.map(match => match[0].match(/href="([^"]+)"/)[1]), hubs);
  assert.equal([...home.matchAll(/class="mf-tools-group" aria-hidden="true" data-nosnippet="" inert=""/g)].length, 1);
  const callStrips = [...home.matchAll(/<div class="call-strip"[^>]*>/g)];
  assert.ok(callStrips.length > 1 && callStrips.every(match => match[0].includes('data-nosnippet=""')), "Repeated call strips are excluded from snippets");
  const snippet = snippetHeadings(home);
  const stackSection = home.match(/<section id="our-services"[\s\S]*?<\/section>/)?.[0];
  assert.ok(stackSection, "Homepage stack section exists");
  const stackSnippet = snippetHeadings(stackSection);
  for (const title of ["N8n Automation", "Make Integration", "Cursor IDE", "Claude Code"]) assert.equal(stackSnippet.headings.filter(heading => heading === title).length, 1, `Only one snippet-eligible stack card: ${title}`);
  assert.equal(snippet.headings.filter(heading => heading === "What We Do").length, 1, "One shared process details panel");
  for (const utility of ["Skip to content", "READY_FOR_DEPLOYMENT", "All rights reserved."]) assert.ok(!snippet.text.includes(utility), `${utility}: excluded from snippets`);
  for (const route of hubs) {
    const html = await getHtml(route);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1].replaceAll("&#x27;", "'").replaceAll("&amp;", "&");
    assert.ok(title?.length < 60 && description?.length >= 125 && description?.length <= 155, `${route}: rendered metadata`);
  }
  let categoryChecks = 0;
  let blogChecks = 0;
  for (const route of [...ecosystem.categories.map(category => `/ai-tools/category/${category.slug}`), ...blogs]) {
    const html = await fs.readFile(`.next/server/app${route}.html`, "utf8");
    const graph = JSON.parse(html.match(/<script id="manasflow-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || "null");
    const card = html.match(/<aside class="mf-tool-funnel"[\s\S]*?<\/aside>/)?.[0];
    assert.ok(card, `${route}: contextual tool card in SSR`);
    const context = route.startsWith("/blog/") ? `${seoContent[route].title} ${route}` : (() => { const category = ecosystem.categories.find(item => route.endsWith(`/${item.slug}`)); return `${category.title} ${category.slug}`; })();
    assert.ok(card.includes(`href="${relatedInteractiveTool(context).href}"`), `${route}: correct canonical tool link`);
    if (route.startsWith("/blog/")) { assert.ok(graph["@graph"].some(node => node["@type"] === "Article" && node.datePublished && node.dateModified)); blogChecks++; }
    else { assert.ok(graph["@graph"].some(node => node["@type"] === "CollectionPage")); categoryChecks++; }
  }
  const robots = await getHtml("/robots.txt");
  for (const bot of ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Googlebot", "Bingbot"]) assert.ok(robots.includes(`User-Agent: ${bot}`));
  assert.ok(robots.includes("Sitemap: https://manasflow.com/sitemap.xml"));
  const llms = await getHtml("/llms.txt");
  const full = await getHtml("/llms-full.txt");
  assert.ok(llms.startsWith("# ManasFlow\n\n> "));
  assert.equal((llms.match(/^## Optional$/gm) || []).length, 1);
  const required = [...hubs, "/playbooks", ...services.map(service => `/${service.slug}`), ...PRODUCT_PAGES.map(product => `/${product.slug}`), ...tools.tools.map(tool => `/${tool.slug}`), ...ecosystem.categories.map(category => `/ai-tools/category/${category.slug}`), ...Object.keys(seoContent).filter(route => /^\/(playbooks|resources)\//.test(route)), ...blogs];
  for (const route of required) assert.ok(llms.includes(`](https://manasflow.com${route})`), `${route}: canonical LLM index entry`);
  assert.ok(full.length > llms.length);
  assert.equal((await getHtml("/indexnow-key.txt")).trim(), key);
  console.log(`Rendered search architecture checks passed: six hubs, snippet exclusions, ${categoryChecks} categories, ${blogChecks} articles, LLM indexes, robots, and IndexNow verification.`);
}
console.log(`Search architecture checks passed: six hubs, ${ecosystem.categories.length} directory schemas, ${blogs.length} dated articles, contextual tool matching, and IndexNow payload validation.`);
