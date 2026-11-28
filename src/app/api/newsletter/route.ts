import { NextResponse } from "next/server";
import { deliverLead } from "@/lib/lead-delivery";
import {
  checkDuplicateSubmission,
  checkRateLimit,
  extractClientIp,
  hashIdentifier,
  isSpamSubmission,
  logStructuredEvent,
} from "@/lib/lead-store";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const clientIp = extractClientIp(request);
  const rate = checkRateLimit(`newsletter:${hashIdentifier(clientIp)}`, 6, 15 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many subscription requests. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  if (isSpamSubmission({ honeypot: body.contact_trap ?? body._gotcha, formLoadedAt: body.formLoadedAt })) {
    logStructuredEvent("newsletter_spam_blocked", {});
    return NextResponse.json({ ok: false, error: "Subscription request could not be verified." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const marketingConsent = body.marketingConsent === undefined ? true : Boolean(body.marketingConsent);
  if (!marketingConsent) {
    return NextResponse.json({ ok: false, error: "Explicit marketing consent is required to subscribe." }, { status: 400 });
  }

  const source = typeof body.source === "string" ? body.source.trim().slice(0, 80) : "site";
  const idempotencyKey = typeof body.idempotencyKey === "string" ? body.idempotencyKey.trim().slice(0, 80) : "";
  const consentTimestamp = new Date().toISOString();

  if (checkDuplicateSubmission(`news:${hashIdentifier(email)}`, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: true, duplicate: true, message: "This address is already queued for the automation brief." });
  }

  const subject = "ManasFlow automation brief — subscription request";
  const text = `Please send the weekly ManasFlow automation brief to ${email}.\nSource: ${source}\nMarketing consent recorded: ${consentTimestamp}`;

  try {
    const result = await deliverLead({
      kind: "newsletter",
      subject,
      text,
      replyTo: email,
      idempotencyKey: idempotencyKey || undefined,
      payload: {
        email,
        source,
        marketingConsent: true,
        consentTimestamp,
        doubleOptInRequested: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_ENABLE_CONFIRMATION === "true"),
      },
      confirmation: {
        to: email,
        subject: "Confirm your ManasFlow automation brief subscription",
        text: `Thanks for subscribing to the ManasFlow weekly automation brief.\n\nIf you ever want to opt out, reply to info@manasflow.com or visit:\nhttps://manasflow.com/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`,
      },
    });
    if (!result.configured) {
      return NextResponse.json(
        {
          ok: false,
          fallback: "mailto",
          persisted: result.persisted.persisted,
          recordId: result.persisted.recordId,
          error: "Newsletter endpoint is not configured on this deployment.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true, recordId: result.persisted.recordId });
  } catch {
    return NextResponse.json({ ok: false, fallback: "mailto", error: "Could not complete newsletter subscription automatically." }, { status: 502 });
  }
}
