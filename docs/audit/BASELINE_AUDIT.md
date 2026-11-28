# ManasFlow Website — Phase 1 Baseline Audit

**Audit Date:** 28 November 2026  
**Codebase Branch:** `feat/master-improvement-plan` (branched from `main` at `012ed1a`)  
**Production Reference:** `https://manasflow.com` (verified live on 28 November 2026)  
**Master Specification:** [MANASFLOW_MASTER_IMPROVEMENT_PLAN.md](file:///C:/Projects/Manas_Flow/Chameleon/temp/MANASFLOW_MASTER_IMPROVEMENT_PLAN.md)

---

## 1. Executive Baseline Summary

Verification against both `origin/main` (`012ed1a`) and live production (`https://manasflow.com`) shows that a substantial initial hardening pass has already shipped (`POST /api/contact`, `POST /api/newsletter`, `site.stats`, homepage roadmap CTAs, removal of unverified compliance absolutes and `"Certified Experts"`, optional project budget on `/contact`, `#refund-policy` in `/terms`, Lighthouse `13.6.0` scores of `100/100` across all 5 categories locally, and `0` errors across `1,768` rendered SEO pages).

However, deep code and script verification reveals **concrete remaining P0, P1, P2, P3, and test-suite gaps** against the Master Specification:

### Baseline Command & Score Snapshot

| Check / Measurement | Baseline Result (at `012ed1a`) | Notes |
| --- | --- | --- |
| `npm run check` (`lint`, `typecheck`, `seo:generate`, `build`) | Pass | `1,751` static routes + dynamic routes (`/api/contact`, `/api/newsletter`) |
| `node scripts/test-cal-booking.mjs` | Pass | Namespaced Cal.com modal, preload, fallback, Escape, non-booking routes |
| `node scripts/test-tool-calculations.mjs` | Pass | ROI, payback, budget, workflow savings, assessment scoring |
| `node scripts/validate-seo.mjs` | Pass | `1,886` URLs (`1,768` indexable) |
| `node scripts/validate-rendered-seo.mjs` | Pass | `1,768` pages, `19,727` schema nodes, `0` errors, `0` warnings |
| `node scripts/test-search-architecture.mjs` | **Fail** | Asserts `PRIMARY_NAVIGATION` matches 6 expected hub items; currently has 8 |
| `node scripts/test-navigation-performance.mjs` | **Fail** | Asserts `chrome`, `home`, `capabilities`, `lower-sections`, `shared` omit top-level `"use client"` |
| `node scripts/test-tool-products.mjs` | **Fail** | Asserts `SoftwareApplication` JSON-LD node; `src/lib/seo.ts` emits `WebApplication` |
| Responsive layout (`320, 375, 390, 768, 1024, 1440, 1920`) | `overflowX: 0`, `0` console errors | Tested via Playwright headless Chrome across 6 primary routes |
| Lighthouse `13.6.0` (local `next start`) | Desktop `100/100/100/100/100`; Mobile `100/100/100/100/100` | Performance, Accessibility, Best Practices, SEO, Agentic Browsing |

---

## 2. Verified Findings (Classified P0–P3)

### F-01 (P0) — Lead Capture Persistence, Attribution, Rate Limiting, Spam Protection & Remaining `mailto:` Forms
- **Issue description:** `POST /api/contact` forwards immediately to `deliverLead()` without persisting leads before external notification, lacks rate limiting, duplicate/idempotency protection, spam/honeypot checks, retry backoff, structured logging, customer confirmation email support, or UTM/referrer/landing-page attribution. Meanwhile, `CareerApplication` ([company-pages.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/company-pages.tsx#L156-L163)) and `BlueprintForm` ([industries.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/industries.tsx#L14-L48)) still submit via `mailto:` only, and `ContactForm` marks `company` required instead of `details` as recommended while returning only a compact `<p role="status">` instead of a rich confirmation view with an optional consultation link.
- **Evidence:** [contact/route.ts](file:///C:/Projects/Manas_Flow/Chameleon/src/app/api/contact/route.ts), [lead-delivery.ts](file:///C:/Projects/Manas_Flow/Chameleon/src/lib/lead-delivery.ts), [company-pages.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/company-pages.tsx#L95-L171), [industries.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/industries.tsx#L14-L48).
- **Affected routes and components:** `/contact`, `/industries`, `/careers`, `ContactForm`, `CareerApplication`, `BlueprintForm`, `ROICalculator`, `POST /api/contact`.
- **Business impact:** Leads remain vulnerable to transient webhook/Resend errors, unattributed ad/organic traffic, bot spam, and drop-offs on industry blueprint enquiries.
- **Technical impact:** Missing storage adapter, retry wrapper, idempotency cache, rate limiter, and attribution hook.
- **Priority / Effort:** **P0** / Medium-High
- **Proposed solution:** Implement `src/lib/lead-store.ts` (persist-first storage adapter supporting Supabase/webhook/local dev NDJSON log, idempotency dedup, sliding-window IP rate limiting, retry with exponential backoff, structured non-PII logging), add honeypot + attribution capture (landing page, referrer, UTM parameters, click IDs), add customer confirmation email option when `RESEND_API_KEY` is configured, wire `BlueprintForm` to `/api/contact` (`kind: "industry-blueprint"`), update `ContactForm` confirmation panel with consultation CTA, and update `CareerApplication` to `/api/contact` (`kind: "career"`) with `mailto:` fallback when unconfigured.
- **Acceptance criteria:** Invalid inputs return `400`; honeypot triggers quiet rejection without delivery; duplicate submissions within cooldown deduplicate; rate limits return `429`; persistent record is attempted before webhook/Resend notification; confirmation panel displays next steps + booking link; unit/API integration tests verify validation, duplicate prevention, rate limiting, and notification failure safety.
- **Current status:** Verified open gap (partial baseline implemented in `012ed1a`).

### F-02 (P0) — Newsletter Consent Separation, Duplicate Protection, Rate Limiting & Unsubscribe Flow
- **Issue description:** `POST /api/newsletter` lacks explicit marketing consent timestamp recording, duplicate subscription protection, rate limiting, and an unsubscribe endpoint/handler.
- **Evidence:** [newsletter/route.ts](file:///C:/Projects/Manas_Flow/Chameleon/src/app/api/newsletter/route.ts), [chrome.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/chrome.tsx#L111-L169), [newsletter.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/newsletter.tsx).
- **Affected routes and components:** Footer and inline `Newsletter` components, `/api/newsletter`, `/api/newsletter/unsubscribe`.
- **Business impact:** Lacks auditable opt-in consent metadata and clean unsubscribe lifecycle required for GDPR/CAN-SPAM readiness.
- **Technical impact:** Needs consent timestamp field, duplicate check, rate limiter, and unsubscribe route.
- **Priority / Effort:** **P0** / Low-Medium
- **Proposed solution:** Enhance `/api/newsletter` with duplicate email cooldown check, IP rate limiting, explicit `consentTimestamp` & source recording, optional double opt-in confirmation email when `RESEND_API_KEY` is set, and add `/api/newsletter/unsubscribe` endpoint. Keep contact form enquiries strictly separate from newsletter marketing consent.
- **Acceptance criteria:** Duplicate signups handled cleanly without duplicate webhook spam; rate limit tested; `/api/newsletter/unsubscribe` handles POST/GET safely without exposing PII; privacy notice updated if needed.
- **Current status:** Verified open gap.

### F-03 (P0) — Typed Conversion Analytics, Consent Mode, Intent vs. Conversion Separation & Booking Verification
- **Issue description:** [analytics.ts](file:///C:/Projects/Manas_Flow/Chameleon/src/lib/analytics.ts) is a 5-line untyped `gtag` helper. Only 4 events exist (`generate_lead`, `newsletter_signup`, `booking_started`, `whatsapp_click`, `roi_calculator_complete`, `roi_roadmap_request`). Missing typed event union (`cta_click`, `service_selected`, `service_page_view`, `case_study_view`, `form_start`, `form_error`, `assessment_started`, `assessment_completed`, `roi_calculator_started`, `roi_calculator_completed`, `demo_started`, `demo_completed`, `booking_completed`), client-server deduplication (`eventId`), GDPR consent preference storage/Google Consent Mode v2 signals, and Cal.com SDK `bookingSuccessfulV2` / `/api/webhooks/cal` verified booking completion handling.
- **Evidence:** [analytics.ts](file:///C:/Projects/Manas_Flow/Chameleon/src/lib/analytics.ts), [booking-link.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/booking-link.tsx#L40-L45), [layout.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/app/layout.tsx#L50-L56).
- **Affected routes and components:** All pages via `layout.tsx`, `BookingLink`, `ContactForm`, interactive tools, service pages, case studies.
- **Business impact:** Cannot distinguish button clicks (`booking_started`) from real scheduled calls (`booking_completed`), nor trace which landing pages/CTAs/calculators generate pipeline.
- **Technical impact:** Need typed analytics module, consent banner/storage, Cal SDK `bookingSuccessfulV2` hook + `/api/webhooks/cal` signature-verified handler, and `ANALYTICS_EVENTS.md` docs.
- **Priority / Effort:** **P0** / Medium
- **Proposed solution:** Expand `src/lib/analytics.ts` with strict typed events, event IDs, session UTM capture (stored strictly in sessionStorage / API payload — never sent as PII to GA4), Consent Mode v2 default + accessible consent bar ([consent-banner.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/consent-banner.tsx)), Cal `bookingSuccessfulV2` listener firing `booking_completed`, and `/api/webhooks/cal` route for verified webhook logging/CRM forwarding. Preserve zero new imports in `booking-link.tsx` & `whatsapp-contact.tsx` so `test-cal-booking.mjs` isolation sandbox stays intact.
- **Acceptance criteria:** Analytics helper strictly typed with 0 `any`; PII keys stripped before firing events; `booking_started` vs `booking_completed` strictly separated; `test-cal-booking.mjs` passes.
- **Current status:** Verified open gap.

### F-04 (P1) — Residual Data Inconsistencies in `service-pages.json`
- **Issue description:** Scan found 5 remaining `"Trusted by 30+ companies"` badges and 3 remaining `"15-min call"` / `"15-minute call"` strings inside [service-pages.json](file:///C:/Projects/Manas_Flow/Chameleon/src/data/manasflow/service-pages.json).
- **Evidence:** `service-pages.json` lines `8658`, `8938`, `8948`, `9938`, `10366`, `13788`, `18738`, `18740` (routes `/engineer-placement`, `/hire-ai-developers`, `/agency/claude-code-dev`, etc.).
- **Affected routes and components:** Service landing pages consuming `service-pages.json`.
- **Business impact:** Mixed company count (`30+` vs `45+`) and mixed consultation duration (`15-min` vs `30-min`) erode trust between homepage and service pages.
- **Technical impact:** JSON data cleanup + re-running `seo:generate` and `validate-rendered-seo.mjs`.
- **Priority / Effort:** **P1** / Low
- **Proposed solution:** Update all `service-pages.json` occurrences cleanly to `45+` companies and `30-min`/`30-minute` strategy call, then run `npm run seo:generate`.
- **Acceptance criteria:** Zero occurrences of `30+ companies` or `15-min`/`15-minute` in active `src/`.
- **Current status:** Verified open gap.

### F-05 (P1) — Service Context Lost on Service CTA Navigation & Missing Security/Architecture Dedicated Page
- **Issue description:** `service-landing.tsx` links `<CallButton href="/contact?service=...">`, but `CallButton` intercepts `/contact` via `isBookingDestination(href, true)` and opens the Cal.com modal instead of navigating to `/contact?service=...`. Furthermore, `ContactForm` does not read `?service=` query parameters to pre-select the service dropdown. In addition, there is no dedicated `/security` (Security & Delivery Architecture) page covering self-hosted vs cloud deployment, credential isolation, human-in-the-loop approvals, data retention, and working-hour overlap for US buyers.
- **Evidence:** [shared.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/shared.tsx#L47-L50), [service-landing.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/service-landing.tsx#L131), [company-pages.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/company-pages.tsx#L117).
- **Affected routes and components:** All 65 service pages, `/contact`, navigation/footer, new `/security` route.
- **Business impact:** High-intent visitors clicking a service page CTA cannot seamlessly pass their chosen service into the enquiry form, and US enterprise/security buyers lack a single authoritative technical trust page.
- **Technical impact:** Fix `/contact?...` navigation behavior in `CallButton` / `ActionLink`, read `window.location.search` in `ContactForm`, add `/security` page + metadata/sitemap registration, and document US timezone overlap (`ET/CT/PT` morning–early afternoon overlap with CET) cleanly in consultation/contact/security pages without inventing US offices.
- **Priority / Effort:** **P1** / Medium
- **Proposed solution:** Ensure explicit `/contact?...` query URLs navigate directly to the pre-filled contact form instead of opening the Cal overlay; map query parameters gracefully to service options in `ContactForm`; publish `/security` (`src/app/security/page.tsx`) aligned with `PageSeo`, header/footer trust links, and verified safeguards.
- **Acceptance criteria:** Visiting `/contact?service=AI%20Agent%20Development` pre-selects service; `/security` renders with HTTP 200, valid JSON-LD, breadcrumb, and passes `validate-seo.mjs` + `validate-rendered-seo.mjs`.
- **Current status:** Verified open gap.

### F-06 (P1) — Pre-Existing Unit/Architecture Test Alignment (`test-search-architecture.mjs`, `test-tool-products.mjs`, `test-navigation-performance.mjs`)
- **Issue description:** Three test scripts under `scripts/` fail against current `main`:
  1. `test-search-architecture.mjs` expects 6 hub links in `PRIMARY_NAVIGATION`, while current `site-navigation.ts` lists 8.
  2. `test-tool-products.mjs` checks for `@type === "SoftwareApplication"`, whereas `src/lib/seo.ts` emits `@type: "WebApplication"` (`WebApplication` is valid Schema.org subtype of `SoftwareApplication`, or both/consistent alignment).
  3. `test-navigation-performance.mjs` asserts `chrome`, `home`, `capabilities`, `lower-sections`, `shared` contain no top-level `"use client"`.
- **Evidence:** Command output from Section 1 baseline run; [test-search-architecture.mjs](file:///C:/Projects/Manas_Flow/Chameleon/scripts/test-search-architecture.mjs), [test-tool-products.mjs](file:///C:/Projects/Manas_Flow/Chameleon/scripts/test-tool-products.mjs), [test-navigation-performance.mjs](file:///C:/Projects/Manas_Flow/Chameleon/scripts/test-navigation-performance.mjs).
- **Business impact:** Automated quality gates cannot be run in CI as a single green suite without either aligning the code or updating stale test assertions cleanly.
- **Priority / Effort:** **P1** / Medium
- **Proposed solution:** Check whether `test-search-architecture.mjs` and `test-tool-products.mjs` should align cleanly (`SoftwareApplication` vs `WebApplication` in `validate-rendered-seo.mjs` & `test-tool-products.mjs`, and `chrome.tsx` / `shared.tsx` server/client boundary factoring if safe, OR keeping interactive islands isolated). Evaluate carefully during Phase 3–4 without breaking `validate-rendered-seo.mjs` (`1,768` pages passing) or design parity!
- **Current status:** Verified open gap.

### F-07 (P1) — Case Studies Distribution & Homepage / Consultation Conversion Enhancements
- **Issue description:** [service-landing.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/service-landing.tsx) renders features, diagrams, booking card, and related services, but does not display matched verified client case studies from `case-studies.json` on relevant service pages (e.g., Just Russel on Marketing/Growth pages, Qatar Tourism on Support/WhatsApp pages, Unmuted/Sage/Orbital Eye on Engineer Placement pages, Dentakay/Addictest on SaaS/Operations pages). Also `/consultation` lacks explicit US-buyer timezone overlap wording (`CET / EST / PST` overlap window) and post-call progression clarity.
- **Evidence:** [service-landing.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/service-landing.tsx), [supplemental-pages.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/supplemental-pages.tsx#L48), [case-studies.json](file:///C:/Projects/Manas_Flow/Chameleon/src/data/manasflow/case-studies.json).
- **Priority / Effort:** **P1** / Medium
- **Proposed solution:** Add a `RelevantOutcomes` band in `service-landing.tsx` mapping verified entries from `case-studies.json` by domain/pattern; add engagement model summary & US/EU timezone overlap section to `/consultation` and `/contact`.
- **Current status:** Verified open gap.

### F-08 (P2) — Interactive Lead Magnets, Automation Demo & Buyer-Focused Vertical Landing Pages
- **Issue description:** Tools in [interactive-tools.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/interactive-tools.tsx), [tool-assessments.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/tool-assessments.tsx), and [tool-planning.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/tool-planning.tsx) compute results locally, and only `ROICalculator` integrates with `/api/contact` or tracks completion events. There is no interactive synthetic live-style **Automation Demo Sandbox** (e.g. AI Lead Qualification / Invoice Extraction / Support Triage interactive workflow simulator), and core vertical buyer pages (e.g. SaaS companies, marketing agencies, e-commerce, operations) need clearer links or landing structures mapped to `/case-studies`, `/roi-calculator`, and `/contact`.
- **Priority / Effort:** **P2** / Medium-High
- **Proposed solution:** Add a lightweight, rate-free client-side interactive Automation Workflow Simulator (`/automation-demo`) demonstrating Lead Qualification, Document Extraction, and Support Triage with transparent "Simulated Sample" labeling and contextual CTA + analytics tracking (`demo_started`, `demo_completed`); wire `assessment_started` / `assessment_completed` / optional report delivery in assessments & use-case finder; audit/link vertical industry guides & buyer landing pages cleanly.
- **Current status:** Verified open gap.

### F-09 (P2) — Marketing Automation, Digital Marketing Strategy & Content Strategy Documentation
- **Issue description:** `docs/marketing/DIGITAL_MARKETING_PLAN.md`, `docs/marketing/CONTENT_STRATEGY.md`, analytics/CRM integration docs, lead scoring logic, and GDPR/CAN-SPAM nurturing sequence templates do not exist yet.
- **Priority / Effort:** **P2** / Medium
- **Proposed solution:** Implement deterministic lead-scoring + lifecycle stage helper (`src/lib/lead-scoring.ts` attached to webhook/CRM payloads with transparent rules and human override support), build reusable email/nurturing draft templates (`docs/crm/NURTURE_TEMPLATES.md` — draft/test mode only, never sending live emails), and author `docs/marketing/DIGITAL_MARKETING_PLAN.md` and `docs/marketing/CONTENT_STRATEGY.md` grounded strictly in verified repository routes and tools.
- **Current status:** Verified open gap.

### F-10 (P3) — AI Solutions Consultant & Growth Analytics Readiness Evaluation / Guardrailed Endpoints
- **Issue description:** Master Plan Sections 27–28 specify evaluating an AI Solutions Consultant and Growth Analytics Dashboard *only after* core conversion infrastructure is stable, without fabricating live data or risking uncontrolled AI API spend.
- **Priority / Effort:** **P3** / Evaluated & Documented / Safe Local Architecture
- **Proposed solution:** Build a safe, deterministic / zero-uncontrolled-cost Solutions Advisor (`/advisor` or modal drawer backed by approved static knowledge base in `src/data/manasflow/`, prompt-injection sanitization, transparent assumptions, human escalation to `/contact`/`/consultation`, explicit AI disclosure) plus an admin-gated / configuration-documented Growth Analytics & Attribution architecture doc + empty-state/env-verification readiness checker so nothing invents fake revenue/session numbers.
- **Current status:** Verified open gap (blocked on external API keys/credentials for live GA4/CRM/GSC data feeds, unblocked for safe architecture, local deterministic tools, and documentation).
