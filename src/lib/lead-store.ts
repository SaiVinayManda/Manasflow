import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { LeadScoreResult } from "./lead-scoring";

export type LeadAttribution = {
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  liFatId?: string;
};

export type PersistedRecord = {
  recordId: string;
  kind: string;
  submittedAt: string;
  emailHash: string;
  idempotencyKey?: string;
  score?: LeadScoreResult;
  attribution?: LeadAttribution;
  payload: Record<string, unknown>;
};

export type PersistResult = {
  persisted: boolean;
  backend: "supabase" | "webhook" | "local-file" | "none";
  recordId: string;
};

type WindowBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, WindowBucket>();
const recentSubmissions = new Map<string, number>();

const CLEANUP_LIMIT = 5000;

function pruneMaps(now: number) {
  if (rateBuckets.size > CLEANUP_LIMIT) {
    for (const [k, v] of rateBuckets) if (v.resetAt <= now) rateBuckets.delete(k);
  }
  if (recentSubmissions.size > CLEANUP_LIMIT) {
    for (const [k, exp] of recentSubmissions) if (exp <= now) recentSubmissions.delete(k);
  }
}

export function resetLeadStoreStateForTests() {
  rateBuckets.clear();
  recentSubmissions.clear();
}

export function hashIdentifier(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex").slice(0, 16);
}

/** Sliding-window in-memory per-IP rate limit (instance-scoped). */
export function checkRateLimit(key: string, maxRequests = 8, windowMs = 15 * 60 * 1000): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  pruneMaps(now);
  const existing = rateBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (existing.count >= maxRequests) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }
  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Prevents accidental double-clicks or replay bursts within a cooldown window. */
export function checkDuplicateSubmission(fingerprint: string, windowMs = 5 * 60 * 1000): boolean {
  const now = Date.now();
  pruneMaps(now);
  const expiresAt = recentSubmissions.get(fingerprint);
  if (expiresAt && expiresAt > now) return true;
  recentSubmissions.set(fingerprint, now + windowMs);
  return false;
}

/** Basic honeypot and timing heuristics without external third-party CAPTCHA friction. */
export function isSpamSubmission({ honeypot, formLoadedAt }: { honeypot?: unknown; formLoadedAt?: unknown }): boolean {
  if (typeof honeypot === "string" && honeypot.trim().length > 0) return true;
  if (typeof formLoadedAt === "number" && Number.isFinite(formLoadedAt)) {
    const elapsed = Date.now() - formLoadedAt;
    if (elapsed >= 0 && elapsed < 800) return true;
  }
  return false;
}

export function extractClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function logStructuredEvent(event: string, meta: Record<string, string | number | boolean | undefined>) {
  console.info(JSON.stringify({ ts: new Date().toISOString(), service: "manasflow-intake", event, ...meta }));
}

async function writeLocalRecord(filename: string, record: PersistedRecord): Promise<boolean> {
  const allowLocal = process.env.LEAD_LOCAL_LOG === "true" || process.env.NODE_ENV !== "production";
  if (!allowLocal) return false;
  const dir = process.env.LEAD_DATA_DIR || path.join(process.cwd(), ".data");
  await fs.mkdir(dir, { recursive: true });
  await fs.appendFile(path.join(/*turbopackIgnore: true*/ dir, filename), `${JSON.stringify(record)}\n`, "utf8");
  return true;
}

/**
 * Persists a lead/newsletter record BEFORE external CRM or email notification
 * so temporary delivery errors do not silently discard customer enquiries.
 */
export async function persistRecord(
  collection: "leads" | "newsletter",
  input: Omit<PersistedRecord, "recordId" | "submittedAt">,
): Promise<PersistResult> {
  const record: PersistedRecord = {
    recordId: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    ...input,
  };

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && supabaseKey) {
    const table = collection === "leads" ? (process.env.SUPABASE_LEADS_TABLE || "manasflow_leads") : (process.env.SUPABASE_NEWSLETTER_TABLE || "manasflow_newsletter");
    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        id: record.recordId,
        kind: record.kind,
        email_hash: record.emailHash,
        idempotency_key: record.idempotencyKey || null,
        score: record.score || null,
        attribution: record.attribution || null,
        payload: record.payload,
        submitted_at: record.submittedAt,
      }),
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error(`Supabase persistence failed (${response.status})`);
    return { persisted: true, backend: "supabase", recordId: record.recordId };
  }

  const persistWebhook = process.env.LEAD_PERSISTENCE_WEBHOOK_URL;
  if (persistWebhook) {
    const response = await fetch(persistWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, ...record }),
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error(`Persistence webhook failed (${response.status})`);
    return { persisted: true, backend: "webhook", recordId: record.recordId };
  }

  if (await writeLocalRecord(`${collection}.jsonl`, record)) {
    return { persisted: true, backend: "local-file", recordId: record.recordId };
  }

  return { persisted: false, backend: "none", recordId: record.recordId };
}
