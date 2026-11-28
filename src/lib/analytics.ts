/** Typed client-side analytics abstraction with PII scrubbing, deduplication, and consent awareness. */

export type AnalyticsEventName =
  | "cta_click"
  | "service_selected"
  | "service_page_view"
  | "case_study_view"
  | "form_start"
  | "form_error"
  | "generate_lead"
  | "assessment_started"
  | "assessment_completed"
  | "roi_calculator_started"
  | "roi_calculator_completed"
  | "demo_started"
  | "demo_completed"
  | "newsletter_signup"
  | "whatsapp_click"
  | "booking_started"
  | "booking_completed"
  | "qualified_lead"
  | "meeting_attended"
  | "proposal_sent"
  | "deal_won";

export type AnalyticsParamValue = string | number | boolean;
export type AnalyticsParams = Record<string, AnalyticsParamValue | undefined>;

const DISALLOWED_PII_KEYS = new Set([
  "email",
  "name",
  "full_name",
  "fullname",
  "phone",
  "telephone",
  "company",
  "details",
  "message",
  "ip",
  "address",
]);

const CONSENT_STORAGE_KEY = "mf_analytics_consent_v1";
const sentEventIds = new Set<string>();

export type ConsentChoice = "granted" | "denied";

export function readConsentChoice(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const val = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return val === "granted" || val === "denied" ? val : null;
  } catch {
    return null;
  }
}

export function writeConsentChoice(choice: ConsentChoice) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {}
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("consent", "update", {
      analytics_storage: choice,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
}

/** Removes any accidental PII keys before dispatching telemetry. */
export function sanitizeAnalyticsParams(params?: AnalyticsParams): Record<string, AnalyticsParamValue> | undefined {
  if (!params) return undefined;
  const clean: Record<string, AnalyticsParamValue> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    const lower = key.toLowerCase();
    if (DISALLOWED_PII_KEYS.has(lower) || lower.includes("email") || lower.includes("phone")) continue;
    if (typeof value === "string" && /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value)) continue;
    clean[key] = value;
  }
  return clean;
}

export function trackEvent(
  event: AnalyticsEventName,
  params?: AnalyticsParams,
  options?: { eventId?: string },
) {
  if (typeof window === "undefined") return;
  if (options?.eventId) {
    if (sentEventIds.has(options.eventId)) return;
    sentEventIds.add(options.eventId);
    if (sentEventIds.size > 500) sentEventIds.clear();
  }
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  const sanitized = sanitizeAnalyticsParams({
    ...params,
    ...(options?.eventId ? { event_id: options.eventId } : {}),
  });
  gtag("event", event, sanitized);
}
