/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const root = "docs/research/9hdigital/";
const html = fs.readFileSync(root + "source.html", "utf8");
const css = fs.readFileSync(root + "source-main.css", "utf8");
const urls = new Set(
  [
    ...html.matchAll(
      /https:\/\/9hdigital\.com\/[^\s'"<>;()]+\.(?:png|jpe?g|svg|gif|mp4|ttf)/g,
    ),
  ].map((m) => m[0]),
);
for (const m of css.matchAll(/url\((\/[^)]+\.(?:png|gif|ttf))\)/g))
  urls.add("https://9hdigital.com" + m[1]);
(async () => {
  const manifest = [];
  await Promise.all(
    [...urls].map(async (url) => {
      const name = path.basename(new URL(url).pathname);
      const dest = "public/sites/9hdigital/" + name;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status}: ${url}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(dest, bytes);
      manifest.push({
        source: url,
        local: "/sites/9hdigital/" + name,
        type: response.headers.get("content-type"),
        bytes: bytes.length,
        signature: bytes.subarray(0, 12).toString("hex"),
      });
    }),
  );
  fs.writeFileSync(
    root + "asset-map.json",
    JSON.stringify(
      manifest.sort((a, b) => a.local.localeCompare(b.local)),
      null,
      2,
    ),
  );
  console.log(
    `Downloaded ${manifest.length} assets (${Math.round(manifest.reduce((n, m) => n + m.bytes, 0) / 1024 / 1024)} MB)`,
  );
})();
