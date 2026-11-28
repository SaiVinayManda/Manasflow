"use client";

export type ClientAttribution = {
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

const STORAGE_KEY = "mf_attribution_v1";

/** Captures non-PII first-touch acquisition metadata for enquiry attribution. */
export function captureAttribution(): ClientAttribution {
  if (typeof window === "undefined") return {};
  try {
    const existingRaw = window.sessionStorage.getItem(STORAGE_KEY);
    const existing = existingRaw ? (JSON.parse(existingRaw) as ClientAttribution) : {};
    const params = new URLSearchParams(window.location.search);
    const next: ClientAttribution = {
      landingPage: existing.landingPage || window.location.pathname,
      referrer: existing.referrer || (document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : undefined),
      utmSource: existing.utmSource || params.get("utm_source") || undefined,
      utmMedium: existing.utmMedium || params.get("utm_medium") || undefined,
      utmCampaign: existing.utmCampaign || params.get("utm_campaign") || undefined,
      utmContent: existing.utmContent || params.get("utm_content") || undefined,
      utmTerm: existing.utmTerm || params.get("utm_term") || undefined,
      gclid: existing.gclid || params.get("gclid") || undefined,
      fbclid: existing.fbclid || params.get("fbclid") || undefined,
      liFatId: existing.liFatId || params.get("li_fat_id") || undefined,
    };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return {};
  }
}

export function getAttribution(): ClientAttribution {
  if (typeof window === "undefined") return {};
  return captureAttribution();
}

export function createSubmissionKey(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
