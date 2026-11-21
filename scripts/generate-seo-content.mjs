import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { loadTypescript } from "./lib/load-typescript.mjs";

const { canonicalRoute } = loadTypescript("src/lib/seo-routes.ts");

const read = name => JSON.parse(fs.readFileSync(`src/data/manasflow/${name}.json`, "utf8"));
const details = read("details-index");
const catalogs = read("catalogs");
const services = read("service-pages");
const ecosystem = read("ecosystem-catalogs");
const supplemental = read("supplemental-pages");
const tools = read("tools").tools;
const history = new Map();
// Content history survives deployment without requiring Git or source files at runtime.
try {
  const log = execFileSync("git", ["log", "--format=DATE:%cI", "--name-only", "--", "src"], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  let date;
  for (const line of log.split(/\r?\n/)) {
    if (line.startsWith("DATE:")) date = line.slice(5);
    else if (line && date) {
      const current = history.get(line);
      history.set(line, { modified: current?.modified || date, firstRecorded: date });
    }
  }
} catch { /* Dates remain omitted in source archives without Git history. */ }
const blogCards = new Map([...catalogs.blog.featured, ...Object.values(catalogs.blog.pages).flat()].map(card => [card.href, card]));
const records = {};
const summarize = text => text.replace(/\s+/g, " ").trim().slice(0, 300);
function visibleFaqs(blocks) {
  const faqs = [];
  let sectionLevel, current;
  for (const block of blocks) {
    if (block.kind === "heading" && /^(?:frequently asked questions|faqs?)(?:\s|$|:)/i.test(block.text)) {
      sectionLevel = block.level || 2;
      continue;
    }
    if (!sectionLevel) continue;
    if (/^(?:Book a Free Strategy Call$|Free weekly brief|Steal our production automations|Building this in production\?|Is Your AI Agent Production-Ready)/i.test(block.text) || /^[A-Z][a-z]+ (?:builds and ships|engineers production-grade)/.test(block.text)) {
      sectionLevel = undefined; current = undefined; continue;
    }
    if (block.kind === "heading" && (block.level || 2) <= sectionLevel) { sectionLevel = undefined; current = undefined; continue; }
    if (block.kind === "heading" && block.text.trim().endsWith("?")) {
      current = { question: block.text, answer: "" };
      faqs.push(current);
    } else if (block.kind === "heading") { sectionLevel = undefined; current = undefined; }
    else if (current) current.answer += `${current.answer ? "\n\n" : ""}${block.text}`;
  }
  return faqs.filter(faq => faq.answer);
}
const sourceRecord = (route, title, description, source, extra = {}) => {
  records[route] = { title, description: summarize(description), source, ...history.get(source), ...extra };
};
for (const page of details) {
  const source = `src/data/manasflow/details/${Buffer.from(page.route).toString("base64url")}.json`;
  const detail = JSON.parse(fs.readFileSync(source, "utf8"));
  const card = blogCards.get(page.route);
  const paragraph = detail.blocks.find(block => block.kind === "paragraph" && block.text.length > 65)?.text;
  const author = detail.blocks.find(block => block.kind === "paragraph" && /^[A-Z][a-z]+ (?:builds and ships|engineers production-grade)/.test(block.text))?.text.split(" ")[0];
  const published = card?.date && !Number.isNaN(Date.parse(card.date)) ? new Date(card.date).toISOString().slice(0, 10) : undefined;
  sourceRecord(page.route, page.title, page.description || card?.description || paragraph || page.title, source, {
    ...(published ? { published } : {}), ...(card?.image ? { image: card.image } : {}),
    ...(visibleFaqs(detail.blocks).length ? { faqs: visibleFaqs(detail.blocks) } : {}),
    ...(author ? { author } : {}),
  });
}
// Extract literal metadata from explicit pages before specialized catalogs override it.
for (const entry of fs.readdirSync("src/app", { withFileTypes: true })) {
  const file = entry.isDirectory() ? `src/app/${entry.name}/page.tsx` : entry.name === "page.tsx" ? "src/app/page.tsx" : undefined;
  if (!file || !fs.existsSync(file) || file.includes("[")) continue;
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/pageMetadata\(\s*"((?:[^"\\]|\\.)*)",\s*"((?:[^"\\]|\\.)*)",\s*"([^"\n]+)"/s);
  if (match) sourceRecord(match[3], JSON.parse(`"${match[1]}"`), JSON.parse(`"${match[2]}"`), file);
}
sourceRecord("/blog", "AI Automation & n8n Workflow Blog", "Insights, tutorials and practical guides on AI automation, n8n workflows and intelligent agents from the ManasFlow team.", "src/data/manasflow/catalogs.json");
for (const page of services) sourceRecord(`/${page.slug}`, page.title, page.description, "src/data/manasflow/service-pages.json");
for (const tool of tools) sourceRecord(`/${tool.slug}`, tool.title, tool.description, "src/data/manasflow/tools.json");
for (const page of supplemental) sourceRecord(page.route, page.title, page.description, "src/data/manasflow/supplemental-pages.json");
for (const category of ecosystem.categories) sourceRecord(`/ai-tools/category/${category.slug}`, `Best ${category.title}`, category.description, "src/data/manasflow/ecosystem-catalogs.json");
for (const item of [...ecosystem.tools, ...ecosystem.bots, ...ecosystem.workflowDetails]) sourceRecord(item.route, item.name, item.description, "src/data/manasflow/ecosystem-catalogs.json");
const productsSource = fs.readFileSync("src/data/manasflow/products.ts", "utf8");
for (const match of productsSource.matchAll(/name: "([^"]+)", slug: "([^"]+)"[\s\S]*?\n\s*description: "([^"]+)"/g)) sourceRecord(`/${match[2]}`, match[1], match[3], "src/data/manasflow/products.ts");
const hubs = {
  "/directory": ["Free AI Model Directory", "Explore free AI models, open-weight models, API tiers, and local runtimes. Filter by provider, modality, and access with ManasFlow."],
  "/ai-model-comparison": ["AI Model Comparison", "Compare AI models side by side with ManasFlow: providers, context windows, published API prices, and a working monthly cost estimator."],
  "/ai-model-pricing-index": ["AI Model Pricing Index", "Compare published AI model API pricing and estimate monthly token costs with ManasFlow."],
  "/platform": ["Our Platform", "ManasRank, ManasDesign, ManasN8N, ManasClaude, Manas Skills, and Manas Framework."],
  "/ai-tools": ["AI Tools Directory", `Explore ${ecosystem.tools.length} AI tools across ${ecosystem.categories.length} categories, with searchable listings and practical implementation guidance from ManasFlow.`],
  "/bot-directory": ["Bot Directory & Automation Templates", "Explore 61 automation templates by category and integration, with clear setup steps and implementation guidance from ManasFlow."],
  "/skills": ["Skills & Agents — AI Capability Stack", "Browse 144 AI capabilities across agent orchestration, engineering, workflow automation, content, sales, and delivery with ManasFlow."],
  "/workflows": ["Automation Workflows", "Find practical automation patterns for sales, support, operations, and developer workflows. Explore setup guides and implementation options with ManasFlow."],
};
for (const [route, [title, description]] of Object.entries(hubs)) sourceRecord(route, title, description, "src/data/manasflow/ecosystem-catalogs.json");
for (const route of ["/directory", "/ai-model-comparison", "/ai-model-pricing-index"]) {
  records[route] = { ...records[route], source: "src/data/manasflow/models.json", ...history.get("src/data/manasflow/models.json") };
}
const hubSources = {
  "/": "src/app/page.tsx",
  "/services": "src/data/manasflow/company-pages.json",
  "/platform": "src/data/manasflow/products.ts",
  "/tools": "src/data/manasflow/tools.json",
  "/ai-tools": "src/data/manasflow/ecosystem-catalogs.json",
  "/blog": "src/data/manasflow/catalogs.json",
  "/contact": "src/data/manasflow/company-pages.json",
};
for (const [route, hub] of Object.entries(read("hub-metadata"))) {
  sourceRecord(route, hub.title, hub.description, hubSources[route]);
}
for (let page = 2; page <= catalogs.blog.totalPages; page++) {
  records[`/blog?page=${page}`] = { ...records["/blog"], title: `AI Automation Blog — Page ${page}` };
}
for (const [route, count] of [["/directory", read("models").freeModels.length], ["/ai-model-comparison", read("models").models.length], ["/ai-model-pricing-index", read("models").models.length]]) {
  for (let page = 2; page <= Math.ceil(count / 12); page++) records[`${route}?page=${page}`] = { ...records[route], title: `${records[route].title} — Page ${page}` };
}
// Shorten search metadata only; keep visible copy and schema headlines verbatim.
const compact = (text, limit) => {
  text = text.replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  const fragment = text.slice(0, limit + 1);
  return fragment.slice(0, fragment.lastIndexOf(" ")).replace(/[\s,:;|—–-]+$/, "");
};
const searchSummary = text => {
  text = text.replace(/\s+/g, " ").trim();
  if (text.length > 155) {
    const sentences = text.match(/.*?[.!?](?=\s|$)|.+$/g) || [];
    const complete = sentences.map((_, index) => sentences.slice(0, index + 1).join("").trim()).filter(sentence => sentence.length >= 65 && sentence.length <= 155).at(-1);
    text = complete || `${compact(text, 154).replace(/(?:\s+(?:a|an|and|as|at|by|for|from|in|into|of|on|or|the|to|with))+[.,;:]?$/i, "").replace(/[.,;:]+$/, "")}…`;
  }
  if (text.length < 125) {
    const additions = [
      " Explore this resource and related guidance on ManasFlow.",
      " Find related resources on ManasFlow.",
      " Explore more on ManasFlow.",
    ];
    text = additions.map(addition => `${text}${addition}`).find(summary => summary.length >= 125 && summary.length <= 155)
      || searchSummary(`${text} Find practical guidance, implementation context, and related resources from ManasFlow.`);
  }
  return text;
};
const titles = new Set();
const descriptions = new Set();
const hubMetadata = read("hub-metadata");
for (const [route, page] of Object.entries(records).filter(([route]) => canonicalRoute(route) === route)) {
  const section = route.split("/")[1]?.split("?")[0].replaceAll("-", " ") || "Home";
  const topic = route.split("?")[0].split("/").at(-1).replaceAll("-", " ");
  const original = page.title.replace(/\s*\|\s*ManasFlow$/i, "");
  const clause = original.split(/: | — | – /)[0];
  const routeTitle = topic.replace(/\b\w/g, letter => letter.toUpperCase()).replace(/\b(ai|api|crm|llm|mcp|roi|saas|seo|n8n)\b/gi, word => ({ ai: "AI", api: "API", crm: "CRM", llm: "LLM", mcp: "MCP", roi: "ROI", saas: "SaaS", seo: "SEO", n8n: "n8n" })[word.toLowerCase()]);
  let title = original.length <= 47 ? original : clause.length <= 47 ? clause : routeTitle.length <= 47 && !route.includes("?") ? routeTitle : compact(original, 47).replace(/(?:\s+(?:a|an|and|as|at|by|for|from|in|into|of|on|or|the|to|with))+$/i, "");
  if (titles.has(title)) title = `${compact(original, 45 - section.length)}: ${section}`;
  if (titles.has(title)) title = compact(topic.replace(/\b\w/g, letter => letter.toUpperCase()), 47);
  if (titles.has(title)) throw new Error(`Duplicate search title: ${route}`);
  page.seoTitle = title;
  titles.add(title);
  let summary = searchSummary(page.description);
  if (descriptions.has(summary)) summary = searchSummary(`${title}. ${page.description}`);
  if (descriptions.has(summary)) throw new Error(`Duplicate search description: ${route}`);
  page.seoDescription = hubMetadata[route]?.description || summary;
  descriptions.add(page.seoDescription);
}
for (const [route, page] of Object.entries(records)) {
  const target = records[canonicalRoute(route)];
  if (target && target !== page) {
    page.seoTitle = target.seoTitle;
    page.seoDescription = target.seoDescription;
  }
}
fs.writeFileSync("src/data/manasflow/seo-content.json", `${JSON.stringify(records, null, 2)}\n`);
console.log(`Prepared SEO source metadata for ${Object.keys(records).length} pages.`);
