/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("../temp/9h-tools/node_modules/playwright");
const fs = require("fs");
(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.goto("https://9hdigital.com/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Deny", exact: true }).click();
  await page.screenshot({
    path: "docs/research/9hdigital/source-desktop-clean.png",
  });
  await page.locator(".services-menu-trigger").click();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: "docs/research/9hdigital/source-services-menu.png",
  });
  await page.mouse.move(700, 600);
  await page.locator(".services-menu-trigger").click();
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "docs/research/9hdigital/source-services.png",
  });
  await page.mouse.wheel(0, 1300);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "docs/research/9hdigital/source-market.png" });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("https://9hdigital.com/", { waitUntil: "networkidle" });
  await page.screenshot({
    path: "docs/research/9hdigital/source-wide-1920.png",
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("https://9hdigital.com/", { waitUntil: "networkidle" });
  const extracted = await page.evaluate(() => {
    const text = (e) => e?.textContent.trim().replace(/\s+/g, " ");
    return {
      services: [...document.querySelectorAll("[data-feature-card]")].map(
        (e) => ({
          title: text(e.querySelector("h5")),
          description: text(e.querySelector("p")),
          image: e.querySelector("img")?.src,
          links: [...e.querySelectorAll("a")].map((a) => ({
            text: text(a),
            href: a.href,
          })),
        }),
      ),
      teams: [
        ...document.querySelectorAll('#tabs-content [role="tabpanel"]'),
      ].map((e) => ({
        description: text(e.querySelector("p")),
        quote: text(e.querySelector(".flex-1.text-center")),
        image: e.querySelector("img")?.src,
        name: text(
          e.querySelector("img")?.parentElement.nextElementSibling.children[0],
        ),
        role: text(
          e.querySelector("img")?.parentElement.nextElementSibling.children[1],
        ),
      })),
      posts: [...document.querySelectorAll(".post-item")].map((e) => ({
        title: text(e.querySelector("h4")),
        href: e.href,
        hover: e.getAttribute("@mouseenter"),
      })),
      testimonials: [
        ...document.querySelectorAll("#testimonials-slider .swiper-slide"),
      ].map((e) => ({
        text: text(e.querySelector("h4")),
        image: e.querySelector("img")?.src,
        person: [...e.querySelectorAll(".flex-col.gap-0\\.5 div")].map(text),
      })),
      footer: document.querySelector("footer")?.outerHTML,
      buttons: [...document.querySelectorAll("button")].map((e) => ({
        text: text(e),
        aria: e.getAttribute("aria-label"),
        outer: e.outerHTML.slice(0, 400),
      })),
      globals: { lenis: !!window.lenis },
    };
  });
  fs.writeFileSync(
    "docs/research/9hdigital/content.json",
    JSON.stringify(extracted, null, 2),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("https://9hdigital.com/", { waitUntil: "networkidle" });
  await page.screenshot({
    path: "docs/research/9hdigital/source-mobile-clean.png",
  });
  console.log(await page.locator("header").innerText());
  console.log(
    await page
      .locator("header button")
      .evaluateAll((es) => es.map((e) => e.outerHTML)),
  );
  await page.locator("header button").first().click();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: "docs/research/9hdigital/source-mobile-menu.png",
  });
  await browser.close();
  process.exit(0);
})();
