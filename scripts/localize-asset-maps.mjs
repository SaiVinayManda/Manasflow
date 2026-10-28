import fs from "node:fs/promises";

for (const file of [
  "docs/research/manasflow/site-clone/asset-map.json",
  "docs/research/manasflow/linked-pages/asset-map.json",
]) {
  const entries = JSON.parse(await fs.readFile(file, "utf8"));
  for (const entry of entries) if (entry.local) entry.url = `/${entry.local.replace(/^public\//, "")}`;
  await fs.writeFile(file, `${JSON.stringify(entries, null, 2)}\n`);
}

const auditPath = "docs/research/manasflow/site-clone/static-audit.json";
try {
  const audit = JSON.parse(await fs.readFile(auditPath, "utf8"));
  delete audit.source;
  audit.site = "Manasflow";
  await fs.writeFile(auditPath, `${JSON.stringify(audit, null, 2)}\n`);
} catch {}
