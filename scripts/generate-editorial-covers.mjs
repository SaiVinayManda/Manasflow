import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { sanitizeText } from "./sanitize-manasflow-content.mjs";

const workspace = await fs.realpath(process.cwd());
const publicRoot = path.resolve(workspace, "public/sites/manasflow");
const editorialRoot = path.resolve(publicRoot, "editorial");
const archiveRoot = path.resolve(workspace, "quarantine/source-editorial-assets");
const dataRoot = path.resolve(workspace, "src/data/manasflow");
const auditRoot = path.resolve(workspace, "docs/research/manasflow");
function assertWithin(filename, root) {
  const resolved = path.resolve(filename);
  if (!resolved.startsWith(`${root}${path.sep}`)) throw new Error(`Refusing path outside intended directory: ${resolved}`);
  return resolved;
}
assertWithin(editorialRoot, publicRoot);
assertWithin(archiveRoot, workspace);
const hash = input => crypto.createHash("sha256").update(input).digest("hex");
const escape = input => input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
async function files(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const output = [];
  for (const entry of entries) {
    const filename = assertWithin(path.join(root, entry.name), root);
    if (entry.isDirectory()) output.push(...await files(filename));
    else if (entry.isFile()) output.push(filename);
  }
  return output;
}
const oldImagePattern = /(?:\/sites\/manasflow\/)?pages\/(catalog-[a-z0-9]+\.(?:png|webp|jpe?g))$/i;
const newImagePattern = /(?:\/sites\/manasflow\/)?editorial\/([a-z0-9]+)\.svg$/i;
const imageMap = new Map();
const records = [];
for (const filename of await files(dataRoot)) {
  if (!filename.endsWith(".json") || path.basename(filename) === "tools.json") continue;
  const before = await fs.readFile(filename, "utf8");
  let value;
  try { value = JSON.parse(before); } catch { continue; }
  function collect(item, inherited = {}) {
    if (Array.isArray(item)) { item.forEach(child => collect(child, inherited)); return; }
    if (!item || typeof item !== "object") return;
    const context = {
      title: typeof item.title === "string" ? item.title : typeof item.name === "string" ? item.name : inherited.title,
      route: typeof item.href === "string" ? item.href : typeof item.route === "string" ? item.route : inherited.route,
    };
    for (const [key, entry] of Object.entries(item)) {
      if (typeof entry === "string" && (oldImagePattern.test(entry) || newImagePattern.test(entry))) {
        const oldName = entry.match(oldImagePattern)?.[1];
        const id = entry.match(newImagePattern)?.[1] || hash(oldName).slice(0, 16);
        const title = sanitizeText(context.title || "AI & Automation — Practical Guides");
        const route = context.route || "/blog";
        const local = `/sites/manasflow/editorial/${id}.svg`;
        if (!imageMap.has(id)) imageMap.set(id, { id, title, route, local, original: oldName || "" });
        item[key] = entry.startsWith("/sites/") ? local : local.replace("/sites/manasflow/", "");
      } else collect(entry, context);
    }
  }
  collect(value);
  if (JSON.stringify(JSON.parse(before)) !== JSON.stringify(value)) records.push({ filename, value });
}

function estimatedWidth(value, size) {
  let units = 0;
  for (const char of value) {
    if (/[ilI1|!.,:;'`]/.test(char)) units += .27;
    else if (/[mwMW@%&]/.test(char)) units += .86;
    else if (/\s/.test(char)) units += .29;
    else if (/[A-Z0-9]/.test(char)) units += .66;
    else units += .53;
  }
  return units * size;
}
function wrap(value, size) {
  const lines = [];
  let line = "";
  for (const word of value.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && estimatedWidth(next, size) > 1030) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  return lines;
}
function cover(record) {
  let size = 68;
  let lines = wrap(record.title, size);
  while (lines.length * size * 1.1 > 350 && size > 32) { size -= 2; lines = wrap(record.title, size); }
  const category = record.route.startsWith("/courses") ? "COURSE" : record.route.startsWith("/resources") || record.route.startsWith("/playbooks") ? "PLAYBOOK" : "FIELD NOTES";
  const lineHeight = Math.round(size * 1.1);
  const titleY = Math.round(190 + (350 - lines.length * lineHeight) / 2 + size * .7);
  const tspans = lines.map((line, index) => `<tspan x="76" dy="${index ? lineHeight : 0}">${escape(line)}</tspan>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">${escape(record.title)} — ManasFlow</title><desc id="desc">An original ManasFlow editorial cover with a light grid, a purple brand badge, and neutral geometric artwork.</desc>
  <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#dadbea" stroke-width="1"/></pattern><linearGradient id="wash" x1="0" x2="1" y2="1"><stop stop-color="#f7f7fc"/><stop offset="1" stop-color="#ecebfa"/></linearGradient><linearGradient id="violet" x1="0" x2="1" y2="1"><stop stop-color="#6d64df"/><stop offset="1" stop-color="#9892e7"/></linearGradient></defs>
  <rect width="1200" height="675" fill="url(#wash)"/><rect width="1200" height="675" fill="url(#grid)" opacity=".7"/>
  <g opacity=".1" fill="none" stroke="#6961c8" stroke-width="2"><circle cx="1080" cy="405" r="176"/><circle cx="1080" cy="405" r="128"/><path d="M890 595 1200 285M968 620 1200 388"/></g>
  <rect x="76" y="66" width="223" height="43" rx="21.5" fill="#665bd7"/><circle cx="99" cy="87.5" r="6" fill="#fff"/><text x="116" y="93" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="700" letter-spacing="1.9" fill="#fff">MANASFLOW</text>
  <text x="1124" y="94" text-anchor="end" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="700" letter-spacing="2" fill="#716e89">${category}</text>
  <text x="76" y="${titleY}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="700" letter-spacing="-1.8" fill="#1c2338">${tspans}</text>
  <path d="M76 578H1124" stroke="#cfcee1"/>
  <text x="76" y="619" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="700" letter-spacing="1.2" fill="#68627f">AI · ENGINEERING · AUTOMATION</text>
  <text x="1124" y="619" text-anchor="end" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="700" fill="#665bd7">manasflow.com</text>
  <g transform="translate(1092 135)" fill="url(#violet)" opacity=".6"><rect width="10" height="29"/><rect x="15" y="9" width="10" height="29"/><rect x="30" width="10" height="29"/></g>
</svg>\n`;
}

await fs.mkdir(editorialRoot, { recursive: true });
await fs.mkdir(archiveRoot, { recursive: true });
for (const record of imageMap.values()) await fs.writeFile(assertWithin(path.join(editorialRoot, `${record.id}.svg`), editorialRoot), cover(record));
for (const record of records) await fs.writeFile(assertWithin(record.filename, dataRoot), `${JSON.stringify(record.value, null, 2)}\n`);

const moved = [];
for (const filename of await files(publicRoot)) {
  if (!/^catalog-[a-z0-9]+\.(?:png|webp|jpe?g)$/i.test(path.basename(filename))) continue;
  const source = assertWithin(await fs.realpath(filename), publicRoot);
  const digest = hash(await fs.readFile(source));
  let destination = assertWithin(path.join(archiveRoot, path.basename(source)), archiveRoot);
  if (await fs.stat(destination).catch(() => false)) destination = assertWithin(path.join(archiveRoot, `${path.parse(source).name}-${digest.slice(0, 12)}${path.extname(source)}`), archiveRoot);
  if (await fs.stat(destination).catch(() => false)) throw new Error(`Archive collision; no file has been overwritten: ${destination}`);
  await fs.rename(source, destination);
  moved.push({ source: path.relative(workspace, source).replaceAll(path.sep, "/"), destination: path.relative(workspace, destination).replaceAll(path.sep, "/"), sha256: digest });
}
let previous = { archived: [] };
try { previous = JSON.parse(await fs.readFile(path.join(archiveRoot, "manifest.json"), "utf8")); } catch {}
await fs.writeFile(path.join(archiveRoot, "manifest.json"), `${JSON.stringify({ archived: [...previous.archived, ...moved] }, null, 2)}\n`);
await fs.mkdir(auditRoot, { recursive: true });
const report = { generatedCovers: imageMap.size, updatedDataFiles: records.map(record => path.relative(workspace, record.filename).replaceAll(path.sep, "/")), archivedThisRun: moved.length, archivedTotal: previous.archived.length + moved.length, covers: [...imageMap.values()] };
await fs.writeFile(path.join(auditRoot, "editorial-cover-audit.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ generatedCovers: report.generatedCovers, updatedDataFiles: report.updatedDataFiles, archivedThisRun: report.archivedThisRun, archivedTotal: report.archivedTotal }, null, 2));
