/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("../temp/browser-tools/node_modules/playwright");
const fs = require("fs");
const assert = require("node:assert/strict");

const base = process.env.REBRAND_QA_URL || "http://127.0.0.1:3001";
const evidence = "docs/research/manasflow/";
const forbidden =
  /9hdigital|9hcapital|HubotSans|Cairo-Regular|GTM-KNS22Q2T|139678809|093bc08beececdc3|1172610660|player\.vimeo|hs-scripts|visibilitykit|Kurt Zammit|Timothy Buttigieg|MFSA|Kindred Cheltenham|Crosscraft|Insinet|NetRefer|The Supp Store|Trusted By Industry Leaders|Turning complexity into clarity/i;

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  const externalRequests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== base)
      externalRequests.push(request.url());
  });
  const routes = [];
  for (const route of ["/", "/contact", "/privacy", "/terms", "/cookies"]) {
    const response = await page.goto(base + route, {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200);
    const html = await page.content();
    assert.equal(forbidden.test(html), false, "Original identity in " + route);
    const info = await page.evaluate(() => ({
      title: document.title,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      ogImage: document.querySelector('meta[property="og:image"]')?.content,
      mailto: [...document.querySelectorAll('a[href^="mailto:"]')].map(
        (link) => link.href,
      ),
      remoteScripts: [...document.scripts]
        .map((script) => script.src)
        .filter(Boolean)
        .filter((src) => new URL(src).origin !== location.origin),
      forms: document.forms.length,
      iframes: document.querySelectorAll("iframe").length,
      robots: document.querySelector('meta[name="robots"]')?.content,
      jsonLd: [
        ...document.querySelectorAll('script[type="application/ld+json"]'),
      ].map((script) => JSON.parse(script.textContent)),
    }));
    assert(info.title.includes("Manasflow"));
    assert(
      info.mailto.every((href) => href.startsWith("mailto:info@manasflow.com")),
    );
    assert.equal(info.forms, 0);
    assert.equal(info.iframes, 0);
    assert.equal(info.jsonLd[0].name, "Manasflow");
    assert.equal(info.jsonLd[0].email, "info@manasflow.com");
    if (["/privacy", "/terms"].includes(route)) {
      assert(info.robots.includes("noindex"));
      assert(
        await page.getByText("Draft notice.", { exact: true }).isVisible(),
      );
    }
    routes.push({ route, status: response.status(), ...info });
    if (route === "/contact" || route === "/privacy")
      await page.screenshot({
        path: evidence + route.slice(1) + "-desktop.png",
        fullPage: true,
      });
  }
  for (const [alias, destination] of [
    ["/privacy-policy", "/privacy"],
    ["/cookie-policy", "/cookies"],
  ]) {
    await page.goto(base + alias, { waitUntil: "networkidle" });
    assert.equal(new URL(page.url()).pathname, destination);
  }
  await page.goto(base, { waitUntil: "networkidle" });
  await page.screenshot({ path: evidence + "home-desktop-1440.png" });
  await page.screenshot({
    path: evidence + "home-desktop-full.png",
    fullPage: true,
  });
  for (const title of [
    "Connected systems",
    "Practical automation",
    "Product & web design",
    "Digital products",
  ]) {
    await page.getByRole("tab", { name: title, exact: false }).click();
    assert.equal(
      await page
        .getByRole("tab", { name: title, exact: false })
        .getAttribute("aria-selected"),
      "true",
    );
    assert(await page.getByRole("tabpanel").isVisible());
  }
  await page
    .getByRole("tab", { name: "Digital products", exact: false })
    .focus();
  await page.keyboard.press("ArrowDown");
  assert.equal(
    await page
      .getByRole("tab", { name: "Connected systems", exact: false })
      .getAttribute("aria-selected"),
    "true",
  );
  await page.screenshot({ path: evidence + "services-connected.png" });
  const sizes = [];
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto(base, { waitUntil: "networkidle" });
    const size = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert(size.scrollWidth <= width, "Overflow at " + width);
    sizes.push(size);
    if (width === 390) {
      await page.screenshot({ path: evidence + "home-mobile-390.png" });
      await page.screenshot({
        path: evidence + "home-mobile-full.png",
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Open menu", exact: true })
        .click();
      assert(
        await page
          .getByRole("navigation", { name: "Mobile navigation" })
          .isVisible(),
      );
      await page.screenshot({ path: evidence + "mobile-menu.png" });
      await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "What we do", exact: true })
        .click();
      assert.equal(
        await page
          .getByRole("button", { name: "Open menu", exact: true })
          .getAttribute("aria-expanded"),
        "false",
      );
      await page
        .getByRole("button", { name: "Open menu", exact: true })
        .click();
      await page.keyboard.press("Escape");
      assert.equal(
        await page
          .getByRole("button", { name: "Open menu", exact: true })
          .getAttribute("aria-expanded"),
        "false",
      );
      await page.goto(base + "/contact", { waitUntil: "networkidle" });
      await page.screenshot({
        path: evidence + "contact-mobile.png",
        fullPage: true,
      });
    }
    if (width === 1920)
      await page.screenshot({ path: evidence + "home-wide-1920.png" });
  }
  const assets = [
    "/brand/mark.svg",
    "/brand/flow-study.svg",
    "/brand/social-card.png",
    "/brand/apple-touch-icon.png",
    "/brand/icon-512.png",
    "/brand/favicon-32.png",
  ];
  const imageResults = await page.evaluate(
    async (paths) =>
      Promise.all(
        paths.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () =>
                resolve({
                  src,
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
              img.onerror = () => resolve({ src, error: true });
              img.src = src;
            }),
        ),
      ),
    assets,
  );
  assert(
    imageResults.every((image) => !image.error),
    "Broken brand asset",
  );
  const inventory = JSON.parse(
    fs.readFileSync("quarantine/9hdigital/inventory-before.json", "utf8"),
  );
  const removed = [];
  for (const item of inventory.records.filter((record) =>
    record.file.startsWith("public/"),
  )) {
    const url = "/" + item.file.slice("public/".length);
    const response = await page.request.get(base + url);
    assert.equal(response.status(), 404, "Old asset is public: " + url);
    removed.push({ url, status: response.status() });
  }
  const archiveResponse = await page.request.get(
    base + "/quarantine/9hdigital/inventory-before.json",
  );
  assert.equal(archiveResponse.status(), 404);
  const faviconResponse = await page.request.get(base + "/favicon.ico");
  assert.equal(faviconResponse.status(), 200);
  const storage = await page.evaluate(() => ({
    cookies: document.cookie,
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
  }));
  assert.equal(storage.cookies, "");
  assert.equal(storage.local.length, 0);
  assert.equal(storage.session.length, 0);
  assert.equal(externalRequests.length, 0, "External requests occurred");
  assert.equal(errors.length, 0, "Browser error");
  const result = {
    passed: true,
    checkedAt: new Date().toISOString(),
    routes,
    sizes,
    imageResults,
    removed,
    archiveStatus: archiveResponse.status(),
    faviconStatus: faviconResponse.status(),
    storage,
    externalRequests,
    errors,
    interactions: [
      "All four service tabs",
      "Keyboard service navigation",
      "Mobile menu open/anchor-close/Escape",
      "Local contact and legal routes",
      "Legal redirects",
      "Manasflow email links",
    ],
  };
  fs.writeFileSync(
    evidence + "qa-results.json",
    JSON.stringify(result, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        passed: result.passed,
        routes: routes.length,
        sizes,
        removedAssets: removed.length,
        externalRequests,
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
  process.exit(0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
