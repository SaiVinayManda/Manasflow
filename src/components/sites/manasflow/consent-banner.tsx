"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { captureAttribution } from "@/lib/attribution";
import { readConsentChoice, writeConsentChoice } from "@/lib/analytics";
import "./consent-banner.css";

/** Captures non-PII first-touch UTM and referrer context into sessionStorage. */
export function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}

/** Shown only when analytics measurement (NEXT_PUBLIC_GA_MEASUREMENT_ID) is enabled. */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readConsentChoice()) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    return undefined;
  }, []);

  if (!visible) return null;

  return (
    <aside className="mf-consent-banner" role="dialog" aria-label="Analytics consent preferences">
      <p>
        We use optional privacy-safe analytics to measure which guides and tools help visitors most. No personal details are shared with analytics. See our <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <div className="mf-consent-actions">
        <button
          type="button"
          className="mf-consent-decline"
          onClick={() => {
            writeConsentChoice("denied");
            setVisible(false);
          }}
        >
          Decline
        </button>
        <button
          type="button"
          className="mf-consent-accept"
          onClick={() => {
            writeConsentChoice("granted");
            setVisible(false);
          }}
        >
          Allow analytics
        </button>
      </div>
    </aside>
  );
}
