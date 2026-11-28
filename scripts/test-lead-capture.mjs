import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadTypescript } from "./lib/load-typescript.mjs";

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "mf-lead-tests-"));
process.env.LEAD_DATA_DIR = tmpDir;
process.env.LEAD_LOCAL_LOG = "true";

const { scoreLead } = loadTypescript("src/lib/lead-scoring.ts");
const { resetLeadStoreStateForTests, checkRateLimit, checkDuplicateSubmission, isSpamSubmission } = loadTypescript("src/lib/lead-store.ts");
const { sanitizeAnalyticsParams } = loadTypescript("src/lib/analytics.ts");
const { isBookingDestination } = loadTypescript("src/lib/booking.ts");
const contactRoute = loadTypescript("src/app/api/contact/route.ts");
const newsletterRoute = loadTypescript("src/app/api/newsletter/route.ts");
const unsubRoute = loadTypescript("src/app/api/newsletter/unsubscribe/route.ts");
const calWebhookRoute = loadTypescript("src/app/api/webhooks/cal/route.ts");

const makeReq = (url, body, headers = {}) =>
  new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": headers["x-forwarded-for"] || "203.0.113.10", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

// 1. Booking destination context check
assert.equal(isBookingDestination("/contact", true), true);
assert.equal(isBookingDestination("/contact?service=AI%20Agent%20Development", true), false);
assert.equal(isBookingDestination("/contact?topic=Workflow", true), false);

// 2. Analytics PII scrubbing
const sanitized = sanitizeAnalyticsParams({
  source: "contact_form",
  service: "AI Agent Development",
  email: "secret@company.com",
  name: "Jane Doe",
  phone: "+15551234",
  custom_leak: "jane@company.com",
});
assert.deepEqual(sanitized, { source: "contact_form", service: "AI Agent Development" });

// 3. Lead scoring never auto-rejects, human review required
const high = scoreLead({
  kind: "contact",
  email: "cto@enterprise.com",
  company: "Enterprise Co",
  website: "https://enterprise.com",
  service: "AI Agent Development",
  budget: "$30,000 - $50,000",
  timeline: "Immediately (within 2 weeks)",
  details: "We need an AI agent handling inbound triage across Zendesk, HubSpot, and Postgres with strict audit trails.",
});
assert.equal(high.tier, "high");
assert.equal(high.humanReviewRequired, true);
const early = scoreLead({ kind: "contact", email: "user@gmail.com", details: "Short note" });
assert.equal(early.humanReviewRequired, true);
assert.ok(early.score >= 20 && early.score < high.score);

// 4. Honeypot & timing spam detection
assert.equal(isSpamSubmission({ honeypot: "http://spam.example", formLoadedAt: Date.now() - 5000 }), true);
assert.equal(isSpamSubmission({ honeypot: "", formLoadedAt: Date.now() - 100 }), true);
assert.equal(isSpamSubmission({ honeypot: "", formLoadedAt: Date.now() - 3000 }), false);

// 5. Contact validation, honeypot rejection, persistence on unconfigured fallback
resetLeadStoreStateForTests();
delete process.env.CONTACT_WEBHOOK_URL;
delete process.env.RESEND_API_KEY;

const badJsonRes = await contactRoute.POST(makeReq("https://manasflow.com/api/contact", "{bad"));
assert.equal(badJsonRes.status, 400);

const badEmailRes = await contactRoute.POST(makeReq("https://manasflow.com/api/contact", {
  kind: "contact",
  name: "Ada",
  email: "invalid",
  service: "Business Automation",
  details: "Need automation",
  formLoadedAt: Date.now() - 5000,
}));
assert.equal(badEmailRes.status, 400);

const missingDetailsRes = await contactRoute.POST(makeReq("https://manasflow.com/api/contact", {
  kind: "contact",
  name: "Ada",
  email: "ada@acme.io",
  service: "Business Automation",
  details: "",
  formLoadedAt: Date.now() - 5000,
}));
assert.equal(missingDetailsRes.status, 400);

const spamRes = await contactRoute.POST(makeReq("https://manasflow.com/api/contact", {
  kind: "contact",
  name: "Bot",
  email: "bot@spam.io",
  service: "Business Automation",
  details: "Buy SEO backlinks now",
  contact_trap: "http://bot.example",
  formLoadedAt: Date.now() - 5000,
}));
assert.equal(spamRes.status, 400);

// Unconfigured external webhook returns 503 + fallback: mailto AND still persists locally
const fallbackRes = await contactRoute.POST(makeReq("https://manasflow.com/api/contact", {
  kind: "contact",
  name: "Ada Lovelace",
  email: "ada@analytical.org",
  service: "AI Agent Development",
  details: "Automating customer triage and escalation across Slack and CRM.",
  idempotencyKey: "idem-test-1",
  formLoadedAt: Date.now() - 5000,
}));
assert.equal(fallbackRes.status, 503);
const fallbackBody = await fallbackRes.json();
assert.equal(fallbackBody.fallback, "mailto");
assert.equal(fallbackBody.persisted, true);

// Duplicate submission check (same idempotencyKey returns duplicate: true)
const dupRes = await contactRoute.POST(makeReq("https://manasflow.com/api/contact", {
  kind: "contact",
  name: "Ada Lovelace",
  email: "ada@analytical.org",
  service: "AI Agent Development",
  details: "Automating customer triage and escalation across Slack and CRM.",
  idempotencyKey: "idem-test-1",
  formLoadedAt: Date.now() - 5000,
}));
assert.equal(dupRes.status, 200);
assert.equal((await dupRes.json()).duplicate, true);

// 6. Webhook failure AFTER persistence still preserves lead locally
const origFetch = global.fetch;
process.env.CONTACT_WEBHOOK_URL = "https://webhook.example.invalid/lead";
global.fetch = async () => new Response("upstream error", { status: 500 });
const failDeliveryRes = await contactRoute.POST(makeReq("https://manasflow.com/api/contact", {
  kind: "roi-roadmap",
  email: "ops@company.com",
  processName: "AP Invoicing",
  summary: "Annual savings $45k",
  idempotencyKey: "idem-fail-1",
  formLoadedAt: Date.now() - 5000,
}));
assert.equal(failDeliveryRes.status, 502);
const linesBeforeSuccess = fs.readFileSync(path.join(tmpDir, "leads.jsonl"), "utf8").trim().split("\n");
assert.equal(linesBeforeSuccess.length, 2, "Failed webhook must NOT lose persisted lead");

// 7. Successful webhook delivery
let capturedPayload = null;
global.fetch = async (_url, init) => {
  capturedPayload = JSON.parse(init.body);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
const okDeliveryRes = await contactRoute.POST(makeReq("https://manasflow.com/api/contact", {
  kind: "industry-blueprint",
  industry: "E-commerce",
  name: "Sam Rivera",
  email: "sam@shopco.com",
  details: "Automate post-purchase returns",
  attribution: { landingPage: "/industries", utmSource: "google", utmMedium: "cpc" },
  idempotencyKey: "idem-ok-1",
  formLoadedAt: Date.now() - 5000,
}));
assert.equal(okDeliveryRes.status, 200);
assert.equal(capturedPayload.attribution.utmSource, "google");
assert.ok(capturedPayload.score.score >= 40);

// 8. Newsletter consent separation & unsubscribe
delete process.env.NEWSLETTER_WEBHOOK_URL;
const unconsented = await newsletterRoute.POST(makeReq("https://manasflow.com/api/newsletter", {
  email: "reader@company.com",
  marketingConsent: false,
  formLoadedAt: Date.now() - 5000,
}));
assert.equal(unconsented.status, 400);

const subOk = await newsletterRoute.POST(makeReq("https://manasflow.com/api/newsletter", {
  email: "reader@company.com",
  marketingConsent: true,
  formLoadedAt: Date.now() - 5000,
}));
assert.equal(subOk.status, 200);

const unsubOk = await unsubRoute.POST(makeReq("https://manasflow.com/api/newsletter/unsubscribe", { email: "reader@company.com" }));
assert.equal(unsubOk.status, 200);

// 9. Cal.com webhook signature verification
process.env.CAL_WEBHOOK_SECRET = "test-cal-secret";
const calPayload = JSON.stringify({
  triggerEvent: "BOOKING_CREATED",
  payload: { uid: "cal_123", attendees: [{ name: "Sam", email: "sam@shopco.com" }] },
});
const badSigRes = await calWebhookRoute.POST(new Request("https://manasflow.com/api/webhooks/cal", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-cal-signature-256": "deadbeef" },
  body: calPayload,
}));
assert.equal(badSigRes.status, 401);

const validSig = crypto.createHmac("sha256", "test-cal-secret").update(calPayload).digest("hex");
const goodSigRes = await calWebhookRoute.POST(new Request("https://manasflow.com/api/webhooks/cal", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-cal-signature-256": validSig },
  body: calPayload,
}));
assert.equal(goodSigRes.status, 200);

// 10. Sliding-window rate limit
for (let i = 0; i < 3; i++) assert.equal(checkRateLimit("ip:test", 3, 60000).allowed, true);
assert.equal(checkRateLimit("ip:test", 3, 60000).allowed, false);
assert.equal(checkDuplicateSubmission("fp:test", 60000), false);
assert.equal(checkDuplicateSubmission("fp:test", 60000), true);

global.fetch = origFetch;
fs.rmSync(tmpDir, { recursive: true, force: true });
console.log("Lead capture, persistence, rate limit, spam guard, attribution, analytics, newsletter unsubscribe & Cal webhook tests passed.");
