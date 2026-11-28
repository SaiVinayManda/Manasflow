export const CAL_NAMESPACE = "30min";
export const CAL_LINK = "manasflow/30min";
export const CAL_ORIGIN = "https://cal.com";
export const CAL_EMBED_SCRIPT_URL = `${CAL_ORIGIN}/embed/embed.js`;
export const CAL_BOOKING_URL = `${CAL_ORIGIN}/${CAL_LINK}`;
export const CAL_LOAD_TIMEOUT_MS = 4000;
export const CAL_CONFIG = {
  layout: "month_view",
  useSlotsViewOnSmallScreen: "true",
  theme: "light",
} as const;

export const CAL_TRIGGER_ATTRIBUTES = {
  "data-cal-namespace": CAL_NAMESPACE,
  // The React handler invokes the SDK directly; do not also register a delegated click.
  "data-booking-link": CAL_LINK,
  "data-cal-origin": CAL_ORIGIN,
  "data-cal-config": JSON.stringify(CAL_CONFIG),
} as const;

export function isBookingDestination(href: string | undefined, includeContact = false) {
  if (!href) return true;
  if (href === CAL_BOOKING_URL || ["#consultation", "#supp-booking"].includes(href)) return true;
  if (/[?&](?:service|topic)=/i.test(href)) return false;
  const pathname = href.split(/[?#]/)[0].replace(/\/$/, "");
  return ["/consultation", "/book-a-call", ...(includeContact ? ["/contact"] : [])].includes(pathname);
}
