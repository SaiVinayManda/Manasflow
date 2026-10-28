/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("../temp/9h-tools/node_modules/playwright");
const fs = require("fs");
const sharp = require("sharp");
const root = "docs/research/9hdigital/";
(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: root + "local-desktop-top.png" });
  await page
    .getByRole("button", { name: "View preferences", exact: true })
    .click();
  await page.getByLabel("Statistics", { exact: true }).check();
  await page
    .getByRole("button", { name: "Save preferences", exact: true })
    .click();
  const consent = JSON.parse(
    await page.evaluate(() => localStorage.getItem("nine-h-consent")),
  );
  if (!consent.choices.statistics || consent.choices.marketing)
    throw new Error("Preferences were not saved");
  await page.screenshot({ path: root + "local-desktop-clean.png" });
  const files = fs
    .readdirSync("public/sites/9hdigital")
    .filter((f) => /\.(png|jpe?g|svg|gif)$/.test(f));
  const images = await page.evaluate(
    async (files) =>
      Promise.all(
        files.map(
          (file) =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () =>
                resolve({
                  file,
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
              img.onerror = () => resolve({ file, error: true });
              img.src = "/sites/9hdigital/" + file;
            }),
        ),
      ),
    files,
  );
  const broken = images.filter((i) => i.error);
  if (broken.length) throw new Error(JSON.stringify(broken));
  const sizes = [];
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 1024 ? 844 : 1000 });
    await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
    const size = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    sizes.push(size);
    if (size.scrollWidth > width) throw new Error("Overflow at " + width);
    if (width === 390) {
      await page.screenshot({ path: root + "local-mobile-clean.png" });
      await page.evaluate(() => localStorage.removeItem("nine-h-consent"));
      await page.reload({ waitUntil: "networkidle" });
      await page.waitForTimeout(700);
      await page.screenshot({ path: root + "local-mobile-cookie.png" });
      await page.getByRole("button", { name: "Deny", exact: true }).click();
      await page
        .getByRole("button", { name: "Open menu", exact: true })
        .click();
      await page.screenshot({ path: root + "local-mobile-menu.png" });
      await page
        .getByRole("button", { name: "Close menu", exact: true })
        .click();
    }
    if (width === 1440) {
      await page.locator(".service-card").first().hover();
      await page.waitForTimeout(700);
      await page.screenshot({ path: root + "local-service-hover.png" });
      await page.getByRole("tab", { name: "Finance", exact: true }).click();
      if (
        !(await page.locator("#team-panel").innerText()).includes(
          "Director of Finance",
        )
      )
        throw new Error("Finance tab failed");
      await page.screenshot({ path: root + "local-team-finance.png" });
      await page.getByRole("tab", { name: "Technology", exact: true }).click();
      await page.mouse.wheel(0, 500);
      await page.screenshot({ path: root + "local-scrolled-header.png" });
    }
    if (width === 1920)
      await page.screenshot({ path: root + "local-wide-1920.png" });
  }
  const desktop = await Promise.all(
    ["source-desktop-top.png", "local-desktop-top.png"].map((file) =>
      sharp(root + file)
        .resize(720, 500)
        .toBuffer(),
    ),
  );
  await sharp({
    create: { width: 1440, height: 532, channels: 3, background: "#ffffff" },
  })
    .composite(desktop.map((input, i) => ({ input, left: i * 720, top: 32 })))
    .png()
    .toFile(root + "comparison-desktop.png");
  const mobile = await Promise.all(
    ["source-mobile-390-top.png", "local-mobile-cookie.png"].map((file) =>
      sharp(root + file).toBuffer(),
    ),
  );
  await sharp({
    create: { width: 780, height: 876, channels: 3, background: "#ffffff" },
  })
    .composite(mobile.map((input, i) => ({ input, left: i * 390, top: 32 })))
    .png()
    .toFile(root + "comparison-mobile.png");
  const labels = Buffer.from(
    '<svg width="1440" height="32"><text x="15" y="22" font-family="Arial" font-size="16">SOURCE — 1440 × 1000</text><text x="735" y="22" font-family="Arial" font-size="16">LOCAL — 1440 × 1000</text></svg>',
  );
  const desktopBuffer = await sharp(root + "comparison-desktop.png")
    .composite([{ input: labels, left: 0, top: 0 }])
    .toBuffer();
  fs.writeFileSync(root + "comparison-desktop.png", desktopBuffer);
  const mobileLabel = Buffer.from(
    '<svg width="780" height="32"><text x="15" y="22" font-family="Arial" font-size="16">SOURCE — 390 × 844</text><text x="405" y="22" font-family="Arial" font-size="16">LOCAL — 390 × 844</text></svg>',
  );
  const mobileBuffer = await sharp(root + "comparison-mobile.png")
    .composite([{ input: mobileLabel, left: 0, top: 0 }])
    .toBuffer();
  fs.writeFileSync(root + "comparison-mobile.png", mobileBuffer);
  const results = {
    errors,
    sizes,
    images,
    consent,
    passed: errors.length === 0,
  };
  fs.writeFileSync(root + "final-qa.json", JSON.stringify(results, null, 2));
  console.log(
    JSON.stringify({ errors, sizes, images: images.length, consent }, null, 2),
  );
  await browser.close();
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
