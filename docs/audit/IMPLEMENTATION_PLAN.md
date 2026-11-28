# ManasFlow Website — Prioritized Implementation Plan

**Created:** 28 November 2026  
**Target Spec:** [MANASFLOW_MASTER_IMPROVEMENT_PLAN.md](file:///C:/Projects/Manas_Flow/Chameleon/temp/MANASFLOW_MASTER_IMPROVEMENT_PLAN.md)  
**Baseline Reference:** [BASELINE_AUDIT.md](file:///C:/Projects/Manas_Flow/Chameleon/docs/audit/BASELINE_AUDIT.md)

---

## Architecture & Preservation Principles

1. **Preserve visual identity & SEO equity:** Keep existing dark purple/obsidian theme tokens, animations, typography (`Lexend`), layout grids, and all `1,768` canonical indexable routes (`npm run seo:validate-rendered` must remain 0 errors / 0 warnings).
2. **Honesty over fake success:** Never simulate CRM persistence, real email delivery, live analytics numbers, customer reviews, certifications, or US office addresses. Where external credentials (`RESEND_API_KEY`, `CONTACT_WEBHOOK_URL`, `CRM_WEBHOOK_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `CAL_WEBHOOK_SECRET`, `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY`) are not yet provisioned, provide clean adapters with explicit documented fallbacks (`mailto:` / local dev persistence / empty states) and mark external activation as blocked awaiting credentials.
3. **No production deployment without approval:** All changes stay on branch `feat/master-improvement-plan` and are verified against local builds, Node tests, Playwright multi-viewport checks, and Lighthouse `13.6.0`.

---

## Phase Sequence

### Phase 1 — Audit & Baseline ✅ (Current Step)
- Inspect codebase (`src/`, `scripts/`, `docs/`, `next.config.ts`) and live `https://manasflow.com`.
- Run baseline tests, multi-viewport Playwright check (`320`–`1920px`), `validate-rendered-seo.mjs`, and Lighthouse `13.6.0`.
- Create `docs/audit/BASELINE_AUDIT.md`, `docs/audit/IMPLEMENTATION_PLAN.md`, `docs/audit/TASK_TRACKER.md`.
- Cut feature branch `feat/master-improvement-plan`.

### Phase 2 — Critical Conversion Infrastructure (P0)
- **T2.1 Persist-first Lead Store, Attribution, Spam Protection, Rate Limiting & Retry Queue (`P0`):**
  - Create `src/lib/lead-store.ts`: structured `LeadRecord`, transparent rule-based lead scoring (`src/lib/lead-scoring.ts`), idempotency key deduplication, sliding-window per-IP rate limiting, honeypot + payload bounds spam protection, persistence adapter (optional Supabase REST API or webhook persistence / local `.data/` dev JSONL persistence when running locally), retry with backoff on external delivery, and optional customer confirmation email template via Resend (only when explicitly configured).
  - Add client attribution helper (`src/lib/attribution.ts`) capturing initial landing page, referrer, UTM tags (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`), and ad click IDs (`gclid`, `fbclid`, `li_fat_id`) cleanly into enquiry payloads without leaking PII into analytics.
- **T2.2 Upgrade Contact, Industry Blueprint, Career & ROI Forms (`P0`):**
  - Update `/api/contact` to validate honeypot, rate limits, duplicate hashes, attribution, and persist before notifying. Support `kind: "contact" | "roi-roadmap" | "industry-blueprint" | "career" | "opportunity-assessment"`.
  - Update `ContactForm`: require Full Name, Email, Service, Project Details; keep Company, Website, Phone, Budget, Timeline optional; read `?service=` / `?topic=` query parameter cleanly; show clear confirmation panel with next steps and consultation CTA after submission; add `form_start` and `form_error` events cleanly.
  - Convert `BlueprintForm` ([industries.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/industries.tsx)) and `CareerApplication` ([company-pages.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/company-pages.tsx)) from `mailto:`-only to API submission with honest `mailto:` fallback when unconfigured.
- **T2.3 Upgrade Newsletter Consent, Deduplication & Unsubscribe (`P0`):**
  - Update `/api/newsletter`: explicit consent metadata timestamp, duplicate check, rate limit, transactional/confirmation capability when configured.
  - Add `/api/newsletter/unsubscribe` endpoint (`POST` / `GET` confirmation page or JSON status) and update `PrivacyNotice` disclosures if needed.
- **T2.4 Conversion Analytics, Consent Management & Booking Verification (`P0`):**
  - Expand `src/lib/analytics.ts` with typed events (`cta_click`, `service_selected`, `service_page_view`, `case_study_view`, `form_start`, `form_error`, `generate_lead`, `assessment_started`, `assessment_completed`, `roi_calculator_started`, `roi_calculator_completed`, `demo_started`, `demo_completed`, `newsletter_signup`, `whatsapp_click`, `booking_started`, `booking_completed`) + deduplication `event_id` + PII scrubber.
  - Add accessible lightweight consent preference notice (`ConsentBanner`) integrated with Google Consent Mode v2 (`gtag('consent', ...)`).
  - Update `BookingLink` to listen for Cal.com `bookingSuccessfulV2` / `bookingSuccessful` SDK callbacks to fire `booking_completed` (only upon real booking confirmation, never on modal open) while preserving zero new imports in `booking-link.tsx` & `whatsapp-contact.tsx`.
  - Add `/api/webhooks/cal` (`POST`) supporting HMAC signature verification (`CAL_WEBHOOK_SECRET`) to log/forward verified bookings server-side.
- **T2.5 Write Lead, Newsletter, Security & Analytics Automated Tests (`P0`):**
  - Create `scripts/test-lead-capture.mjs` testing validation (`400`), honeypot rejection, rate limits (`429`), duplicate idempotency, persistence before notification failure (`502` webhook failure preserves persisted lead), `/api/newsletter` + `/api/newsletter/unsubscribe`, `/api/webhooks/cal` signature checks, and attribution/PII scrubbing in `analytics.ts`.

### Phase 3 — Website Conversion Optimization (P1)
- **T3.1 Data & Claim Consistency Cleanup (`P1`):**
  - Fix remaining `30+ companies` (5 places) and `15-min`/`15-minute` (3 places) strings inside `src/data/manasflow/service-pages.json`; regenerate `seo-content.json` (`npm run seo:generate`).
- **T3.2 Service Context Preservation & CTA Hierarchy (`P1`):**
  - Fix `CallButton` / `ActionLink` so `/contact?service=...` links navigate directly to the pre-filled contact form instead of forcing the Cal overlay; pre-select service in `ContactForm`; standardize CTA analytics tracking (`cta_click`).
- **T3.3 Case Studies Distribution & Enhanced Case Pages (`P1`):**
  - Render matched verified outcomes from `case-studies.json` directly on commercial service landing pages (`service-landing.tsx`) cleanly (preserving SEO heading hierarchy & schema alignment).
- **T3.4 Dedicated Security & Delivery Architecture Page + Consultation US/EU Clarity (`P1`):**
  - Create `/security` (`src/app/security/page.tsx`) covering self-hosted vs cloud deployment, credential isolation, human approval gates, observability/audit logs, model provider selection, code ownership, and US/EU timezone overlap (`ET`/`CT`/`PT` overlap window without inventing US offices). Link cleanly from Footer, Homepage trust block, and Services.
  - Enhance `/consultation` and `/contact` clarity (who conducts the call, what you leave with, working-hour overlap, engagement models: Assessment -> Pilot -> Embedded Engineer -> Managed Automation).
- **T3.5 Navigation Simplification Review & Accessibility/Mobile Polish (`P1`):**
  - Audit desktop/mobile navigation ergonomics (`Chrome`, `MegaMenu`) and footer/FAQ accessibility; ensure `validate-rendered-seo.mjs` and Playwright 7-viewport checks (`320`–`1920px`) remain green with zero horizontal overflow or hidden obstructions.

### Phase 4 — Technical SEO, Schema Alignment & Performance (P1)
- **T4.1 Align Test Suite & Schema Verification (`P1`):**
  - Audit and fix failing baseline scripts (`test-tool-products.mjs`, `test-search-architecture.mjs`, and document/evaluate `test-navigation-performance.mjs` server/client boundary) without sacrificing SSR SEO (`validate-rendered-seo.mjs`).
- **T4.2 Metadata, Sitemap & Structured Data Validation (`P1`):**
  - Register `/security`, `/automation-demo` (once added), and new resources properly in metadata/sitemap/routes so `seo:generate` and `validate-rendered-seo.mjs` validate 100% of public pages cleanly.
- **T4.3 Core Web Vitals & Mobile Verification (`P1`):**
  - Measure desktop & mobile Lighthouse `13.6.0` after Phase 3–4 updates to preserve ~100/100 scores and zero regressions.

### Phase 5 — Customer Acquisition Assets & Lead Magnets (P2)
- **T5.1 Interactive Automation Workflow Demo (`/automation-demo`) (`P2`):**
  - Build a clean, zero-cost client-side interactive workflow simulator demonstrating (1) AI Lead Qualification & CRM Routing, (2) Intelligent Invoice Extraction & Human Approval, and (3) Support Ticket Triage & Escalation — explicitly marked as simulated synthetic sample data, wired to `demo_started` / `demo_completed` events and contextual conversion CTAs.
- **T5.2 Connect Lead Magnets to Lead Capture & Solutions (`P2`):**
  - Wire `ToolAssessment` and `UseCaseGenerator` to fire `assessment_started` / `assessment_completed` and offer an optional scoped report request via `/api/contact` (`kind: "opportunity-assessment"`) + clear assumption labels.
- **T5.3 Marketing & Content Strategy Deliverables (`P2`):**
  - Author `docs/marketing/DIGITAL_MARKETING_PLAN.md` and `docs/marketing/CONTENT_STRATEGY.md` based strictly on verified repository pages and US/EU market positioning.

### Phase 6 — Marketing Automation & CRM Architecture (P2)
- **T6.1 CRM Webhook Adapter, Lead Scoring & Lifecycle Documentation (`P2`):**
  - Wire rule-based transparent lead scoring (`src/lib/lead-scoring.ts`) and CRM lifecycle metadata into `deliverLead`, add optional `CRM_WEBHOOK_URL` support, and document CRM/analytics/nurturing setup in `docs/crm/CRM_INTEGRATION.md`, `docs/crm/NURTURE_TEMPLATES.md` (draft/test mode only), and `docs/analytics/ANALYTICS_EVENTS.md`.

### Phase 7 — Advanced Growth Capabilities (P3)
- **T7.1 Solutions Advisor & Growth Analytics Readiness (`P3`):**
  - Add a grounded, deterministic interactive Solutions Advisor widget/helper backed strictly by verified `case-studies.json` and `service-pages.json` (with prompt-injection filtering, zero external LLM spend/leakage, clear AI disclosure, and escalation to `/contact` or `/consultation`).
  - Document the Growth Analytics reporting architecture (`docs/analytics/GROWTH_DASHBOARD_SPEC.md`) clearly identifying which metrics require live GA4 / GSC / CRM / Cal.com credentials.

### Phase 8 — Final Verification, Documentation & Handoff
- Run full test & validation suite (`test-cal-booking.mjs`, `test-tool-calculations.mjs`, `test-lead-capture.mjs`, `test-tool-products.mjs`, `test-search-architecture.mjs`, `npm run check`, `validate-seo.mjs`, `validate-rendered-seo.mjs`), Playwright 7-viewport check, security header check, and Lighthouse `13.6.0` (mobile & desktop).
- Produce `docs/audit/FINAL_IMPLEMENTATION_REPORT.md` covering all 16 required deliverables, before/after comparison, configuration guide, blockers/approvals list, and rollback steps.
- Commit cleanly on `feat/master-improvement-plan` (without deploying to production).
