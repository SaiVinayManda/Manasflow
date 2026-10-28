import fs from "node:fs/promises";
import ts from "typescript";

const base = "temp/linked-pages";
const industryName = "page-e9da6dec20072313.js";
const caseName = "page-10abc15dd3a7518b.js";
const rebrand = (value) => typeof value === "string" ? value.replace(/[A-Z0-9._%+-]+@[^\s]+/gi, "info@manasflow.com") : value;
function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return rebrand(node.text);
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.flatMap((property) => {
    if (!ts.isPropertyAssignment(property)) return [];
    const key = property.name.getText().replace(/^['"]|['"]$/g, "");
    if (/testimonial|quote|author|founder|team/i.test(key)) return [];
    const value = literal(property.initializer);
    return value === undefined ? [] : [[key, value]];
  }));
  return undefined;
}
async function arrays(file) {
  const text = await fs.readFile(`${base}/chunks/${file}`, "utf8");
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const result = [];
  const walk = (node) => {
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      result.push(literal(node.initializer));
    }
    ts.forEachChild(node, walk);
  };
  walk(ast);
  return result;
}
const iArrays = await arrays(industryName);
const cArrays = await arrays(caseName);
const industries = iArrays.find((array) => array.length === 9 && array[0]?.slug);
const logos = iArrays.find((array) => array.length === 8 && array[0]?.src);
const patterns = cArrays.find((array) => array.length === 5 && array[0]?.blurb);
const clients = cArrays.find((array) => array.length === 40 && array[0]?.descriptor);
const decode = (value) => value.replace(/&amp;/g, "&").replace(/&#x([a-f0-9]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&quot;/g, '"').replace(/&apos;/g, "'");
const plain = (value) => rebrand(decode(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()));
const html = await fs.readFile(`${base}/case-studies.main.html`, "utf8");
const stories = [...html.matchAll(/<a\b[^>]*href="(\/case-studies\/[^"#]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((match) => {
  const card = match[2];
  const heading = card.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)?.[1] || "";
  const paragraphs = [...card.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((m) => plain(m[1]));
  const imageTag = card.match(/<img\b[^>]*>/)?.[0];
  let src = decode(imageTag?.match(/src="([^"]+)"/)?.[1] || "");
  if (src.startsWith("/_next/image")) src = new URL(src, process.env.MANASFLOW_SOURCE_ORIGIN).searchParams.get("url");
  const category = card.match(/<span[^>]*>([\s\S]*?)<\/span>/)?.[1] || "";
  const date = plain(card.match(/<span[^>]*>March[^<]+<\/span>/)?.[0] || "March 3, 2026");
  const metrics = [...card.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => plain(m[1]).replace(/^•\s*/, ""));
  const tools = [...card.matchAll(/<span[^>]*class="[^"]*bg-muted[^\"]*"[^>]*>([\s\S]*?)<\/span>/g)].map((m) => plain(m[1]));
  const minutes = plain(card).match(/(\d+) min read/)?.[1] || "5";
  return { href: match[1], title: plain(heading), description: paragraphs[0], category: plain(category), date, metrics, tools, minutes, image: src };
});
const sourceOrigin = process.env.MANASFLOW_SOURCE_ORIGIN;
if (!sourceOrigin) throw new Error("Set MANASFLOW_SOURCE_ORIGIN before collecting reference assets.");
const assets = [];
for (const logo of logos) {
  logo.local = `pages/industry-${logo.src.split("/").at(-1)}`;
  assets.push({ url: sourceOrigin + logo.src, local: `public/sites/manasflow/${logo.local}` });
  delete logo.src;
}
for (const client of clients) {
  if (!client.domain) continue;
  client.logo = `pages/client-${client.domain.replace(/[^\w.-]/g, "-")}.png`;
  assets.push({ url: `https://img.logo.dev/${client.domain}?token=pk_fBi0irWDRaSuFNlLgKDnvQ&size=96&format=png&retina=true`, local: `public/sites/manasflow/${client.logo}` });
}
for (const story of stories) {
  if (!story.image) continue;
  const url = new URL(story.image, sourceOrigin);
  story.image = `pages/story-${url.pathname.split("/").at(-1)}`;
  assets.push({ url: url.href, local: `public/sites/manasflow/${story.image}` });
}
await fs.mkdir("src/data/manasflow", { recursive: true });
await fs.writeFile("src/data/manasflow/industries.json", JSON.stringify({ industries, logos }, null, 2));
await fs.writeFile("src/data/manasflow/case-studies.json", JSON.stringify({ patterns, clients, stories }, null, 2));
await fs.writeFile(`${base}/industry-case-assets.json`, JSON.stringify(assets, null, 2));
await fs.writeFile(`${base}/industry-case-deep-routes.json`, JSON.stringify([...industries.map((i) => i.href), ...stories.map((s) => s.href)], null, 2));
console.log(JSON.stringify({ industries: industries.length, clients: clients.length, stories: stories.length, assets: assets.length, routes: industries.map((i) => i.href) }, null, 2));
