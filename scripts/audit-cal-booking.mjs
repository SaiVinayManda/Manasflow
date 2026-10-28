import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
const files = (await walk(".next/server/app")).filter(file => file.endsWith(".html"));
const decode = text => text.replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&amp;", "&");
const labelOf = html => decode(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
const attributes = html => Object.fromEntries([...html.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1], decode(match[2])]));
const labels = new Map();
const failures = [];
let triggers = 0;
let pagesWithBooking = 0;
for (const file of files) {
  const html = await fs.readFile(file, "utf8");
  let pageTriggers = 0;
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const attrs = attributes(match[1]);
    const label = labelOf(match[2]);
    if (attrs["data-booking-link"]) {
      triggers++; pageTriggers++; labels.set(label, (labels.get(label) || 0) + 1);
      let config;
      try { config = JSON.parse(attrs["data-cal-config"]); } catch { failures.push({ file, label, issue: "Invalid Cal config" }); }
      if (attrs.href !== "https://cal.com/manasflow/30min" || attrs["data-booking-link"] !== "manasflow/30min" || attrs["data-cal-link"] || attrs["data-cal-origin"] !== "https://cal.com" || attrs["data-cal-namespace"] !== "30min" || config?.layout !== "month_view" || config?.useSlotsViewOnSmallScreen !== "true" || config?.theme !== "light") failures.push({ file, label, issue: "Incorrect trigger configuration", attrs });
    } else if (/^\/(?:contact|consultation)(?:[?#/]|$)/.test(attrs.href || "") && /\b(?:book|schedule|free consultation|strategy call|strategy session)\b/i.test(label)) failures.push({ file, label, href: attrs.href, issue: "Booking CTA still navigates internally" });
  }
  if (pageTriggers) pagesWithBooking++;
}
const report = { checkedAt: new Date().toISOString(), htmlPages: files.length, pagesWithBooking, bookingTriggers: triggers, failures, labels: Object.fromEntries(labels) };
await fs.mkdir("docs/research/manasflow/booking", { recursive: true });
await fs.writeFile("docs/research/manasflow/booking/build-audit.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, labels: [...labels.keys()].slice(0, 28) }, null, 2));
assert.ok(triggers > 0);
assert.equal(failures.length, 0, "Booking trigger audit failed");
