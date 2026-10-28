/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("../temp/9h-tools/node_modules/playwright");
const fs = require("fs");
(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const results = {};
  for (const [kind, url] of [
    ["source", "https://9hdigital.com/"],
    ["local", "http://127.0.0.1:3000"],
  ]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const failed = [];
    page.on("response", (r) => {
      if (r.status() >= 400 && r.url().includes("/sites/"))
        failed.push(r.url());
    });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `docs/research/9hdigital/${kind}-desktop-top.png`,
    });
    await page.getByRole("button", { name: "Deny", exact: true }).click();
    await page.screenshot({
      path: `docs/research/9hdigital/${kind}-desktop-clean.png`,
    });
    const selectors =
      kind === "source"
        ? [
            "[data-feature-card]",
            "[data-pinned-tabs]",
            "#tabs-content",
            "#hover-posts",
            "[data-testimonials-section]",
          ]
        : [
            ".service-grid",
            ".markets-layout",
            ".team-panel",
            ".insight-list",
            ".testimonials-scroll",
          ];
    for (const [i, selector] of selectors.entries()) {
      const target = page.locator(selector).first();
      const top = await target.evaluate(
        (e) => e.getBoundingClientRect().top + window.scrollY - 114,
      );
      // Wheel input exercises the source's scroll listeners and pinned scenes.
      await page.mouse.wheel(
        0,
        top - (await page.evaluate(() => window.scrollY)),
      );
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: `docs/research/9hdigital/${kind}-section-${i}.png`,
      });
    }
    results[kind] = {
      errors,
      failed,
      dimensions: await page.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      })),
    };
    if (kind === "source") {
      results.source.measurements = await page.evaluate(() =>
        [...document.querySelectorAll("[data-tab-item]")].map((e) => ({
          h: e.offsetHeight,
          css: getComputedStyle(e).cssText,
        })),
      );
    } else {
      await page
        .getByRole("button", { name: "Next testimonial", exact: true })
        .click();
      await page.waitForTimeout(1200);
      results.local.testimonial = await page
        .locator(".testimonial-progress")
        .innerText();
      await page.getByRole("tab", { name: "Marketing", exact: true }).click();
      results.local.marketing = await page.locator("#team-panel").innerText();
      await page
        .getByRole("button", { name: "Play video", exact: true })
        .click();
      results.local.video = await page
        .locator("dialog")
        .evaluate((e) => e.open);
      await page
        .getByRole("button", { name: "Close video", exact: true })
        .click();
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `docs/research/9hdigital/${kind}-mobile-clean.png`,
    });
    await page
      .getByRole("button", { name: "Open menu", exact: true })
      .first()
      .click();
    await page.screenshot({
      path: `docs/research/9hdigital/${kind}-mobile-menu.png`,
    });
    await (
      kind === "source"
        ? page
            .locator("#mobile-menu-panel")
            .getByRole("button", { name: "Close menu", exact: true })
        : page.getByRole("button", { name: "Close menu", exact: true })
    ).click();
    if (kind === "local") {
      await page
        .getByRole("button", { name: "iGaming & Entertainment", exact: false })
        .click();
      results.local.accordion = await page
        .locator("#market-detail-1")
        .isVisible();
      await page
        .getByRole("button", { name: "Next testimonial", exact: true })
        .click();
      results.local.mobileTestimonial = await page
        .locator(".testimonial-progress")
        .innerText();
    }
    results[kind].mobile = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      hero: document.querySelector("main section").getBoundingClientRect()
        .height,
    }));
    if (kind === "local") {
      for (let y = 0; y < 10000; y += 700) {
        await page.mouse.wheel(0, 700);
        await page.waitForTimeout(100);
      }
      await page.screenshot({
        path: "docs/research/9hdigital/local-mobile-full.png",
        fullPage: true,
      });
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(url, { waitUntil: "networkidle" });
      await page.screenshot({
        path: "docs/research/9hdigital/local-wide-1920.png",
      });
    }
    await page.close();
  }
  fs.writeFileSync(
    "docs/research/9hdigital/verification.json",
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
