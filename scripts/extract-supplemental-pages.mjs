import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { sanitizeText } from "./sanitize-manasflow-content.mjs";

const { parse } = createRequire(import.meta.url)("next/dist/compiled/node-html-parser");
const reference = "temp/route-audit";
const filenames = await fs.readdir(reference);
const routes = filenames.filter(name => name.endsWith(".html") && name.startsWith("%2F")).map(name => decodeURIComponent(name.slice(0, -5))).filter(route => ["/philosophy", "/jev-builds", "/grok-bot-examples", "/claude-md-examples", "/golden-offer", "/consultation"].includes(route) || /^\/(?:workshops|fr)\//.test(route));
const clean = value => sanitizeText(String(value || "").replace(/\s+/g, " ").trim());
const text = node => clean(node?.structuredText || node?.textContent || "");
const ownClaim = value => /refund|money.back|satisfaction guarantee|ex.IBM|30\+ Companies|30\+ Entreprises|guaranteed|same.day response|respond.*24 hours|100%.*ownership.*guarantee|for one client|from our.*case study|nos systèmes en action|reviennent généralement|deploy within days|shipping from Day 1|start shipping.*same week|live within days|no long.term contracts/i.test(value);
const safeText = value => ownClaim(value) ? "" : clean(value).replace(/\$\d[\d,]*(?:\s*(?:\/\s*(?:mo|month)|per month))?/g, "scope-based pricing");
const unique = values => [...new Set(values.filter(Boolean))];
function pageMain(h1) {
  let node = h1;
  while (node?.parentNode && node.tagName !== "MAIN") node = node.parentNode;
  return node;
}
function contentForHeading(heading, root) {
  let node = heading;
  while (node.parentNode && node.parentNode !== root && node.parentNode.querySelectorAll("h2").length === 1) node = node.parentNode;
  if (node !== heading) return node;
  const siblings = heading.parentNode.childNodes;
  const start = siblings.indexOf(heading);
  const output = [];
  for (let index = start; index < siblings.length; index++) {
    const sibling = siblings[index];
    if (index > start && (sibling.tagName === "H2" || sibling.querySelector?.("h2"))) break;
    output.push(sibling.toString());
  }
  return parse(output.join(""));
}
function cardContainer(heading, boundary) {
  let node = heading;
  while (node.parentNode && node.parentNode !== boundary && node.parentNode.querySelectorAll("h3").length === 1 && !node.parentNode.querySelector("h2")) node = node.parentNode;
  return node;
}
function localHref(href) {
  const sanitized = sanitizeText(href || "");
  if (/cal\.com|calendly\.com/.test(sanitized)) return "/consultation";
  if (sanitized.startsWith("mailto:")) return "mailto:info@manasflow.com";
  if (/^https?:\/\//.test(sanitized) && !/github\.com|docs\.|youtube\.com|youtu\.be|x\.com|linkedin\.com|typesafe\.ai|agents\.md/.test(sanitized)) return "";
  return sanitized.startsWith("/") || sanitized.startsWith("#") || /^https?:\/\//.test(sanitized) ? sanitized : "";
}
function linksWithin(node) {
  return node.querySelectorAll("a").map(link => ({ label: text(link), href: localHref(link.getAttribute("href")) })).filter(link => link.label && link.href && !/walid|adel|boulanouar|dahani/i.test(link.label));
}
function flightData(html) {
  const payload = [...html.matchAll(/self\.__next_f\.push\(\[1,("(?:\\.|[^"\\])*")\]\)/g)].map(match => JSON.parse(match[1])).join("");
  const records = [];
  for (const line of payload.split("\n")) {
    const separator = line.indexOf(":");
    try { records.push(JSON.parse(line.slice(separator + 1))); } catch {}
  }
  const buffer = Buffer.from(payload);
  function resolve(value) {
    if (typeof value !== "string" || !/^\$[0-9a-f]+$/.test(value)) return value;
    const id = value.slice(1);
    const pattern = new RegExp(`(?:^|\\n)${id}:T([0-9a-f]+),`);
    const match = pattern.exec(payload);
    if (!match) return "";
    const start = Buffer.byteLength(payload.slice(0, match.index + match[0].length));
    return buffer.subarray(start, start + parseInt(match[1], 16)).toString();
  }
  const found = {};
  function walk(value) {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) { value.forEach(walk); return; }
    for (const [key, entry] of Object.entries(value)) {
      if (["initial", "prompts"].includes(key) && Array.isArray(entry)) found[key] = entry.map(item => Object.fromEntries(Object.entries(item).map(([key, value]) => [key, resolve(value)])));
      walk(entry);
    }
  }
  records.forEach(walk);
  return found;
}

const pages = [];
for (const route of routes) {
  const html = await fs.readFile(`${reference}/${encodeURIComponent(route)}.html`, "utf8");
  const document = parse(html);
  const h1 = document.querySelector("h1");
  if (!h1) continue;
  const root = pageMain(h1);
  const siblings = h1.parentNode.childNodes;
  const h1Index = siblings.indexOf(h1);
  const following = siblings.slice(h1Index + 1).find(node => node.tagName === "P");
  const description = safeText(text(following)) || safeText(document.querySelector('meta[name="description"]')?.getAttribute("content"));
  const kind = route.startsWith("/workflows/") ? "workflow" : route.startsWith("/workshops/") ? "workshop" : route.startsWith("/fr/") ? "french" : route.includes("examples") || route === "/jev-builds" ? "examples" : route === "/golden-offer" ? "offer" : route === "/consultation" ? "consultation" : "philosophy";
  const faqs = [];
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const schema = JSON.parse(script.textContent);
      const candidates = Array.isArray(schema) ? schema : schema["@graph"] || [schema];
      for (const candidate of candidates) if (candidate["@type"] === "FAQPage") for (const item of candidate.mainEntity || []) {
        const answer = safeText(item.acceptedAnswer?.text);
        if (answer) faqs.push({ question: clean(item.name), answer });
      }
    } catch {}
  }
  for (const details of root.querySelectorAll("details")) {
    const summary = details.querySelector("summary");
    const answer = details.querySelectorAll("p").map(text).join(" ");
    if (summary && answer && !ownClaim(answer)) faqs.push({ question: text(summary).replace(/^\d+\s*/, "").replace(/\s*[+−-]\s*$/, ""), answer: safeText(answer) });
  }
  const sections = [];
  const skipped = /client|testimonial|ROI réel|Écoutez|Real Results|Hear it from|bench you can deploy|résultats réels|^DEPLOY/i;
  for (const heading of root.querySelectorAll("h2")) {
    const title = text(heading);
    const container = contentForHeading(heading, root);
    if (skipped.test(title)) continue;
    if (/Questions|Frequently|FAQ|fréquentes|Everything you need to know before/i.test(title)) {
      for (const question of container.querySelectorAll("h3")) {
        const box = cardContainer(question, container);
        const answer = box.querySelectorAll("p").map(text).filter(value => !ownClaim(value)).join(" ");
        if (answer) faqs.push({ question: text(question), answer: safeText(answer) });
      }
      continue;
    }
    if (kind === "examples" && !/Before you build|Methodology|Generate a starter/i.test(title)) continue;
    const cards = container.querySelectorAll("h3").map(cardHeading => {
      const card = cardContainer(cardHeading, container);
      return { title: text(cardHeading), body: unique(card.querySelectorAll("p").map(text).map(safeText)), items: unique(card.querySelectorAll("li").map(text).map(safeText)), links: linksWithin(card) };
    }).filter(card => !skipped.test(card.title) && !/refund|guarantee|\$|\d[,.]\d{3}/i.test(card.title));
    const cardParagraphs = new Set(container.querySelectorAll("h3").flatMap(cardHeading => cardContainer(cardHeading, container).querySelectorAll("p")));
    const body = unique(container.querySelectorAll("p").filter(paragraph => !cardParagraphs.has(paragraph) && !paragraph.parentNode.closest?.("details")).map(text).filter(value => value !== title).map(safeText)).filter(paragraph => paragraph.length > 12);
    const tables = container.querySelectorAll("table").map(table => ({ headers: table.querySelectorAll("thead th").map(text), rows: table.querySelectorAll("tbody tr").map(row => row.querySelectorAll("td,th").map(text).map(safeText)) }));
    const items = cards.length ? [] : unique(container.querySelectorAll("li").map(text).map(safeText));
    if (kind === "workshop" && /Master These|Designed For/.test(title)) items.push(...unique(container.querySelectorAll("span").map(text)).filter(value => value.length > 3));
    if (kind === "workshop" && /Investment/.test(title)) {
      for (const box of container.querySelectorAll('[data-slot="card"]')) cards.push({ title: text(box.querySelector('[data-slot="card-title"]')), body: ["Discuss current availability and pricing with ManasFlow."], items: box.querySelectorAll("li").map(text), links: [{ label: "Ask about this format", href: "/consultation" }] });
      items.length = 0;
    }
    const code = container.querySelectorAll("pre").map(node => sanitizeText(node.textContent));
    const links = linksWithin(container).filter(link => !cards.some(card => card.links.some(item => item.href === link.href)));
    if (kind === "offer" && /Ready to Hire/.test(title)) continue;
    if (body.length || cards.length || items.length || tables.length || code.length) sections.push({ title, body, cards, items, tables, code, links, numbered: /How it works|Curriculum|Method|Méthod|principle|Audit, Construction|hiring.*broken/i.test(title) });
  }
  const examples = [];
  if (kind === "examples") {
    const data = flightData(html);
    if (route === "/claude-md-examples") {
      for (const item of data.initial || []) if (!/walid|adel|ayautomate/i.test(item.repo)) examples.push({ title: clean(item.repo), category: item.projectType || "Repository", description: clean(item.description), code: sanitizeText(item.text || ""), source: localHref(item.url), author: clean(item.owner), language: item.language || "", license: item.license || "Not specified", fileType: item.fileType || "CLAUDE.md" });
    } else {
      for (const item of data.prompts || []) examples.push({ title: clean(item.label), category: item.category || "Prompts", description: `A public prompt attributed to ${clean(item.author)}. Review it for your context before use.`, code: sanitizeText(item.prompt || ""), source: localHref(item.url), author: clean(item.author), language: "", license: "Public post", fileType: "Prompt" });
      for (const item of data.initial || []) {
        if (item.own || /walid|adel|ayautomate/i.test(item.author || item.name || "")) continue;
        const title = clean(item.title || item.name || item.text?.split("\n")[0]?.slice(0, 120) || item.desc);
        const description = clean(item.summary || item.desc || item.text || "");
        if (!title || !description) continue;
        examples.push({ title, category: item.category || item.kind || "Build", description, code: "", source: localHref(item.url || (item.kind === "x" ? `https://x.com/${item.handle}/status/${item.id}` : "")), author: clean(item.author || item.name || ""), language: "", license: "Public reference", fileType: item.kind || "Example" });
      }
    }
  }
  const heroCards = [];
  if (kind === "workflow") {
    const meta = h1.parentNode.querySelector("div.border");
    for (const box of meta?.querySelectorAll("div.p-4") || []) { const paragraphs = box.querySelectorAll("p"); heroCards.push({ title: text(paragraphs[0]), body: text(paragraphs[1]), items: box.querySelectorAll("li").map(text) }); }
  }
  const publicDescription = kind === "examples" ? description.replace(/1,298 real files from 1,290 public GitHub repos/, "Real files from public GitHub repositories").replace(/1,305 public builds, tests, repos and guides/, "Public builds, tests, repositories, and guides") : kind === "offer" ? "Work with a dedicated AI engineer and a coordinated set of agents in your own repository. Discuss the skills, scope, and delivery plan that fit your team." : description;
  if (route === "/claude-md-examples") {
    const methodology = sections.find(section => section.title === "Methodology");
    if (methodology) methodology.body = ["This library contains a captured reference sample of public CLAUDE.md and AGENTS.md files. Each card links to the repository file at the recorded commit and retains its language and license.", "For permissive licenses such as MIT, Apache-2.0, BSD, ISC, CC0, and the Unlicense, copying is available. Other examples remain source references; follow the repository’s license before reuse.", "The examples are project-specific instructions. Read them as reference material and adapt commands, directory structure, and constraints to your own project.", "Language, project type, and file type filters operate locally. Search checks repository names, descriptions, and excerpt text. The starter generator also runs entirely in your browser."];
  }
  pages.push({ route, kind, title: text(h1), description: publicDescription, sections, faqs: faqs.filter((faq, index) => faqs.findIndex(item => item.question === faq.question) === index), heroCards, examples, language: route.startsWith("/fr/") ? "fr" : "en" });
}
await fs.writeFile("src/data/manasflow/supplemental-pages.json", `${JSON.stringify(pages, null, 2)}\n`);
console.log(pages.map(page => `${page.route}: ${page.sections.length} sections, ${page.faqs.length} FAQs, ${page.examples.length} examples`).join("\n"));
