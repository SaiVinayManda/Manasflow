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
  await page.screenshot({
    path: "docs/research/9hdigital/source-desktop-1440-top.png",
  });
  const data = await page.evaluate(() => ({
    text: document.body.innerText,
    sections: [...document.querySelectorAll("section")].map((e) => ({
      tag: e.tagName,
      cls: e.className,
      id: e.id,
      rect: {
        y: e.getBoundingClientRect().y,
        h: e.getBoundingClientRect().height,
      },
      html: e.outerHTML,
    })),
    links: [...document.querySelectorAll("a")].map((e) => ({
      text: e.innerText,
      href: e.href,
    })),
    fonts: [...document.fonts].map((f) => ({
      family: f.family,
      weight: f.weight,
      status: f.status,
    })),
    media: [...document.querySelectorAll("img,video,source")].map((e) => ({
      tag: e.tagName,
      src: e.currentSrc || e.src,
      alt: e.alt,
    })),
    headings: [...document.querySelectorAll("h1,h2,h3")].map((e) => ({
      text: e.innerText,
      css: ((s) => ({
        font: s.font,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        color: s.color,
      }))(getComputedStyle(e)),
      rect: {
        x: e.getBoundingClientRect().x,
        y: e.getBoundingClientRect().y,
        w: e.getBoundingClientRect().width,
        h: e.getBoundingClientRect().height,
      },
    })),
  }));
  fs.writeFileSync(
    "docs/research/9hdigital/desktop-inspection.json",
    JSON.stringify(data, null, 2),
  );
  const total = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (let y = 800; y < total; y += 800) {
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(600);
  }
  await page.screenshot({
    path: "docs/research/9hdigital/source-desktop-1440-full.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("https://9hdigital.com/", { waitUntil: "networkidle" });
  await page.screenshot({
    path: "docs/research/9hdigital/source-mobile-390-top.png",
  });
  for (let y = 0; y < 14000; y += 700) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(100);
  }
  await page.screenshot({
    path: "docs/research/9hdigital/source-mobile-390-full.png",
    fullPage: true,
  });
  fs.writeFileSync("docs/research/9hdigital/mobile.html", await page.content());
  console.log(
    JSON.stringify(
      { total, headings: data.headings, fonts: data.fonts },
      null,
      2,
    ),
  );
  await browser.close();
})();
