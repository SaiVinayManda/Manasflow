import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name).replaceAll("\\", "/");
    return entry.isDirectory() ? walk(file) : [file];
  });
}
const pattern =
  /9hdigital\.com|9hcapital\.com|HubotSans|Cairo-Regular|GTM-KNS22Q2T|139678809|093bc08beececdc3|1172610660|Kurt Zammit|Timothy Buttigieg|MFSA-main/i;
const built = [".next/server", ".next/static"].flatMap(walk);
const leaked = built.filter(
  (file) =>
    /\.(?:js|json|html|css|rsc)$/.test(file) &&
    pattern.test(fs.readFileSync(file, "utf8")),
);
assert.equal(leaked.length, 0, "Original identity in production output");
const includedArchive = walk(".next/standalone").filter((file) =>
  /\/(quarantine|temp)\//.test(file),
);
assert.equal(includedArchive.length, 0, "Quarantine in standalone output");
const inventory = JSON.parse(
  fs.readFileSync("quarantine/9hdigital/inventory-before.json", "utf8"),
);
function destination(file) {
  if (file.startsWith("public/sites/9hdigital/"))
    return file.replace(
      "public/sites/9hdigital/",
      "quarantine/9hdigital/assets/",
    );
  if (file.startsWith("src/components/sites/9hdigital/"))
    return file.replace(
      "src/components/sites/9hdigital/",
      "quarantine/9hdigital/components/",
    );
  if (file.startsWith("docs/research/9hdigital/"))
    return file.replace(
      "docs/research/9hdigital/",
      "quarantine/9hdigital/research/",
    );
  if (file.startsWith("scripts/") && file !== "scripts/.gitkeep")
    return "quarantine/9hdigital/tooling/" + path.basename(file);
  if (file === "src/app/favicon.ico")
    return "quarantine/9hdigital/template-favicon.ico";
  if (file.startsWith("src/app/"))
    return "quarantine/9hdigital/app-before/" + path.basename(file);
  return file;
}
const archiveHashes = inventory.records.map((record) => {
  const file = destination(record.file);
  assert(fs.existsSync(file), "Missing original: " + file);
  const sha256 = crypto
    .createHash("sha256")
    .update(fs.readFileSync(file))
    .digest("hex");
  assert.equal(sha256, record.sha256, "Changed original: " + file);
  return { original: record.file, preserved: file, sha256 };
});
const results = {
  passed: true,
  checkedAt: new Date().toISOString(),
  productionFilesScanned: built.length,
  identityLeaks: leaked,
  archiveInStandalone: includedArchive,
  preservedFiles: archiveHashes.length,
  archiveHashes,
};
fs.writeFileSync(
  "docs/research/manasflow/build-audit.json",
  JSON.stringify(results, null, 2),
);
console.log(
  JSON.stringify(
    {
      passed: true,
      productionFilesScanned: built.length,
      identityLeaks: leaked.length,
      preservedFiles: archiveHashes.length,
      archiveInStandalone: includedArchive.length,
    },
    null,
    2,
  ),
);
