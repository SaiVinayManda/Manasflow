"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { CAL_CONFIG, CAL_EMBED_SCRIPT_URL, CAL_LINK, CAL_NAMESPACE, CAL_ORIGIN } from "@/lib/booking";

type CalApi = Awaited<ReturnType<typeof getCalApi>>;
let initialization: Promise<CalApi> | undefined;

export function initializeCal() {
  initialization ??= getCalApi({ namespace: CAL_NAMESPACE, embedJsUrl: CAL_EMBED_SCRIPT_URL }).then(cal => {
    // A namespaced API ignores init calls that omit its namespace argument.
    cal("init", CAL_NAMESPACE, { origin: CAL_ORIGIN });
    cal("ui", {
      hideEventTypeDetails: false,
      layout: CAL_CONFIG.layout,
      theme: CAL_CONFIG.theme,
    });
    cal("preload", { calLink: CAL_LINK });
    return cal;
  }).catch(error => {
    initialization = undefined;
    throw error;
  });
  return initialization;
}

export function CalProvider() {
  useEffect(() => { void initializeCal().catch(() => undefined); }, []);
  return null;
}
