import { NextResponse } from "next/server";
import { deliverLead } from "@/lib/lead-delivery";
import type { LeadKind } from "@/lib/lead-delivery";
import { scoreLead } from "@/lib/lead-scoring";
import {
  checkDuplicateSubmission,
  checkRateLimit,
  extractClientIp,
  hashIdentifier,
  isSpamSubmission,
  logStructuredEvent,
} from "@/lib/lead-store";
import type { LeadAttribution } from "@/lib/lead-store";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_KINDS = new Set<LeadKind>([
  "contact",
  "roi-roadmap",
  "industry-blueprint",
  "career",
  "opportunity-assessment",
]);

function str(value: unknown, maxLen = 4000): string {
  return typeof value === "string" ? value.trim().slice(0, maxLen) : "";
}

function parseAttribution(raw: unknown): LeadAttribution | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const obj = raw as Record<string, unknown>;
  return {
    landingPage: str(obj.landingPage, 250) || undefined,
    referrer: str(obj.referrer, 400) || undefined,
    utmSource: str(obj.utmSource, 120) || undefined,
    utmMedium: str(obj.utmMedium, 120) || undefined,
    utmCampaign: str(obj.utmCampaign, 160) || undefined,
    utmContent: str(obj.utmContent, 160) || undefined,
    utmTerm: str(obj.utmTerm, 160) || undefined,
    gclid: str(obj.gclid, 160) || undefined,
    fbclid: str(obj.fbclid, 160) || undefined,
    liFatId: str(obj.liFatId, 160) || undefined,
  };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const clientIp = extractClientIp(request);
  const rate = checkRateLimit(`contact:${hashIdentifier(clientIp)}`, 10, 15 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions from your network. Please wait a few minutes or email info@manasflow.com." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  if (isSpamSubmission({ honeypot: body.contact_trap ?? body._gotcha, formLoadedAt: body.formLoadedAt })) {
    logStructuredEvent("spam_blocked", { kind: str(body.kind, 40) || "contact" });
    return NextResponse.json({ ok: false, error: "Submission could not be verified. Please try again or email info@manasflow.com." }, { status: 400 });
  }

  const rawKind = str(body.kind, 40) as LeadKind;
  const kind: LeadKind = ALLOWED_KINDS.has(rawKind) ? rawKind : "contact";

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const company = str(body.company, 160);
  const website = str(body.website, 250);
  const phone = str(body.phone, 50);
  const service = str(body.service, 120);
  const budget = str(body.budget, 80);
  const timeline = str(body.timeline, 100);
  const details = str(body.details, 4000);
  const industry = str(body.industry, 120);
  const idempotencyKey = str(body.idempotencyKey, 80);
  const attribution = parseAttribution(body.attribution);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid work email address." }, { status: 400 });
  }
  if (kind === "contact" && (!name || !service || !details)) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your full name, email address, required service, and project details." },
      { status: 400 },
    );
  }
  if (kind === "industry-blueprint" && !name) {
    return NextResponse.json({ ok: false, error: "Please enter your name and work email." }, { status: 400 });
  }
  if (kind === "career" && (!name || !str(body.linkedin, 300) || !str(body.github, 300))) {
    return NextResponse.json({ ok: false, error: "Please provide your name, email, LinkedIn, and GitHub profile links." }, { status: 400 });
  }

  const fingerprint = idempotencyKey
    ? `idem:${idempotencyKey}`
    : `dup:${kind}:${hashIdentifier(email)}:${hashIdentifier(service || industry || details.slice(0, 80))}`;

  if (checkDuplicateSubmission(fingerprint, 5 * 60 * 1000)) {
    return NextResponse.json({
      ok: true,
      duplicate: true,
      message: "We already received this request — our team will reply within one business day.",
    });
  }

  const score = scoreLead({
    kind: kind === "cal-booking" || kind === "newsletter" ? "contact" : kind,
    email,
    company,
    website,
    service: service || industry,
    budget,
    timeline,
    details: details || str(body.summary, 1000),
  });

  const subject =
    kind === "roi-roadmap"
      ? `Automation roadmap request: ${str(body.processName, 120) || "Workflow ROI"}`
      : kind === "industry-blueprint"
        ? `${industry || "Industry"} automation blueprint — ${company || name}`
        : kind === "opportunity-assessment"
          ? `Automation opportunity report: ${company || name}`
          : kind === "career"
            ? `ManasFlow engineering application: ${name}`
            : `Project enquiry: ${company || name} (${service})`;

  const text =
    kind === "roi-roadmap" || kind === "opportunity-assessment"
      ? `Work email: ${email}\nName: ${name || "Not provided"}\n\n${str(body.summary, 4000)}`
      : kind === "career"
        ? `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nLinkedIn: ${str(body.linkedin, 300)}\nGitHub: ${str(body.github, 300)}\nDemo: ${str(body.video, 300)}\nLanguages: ${str(body.languages, 60)}\nSkills: ${str(body.skills, 400)}`
        : [
            "Hello ManasFlow,",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            `Company: ${company || "Not specified"}`,
            `Website: ${website || "Not provided"}`,
            `Phone: ${phone || "Not provided"}`,
            ...(industry ? [`Industry: ${industry}`] : []),
            `Service: ${service || "Not specified"}`,
            `Timeline: ${timeline || "Not specified"}`,
            `Project budget: ${budget || "Not specified"}`,
            `Indicative lead score: ${score.score}/100 (${score.tier})`,
            "",
            "Project details:",
            details,
          ].join("\n");

  const payload: Record<string, unknown> = {
    name,
    email,
    company: company || "Not specified",
    ...(website ? { website } : {}),
    ...(phone ? { phone } : {}),
    ...(industry ? { industry } : {}),
    service: service || "Not specified",
    budget: budget || "Not specified",
    ...(timeline ? { timeline } : {}),
    details: details || str(body.summary, 2000),
  };

  try {
    const outcome = await deliverLead({
      kind,
      subject,
      text,
      replyTo: email,
      payload,
      attribution,
      score,
      idempotencyKey: idempotencyKey || undefined,
      confirmation: kind === "contact" || kind === "roi-roadmap" || kind === "industry-blueprint"
        ? {
            to: email,
            subject: "We received your ManasFlow enquiry",
            text: `Hi ${name || "there"},\n\nThank you for contacting ManasFlow. Our engineering team has received your request (${service || industry || "AI automation"}) and will respond within one business day.\n\nIf you prefer to pick a time directly on our calendar:\nhttps://cal.com/manasflow/30min\n\nBest regards,\nManasFlow`,
          }
        : undefined,
    });

    if (!outcome.configured) {
      return NextResponse.json(
        {
          ok: false,
          fallback: "mailto",
          persisted: outcome.persisted.persisted,
          recordId: outcome.persisted.recordId,
          error: "Direct email/CRM delivery is not configured in this environment.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      ok: true,
      recordId: outcome.persisted.recordId,
      persisted: outcome.persisted.persisted,
    });
  } catch (err) {
    logStructuredEvent("lead_delivery_error", {
      kind,
      error: err instanceof Error ? err.message : "unknown",
    });
    return NextResponse.json(
      { ok: false, fallback: "mailto", error: "Could not deliver your enquiry automatically." },
      { status: 502 },
    );
  }
}
