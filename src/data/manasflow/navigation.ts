export type NavigationLink = { label: string; detail: string; href: string };
export type NavigationGroup = { title: string; links: NavigationLink[] };

export const agencyLinks = [
  ["n8n Agency", "/n8n-agency"], ["Claude Code Agency", "/claude-code-agency"],
  ["Cursor Agency", "/cursor-agency"], ["Codex Agency", "/codex-agency"],
  ["Lovable Agency", "/lovable-agency"], ["Bubble Agency", "/bubble-agency"],
  ["Framer Agency", "/framer-agency"], ["Supabase Agency", "/supabase-agency"],
  ["FlutterFlow Agency", "/flutterflow-agency"], ["Replit Agency", "/replit-agency"],
  ["v0 Agency", "/v0-agency"],
] as const;

export const crmLinks = [
  ["Salesforce Consultants", "/salesforce-consultants"], ["HubSpot Consultants", "/hubspot-consultants"],
  ["Zoho Consultants", "/zoho-consultants"], ["Pipedrive Consultants", "/pipedrive-consultants"],
  ["Attio CRM Agency", "/attio-crm-agency"], ["Clay Agency", "/clay-agency"],
  ["Cold Email Agency", "/cold-email-agency"], ["LinkedIn Outreach Agency", "/linkedin-outreach-agency"],
] as const;

export const serviceLinks = [
  ["All Services", "/services"], ["AI Strategy Consulting", "/ai-strategy-consulting"],
  ["AI Agent Development", "/ai-agent-development"], ["Workflow Automation", "/workflow-automation"],
  ["Custom Automation", "/custom-automation"], ["RAG Pipeline Development", "/rag-pipeline-development"],
  ["SaaS MVP Development", "/saas-mvp-development"], ["AI Workshops", "/ai-workshops"],
  ["Engineer Placement", "/engineer-placement"], ["Hire AI Developers", "/hire-ai-developers"],
  ["Custom Training", "/custom-training"], ["Maintenance & Support", "/maintenance-support"],
  ["OpenClaw & NemoClaw Setup", "/openclaw-nemoclaw-setup"],
] as const;

export const solutionLinks = [
  ["AI Automation Agency", "/ai-automation-agency"], ["AI Chatbot Development Agency", "/ai-chatbot-development-agency"],
  ["Workflow Automation Agency", "/workflow-automation-agency"], ["SaaS Development Agency", "/saas-development-agency"],
  ["No-Code Development Agency", "/no-code-development-agency"], ["Marketing Automation Agency", "/marketing-automation-agency"],
  ["Next.js AI App Development", "/nextjs-ai-app-development"],
] as const;

export const freeToolLinks = [
  ["Free AI Models Directory", "/directory"], ["AI Model Comparison & Leaderboard", "/ai-model-comparison"],
  ["AI Model Pricing Index", "/ai-model-pricing-index"], ["ROI Calculator", "/roi-calculator"],
  ["AI Readiness Assessment", "/ai-readiness-assessment"], ["AI Budget Planner", "/ai-budget-planner"],
  ["Workflow Audit", "/workflow-audit"], ["AI Maturity Quiz", "/ai-maturity-quiz"],
  ["AI Use Case Generator", "/ai-use-case-generator"], ["AI Tool Selector", "/ai-tool-selector"],
  ["Digital Transformation Scorecard", "/digital-transformation-scorecard"], ["AI Job Description Generator", "/ai-job-description-generator"],
] as const;

export const productLinks = [
  { label: "ManasRank", detail: "Make your expertise discoverable in AI search", href: "/manasrank" },
  { label: "ManasDesign", detail: "Design systems for the products you build", href: "/manasdesign" },
  { label: "ManasN8N", detail: "Workflow blueprints and automation resources", href: "/manasn8n" },
  { label: "ManasClaude", detail: "Prompts, agents, and Claude Code patterns", href: "/manasclaude" },
  { label: "Manas Skills", detail: "Reusable instructions for everyday builds", href: "/manas-skills" },
  { label: "Manas Framework", detail: "Plan, build, review, test, and ship", href: "/manas-framework" },
] satisfies NavigationLink[];

const linksWithDetail = (links: readonly (readonly [string, string])[], detail: string): NavigationLink[] =>
  links.map(([label, href]) => ({ label, href, detail }));

export const serviceGroups: NavigationGroup[] = [
  { title: "Automate", links: [
    { label: "AI Agent Development", detail: "Production agents connected to your tools", href: "/ai-agent-development" },
    { label: "Workflow Automation", detail: "n8n, Make, or custom, wired into your stack", href: "/workflow-automation" },
    { label: "Custom Automation", detail: "End-to-end automation for your process", href: "/custom-automation" },
    { label: "RAG Pipeline Development", detail: "Retrieval pipelines for your knowledge", href: "/rag-pipeline-development" },
    { label: "Maintenance & Support", detail: "Monitoring, maintenance, and improvement", href: "/maintenance-support" },
  ] },
  { title: "Build", links: [
    { label: "SaaS MVP Development", detail: "A working product from idea to launch", href: "/saas-mvp-development" },
    { label: "OpenClaw & NemoClaw Setup", detail: "Configure and connect your AI stack", href: "/openclaw-nemoclaw-setup" },
    { label: "Claude Code Security Audit", detail: "Review your AI development environment", href: "/services/claude-code-security-audit" },
  ] },
  { title: "Grow", links: [
    { label: "Engineer Placement", detail: "AI-native engineering in your team", href: "/engineer-placement" },
    { label: "Hire AI Developers", detail: "Engineers for the systems you need", href: "/hire-ai-developers" },
    { label: "AI Strategy Consulting", detail: "A practical roadmap for your AI investment", href: "/ai-strategy-consulting" },
    { label: "AI Workshops", detail: "Hands-on learning for your team", href: "/ai-workshops" },
    { label: "Custom Training", detail: "Programs tailored to your tools and work", href: "/custom-training" },
  ] },
  { title: "Solutions", links: linksWithDetail(solutionLinks, "Explore a dedicated implementation service") },
  { title: "Platform Agencies", links: linksWithDetail(agencyLinks, "Build and automate with a specialist team") },
  { title: "GTM & CRM", links: linksWithDetail(crmLinks, "Connect your revenue systems and workflows") },
];

export const resourceGroups: NavigationGroup[] = [
  { title: "Learn", links: [
    { label: "Blog", detail: "Field notes on shipping AI in production", href: "/blog" },
    { label: "Playbooks", detail: "Step-by-step automation guides", href: "/playbooks" },
    { label: "Claude Code Challenge", detail: "Hands-on daily AI development lessons", href: "/resources/claude-code-challenge" },
    { label: "FAQ", detail: "Answers to common questions", href: "/faq" },
  ] },
  { title: "Playbooks", links: [
    { label: "AI Automation Playbook", detail: "Clean, build, and run your automation", href: "/resources/ai-automation-playbook" },
    { label: "Customer Support Workflow", detail: "Agents with a human in the loop", href: "/resources/customer-support-workflow" },
    { label: "Lead Qualification Playbook", detail: "Capture, enrich, score, and route leads", href: "/resources/lead-qualification-playbook" },
  ] },
  { title: "Explore", links: [
    { label: "Industries", detail: "Automation for your business sector", href: "/industries" },
    { label: "Interactive Demo", detail: "Simulated lead, invoice & support triage workflows", href: "/automation-demo" },
    { label: "Solutions Advisor", detail: "Match bottlenecks to services & case studies", href: "/advisor" },
    { label: "Security & Delivery", detail: "Infrastructure, credentials & human-in-loop gates", href: "/security" },
    { label: "Case Studies", detail: "Implementation patterns and examples", href: "/case-studies" },
    { label: "Courses", detail: "Practical AI learning paths", href: "/courses" },
    { label: "No-Code Stack", detail: "Tools for building connected products", href: "/resources/no-code-stack" },
    { label: "Tech Stack", detail: "Explore the automation ecosystem", href: "/resources/tech-stack" },
    { label: "All Free Tools", detail: "Calculators, assessments, and generators", href: "/tools" },
    { label: "AI Tools Directory", detail: "Browse tools by business function", href: "/ai-tools" },
    { label: "Bot Directory", detail: "Automation patterns and setup guides", href: "/bot-directory" },
    { label: "Skills & Agents", detail: "Explore the AI capability stack", href: "/skills" },
    { label: "Workflows", detail: "Step-by-step operational playbooks", href: "/workflows" },
    { label: "Careers", detail: "Build with the ManasFlow team", href: "/careers" },
    { label: "Contact", detail: "Talk through your next project", href: "/contact" },
  ] },
  { title: "Free Tools", links: linksWithDetail(freeToolLinks, "Explore this free ManasFlow resource") },
  { title: "Our Builds", links: productLinks },
  { title: "Our Platform", links: [{ label: "Our Platform", href: "/platform", detail: "ManasFlow products and frameworks" }] },
];

export const NAVIGATION_ROUTES = [...new Set([
  ...serviceGroups.flatMap(group => group.links.map(link => link.href)),
  ...resourceGroups.flatMap(group => group.links.map(link => link.href)),
  "/", "/services", "/consultation", "/golden-offer", "/terms", "/privacy", "/workflows",
])];
