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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const service = typeof body.service === "string" ? body.service.trim() : "";
  const budget = typeof body.budget === "string" ? body.budget.trim() : "";
  const details = typeof body.details === "string" ? body.details.trim() : "";
  const kind = body.kind === "roi-roadmap" ? "roi-roadmap" : "contact";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  if (kind === "contact" && (!name || !company || !service)) {
    return NextResponse.json({ ok: false, error: "Please fill in your name, company, email, and service." }, { status: 400 });
  }

  const subject = kind === "roi-roadmap"
    ? `Automation roadmap request: ${typeof body.processName === "string" && body.processName.trim() ? body.processName.trim() : "Workflow ROI"}`
    : `Project enquiry: ${company}`;
  const text = kind === "roi-roadmap"
    ? `Work email: ${email}\n\n${typeof body.summary === "string" ? body.summary : ""}`
    : `Hello ManasFlow,\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\nService: ${service}\nProject budget: ${budget || "Not specified"}\n\nProject details:\n${details}`;

  try {
    const result = await deliverLead({
      kind,
      subject,
      text,
      replyTo: email,
      payload: { name, email, company, service, budget: budget || "Not specified", details },
    });
    if (!result.configured) {
      return NextResponse.json({ ok: false, fallback: "mailto", error: "Direct delivery is not configured on this deployment." }, { status: 503 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, fallback: "mailto", error: "Could not deliver your enquiry automatically." }, { status: 502 });
  }
}
