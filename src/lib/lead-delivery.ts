import { site } from "./site";

export type LeadKind = "contact" | "newsletter" | "roi-roadmap";

export async function deliverLead({
  kind,
  subject,
  text,
  replyTo,
  payload,
}: {
  kind: LeadKind;
  subject: string;
  text: string;
  replyTo?: string;
  payload: Record<string, unknown>;
}): Promise<{ delivered: boolean; configured: boolean }> {
  const webhookUrl = kind === "newsletter" ? (process.env.NEWSLETTER_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL) : process.env.CONTACT_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  if (!webhookUrl && !resendKey) return { delivered: false, configured: false };

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, subject, text, ...payload, submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Webhook failed with status ${response.status}`);
    return { delivered: true, configured: true };
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || site.email;
  const fromEmail = process.env.RESEND_FROM_EMAIL || `${site.name} <onboarding@resend.dev>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      text,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Resend failed with status ${response.status}`);
  return { delivered: true, configured: true };
}
