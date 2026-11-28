# ManasFlow — Conversion Analytics & Consent Documentation

**Modules:** [src/lib/analytics.ts](file:///C:/Projects/Manas_Flow/Chameleon/src/lib/analytics.ts), [consent-banner.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/components/sites/manasflow/consent-banner.tsx), [layout.tsx](file:///C:/Projects/Manas_Flow/Chameleon/src/app/layout.tsx), [api/webhooks/cal/route.ts](file:///C:/Projects/Manas_Flow/Chameleon/src/app/api/webhooks/cal/route.ts)

---

## 1. Privacy, Consent & Zero-PII Safeguards

- GA4 (`googletagmanager.com/gtag/js`) loads **only** when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured.
- Google Consent Mode v2 initializes `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` to `denied` prior to user interaction. Accepting via `ConsentBanner` persists `mf_analytics_consent_v1 = "granted"` in `localStorage` and calls `gtag('consent', 'update', { analytics_storage: 'granted' })`.
- `sanitizeAnalyticsParams()` inside `src/lib/analytics.ts` strips keys matching `email`, `name`, `full_name`, `phone`, `telephone`, `company`, `details`, `message`, `ip`, `address`, and rejects any string value matching an email regex. **No PII is ever transmitted to Google Analytics.**
- Attribution (`utm_*`, referrer, `gclid`, `fbclid`, `li_fat_id`) is passed only to ManasFlow's server `/api/contact` persistence payload, separate from GA4 custom parameters.

---

## 2. Intent vs. Verified Conversion Separation

| User Action | Event Fired | Is Verified Conversion? | Trigger Location |
| --- | --- | --- | --- |
| Click CTA link / button | `cta_click` | No (intent) | Hero / Demo / Solutions Advisor |
| Open Cal.com modal / click WhatsApp | `booking_started` / `whatsapp_click` | No (intent) | `booking-link.tsx`, `whatsapp-contact.tsx` |
| Start typing in `/contact` form | `form_start` | No (intent) | `ContactForm` (`onFocusCapture`) |
| Select service in form | `service_selected` | No (intent) | `ContactForm` (`<select name="service">`) |
| Validation / API error (`4xx`/`5xx`) | `form_error` | No (diagnostic) | `ContactForm`, `Newsletter`, `BlueprintForm`, `ROICalculator` |
| **API HTTP 200 persisted enquiry** | `generate_lead` (`event_id`) | **Yes** | Confirmed `200 OK` from `/api/contact` |
| **API HTTP 200 newsletter opt-in** | `newsletter_signup` (`event_id`) | **Yes (Marketing Opt-In)** | Confirmed `200 OK` from `/api/newsletter` |
| **Cal SDK `bookingSuccessful` / `bookingSuccessfulV2`** | `booking_completed` | **Yes** | `booking-link.tsx` `onCalEvent` + `/api/webhooks/cal` |
| Tool interactions | `assessment_started`, `assessment_completed`, `roi_calculator_started`, `roi_calculator_completed`, `demo_started`, `demo_completed` | Micro-conversions | Interactive calculators, assessments & `/automation-demo` |
| Downstream CRM stages | `qualified_lead`, `meeting_attended`, `proposal_sent`, `deal_won` | CRM Server-Side / Measurement Protocol | Post-lead webhook pipeline (requires CRM setup) |

---

## 3. Deduplication & Verification

1. **Client-side Deduplication:** Critical conversions pass an idempotency `eventId` into `trackEvent(name, params, { eventId })`, preventing double fires within the same tab session.
2. **Server-Side Booking Reconciliation:** Configure Cal.com Event Type webhooks (`BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`) to `POST https://manasflow.com/api/webhooks/cal` signed with `CAL_WEBHOOK_SECRET`. Match `recordId` / `bookingUid` in CRM rather than relying on client-side modal clicks.
3. **Manual Verification Steps:**
   - Set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...` locally, open Chrome DevTools Network filter `collect?v=2` + GA4 DebugView.
   - Verify no `collect` analytics storage cookie is written before clicking **Allow analytics** on `ConsentBanner`.
   - Submit `/contact`, trigger ROI calculator completion, run `/automation-demo`, and open/close the Cal modal (verifying `booking_started` fires without `booking_completed`, and zero PII fields appear in any request payload).
