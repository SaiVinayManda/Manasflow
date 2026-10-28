import fs from "node:fs/promises";
const known = new Set(["/", ...JSON.parse(await fs.readFile("src/data/manasflow/details-index.json", "utf8")).map(page => page.route)]);
for (const entry of await fs.readdir("src/app", { withFileTypes: true })) if (entry.isDirectory() && !entry.name.startsWith("[")) known.add(`/${entry.name}`);
known.add("/agency/[...slug]");
for (const file of ["src/components/sites/manasflow/chrome.tsx", "src/components/sites/manasflow/home.tsx", "src/components/sites/manasflow/catalogs.tsx"]) {
  const source = await fs.readFile(file, "utf8");
  const routes = [...source.matchAll(/["'`]\/(?!\/)([A-Za-z0-9_?=#./-]+)["'`]/g)].map(match => `/${match[1].split(/[?#]/)[0].replace(/\/$/, "")}`);
  const missing = [...new Set(routes.filter(route => route && !route.startsWith("/#") && !known.has(route) && !(route.startsWith("/agency/") && known.has("/agency/[...slug]"))))];
  console.log(`${file}: ${missing.length ? `unmatched ${missing.join(", ")}` : "all static local routes resolve"}`);
}
const source = await fs.readFile("src/components/sites/manasflow/chrome.tsx", "utf8");
for (const route of ["/industries", "/blog", "/case-studies", "/playbooks", "/courses", "/services", "/contact"]) {
  if (!source.includes(route)) throw new Error(`The local navigation is missing ${route}.`);
}
if (!source.includes("info@manasflow.com")) throw new Error("The Manasflow contact address is missing from the shared chrome.");
