import { NextResponse } from "next/server";
import { deliverLead } from "@/lib/lead-delivery";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const subject = "ManasFlow automation brief — subscription request";
  const text = `Please send the weekly ManasFlow automation brief to ${email}.`;

  try {
    const result = await deliverLead({ kind: "newsletter", subject, text, replyTo: email, payload: { email } });
    if (!result.configured) {
      return NextResponse.json({ ok: false, fallback: "mailto", error: "Newsletter endpoint is not configured on this deployment." }, { status: 503 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, fallback: "mailto", error: "Could not complete newsletter subscription automatically." }, { status: 502 });
  }
}
