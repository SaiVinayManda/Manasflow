import { NextResponse } from "next/server";
import { checkRateLimit, extractClientIp, hashIdentifier, logStructuredEvent, persistRecord } from "@/lib/lead-store";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function handleUnsubscribe(email: string, request: Request) {
  const rate = checkRateLimit(`unsub:${hashIdentifier(extractClientIp(request))}`, 10, 15 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json({ ok: false, error: "Too many requests. Try again shortly." }, { status: 429 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please supply a valid email address to unsubscribe." }, { status: 400 });
  }

  const persisted = await persistRecord("newsletter", {
    kind: "newsletter-unsubscribe",
    emailHash: hashIdentifier(email),
    payload: { email, action: "unsubscribe", requestedAt: new Date().toISOString() },
  });

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "newsletter-unsubscribe", email, recordId: persisted.recordId, requestedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(6000),
    }).catch(err => {
      logStructuredEvent("unsubscribe_webhook_error", { error: err instanceof Error ? err.message : "unknown" });
    });
  }

  logStructuredEvent("newsletter_unsubscribe", { recordId: persisted.recordId, persistedBackend: persisted.backend });
  return NextResponse.json({
    ok: true,
    recordId: persisted.recordId,
    message: "Your unsubscribe request has been recorded.",
  });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
  return handleUnsubscribe(email, request);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = (searchParams.get("email") || "").trim().slice(0, 200);
  return handleUnsubscribe(email, request);
}
