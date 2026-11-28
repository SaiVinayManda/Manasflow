# ManasFlow — Growth Analytics & Reporting Dashboard Specification

**Status:** Architecture & Integration Specification — **Blocked on live GA4 Property ID, Google Search Console OAuth, CRM API keys, and Cal.com API/Webhook secret.** Zero mock dashboards or fabricated session/revenue numbers are shipped in the public app.

---

## 1. Reporting Requirements & Live Data Sources

| Metric Group | Required Metrics | Authoritative Source | Missing Live Prerequisite |
| --- | --- | --- | --- |
| Acquisition & Traffic | Sessions, channels, landing pages, campaign UTMs | Google Analytics 4 Data API | `NEXT_PUBLIC_GA_MEASUREMENT_ID` + GA4 Property Service Account |
| Organic Search | Impressions, clicks, CTR, top queries, indexed pages | Google Search Console API | Verified GSC property + Service Account export |
| Conversion Funnel | `form_start`, `generate_lead`, `roi_calculator_completed`, `booking_completed`, conversion rate | GA4 + Supabase `manasflow_leads` table | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, GA4 |
| Calendar Bookings | Created, rescheduled, canceled, attendance status | `/api/webhooks/cal` + Cal.com API | `CAL_WEBHOOK_SECRET` |
| Pipeline & Revenue | Qualified leads, proposals sent, proposal value, closed-won deals, CAC, revenue by UTM source | CRM (`HubSpot` / `Attio` / `Pipedrive` via `CRM_WEBHOOK_URL`) | Live CRM API Token & webhook connection |
| Newsletter Health | Confirmed opt-ins, unsubscribe count | Supabase `manasflow_newsletter` table + ESP | Live ESP / Supabase tables |

---

## 2. Recommended Internal Implementation Pattern (Next Step Once Keys Exist)

1. Protect any future `/admin/growth` dashboard route with authenticated admin session middleware (e.g., NextAuth/Supabase Auth RBAC restricted strictly to verified `@manasflow.com` admins — **never publicly exposed**).
2. Read aggregated metrics directly from Supabase SQL views + GA4/GSC read-only server actions; render explicit **empty-state setup cards** whenever an integration env var is unset rather than falling back to placeholder charts.
3. Join leads to closed-won CRM revenue using `recordId` (`uuid`) and first-touch `attribution` (`utmSource`, `utmCampaign`, `landingPage`) persisted by `src/lib/lead-store.ts`.
