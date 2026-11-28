# ManasFlow — Digital Marketing Strategy Plan

**Target Market:** Primary: United States (B2B SMB to mid-market SaaS, agencies, e-commerce, operations); Secondary: Europe & international remote-first buyers.  
**Status:** Strategy & Readiness Documentation — **No ad campaigns, paid directory listings, or automated marketing sends are activated without explicit business-owner approval.**

---

## 1. Strategic Positioning & Core Value Proposition

- **Core Differentiation:** Embedded forward-deployed AI engineers paired with curated coding/orchestration agents (`Claude Code`, `n8n`, `MCP`, `E2B`), backed by full customer code/infrastructure ownership and a documented 30-day first-month guarantee (`Terms §9`).
- **Lead Magnet First, Discovery Second:** Lead capture directs cold/warm acquisition traffic toward high-clarity interactive tools and tailored landing pages rather than generic homepage exits.

---

## 2. Channel Architecture

### A. Google Search Campaigns (High-Intent Commercial Capture — Pending Budget Approval)
Route paid search ad groups strictly to single-intent landing pages (`no shared multi-intent dumping`) with preserved service pre-selection and session UTM tracking:

| Campaign Theme | Target Buyer Intent Keywords (Illustrative) | Dedicated Landing Page | Primary Conversion Event |
| --- | --- | --- | --- |
| Embedded AI Engineers | "hire forward deployed ai engineer", "embedded ai engineers" | `/engineer-placement` | `generate_lead` / `booking_completed` |
| Business Workflow Automation | "business workflow automation agency", "b2b workflow automation" | `/workflow-automation-agency` | `generate_lead` / `booking_completed` |
| n8n Automation Agency | "n8n agency", "hire n8n developers", "custom n8n workflows" | `/n8n-agency` | `generate_lead` / `booking_completed` |
| AI Agent Development | "custom ai agent development", "enterprise ai agents" | `/ai-agent-development` | `generate_lead` / `booking_completed` |
| SaaS & AI Product MVP | "ai saas mvp development", "build ai web app agency" | `/saas-mvp-development` | `generate_lead` / `booking_completed` |
| Interactive Funnel (Mid-Funnel) | "ai automation roi calculator", "workflow audit template" | `/roi-calculator`, `/automation-demo` | `roi_calculator_completed` -> `generate_lead` |

### B. LinkedIn Organic & Paid Acquisition (Pending Budget Approval)
- **Organic Pillars (Founder & Engineering Accounts):**
  1. Weekly architecture teardowns showcasing real workflows (`Documents to Decisions`, `Growth workflow`, `Execution capacity` patterns from `/case-studies`).
  2. Interactive tool spotlights linking directly to `/roi-calculator`, `/workflow-audit`, `/automation-demo`, and `/advisor`.
  3. Engineering transparency threads citing `/security` (credential scoping, human-in-the-loop gates, self-hosted VPC vs customer cloud).
- **LinkedIn Lead-Gen Ads (Sponsored Content):** Target US Operations Directors, VP Engineering, CTOs, SaaS Founders, and Marketing Agency Owners (`11–250` headcount) driving directly to `/automation-demo?utm_source=linkedin&utm_medium=paid_social` and `/roi-calculator`.

### C. YouTube Technical Demonstrations
- Publish short 3–5 minute live system walkthroughs matching the patterns inside `/automation-demo` (`Lead Qualification`, `Document Extraction + AP Approval`, `KB-Cited Support Triage`) and link pinned descriptions with UTMs straight to `/contact?service=...`.

### D. Permission-Based Email Marketing & Weekly Brief
- Operated through explicit marketing opt-in (`/api/newsletter`), tracked separately from sales/contact enquiries, with one-click unsubscribe (`/api/newsletter/unsubscribe`). Templates live in draft/test mode in [NURTURE_TEMPLATES.md](file:///C:/Projects/Manas_Flow/Chameleon/docs/crm/NURTURE_TEMPLATES.md).

### E. Partner Marketing, Agencies Directory & Verified Customer Reviews
- Maintain accurate technical profiles on Clutch, G2, and Make/n8n partner directories once verified client review invitations are approved by ManasFlow leadership.
- Build mutual referral partnerships with HubSpot, Clay, and RevOps consultancies that lack deep custom agent/n8n backend engineering.

---

## 3. Standard UTM & Attribution Convention

The client `AttributionTracker` ([src/lib/attribution.ts](file:///C:/Projects/Manas_Flow/Chameleon/src/lib/attribution.ts)) persists first-touch `landingPage`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `fbclid`, and `li_fat_id` in `sessionStorage` and attaches them cleanly to `/api/contact` payloads (never forwarded to GA4 with PII).

Recommended campaign URL template:
`https://manasflow.com/<landing-page>?utm_source=<google|linkedin|youtube|newsletter>&utm_medium=<cpc|paid_social|organic|email>&utm_campaign=<theme-YYYY-QQ>&utm_content=<creative-variant>`

---

## 4. Revenue Attribution & Consent Alignment
- Browser GA4 initializes only with `NEXT_PUBLIC_GA_MEASUREMENT_ID` and defaults `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` to `denied` until consented via `ConsentBanner`.
- CRM webhooks receive `recordId`, `score` (`0–100`), `tier`, `stage`, and `attribution` to reconcile downstream `Qualified -> Discovery completed -> Proposal sent -> Won` revenue without inflating button clicks (`booking_started`) into revenue conversions.
