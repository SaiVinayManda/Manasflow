import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { chromium } from "../temp/browser-tools/node_modules/playwright/index.mjs";

const origin = process.env.MANASFLOW_PREVIEW_URL || "http://127.0.0.1:3100";
const output = "docs/research/manasflow/completion";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
const failedAssets = [];
const checks = [];
page.on("pageerror", error => errors.push(error.message));
page.on("response", response => { if (response.status() >= 400 && response.url().startsWith(origin)) failedAssets.push({ url: response.url(), status: response.status() }); });
const visit = async route => {
  const response = await page.goto(new URL(route, origin).href, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, route);
  await page.locator("main h1").first().waitFor();
};
const screenshot = async name => page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
try {
  await visit("/n8n-agency");
  await screenshot("agency-desktop");
  await page.locator(".service-faq details").nth(1).locator("summary").click();
  assert.equal(await page.locator(".service-faq details").nth(1).getAttribute("open"), "");
  await page.getByRole("button", { name: "Services", exact: true }).click();
  await page.locator("#mf-menu-services").waitFor({ state: "visible" });
  assert.ok(await page.locator('#mf-menu-services a[href="/n8n-agency"]').count());
  await page.keyboard.press("Escape");
  checks.push("Agency FAQ and desktop mega menu");

  await visit("/roi-calculator");
  await page.getByLabel("Process name", { exact: true }).fill("Invoice processing");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Calculate ROI", exact: true }).click();
  assert.equal(await page.getByText("Annual gross savings", { exact: true }).count(), 1);
  await screenshot("roi-results-desktop");
  checks.push("ROI wizard produces savings, payback, and projection results");

  await visit("/ai-readiness-assessment");
  await page.getByRole("button", { name: "Start Assessment", exact: true }).click();
  for (let step = 0; step < 20; step++) {
    if (await page.getByText("Your assessment results", { exact: true }).count()) break;
    const questions = page.locator("fieldset.it-question");
    for (let index = 0; index < await questions.count(); index++) await questions.nth(index).locator('input[type="radio"]').last().check();
    const advance = page.locator(".it-tool-workspace button[type=submit]");
    assert.ok(await advance.isEnabled());
    await advance.click();
  }
  assert.equal(await page.getByText("Your assessment results", { exact: true }).count(), 1);
  assert.match(await page.locator(".it-score").innerText(), /100/);
  await page.getByRole("button", { name: "Retake assessment", exact: true }).click();
  await page.getByRole("button", { name: "Start Assessment", exact: true }).click();
  assert.equal(await page.locator('fieldset.it-question input:checked').count(), 0);
  checks.push("Readiness quiz scores all answers and clears them on retake");

  await visit("/ai-model-comparison");
  const choices = page.locator(".mf-model-compare-control input");
  await choices.nth(0).check();
  await choices.nth(1).check();
  assert.equal(await page.locator("#model-comparison thead th").count(), 3);
  const row = page.locator("#model-comparison tr").filter({ has: page.getByRole("rowheader", { name: "Estimated monthly cost", exact: true }) });
  const before = await row.innerText();
  await page.getByRole("button", { name: /Heavy/ }).click();
  assert.notEqual(await row.innerText(), before);
  await screenshot("model-comparison-desktop");
  checks.push("Two-model comparison and monthly token estimates update");

  await visit("/ai-tools");
  const allTools = await page.locator(".mf-ecosystem-tool-card").count();
  await page.locator('input[type="search"]').first().fill("HubSpot");
  const matches = await page.locator(".mf-ecosystem-tool-card").count();
  assert.ok(matches > 0 && matches < allTools);
  checks.push("Directory search filters actual tool records");

  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = [];
  for (const route of ["/", "/n8n-agency", "/roi-calculator", "/ai-tools", "/directory", "/golden-offer", "/manasn8n"]) {
    await visit(route);
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: window.innerWidth }));
    if (dimensions.scroll > dimensions.viewport + 1) overflow.push({ route, ...dimensions });
    await screenshot(`mobile-${route === "/" ? "home" : route.slice(1)}`);
  }
  assert.deepEqual(overflow, []);
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.locator("#mf-mobile-menu").waitFor({ state: "visible" });
  checks.push("Seven mobile page patterns have no horizontal overflow; mobile menu opens");
  assert.deepEqual(errors, []);
  assert.deepEqual(failedAssets, []);
  const report = { origin, checkedAt: new Date().toISOString(), checks, errors, failedAssets };
  await fs.writeFile(`${output}/rendered-audit.json`, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
