import fs from "node:fs/promises";
import path from "node:path";
import { sanitizeText } from "./sanitize-manasflow-content.mjs";

const folder = "temp/route-audit";
const decode = value => value.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16))).replace(/&#([0-9]+);/g, (_, decimal) => String.fromCodePoint(Number(decimal))).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
const clean = value => sanitizeText(decode(value).replace(/\s+/g, " ").trim()).replace(/\bay run\b/gi, "manasflow run").replace(/\bay ship\b/gi, "manasflow ship").replace(/\bay-automate\b/gi, "manasflow");

// A literal HTML tree is used only for extraction. Source markup and scripts are never rendered or executed.
function parse(html) {
  const root = { tag: "root", attrs: {}, children: [] };
  const stack = [root];
  const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  for (const match of markup.matchAll(/<[^>]+>|[^<]+/g)) {
    const token = match[0];
    if (token.startsWith("</")) {
      const tag = token.match(/^<\/([\w-]+)/)?.[1].toLowerCase();
      const index = stack.findLastIndex(node => node.tag === tag);
      if (index > 0) stack.length = index;
    } else if (token.startsWith("<")) {
      const tag = token.match(/^<([\w-]+)/)?.[1].toLowerCase();
      if (!tag) continue;
      const attrs = Object.fromEntries([...token.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(item => [item[1], decode(item[2] ?? item[3] ?? "")]));
      const node = { tag, attrs, children: [] };
      stack.at(-1).children.push(node);
      if (!voidTags.has(tag) && !token.endsWith("/>")) stack.push(node);
    } else stack.at(-1).children.push({ tag: "text", text: token, attrs: {}, children: [] });
  }
  return root;
}
const text = node => clean(node?.tag === "text" ? node.text : (node?.children || []).map(text).join(" "));
function findAll(node, test) { const out = []; for (const child of node.children || []) { if (test(child)) out.push(child); out.push(...findAll(child, test)); } return out; }
const first = (node, tag) => findAll(node, child => child.tag === tag)[0];
const body = tree => first(tree, "main") || tree;
const read = route => fs.readFile(path.join(folder, `${encodeURIComponent(route)}.html`), "utf8");
const schemas = html => [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match => { try { const data = JSON.parse(match[1]); return data["@graph"] || [data]; } catch { return []; } });
const logoFor = domain => {
  const filename = `tool-${domain.replace(/^www\./, "").replace(/[^a-z0-9]+/gi, "-")}.png`;
  return filename;
};

const toolsHtml = await read("/ai-tools");
const toolsTree = body(parse(toolsHtml));
const categories = [];
const toolMap = new Map();
for (const section of findAll(toolsTree, node => node.tag === "section" && node.attrs.id)) {
  const title = text(first(section, "h2"));
  if (!title) continue;
  const slug = section.attrs.id;
  const categoryLink = findAll(section, node => node.tag === "a" && node.attrs.href === `/ai-tools/category/${slug}`)[0];
  if (!categoryLink) continue;
  const description = text(first(section, "p"));
  const tools = [];
  for (const item of findAll(section, node => node.tag === "li")) {
    const link = findAll(item, node => node.tag === "a" && /^\/ai-tools\/[^/]+$/.test(node.attrs.href || ""))[0];
    if (!link) continue;
    const name = text(first(item, "h3"));
    const description = text(first(item, "p"));
    const external = findAll(item, node => node.tag === "a" && /^https?:\/\//.test(node.attrs.href || ""))[0]?.attrs.href || "";
    let domain = "";
    try { domain = new URL(external).hostname.replace(/^www\./, ""); } catch {}
    const route = clean(link.attrs.href);
    const existing = toolMap.get(route);
    if (existing) existing.categories.push(slug);
    else toolMap.set(route, { route, slug: route.split("/").at(-1), name, description, website: clean(external), domain, logo: logoFor(domain), categories: [slug] });
    tools.push(route);
  }
  const note = findAll(section, node => node.tag === "div" && node.attrs.class?.includes("border-l-4"))[0];
  const limitations = note ? findAll(note, node => node.tag === "li").map(text) : [];
  const paragraphs = note ? findAll(note, node => node.tag === "p").map(text) : [];
  const solution = paragraphs.find(value => value !== "Where a point solution breaks") || "";
  categories.push({ slug, title, description, limitations, solution, tools });
}
const tools = [...toolMap.values()];
for (const tool of tools) {
  const candidate = path.join("public/sites/manasflow", tool.logo);
  if (!(await fs.stat(candidate).catch(() => false))) tool.logo = "";
}

const bots = [];
const botFiles = (await fs.readdir(folder)).filter(name => name.startsWith("%2Fbot-directory%2F") && name.endsWith(".html"));
const categoryNames = { Sales: "Sales Automation", Marketing: "Marketing Automation", Ops: "Ops Automation", Support: "Support Automation", Personal: "Personal Automation", Dev: "Dev & Agent Automation" };
for (const filename of botFiles) {
  const html = await fs.readFile(path.join(folder, filename), "utf8");
  const tree = body(parse(html));
  const schema = schemas(html).find(item => item["@type"] === "HowTo");
  if (!schema) throw new Error(`Missing HowTo source data: ${filename}`);
  const route = clean(decodeURIComponent(filename.slice(0, -5)));
  const category = findAll(tree, node => node.tag === "span").map(text).find(value => categoryNames[value]) || "Ops";
  const sections = findAll(tree, node => node.tag === "section");
  const integrationSection = sections.find(node => text(first(node, "h2")) === "Integrations");
  const integrations = integrationSection ? findAll(integrationSection, node => node.tag === "img").map(node => clean(node.attrs.alt || "")).filter(Boolean) : [];
  const overview = sections.find(node => text(first(node, "h2")) === "What this template does");
  bots.push({ route, slug: route.split("/").at(-1), name: clean(schema.name), description: clean(schema.description), category, categoryTitle: categoryNames[category], integrations: [...new Set(integrations)], paragraphs: overview ? findAll(overview, node => node.tag === "p").map(text) : [], steps: (schema.step || []).map(step => clean(step.text)) });
}

const skillsHtml = await read("/skills");
const skillsTree = body(parse(skillsHtml));
const skillCards = findAll(skillsTree, node => node.tag === "div" && node.attrs.class?.includes("group border border-border bg-card p-4"));
const skills = skillCards.map((card, index) => ({
  name: text(first(card, "h3")), description: text(first(card, "p")),
  category: text(findAll(card, node => node.tag === "span")[0]),
  tags: findAll(card, node => node.tag === "span").slice(1).map(text), order: index,
}));
const flagships = findAll(skillsTree, node => node.tag === "div" && node.attrs.class?.includes("group relative border border-border bg-card p-6")).map(card => ({
  name: text(first(card, "h3")), description: text(first(card, "p")),
  count: parseInt(text(first(card, "span")), 10) || 0,
  category: text(findAll(card, node => node.tag === "p")[1]),
}));
const faqSchema = schemas(skillsHtml).find(item => item["@type"] === "FAQPage");
const skillFaqs = (faqSchema?.mainEntity || []).map(item => ({ question: clean(item.name), answer: clean(item.acceptedAnswer.text) }));
const workflowsTree = body(parse(await read("/workflows")));
const workflowGroups = findAll(workflowsTree, node => node.tag === "section").map(section => ({
  name: text(first(section, "h2")),
  workflows: findAll(section, node => node.tag === "a" && /^\/workflows\/[^/]+$/.test(node.attrs.href || "")).map(link => ({
    route: clean(link.attrs.href), name: text(first(link, "h3")),
    description: text(findAll(link, node => node.tag === "p")[0]),
    timeline: text(findAll(link, node => node.tag === "p")[1]),
  })),
})).filter(group => group.workflows.length);
const workflowDetails = [];
for (const group of workflowGroups) {
  for (const summary of group.workflows) {
    const html = await read(summary.route);
    const tree = body(parse(html));
    const schema = schemas(html).find(item => item["@type"] === "HowTo");
    const faq = schemas(html).find(item => item["@type"] === "FAQPage");
    if (!schema) throw new Error(`Missing workflow HowTo data: ${summary.route}`);
    const labelCard = label => findAll(tree, node => node.tag === "div" && node.children.some(child => child.tag === "p" && text(child) === label))[0];
    const listCard = label => findAll(tree, node => node.tag === "div" && node.children.some(child => child.tag === "div" && text(child) === label) && findAll(node, child => child.tag === "ul").length)[0];
    const timeline = labelCard("Typical timeline");
    const setup = labelCard("What we need to start");
    const deliverables = listCard("You get");
    const limitations = listCard("When NOT to use this");
    const stepItems = findAll(tree, node => node.tag === "li" && Boolean(first(node, "h3")));
    const description = text(findAll(tree, node => node.tag === "p" && node.attrs.class?.includes("sm:text-lg"))[0]) || clean(schema.description);
    workflowDetails.push({
      ...summary, group: group.name, description,
      timeline: timeline ? text(findAll(timeline, node => node.tag === "p")[1]) : summary.timeline,
      stack: (schema.tool || []).map(tool => clean(tool.name)),
      prerequisites: setup ? findAll(setup, node => node.tag === "li").map(node => text(node).replace(/^[·✓]\s*/, "")) : [],
      deliverables: deliverables ? findAll(deliverables, node => node.tag === "li").map(node => text(node).replace(/^[·✓]\s*/, "")) : [],
      limitations: limitations ? findAll(limitations, node => node.tag === "li").map(node => text(node).replace(/^[·✓]\s*/, "")) : [],
      steps: (schema.step || []).map((step, index) => ({ name: clean(step.name), text: clean(step.text), tools: text(findAll(stepItems[index] || {}, node => node.tag === "p")[1]).replace(/^Tools:\s*/, "") })),
      resources: findAll(tree, node => node.tag === "a" && node.attrs.class?.includes("border border-border bg-card px-4")).map(link => ({ href: clean(link.attrs.href || ""), title: text(link) })),
      faqs: (faq?.mainEntity || []).map(item => ({ question: clean(item.name), answer: clean(item.acceptedAnswer.text) })),
    });
  }
}
if (categories.length !== 75 || tools.length < 300 || bots.length !== 61 || skills.length !== 144) throw new Error(`Unexpected extraction totals: ${categories.length} categories, ${tools.length} tools, ${bots.length} bots, ${skills.length} skills.`);
const result = { categories, tools, bots, skills, flagships, skillFaqs, workflowGroups, workflowDetails };
await fs.writeFile("src/data/manasflow/ecosystem-catalogs.json", `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ categories: categories.length, tools: tools.length, localVendorLogos: tools.filter(tool => tool.logo).length, bots: bots.length, skills: skills.length, flagshipSystems: flagships.length }, null, 2));
