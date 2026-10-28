import fs from "node:fs/promises";
import path from "node:path";

const clean = text => text.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim().replace(/\b[A-Z]{2}\s*Automate\b/gi, "Manasflow").replace(/\b[a-z]{2}automate\.com\b/gi, "manasflow.com");
const html = await fs.readFile("temp/linked-pages/tools.main.html", "utf8");
const index = JSON.parse(await fs.readFile("temp/linked-pages/tools.json", "utf8"));
const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1])).find(value => value["@type"] === "CollectionPage");
let assets = [];
try { assets = JSON.parse(await fs.readFile("docs/research/manasflow/linked-pages/asset-map.json", "utf8")); } catch {}
const tools = [];
for (const item of schema.mainEntity.itemListElement) {
  const slug = new URL(item.url).pathname.split("/").at(-1);
  const link = index.links.find(link => link.href === `/tools/${slug}`);
  const image = assets.find(asset => asset.url.endsWith(`/images/tools/${slug}.jpg`));
  const tool = { slug, title: item.name, description: item.description, category: ["Calculators", "Assessments", "Generators"].find(category => link.title.includes(category)), time: link.title.match(/(\d+ min)/)?.[1] || "5 min", popular: link.title.startsWith("Popular"), image: image?.local.replace("public/sites/manasflow/", "") || `pages/${slug}.jpg`, fields: [], headings: [], text: "", faqs: [], chunks: [] };
  const detailPath = `temp/linked-pages/details/${encodeURIComponent(`/tools/${slug}`)}.html`;
  try {
    const detail = await fs.readFile(detailPath, "utf8");
    const main = detail.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || detail;
    tool.headings = [...main.matchAll(/<(h[123])\b[^>]*>([\s\S]*?)<\/\1>/g)].map(match => ({ level: match[1], text: clean(match[2]) }));
    tool.text = clean(main.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ""));
    tool.fields = [...main.matchAll(/<(input|select|textarea)\b([^>]*?)(?:\/?>)/g)].map(match => {
      const attrs = Object.fromEntries([...match[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(attr => [attr[1], clean(attr[2])]));
      const label = attrs.id ? main.match(new RegExp(`<label[^>]*for="${attrs.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>([\\s\\S]*?)<\\/label>`)) : null;
      return { tag: match[1], ...attrs, label: clean(label?.[1] || attrs["aria-label"] || attrs.placeholder || "") };
    });
    const schemas = [...main.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => { try { return JSON.parse(match[1]); } catch { return null; } });
    const faq = schemas.find(value => value?.["@type"] === "FAQPage");
    tool.faqs = faq?.mainEntity?.map(item => ({ question: clean(item.name), answer: clean(item.acceptedAnswer.text) })) || [];
    tool.chunks = [...detail.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => path.basename(match[1].split("?")[0])).filter(name => name.startsWith("page-"));
  } catch {}
  tools.push(tool);
}
await fs.mkdir("src/data/manasflow", { recursive: true });
await fs.writeFile("src/data/manasflow/tools.json", `${JSON.stringify({ tools }, null, 2)}\n`);
console.log(`${tools.length} tools; ${tools.filter(tool => tool.text).length} detail pages extracted.`);
