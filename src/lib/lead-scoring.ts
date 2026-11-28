/** Transparent, rule-based lead scoring and lifecycle classification. */

export type LeadStage =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Discovery scheduled"
  | "Discovery completed"
  | "Proposal sent"
  | "Negotiation"
  | "Won"
  | "Lost"
  | "Nurturing";

export type LeadScoringInput = {
  kind: "contact" | "roi-roadmap" | "industry-blueprint" | "career" | "opportunity-assessment";
  email?: string;
  company?: string;
  website?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  details?: string;
};

export type LeadScoreResult = {
  score: number;
  tier: "high" | "standard" | "early";
  stage: LeadStage;
  reasons: string[];
  humanReviewRequired: true;
};

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
]);

const HIGH_BUDGETS = new Set(["$15,000 - $30,000", "$30,000 - $50,000", "$50,000+", "$15k - $50k", "$50k+"]);
const CORE_SERVICES = new Set([
  "AI Agent Development",
  "Business Automation",
  "Custom AI Solutions",
  "Workflow Automation",
  "Engineer Placement",
  "SaaS MVP Development",
]);

/**
 * Computes an indicative priority score without ever auto-rejecting leads.
 * Human review remains mandatory for all incoming enquiries.
 */
export function scoreLead(input: LeadScoringInput): LeadScoreResult {
  let score = 20;
  const reasons: string[] = ["Valid submission received"];

  const emailDomain = input.email?.split("@")[1]?.toLowerCase() || "";
  if (emailDomain && !FREE_EMAIL_DOMAINS.has(emailDomain)) {
    score += 15;
    reasons.push("Business email domain provided");
  }
  if (input.company?.trim()) {
    score += 10;
    reasons.push("Company name specified");
  }
  if (input.website?.trim()) {
    score += 10;
    reasons.push("Company website provided");
  }
  if (input.service && CORE_SERVICES.has(input.service)) {
    score += 15;
    reasons.push(`Core service fit: ${input.service}`);
  } else if (input.service?.trim()) {
    score += 10;
    reasons.push("Service category selected");
  }

  const detailLen = input.details?.trim().length || 0;
  if (detailLen >= 80) {
    score += 15;
    reasons.push("Detailed project context shared");
  } else if (detailLen >= 25) {
    score += 10;
    reasons.push("Initial project context provided");
  }

  if (input.budget && HIGH_BUDGETS.has(input.budget)) {
    score += 15;
    reasons.push(`Scoped budget range: ${input.budget}`);
  } else if (input.budget?.trim()) {
    score += 5;
  }

  if (input.timeline && /immediately|2 weeks|this month|urgent/i.test(input.timeline)) {
    score += 10;
    reasons.push("Near-term implementation timeline");
  } else if (input.timeline?.trim()) {
    score += 5;
  }

  const clamped = Math.min(100, score);
  const tier = clamped >= 70 ? "high" : clamped >= 45 ? "standard" : "early";
  const stage: LeadStage = input.kind === "career" ? "New" : tier === "high" ? "Qualified" : "New";

  return {
    score: clamped,
    tier,
    stage,
    reasons,
    humanReviewRequired: true,
  };
}
