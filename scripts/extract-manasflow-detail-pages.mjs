import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { parse } = require("next/dist/compiled/node-html-parser");
const source = "temp/linked-pages/details";
const destination = "src/data/manasflow/details";
const strip = value => value.replace(/\s+/g, " ").trim().replace(/\b[A-Z]{2}\s*Automation\b/gi, "Manasflow").replace(/\b[A-Z]{2}\s*Automate\b/gi, "Manasflow").replace(/\b[a-z]{2}automate\.com\b/gi, "manasflow.com");
await fs.mkdir(destination, { recursive: true });
const index = [];
for (const filename of await fs.readdir(source)) {
  if (!filename.endsWith(".html")) continue;
  const route = decodeURIComponent(filename.slice(0, -5));
  const root = parse(await fs.readFile(path.join(source, filename), "utf8"));
  const main = root.querySelector("main");
  if (!main) continue;
  for (const selector of ["script", "style", "nav", "footer", "[class*=author]", "[class*=avatar]", "[class*=founder]", "[class*=team-member]"]) {
    for (const node of main.querySelectorAll(selector)) node.remove();
  }
  const blocks = [];
  let omitFounderBio = false;
  for (const node of main.querySelectorAll("h1,h2,h3,h4,p,li,blockquote")) {
    const text = strip(node.textContent || "");
    const heading = /^H[1-4]$/.test(node.tagName);
    if (heading && omitFounderBio && /future of work/i.test(text)) omitFounderBio = false;
    if (heading && /who i am|founder(?:ship)? bio|leadership team|meet (?:the )?founder/i.test(text)) { omitFounderBio = true; continue; }
    if (omitFounderBio) continue;
    if (!text || text.length < 3 || /^(share|copy link|written by|by [A-Z])/i.test(text)) continue;
    if (/\b(?:walid boulanouar|adel dahani|david arnaux)\b|\b(?:i['’]m walid|i co[- ]?founded|co[- ]?founded ay|follow walid|visit manasflow\.com for more automation solutions)\b/i.test(text)) continue;
    if (/^\s*visit manasflow\.com\s+for more automation/i.test(text)) continue;
    const tag = node.tagName.toLowerCase();
    const kind = tag.startsWith("h") ? "heading" : tag === "li" ? "list" : tag === "blockquote" ? "quote" : "paragraph";
    if (blocks.at(-1)?.text === text) continue;
    blocks.push({ kind, level: kind === "heading" ? Number(tag[1]) : undefined, text });
    if (blocks.length >= 180) break;
  }
  const title = blocks.find(block => block.kind === "heading" && block.level === 1)?.text || blocks.find(block => block.kind === "heading")?.text || route.split("/").at(-1).replaceAll("-", " ");
  const description = strip(main.querySelector('meta[name="description"]')?.getAttribute("content") || "");
  index.push({ route, title, description, blocks });
}
await fs.writeFile("src/data/manasflow/details-index.json", `${JSON.stringify(index.map(({ route, title, description }) => ({ route, title, description })), null, 2)}\n`);
for (const page of index) {
  const file = `${Buffer.from(page.route).toString("base64url")}.json`;
  await fs.writeFile(path.join(destination, file), `${JSON.stringify(page)}\n`);
}
console.log(`Extracted ${index.length} local detail pages.`);
