# ManasFlow Website — Implementation Task Tracker

**Specification:** [MANASFLOW_MASTER_IMPROVEMENT_PLAN.md](file:///C:/Projects/Manas_Flow/Chameleon/temp/MANASFLOW_MASTER_IMPROVEMENT_PLAN.md)  
**Branch:** `feat/master-improvement-plan`  
**Status Legend:** `Pending` | `In progress` | `Implemented` | `Tested` | `Blocked` | `Requires approval` | `Completed`

---

## Task Board

| ID | Phase | Priority | Task | Status | Notes / Blockers |
| --- | --- | --- | --- | --- | --- |
| T1.1 | Phase 1 | P0 | Inspect repo, live production site, layout across 7 viewports, tests & Lighthouse | Completed | Baseline verified against `012ed1a` & `https://manasflow.com` |
| T1.2 | Phase 1 | P0 | Create `BASELINE_AUDIT.md`, `IMPLEMENTATION_PLAN.md`, `TASK_TRACKER.md` & feature branch | Completed | Feature branch `feat/master-improvement-plan` |
| T2.1 | Phase 2 | P0 | Persist-first lead store, attribution helper, scoring, rate limiting, spam protection & retry | Pending | Needs live `SUPABASE_*` / `RESEND_API_KEY` / `CONTACT_WEBHOOK_URL` in prod |
| T2.2 | Phase 2 | P0 | Upgrade `/api/contact`, `ContactForm` (`?service=`, optional fields, confirmation), `BlueprintForm`, `CareerApplication` | Pending | |
| T2.3 | Phase 2 | P0 | Upgrade `/api/newsletter` (consent, duplicate guard, rate limit) & `/api/newsletter/unsubscribe` | Pending | Live ESP credentials needed in prod |
| T2.4 | Phase 2 | P0 | Typed analytics (`analytics.ts`), Consent Mode v2 banner, Cal SDK `booking_completed` & `/api/webhooks/cal` | Pending | `NEXT_PUBLIC_GA_MEASUREMENT_ID` & `CAL_WEBHOOK_SECRET` needed in prod |
| T2.5 | Phase 2 | P0 | Automated tests for lead capture, newsletter, webhook signature, attribution & analytics (`test-lead-capture.mjs`) | Pending | |
| T3.1 | Phase 3 | P1 | Clean remaining `30+` & `15-min` inconsistencies in `service-pages.json` + regenerate SEO data | Pending | |
| T3.2 | Phase 3 | P1 | Preserve `?service=` context on CTA links to `/contact` & standardize CTA tracking | Pending | |
| T3.3 | Phase 3 | P1 | Surface matched verified case studies across commercial service landing pages | Pending | |
| T3.4 | Phase 3 | P1 | Add dedicated `/security` architecture & delivery page + US/EU overlap clarity on consultation/contact | Pending | US entity/office intentionally omitted (not verified) |
| T3.5 | Phase 3 | P1 | Mobile/tablet/desktop navigation & sticky widget UX audit across `320`–`1920px` | Pending | |
| T4.1 | Phase 4 | P1 | Resolve pre-existing test suite alignment (`test-search-architecture.mjs`, `test-tool-products.mjs`, etc.) | Pending | |
| T4.2 | Phase 4 | P1 | Verify sitemap, robots, schema, canonicals & `validate-rendered-seo.mjs` with all new pages | Pending | |
| T4.3 | Phase 4 | P1 | Verify Lighthouse `13.6.0` Performance, Accessibility, Best Practices, SEO & Agentic Browsing (~100/100) | Pending | |
| T5.1 | Phase 5 | P2 | Build interactive `/automation-demo` workflow simulator (Lead Qual, Invoice OCR, Support Triage) | Pending | |
| T5.2 | Phase 5 | P2 | Connect assessment/finder tools to optional scoped report lead capture & typed analytics | Pending | |
| T5.3 | Phase 5 | P2 | Author `docs/marketing/DIGITAL_MARKETING_PLAN.md` & `docs/marketing/CONTENT_STRATEGY.md` | Pending | Ad spend / campaign launch requires approval |
| T6.1 | Phase 6 | P2 | Wire CRM webhook adapter & lead scoring metadata; write `CRM_INTEGRATION.md`, `NURTURE_TEMPLATES.md`, `ANALYTICS_EVENTS.md` | Pending | Live CRM / ESP email activation blocked without credentials/approval |
| T7.1 | Phase 7 | P3 | Add deterministic grounded Solutions Advisor & document Growth Analytics Dashboard spec (`GROWTH_DASHBOARD_SPEC.md`) | Pending | Live GSC/GA4/CRM dashboard widgets require API OAuth/service keys |
| T8.1 | Phase 8 | P0 | Full regression suite, security & env check, `FINAL_IMPLEMENTATION_REPORT.md` & clean branch commits | Pending | Production deployment requires explicit approval |

---

## Completed Task Logs

### T1.1 & T1.2 — Baseline Investigation, Docs & Feature Branch
- **Status:** Completed
- **Files changed:** `docs/audit/BASELINE_AUDIT.md`, `docs/audit/IMPLEMENTATION_PLAN.md`, `docs/audit/TASK_TRACKER.md`
- **Reason for change:** Establish verified baseline facts comparing `main` (`012ed1a`) and live production `https://manasflow.com` before editing code.
- **Implementation details:** Inspected repository routes, form handlers, JSON datasets, test scripts, and live HTTP responses; measured 7 viewports via headless Chrome (`overflowX: 0`); ran Lighthouse `13.6.0` and `validate-rendered-seo.mjs`. Created branch `feat/master-improvement-plan`.
- **Tests performed:** `npm run check`, `test-cal-booking.mjs`, `test-tool-calculations.mjs`, `validate-seo.mjs`, `validate-rendered-seo.mjs`, `test-search-architecture.mjs`, `test-navigation-performance.mjs`, `test-tool-products.mjs`, Playwright 7-viewport layout scan, Lighthouse `13.6.0`.
- **Test results:** Build, SEO (`1,768` pages, `0` errors), booking, calculations, 7-viewport responsiveness, and Lighthouse (`100` across all 5 categories on desktop & mobile) pass; 3 legacy architecture/tool scripts fail as documented in `F-06`.
- **Remaining limitations / Blockers:** No live external credentials (`RESEND_API_KEY`, `CONTACT_WEBHOOK_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `CAL_WEBHOOK_SECRET`, `SUPABASE_URL`, `CRM_WEBHOOK_URL`) configured in workspace `.env`.
