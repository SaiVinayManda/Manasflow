# ManasFlow — CRM & Automated Lead Management Architecture

**Version:** 1.0  
**Related Modules:** [lead-store.ts](file:///C:/Projects/Manas_Flow/Chameleon/src/lib/lead-store.ts), [lead-delivery.ts](file:///C:/Projects/Manas_Flow/Chameleon/src/lib/lead-delivery.ts), [lead-scoring.ts](file:///C:/Projects/Manas_Flow/Chameleon/src/lib/lead-scoring.ts), [contact/route.ts](file:///C:/Projects/Manas_Flow/Chameleon/src/app/api/contact/route.ts), [webhooks/cal/route.ts](file:///C:/Projects/Manas_Flow/Chameleon/src/app/api/webhooks/cal/route.ts)

---

## 1. End-to-End Pipeline Flow

```text
Website Form / Tool / Cal.com
   │
   ▼  (Client Attribution + Honeypot + Idempotency Key)
POST /api/contact  or  POST /api/webhooks/cal
   │
   ├─ 1. IP Sliding-Window Rate Limit (429 on abuse)
   ├─ 2. Spam / Timing / Field Validation (400)
   ├─ 3. Idempotency / Cooldown Duplicate Check
   ├─ 4. Transparent Rule Scoring (scoreLead -> 0-100, tier, stage)
   ├─ 5. Persist FIRST (Supabase REST -> Persistence Webhook -> Dev JSONL)
   └─ 6. Fan-out with Retry (3x backoff, HMAC X-ManasFlow-Signature):
         ├─ Notification Webhook (n8n / Slack / Email router via CONTACT_WEBHOOK_URL)
         ├─ CRM Pipeline Sync (CRM_WEBHOOK_URL)
         └─ Transactional Email / Confirmation (Resend API when configured)
```

If an external webhook or email API returns an error (`502`), step 5 guarantees the lead is already written before delivery is retried or surfaces a safe `mailto:` fallback to the visitor.

---

## 2. Supported Lifecycle Stages & Payload Schema

Stages defined in `LeadStage` (`src/lib/lead-scoring.ts`):
`New` → `Contacted` → `Qualified` → `Discovery scheduled` → `Discovery completed` → `Proposal sent` → `Negotiation` → `Won` | `Lost` | `Nurturing`

Every `CRM_WEBHOOK_URL` `POST` payload includes:

```json
{
  "recordId": "uuid-v4",
  "kind": "contact | roi-roadmap | industry-blueprint | career | opportunity-assessment | cal-booking",
  "stage": "New | Qualified",
  "score": {
    "score": 85,
    "tier": "high | standard | early",
    "stage": "Qualified",
    "reasons": ["Business email domain provided", "Detailed project context shared"],
    "humanReviewRequired": true
  },
  "attribution": {
    "landingPage": "/ai-agent-development",
    "referrer": "https://www.google.com/",
    "utmSource": "google",
    "utmMedium": "cpc",
    "utmCampaign": "agents-2026-q4",
    "gclid": "..."
  },
  "lead": {
    "name": "...",
    "email": "...",
    "company": "...",
    "service": "...",
    "budget": "...",
    "timeline": "...",
    "details": "..."
  },
  "submittedAt": "ISO-8601 timestamp"
}
```

---

## 3. Scoring Rules & Mandatory Human Review Guardrail

`scoreLead()` uses explicit additive criteria (`20` base + business email `+15`, company `+10`, website `+10`, core service fit `+15` or `+10`, detail depth `+15`/`+10`, budget tier `+15`/`+5`, urgency `+10`/`+5`, capped at `100`):
- **High (`>= 70`):** Auto-tagged `Qualified` for same-day senior engineer follow-up.
- **Standard (`45–69`):** Tagged `New` for normal qualification review.
- **Early (`< 45`):** Tagged `New` with advisory checklist guidance.

**Non-Rejection Policy:** `humanReviewRequired` is hardcoded `true`. Automated scoring NEVER drops, hides, or rejects an enquiry; operators can override scores/stages freely inside CRM / n8n.

---

## 4. Recommended n8n Integration Workflow (Reuse Existing Infrastructure)

1. Point `CONTACT_WEBHOOK_URL` or `CRM_WEBHOOK_URL` in Vercel to a single secured **n8n Webhook node**.
2. Verify HMAC-SHA256 `X-ManasFlow-Signature` against `WEBHOOK_SIGNING_SECRET`.
3. Upsert Contact + Deal in HubSpot/Attio/Pipedrive using `email` + `idempotencyKey`.
4. Send internal Slack alert (`#inbound-leads`) with `score.tier`, `service`, `attribution.utmCampaign`, and `details` (excluding spam).
5. Point Cal.com Webhooks (`BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`) to `https://manasflow.com/api/webhooks/cal` with `CAL_WEBHOOK_SECRET` so confirmed consultations transition deals cleanly to **`Discovery scheduled`** without false attribution from CTA clicks.

---

## 5. Configuration Checklist (Pending Production Secrets)

| Variable | Purpose | Required in Prod? |
| --- | --- | --- |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Primary durable lead & newsletter store | Recommended |
| `CONTACT_WEBHOOK_URL` | Primary n8n / Slack / intake automation receiver | Recommended |
| `CRM_WEBHOOK_URL` | Dedicated CRM pipeline webhook (if separate from n8n) | Optional |
| `WEBHOOK_SIGNING_SECRET` | HMAC-SHA256 verification on outbound webhooks | Recommended |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Fallback direct email + optional customer confirmation (`RESEND_ENABLE_CONFIRMATION=true`) | Optional |
| `CAL_WEBHOOK_SECRET` | Verifies Cal.com signed booking lifecycle webhooks | Recommended |
