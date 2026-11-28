import hubs from "@/data/manasflow/hub-metadata.json";

export const site = {
  name: "ManasFlow",
  url: "https://manasflow.com",
  email: "info@manasflow.com",
  registeredLocation: "Milan, Italy",
  workingLocation: "Remote-first across Europe",
  description: hubs["/"].description,
  legalUpdated: "17 October 2026",
  stats: {
    companiesShipped: "45+",
    integrationsDeployed: "200+",
    connectedTools: "100+",
    consultationMinutes: 30,
    challengeName: "52-Day Claude Code Challenge",
    challengeDays: 52,
  },
} as const;

// No analytics SDK, tracking identifier or remote form endpoint is configured.
// Booking uses Cal.com (manasflow/30min); enquiries use ManasFlow email.
export const contactHref = `mailto:${site.email}`;
