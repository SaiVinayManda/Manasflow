import fs from "node:fs/promises";

const filename = "src/data/manasflow/tools.json";
const catalog = JSON.parse(await fs.readFile(filename, "utf8"));
await fs.mkdir("public/sites/manasflow/tool-previews", { recursive: true });
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
for (const tool of catalog.tools) {
  const words = tool.title.split(" ");
  const lines = [""];
  for (const word of words) {
    if ((lines.at(-1) + word).length > 32) lines.push("");
    lines[lines.length - 1] += `${lines.at(-1) ? " " : ""}${word}`;
  }
  const chart = tool.category === "Calculators"
    ? '<path d="M90 350H550M90 350V200" stroke="#45405b" stroke-width="2"/><path d="M100 335L190 310L280 285L370 248L460 210L540 160" stroke="#a4a5ed" stroke-width="4" fill="none"/><path d="M100 335L190 310L280 285L370 248L460 210L540 160V350H100Z" fill="url(#fade)"/><g fill="#a4a5ed"><circle cx="190" cy="310" r="5"/><circle cx="370" cy="248" r="5"/><circle cx="540" cy="160" r="5"/></g>'
    : tool.category === "Assessments"
      ? '<g transform="translate(320 275)" stroke="#48415e" fill="none"><path d="M0-95L90-29L56 77H-56L-90-29Z"/><path d="M0-65L62-20L38 53H-38L-62-20Z"/><path d="M0-35L33-11L21 28H-21L-33-11Z"/><path d="M0-95V0M90-29L0 0M56 77L0 0M-56 77L0 0M-90-29L0 0"/><path d="M0-80L78-25L38 53L-44 61L-60-20Z" fill="#9294df44" stroke="#a4a5ed" stroke-width="3"/></g>'
      : '<rect x="155" y="185" width="330" height="174" rx="12" fill="#242032" stroke="#49415d"/><g fill="#a4a5ed"><rect x="180" y="210" width="160" height="10" rx="5"/><rect x="180" y="238" width="270" height="6" rx="3" opacity=".5"/><rect x="180" y="258" width="235" height="6" rx="3" opacity=".4"/><rect x="180" y="278" width="260" height="6" rx="3" opacity=".3"/><rect x="180" y="310" width="100" height="26" rx="5" opacity=".7"/></g>';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><defs><linearGradient id="fade" x2="0" y2="1"><stop stop-color="#8587d4" stop-opacity=".3"/><stop offset="1" stop-color="#8587d4" stop-opacity="0"/></linearGradient><radialGradient id="bg"><stop stop-color="#292337"/><stop offset="1" stop-color="#121018"/></radialGradient></defs><rect width="640" height="400" fill="url(#bg)"/><rect x="24" y="24" width="592" height="352" rx="14" fill="none" stroke="#4a405e" stroke-opacity=".6"/><text x="52" y="57" fill="#9c99b8" font-family="Arial,sans-serif" font-size="12" letter-spacing="2">MANASFLOW · ${escape(tool.category.toUpperCase())}</text>${lines.map((line, index) => `<text x="52" y="${104 + index * 31}" fill="#f0edee" font-family="Arial,sans-serif" font-weight="600" font-size="26">${escape(line)}</text>`).join("")}${chart}</svg>`;
  const image = `tool-previews/${tool.slug}.svg`;
  await fs.writeFile(`public/sites/manasflow/${image}`, svg);
  tool.image = image;
}
await fs.writeFile(filename, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Generated ${catalog.tools.length} locally branded tool previews and repaired hub image references.`);
