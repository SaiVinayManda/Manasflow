import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const write = process.argv.includes("--write");
const substitutions = [
  [/https?:\/\/(?:www\.)?github\.com\/walidboulanouar\/(?:Ay-Skills|ay-skills)[^\s"<>]*/gi, "/manas-skills"],
  [/https?:\/\/(?:www\.)?github\.com\/walidboulanouar\/[^\s"<>]*/gi, "/manas-framework"],
  [/\bgithub\.com\/walidboulanouar\/[^\s"<>]*/gi, "/manas-framework"],
  [/https?:\/\/(?:www\.)?linkedin\.com\/(?:in\/(?:walid-boulanouar|adeldahani)|company\/ay-automate)[^\s"<>]*/gi, "/contact"],
  [/https?:\/\/(?:www\.)?(?:cal\.com|calendly\.com)\/(?:walid|ayautomate|ay-automate)[^\s"<>]*/gi, "/consultation"],
  [/(?:walid|contact|adel)@(?:ayautomate|manasflow)\.com/gi, "info@manasflow.com"],
  [/https?:\/\/(?:www\.)?ayautomate\.(?:com|dev)(?=\/)/gi, ""],
  [/https?:\/\/(?:www\.)?ayautomate\.(?:com|dev)\b/gi, "/"],
  [/https?:\/\/(?:www\.)?ayrank\.(?:com|ai)\/?/gi, "/manasrank"],
  [/https?:\/\/(?:www\.)?aydesign\.(?:ai|com)\/?/gi, "/manasdesign"],
  [/https?:\/\/(?:www\.)?ayn8n\.com\/?/gi, "/manasn8n"],
  [/https?:\/\/(?:www\.)?ayclaude\.com\/?/gi, "/manasclaude"],
  [/ayautomate\.(?:com|dev)/gi, "manasflow.com"],
  [/\bay[ -]?automate\b/gi, "ManasFlow"],
  [/\bayrank\b/gi, match => match === match.toLowerCase() ? "manasrank" : "ManasRank"],
  [/\baydesign\b/gi, match => match === match.toLowerCase() ? "manasdesign" : "ManasDesign"],
  [/\bayn8n\b/gi, match => match === match.toLowerCase() ? "manasn8n" : "ManasN8N"],
  [/\bayclaude\b/gi, match => match === match.toLowerCase() ? "manasclaude" : "ManasClaude"],
  [/\bAY[ -]Skills\b/gi, "Manas Skills"],
  [/\bAY[ -]Framework\b/gi, "Manas Framework"],
  [/\bWalid Boulanouar\b/gi, "the ManasFlow team"],
  [/\bAdel Dahani\b/gi, "the ManasFlow team"],
  [/\b(?:Walid|Boulanouar|Dahani|Adel)\b/gi, "the ManasFlow team"],
  [/\.ay(?=\/)/g, ".manasflow"],
  [/resume-ay\b/g, "resume-manasflow"],
  [/walid-writing-style/g, "manasflow-writing-style"],
  [/\bwalidboulanouar\b/gi, "manasflow"],
  [/\bAY\b/g, "ManasFlow"],
  [/Manasflow/g, "ManasFlow"],
  [/https?:\/\/maestro\.manasflow\.com\/?/gi, "/manas-framework"],
];

export function sanitizeText(input) {
  return substitutions.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), input);
}

function sanitize(value) {
  if (typeof value === "string") return sanitizeText(value);
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitize(item)]));
  return value;
}

export async function sanitizeContent() {
const updates = [];
const detailFolder = "src/data/manasflow/details";
for (const name of await fs.readdir(detailFolder)) {
  if (!name.endsWith(".json")) continue;
  const filename = path.join(detailFolder, name);
  const before = await fs.readFile(filename, "utf8");
  const record = sanitize(JSON.parse(before));
  const after = JSON.stringify(record);
  const destination = path.join(detailFolder, `${Buffer.from(record.route).toString("base64url")}.json`);
  if (JSON.stringify(JSON.parse(before)) !== after || filename !== destination) {
    updates.push({ file: filename, destination });
    if (write) {
      await fs.writeFile(filename, `${after}\n`);
      if (filename !== destination) await fs.rename(filename, destination);
    }
  }
}
for (const name of ["details-index.json", "catalogs.json", "company-pages.json", "case-studies.json", "industries.json", "models.json", "tools.json"]) {
  const filename = path.join("src/data/manasflow", name);
  const before = await fs.readFile(filename, "utf8").catch(() => null);
  if (!before) continue;
  const record = sanitize(JSON.parse(before));
  if (JSON.stringify(JSON.parse(before)) !== JSON.stringify(record)) {
    updates.push({ file: filename });
    if (write) await fs.writeFile(filename, `${JSON.stringify(record, null, 2)}\n`);
  }
}
const sourceAssetNames = ["tool-ayrank-com.png", "tool-ayn8n-com.png", "tool-ayclaude-com.png", "aydesign.png"];
if (write) {
  await fs.mkdir("quarantine/source-product-assets", { recursive: true });
  for (const name of sourceAssetNames) {
    const source = path.join("public/sites/manasflow", name);
    if (await fs.stat(source).catch(() => false)) await fs.rename(source, path.join("quarantine/source-product-assets", name));
  }
}
console.log(JSON.stringify({ write, contentFilesChanged: updates.length, renamedRoutes: updates.filter(update => update.destination && update.file !== update.destination).length, retiredProductAssets: sourceAssetNames.length }, null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await sanitizeContent();
