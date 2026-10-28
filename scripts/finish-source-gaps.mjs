import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { sanitizeText } from "./sanitize-manasflow-content.mjs";

const { parse } = createRequire(import.meta.url)("next/dist/compiled/node-html-parser");
const route = "/services/generative-ai-development-company";
const filename = "src/data/manasflow/service-pages.json";
const pages = JSON.parse(await fs.readFile(filename, "utf8"));
if (!pages.some(page => page.sourceRoute === route)) {
  const document = parse(await fs.readFile(`temp/route-audit/${encodeURIComponent(route)}.html`, "utf8"));
  const clean = node => sanitizeText((node?.structuredText || node?.textContent || "").replace(/\s+/g, " ").trim());
  const h1 = document.querySelector("h1");
  if (!h1) throw new Error("Missing captured generative AI service content");
  let root = h1;
  while (root.parentNode && !root.getAttribute?.("hidden") && root.getAttribute?.("hidden") !== "") root = root.parentNode;
  const sections = [];
  for (const section of root.querySelectorAll("section")) {
    const heading = section.querySelector("h2");
    const title = clean(heading);
    if (!title || /results from|scope your|describe the|questions|deploy.*automation/i.test(title)) continue;
    const cards = section.querySelectorAll("h3").map(cardHeading => {
      let card = cardHeading;
      while (card.parentNode && card.parentNode !== section && card.parentNode.querySelectorAll("h3").length === 1 && !card.parentNode.querySelector("h2")) card = card.parentNode;
      return { title: clean(cardHeading), body: card.querySelectorAll("p").map(clean).filter(Boolean), items: card.querySelectorAll("li").map(clean).filter(Boolean) };
    });
    sections.push({ title, body: section.querySelectorAll("p").filter(node => !cards.some(card => card.body.includes(clean(node)))).map(clean).filter(Boolean), cards, items: cards.length ? [] : section.querySelectorAll("li").map(clean).filter(Boolean), steps: [], tables: [], links: section.querySelectorAll("a").map(link => ({ label: clean(link), href: sanitizeText(link.getAttribute("href") || "") })).filter(link => link.label && link.href.startsWith("/") && !link.href.startsWith("//")), figures: [], layout: /runs|30 days/.test(title) ? "process" : "cards" });
  }
  const faqs = root.querySelectorAll("details").map(node => ({ question: clean(node.querySelector("summary")).replace(/\s*\+$/, ""), answer: node.querySelectorAll("p").map(clean).join(" ") })).filter(faq => faq.question && faq.answer);
  const intro = h1.parentNode.querySelectorAll("p").map(clean).find(text => text.length > 100) || "Build production generative AI around your own data, tools, evaluation set, and operating requirements with ManasFlow.";
  pages.push({ slug: "generative-ai-development-company", sourceRoute: route, title: clean(h1), accent: clean(h1.querySelector("span")), description: intro, badge: "Generative AI Development", intro, note: "Free 30-minute strategy call", centered: false, visualTitle: "Built for production", visualItems: ["Grounded answers from your documents", "Agents connected to your tools", "Evaluation on your real examples"], cta: "Discuss your AI project", sections, faqs });
  await fs.writeFile(filename, `${JSON.stringify(pages, null, 2)}\n`);
  console.log(`Added generative AI service: ${sections.length} sections, ${faqs.length} FAQs.`);
}
const industryFile = "src/data/manasflow/industries.json";
const industries = JSON.parse(await fs.readFile(industryFile, "utf8"));
for (const logo of industries.logos) {
  const candidate = logo.local.replace("pages/industry-", "pages/");
  await fs.access(`public/sites/manasflow/${candidate}`);
  logo.local = candidate;
}
await fs.writeFile(industryFile, `${JSON.stringify(industries, null, 2)}\n`);
console.log("Repaired all eight industry logo references using existing local assets.");
