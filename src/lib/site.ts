export const site = {
  name: "ManasFlow",
  url: "https://manasflow.com",
  email: "info@manasflow.com",
  registeredLocation: "Milan, Italy",
  workingLocation: "Remote-first across Europe",
  description:
    "Scale your business with ManasFlow. AI agents, custom workflow automation, and forward-deployed engineering that take repetitive work off your team's plate. Book a free strategy call.",
  legalUpdated: "17 October 2026",
} as const;

// No analytics SDK, tracking identifier or remote form endpoint is configured.
// Booking uses Cal.com (manasflow/30min); enquiries use ManasFlow email.
export const contactHref = `mailto:${site.email}`;
