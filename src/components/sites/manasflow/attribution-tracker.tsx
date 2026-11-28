"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Captures non-PII first-touch acquisition metadata cleanly after hydration. */
export function AttributionTracker() {
  useEffect(() => {
    const id = typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback(() => captureAttribution())
      : window.setTimeout(() => captureAttribution(), 100);
    return () => {
      if (typeof window.cancelIdleCallback === "function" && typeof id === "number") {
        window.cancelIdleCallback(id);
      } else {
        window.clearTimeout(id);
      }
    };
  }, []);
  return null;
}
