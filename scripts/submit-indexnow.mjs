import fs from "node:fs/promises";
import { loadTypescript } from "./lib/load-typescript.mjs";
import { INDEXNOW_ENDPOINT, INDEXNOW_KEY_PATH, indexNowPayload } from "./lib/indexnow.mjs";

const args = process.argv.slice(2);
if (args.some(arg => arg.startsWith("--") && arg !== "--dry-run")) throw new Error("Usage: npm run indexnow:submit -- [--dry-run] [URL or /path ...]");
const dryRun = args.includes("--dry-run");
const requested = args.filter(arg => arg !== "--dry-run");
const { site } = loadTypescript("src/lib/site.ts");
const { canonicalRoute } = loadTypescript("src/lib/seo-routes.ts");
const { indexableRoutes } = loadTypescript("src/lib/seo.ts");
const key = (await fs.readFile(INDEXNOW_KEY_PATH, "utf8")).trim();
const routes = requested.length ? requested.map(input => {
  const url = new URL(input, site.url);
  if (url.origin !== site.url) throw new Error(`URL is outside the canonical origin: ${input}`);
  return canonicalRoute(`${url.pathname}${url.search}`);
}) : indexableRoutes();
const urls = [...new Set(routes)];
if (!urls.length) throw new Error("No URLs to submit.");
const batches = Array.from({ length: Math.ceil(urls.length / 10000) }, (_, index) => indexNowPayload(site.url, key, urls.slice(index * 10000, (index + 1) * 10000)));
if (dryRun) {
  console.log(JSON.stringify({ dryRun: true, endpoint: INDEXNOW_ENDPOINT, keyLocation: batches[0].keyLocation, urlCount: urls.length, batches: batches.length, sample: batches[0].urlList.slice(0, 6) }, null, 2));
} else {
  // Avoid notifying engines about an unpublished checkout or an undeployed key.
  const verification = await fetch(batches[0].keyLocation, { redirect: "error", signal: AbortSignal.timeout(15000) });
  if (!verification.ok || (await verification.text()).trim() !== key) throw new Error("The live IndexNow verification file does not match this checkout. Deploy the site and key first.");
  for (const payload of batches) {
    const response = await fetch(INDEXNOW_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) });
    if (![200, 202].includes(response.status)) throw new Error(`IndexNow rejected the request (${response.status}): ${(await response.text()).slice(0, 300)}`);
    console.log(`${response.status === 202 ? "Accepted; key validation pending" : "Received by IndexNow"}: ${payload.urlList.length} URLs.`);
  }
}
