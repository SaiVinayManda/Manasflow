import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const roots = ["src", "public/sites/9hdigital", "docs/research/9hdigital", "scripts"];
const identity = /9h(?:digital|capital|-digital)?|niu-theme|HubotSans|Cairo|nine-(?:site|header|hero|footer|h-consent)|NineH|9H|MFSA|Kindred|Crosscraft|Al Balad|Insinet|Malta Gaming|Kurt Zammit|Peter Bugeja|Kenneth Mifsud|Shaima|NetRefer|MISK|Vitel|Supp Store|Mapfre|Timothy|Buttigieg|Yara Omara|Head of Tech|Chief Creative Officer|Director of Finance|vimeo|1172610660|GTM-KNS22Q2T|139678809|093bc08beececdc3|hs-scripts|visibilitykit|complianz|lead-source-tracker|schema.org|application\/ld\+json|og:|twitter:|mailto:|tel:|<form|action=/i;
const textExtensions = /\.(tsx?|jsx?|mjs|cjs|css|json|html|md|svg)$/i;
function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name).replaceAll("\\", "/");
    return entry.isDirectory() ? walk(file) : [file];
  });
}
const files = [...new Set(roots.flatMap(walk))].filter(file => !file.endsWith("audit-original.mjs"));
const records = files.map(file => {
  const bytes = fs.readFileSync(file);
  const matches = textExtensions.test(file) ? bytes.toString("utf8").split(/\r?\n/).flatMap((text, index) => identity.test(text) ? [{ line: index + 1, text }] : []) : [];
  return { file, bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex"), identityMatches: matches };
});
const html = fs.readFileSync("docs/research/9hdigital/source.html", "utf8");
const jsonLd = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
const summary = {
  capturedAt: new Date().toISOString(),
  scope: roots,
  records,
  jsonLd,
  sourceScripts: [...html.matchAll(/<script[^>]*\bsrc=["']([^"']+)/g)].map(match => match[1]),
  sourceForms: [...html.matchAll(/<form\b[^>]*>/g)].map(match => match[0]),
  sourceContacts: [...new Set([...html.matchAll(/(?:mailto:|tel:)[^"'<>\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)].map(match => match[0]))],
};
fs.mkdirSync("quarantine/9hdigital", { recursive: true });
fs.writeFileSync("quarantine/9hdigital/inventory-before.json", JSON.stringify(summary, null, 2));
const lines = records.filter(record => record.identityMatches.length).map(record => `- \`${record.file}\`: lines ${record.identityMatches.map(match => match.line).join(", ")}`);
fs.writeFileSync("quarantine/9hdigital/identity-locations.md", "# Original identity locations\n\nEvery matched line, including full source text, is recorded in inventory-before.json. Binary assets are recorded with SHA-256 hashes.\n\n" + lines.join("\n") + "\n");
console.log(JSON.stringify({ files: records.length, identityFiles: lines.length, assets: records.filter(r => r.file.startsWith("public/")).length, jsonLd }, null, 2));
