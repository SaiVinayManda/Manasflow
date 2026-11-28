import crypto from "node:crypto";
import { site } from "./site";
import type { LeadScoreResult } from "./lead-scoring";
import { hashIdentifier, logStructuredEvent, persistRecord } from "./lead-store";
import type { LeadAttribution, PersistResult } from "./lead-store";

export type LeadKind =
  | "contact"
  | "newsletter"
  | "roi-roadmap"
  | "industry-blueprint"
  | "career"
  | "opportunity-assessment"
  | "cal-booking";

export type DeliveryOutcome = {
  delivered: boolean;
  configured: boolean;
  persisted: PersistResult;
};

async function withRetry(fn: () => Promise<Response>, attempts = 3): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fn();
      if (response.ok || response.status < 500) return response;
      lastError = new Error(`Upstream returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (i < attempts - 1) await new Promise(resolve => setTimeout(resolve, 250 * (i + 1)));
  }
  throw lastError instanceof Error ? lastError : new Error("Delivery failed after retries");
}

function buildWebhookHeaders(body: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.WEBHOOK_SIGNING_SECRET;
  if (secret) {
    headers["X-ManasFlow-Signature"] = crypto.createHmac("sha256", secret).update(body).digest("hex");
  }
  return headers;
}

/**
 * Persists first (Supabase / persistence webhook / dev local JSONL),
 * then forwards to notification webhook / CRM webhook / Resend with retries.
 */
export async function deliverLead({
  kind,
  subject,
  text,
  replyTo,
  payload,
  attribution,
  score,
  idempotencyKey,
  confirmation,
}: {
  kind: LeadKind;
  subject: string;
  text: string;
  replyTo?: string;
  payload: Record<string, unknown>;
  attribution?: LeadAttribution;
  score?: LeadScoreResult;
  idempotencyKey?: string;
  confirmation?: { to: string; subject: string; text: string };
}): Promise<DeliveryOutcome> {
  const collection = kind === "newsletter" ? "newsletter" : "leads";
  const persisted = await persistRecord(collection, {
    kind,
    emailHash: hashIdentifier(replyTo || "anonymous"),
    idempotencyKey,
    score,
    attribution,
    payload,
  });

  const webhookUrl = kind === "newsletter"
    ? (process.env.NEWSLETTER_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL)
    : process.env.CONTACT_WEBHOOK_URL;
  const crmWebhookUrl = kind !== "newsletter" ? process.env.CRM_WEBHOOK_URL : undefined;
  const resendKey = process.env.RESEND_API_KEY;

  logStructuredEvent("lead_intake_attempt", {
    recordId: persisted.recordId,
    kind,
    persistedBackend: persisted.backend,
    hasWebhook: Boolean(webhookUrl),
    hasCrmWebhook: Boolean(crmWebhookUrl),
    hasResend: Boolean(resendKey),
    scoreTier: score?.tier,
  });

  if (!webhookUrl && !crmWebhookUrl && !resendKey) {
    return { delivered: false, configured: false, persisted };
  }

  const submittedAt = new Date().toISOString();

  if (webhookUrl) {
    const serialized = JSON.stringify({
      recordId: persisted.recordId,
      kind,
      subject,
      text,
      idempotencyKey,
      score,
      attribution,
      ...payload,
      submittedAt,
    });
    const response = await withRetry(() =>
      fetch(webhookUrl, {
        method: "POST",
        headers: buildWebhookHeaders(serialized),
        body: serialized,
        signal: AbortSignal.timeout(8000),
      }),
    );
    if (!response.ok) throw new Error(`Webhook failed with status ${response.status}`);
  }

  if (crmWebhookUrl && crmWebhookUrl !== webhookUrl) {
    const crmBody = JSON.stringify({
      recordId: persisted.recordId,
      kind,
      stage: score?.stage || "New",
      score,
      attribution,
      lead: payload,
      submittedAt,
    });
    const crmResponse = await withRetry(() =>
      fetch(crmWebhookUrl, {
        method: "POST",
        headers: buildWebhookHeaders(crmBody),
        body: crmBody,
        signal: AbortSignal.timeout(8000),
      }),
    );
    if (!crmResponse.ok) throw new Error(`CRM webhook failed with status ${crmResponse.status}`);
  }

  if (!webhookUrl && resendKey) {
    const toEmail = process.env.CONTACT_TO_EMAIL || site.email;
    const fromEmail = process.env.RESEND_FROM_EMAIL || `${site.name} <onboarding@resend.dev>`;
    const response = await withRetry(() =>
      fetch("https://api.resend.com/emails", {
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
      }),
    );
    if (!response.ok) throw new Error(`Resend failed with status ${response.status}`);
  }

  if (resendKey && confirmation && process.env.RESEND_ENABLE_CONFIRMATION === "true") {
    const fromEmail = process.env.RESEND_FROM_EMAIL || `${site.name} <onboarding@resend.dev>`;
    await withRetry(() =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [confirmation.to],
          subject: confirmation.subject,
          text: confirmation.text,
        }),
        signal: AbortSignal.timeout(8000),
      }),
    ).catch(err => {
      logStructuredEvent("confirmation_email_failed", {
        recordId: persisted.recordId,
        error: err instanceof Error ? err.message : "unknown",
      });
    });
  }

  return { delivered: true, configured: true, persisted };
}
