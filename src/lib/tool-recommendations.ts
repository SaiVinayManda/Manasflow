type ToolRecommendation = { href: string; title: string; description: string; anchor: string };

// Match the page's topic, rather than sending every article to the same funnel.
export function relatedInteractiveTool(context: string): ToolRecommendation {
  if (/\b(readiness|maturity|governance|compliance|adoption|strategy|transformation)\b/i.test(context)) {
    return { href: "/ai-readiness-assessment", title: "Find your starting point for AI adoption", description: "Assess your data, technology, people, process, and strategy to get a practical roadmap.", anchor: "Assess your organization's next steps with our AI Readiness Assessment" };
  }
  if (/\b(roi|costs?|pricing|budget|payback|savings|finance|accounting|productivity|automation|workflows?)\b/i.test(context.replaceAll("-", " "))) {
    return { href: "/roi-calculator", title: "Put numbers behind your automation plan", description: "Model implementation costs, time savings, and break-even using assumptions from your own process.", anchor: "Estimate the value of automating this process with our ROI Calculator" };
  }
  return { href: "/ai-tool-selector", title: "Choose a tool that fits your stack", description: "Compare implementation options against your budget, technical skills, workflow volume, and requirements.", anchor: "Compare these tools against your stack in our AI Tool Selector" };
}
