export type ProductResource = { title: string; category: string; description: string; href: string; content: string };
export type ProductPageData = {
  name: string; slug: string; eyebrow: string; title: string; accent: string; description: string;
  kind: "rank" | "design" | "library" | "framework";
  features: { title: string; description: string }[];
  resources: ProductResource[];
  faqs: { question: string; answer: string }[];
};

export const PRODUCT_PAGES: ProductPageData[] = [
  {
    name: "ManasRank", slug: "manasrank", eyebrow: "AI search visibility", title: "Be discoverable.", accent: "Be the answer.", kind: "rank",
    description: "Give AI search engines clear, useful evidence about what your business does. Start with a practical content readiness review, then build a plan with ManasFlow.",
    features: [
      { title: "A clear entity", description: "Connect your services, expertise, and brand identity across the pages that matter." },
      { title: "Answers with evidence", description: "Turn broad claims into specific answers supported by examples, documentation, and sources." },
      { title: "A measurable plan", description: "Choose relevant questions, record a baseline, and review visibility as your content develops." },
    ],
    resources: [
      { title: "Service page clarity", category: "Content", description: "State who you help, what you deliver, and how it works.", href: "/services", content: "# Service page review\n\n- Name the intended customer.\n- Explain the problem in the customer's words.\n- Describe the deliverable and process.\n- Answer common questions with specific evidence.\n- Provide a clear contact route." },
      { title: "AI visibility roadmap", category: "Strategy", description: "Prioritize content opportunities around real buyer questions.", href: "/ai-strategy-consulting", content: "# AI visibility roadmap\n\n1. List the questions customers ask before buying.\n2. Map each question to a useful answer page.\n3. Identify missing evidence and unclear claims.\n4. Improve one topic cluster at a time.\n5. Record observations and revisit them regularly." },
      { title: "Knowledge architecture", category: "Implementation", description: "Organize the information your users and AI systems need.", href: "/rag-pipeline-development", content: "# Knowledge architecture\n\nInventory trusted content, assign owners, remove contradictions, and record update dates. Group material by customer task and preserve source links." },
    ],
    faqs: [
      { question: "Does this tool check live AI rankings?", answer: "The readiness checklist runs locally in your browser. It reviews your own answers; it does not query AI search providers or measure live rankings. Contact ManasFlow to scope a monitored visibility project." },
      { question: "Can you guarantee that an AI assistant will cite my business?", answer: "No. AI answers depend on the provider, query, sources, and time. The goal is to improve the clarity, usefulness, and evidence of your content, then measure observations against an agreed baseline." },
      { question: "Where should I start?", answer: "Choose a service and five real customer questions. Check whether your site answers each question directly and provides trustworthy evidence. Use the checklist below to organize your next steps." },
    ],
  },
  {
    name: "ManasDesign", slug: "manasdesign", eyebrow: "Design for the products you build", title: "From a working app", accent: "to a considered product.", kind: "design",
    description: "Build a consistent visual language for your next product. Explore a direction, prepare a design brief, and connect with ManasFlow for implementation.",
    features: [
      { title: "One visual system", description: "Define typography, spacing, color, and component states so every screen belongs together." },
      { title: "Built around real tasks", description: "Make the important actions clear with purposeful hierarchy and readable interfaces." },
      { title: "Ready for implementation", description: "Carry the design through responsive layouts, reusable components, and accessible interactions." },
    ],
    resources: [
      { title: "Interface foundations", category: "Design systems", description: "A concise starting point for typography, spacing, and color.", href: "/saas-mvp-development", content: "# Interface foundations\n\nDefine the main user task, type scale, spacing scale, semantic colors, border treatments, and focus states. Document mobile layouts and test the longest realistic content." },
      { title: "Component review", category: "Components", description: "Check loading, empty, error, and success states before shipping.", href: "/nextjs-ai-app-development", content: "# Component review\n\nFor every component, check default, hover, focus, disabled, loading, empty, error, and success states. Verify keyboard use, responsive wrapping, and meaningful labels." },
      { title: "Product handoff", category: "Delivery", description: "Translate your design direction into a buildable product scope.", href: "/contact", content: "# Product design handoff\n\nDescribe the audience and primary task. Include core screens, content requirements, component inventory, breakpoints, interactions, and acceptance criteria." },
    ],
    faqs: [
      { question: "Can I try the design directions here?", answer: "Yes. The local preview changes color direction and density so you can compare a small interface before preparing your brief." },
      { question: "Does choosing a direction redesign my application?", answer: "The preview is an interactive starting point. It does not connect to or edit your application. Share the brief with ManasFlow to discuss a full implementation." },
      { question: "Can you work with an existing design system?", answer: "Yes. A project can extend your existing typography, tokens, components, and accessibility requirements instead of replacing them." },
    ],
  },
  {
    name: "ManasN8N", slug: "manasn8n", eyebrow: "Automation blueprint library", title: "Find your next", accent: "connected workflow.", kind: "library",
    description: "Explore practical automation patterns for sales, support, and everyday operations. Read an implementation brief, then adapt the pattern to your own tools.",
    features: [
      { title: "Search by the job", description: "Find a starting point using the problem you need to solve, rather than a list of integrations." },
      { title: "Understand the flow", description: "Each blueprint describes the trigger, data transformation, approval, and destination." },
      { title: "Build with ownership", description: "Keep credentials in your own accounts and document how your automation is operated." },
    ],
    resources: [
      { title: "Lead capture and qualification", category: "Sales & CRM", description: "Capture an inquiry, enrich the record, and route qualified leads.", href: "/resources/lead-qualification-playbook", content: "# Lead qualification blueprint\n\nTrigger: a validated website inquiry.\nNormalize email and company fields.\nCheck for an existing CRM record.\nApply explicit qualification rules.\nCreate or update the CRM record.\nNotify the responsible owner with the source and next action.\nKeep a record of retries and rejected input." },
      { title: "Customer support triage", category: "Support", description: "Classify incoming requests and keep a person in control of replies.", href: "/resources/customer-support-workflow", content: "# Support triage blueprint\n\nTrigger: a new support request.\nRemove unnecessary personal data.\nClassify intent and urgency.\nRetrieve the relevant approved documentation.\nPrepare a proposed response with source references.\nRequire human approval for sensitive requests.\nRecord the final action and outcome." },
      { title: "Document intake and review", category: "Operations", description: "Extract structured information and flag records that need attention.", href: "/workflow-automation", content: "# Document intake blueprint\n\nTrigger: a document reaches an approved inbox.\nValidate its type and source.\nExtract the required fields.\nApply confidence and business-rule checks.\nRoute uncertain values to a reviewer.\nWrite approved records to the destination system.\nPreserve the source and processing log." },
      { title: "Weekly operations digest", category: "Operations", description: "Gather updates from connected tools into a concise team brief.", href: "/n8n-agency", content: "# Weekly operations digest\n\nTrigger: a scheduled run.\nRead the agreed metrics from each system.\nNormalize dates and identifiers.\nCompare changes with the previous reporting period.\nPrepare a concise digest with source links.\nSend to an approved internal channel.\nLog missing data and connector failures." },
      { title: "CRM data quality checks", category: "Sales & CRM", description: "Find incomplete, inconsistent, or duplicate records before they spread.", href: "/hubspot-consultants", content: "# CRM data quality blueprint\n\nTrigger: a scheduled audit or record update.\nIdentify missing required fields.\nNormalize known formats.\nFlag possible duplicates for review.\nNever merge or delete records without an approved rule.\nNotify the data owner and record corrections." },
      { title: "Approval before an external action", category: "Support", description: "Add an explicit review gate to an automated decision.", href: "/custom-automation", content: "# Human approval blueprint\n\nPrepare the proposed action and show its supporting information.\nAssign a reviewer.\nRecord approve, reject, or request-changes decisions.\nExpire stale approvals.\nExecute only the approved action.\nKeep an audit trail and a recovery path." },
    ],
    faqs: [
      { question: "Are these importable n8n workflow files?", answer: "These resources are implementation blueprints in Markdown. They explain the logic and operating considerations. They are not executable workflows and contain no credentials or configured integrations." },
      { question: "Can ManasFlow build the workflow for my systems?", answer: "Yes. Start with the pattern closest to your task and contact us with your tools, data sources, approval rules, and intended result." },
      { question: "Is ManasN8N affiliated with n8n?", answer: "ManasN8N is a ManasFlow resource. n8n is a third-party platform, and this library does not imply official affiliation or endorsement." },
    ],
  },
  {
    name: "ManasClaude", slug: "manasclaude", eyebrow: "Claude Code resource library", title: "Better context.", accent: "More reliable builds.", kind: "library",
    description: "Explore reusable prompts and working patterns for understanding a codebase, planning a change, reviewing a build, and documenting the result.",
    features: [
      { title: "Start with context", description: "Give the assistant a concrete task, the relevant files, and a clear definition of done." },
      { title: "Review every boundary", description: "Plan how data, permissions, errors, and external actions should behave before building." },
      { title: "Keep the result useful", description: "Leave maintainers with clear implementation notes and evidence of the checks that ran." },
    ],
    resources: [
      { title: "Codebase orientation", category: "Planning", description: "Find the entry points, conventions, and dependencies before changing code.", href: "/resources/claude-code-challenge", content: "# Codebase orientation\n\nInspect the project instructions, package scripts, route structure, and relevant modules. Identify the files that own the requested behavior. Explain the current flow, likely change points, and unresolved questions. Do not edit code during orientation." },
      { title: "Implementation plan", category: "Planning", description: "Break a concrete change into reviewable work with explicit checks.", href: "/playbooks", content: "# Implementation plan\n\nDescribe the user-visible outcome. List the smallest coherent changes and the files they affect. Identify data migrations, external dependencies, and compatibility risks. Define useful validation and acceptance criteria. Flag questions that affect the implementation." },
      { title: "Focused code review", category: "Review", description: "Look for behavioral regressions, missing validation, and failure paths.", href: "/claude-code-agency", content: "# Focused code review\n\nReview the proposed change against the original requirement. Prioritize correctness, authorization, input validation, failure handling, and regressions. Cite specific files and behavior. Separate confirmed defects from questions. Avoid style-only feedback unless it affects maintainability." },
      { title: "Test planning", category: "Verification", description: "Choose checks that cover the behavior and its meaningful edge cases.", href: "/custom-training", content: "# Test planning\n\nIdentify the behavior that could break. Cover a representative success path, invalid inputs, empty data, and relevant failure modes. Prefer tests of observable behavior. State what each check proves and what remains unverified." },
      { title: "Delivery note", category: "Delivery", description: "Explain what changed, why, and how it was checked.", href: "/contact", content: "# Delivery note\n\nLead with the user-visible result. Explain the main implementation choices. List checks actually run and their outcomes. State material limitations, configuration requirements, and follow-up work without claiming unperformed verification." },
    ],
    faqs: [
      { question: "Do these resources connect to my Claude account?", answer: "No. You can read, copy, or download the local prompt briefs. No account, model API, or external execution is connected to this page." },
      { question: "Can I use the patterns with other coding assistants?", answer: "The task framing, review, and verification principles are portable. Adapt commands and project instruction files to the assistant and repository you use." },
      { question: "What should I put in a project instruction file?", answer: "Include the commands that work, repository conventions, important architectural boundaries, and the checks required before delivery. Keep instructions specific and current." },
    ],
  },
  {
    name: "Manas Skills", slug: "manas-skills", eyebrow: "Reusable agent instructions", title: "Turn a repeatable task", accent: "into a reliable skill.", kind: "library",
    description: "A practical collection of task briefs for building, reviewing, and documenting software. Read a skill, adapt it to your project, and make the workflow repeatable.",
    features: [
      { title: "Specific triggers", description: "Name the task a skill handles and the situations where it should be applied." },
      { title: "Useful instructions", description: "Describe the inputs, process, boundaries, and result in language an agent can follow." },
      { title: "Evidence before delivery", description: "Include checks that verify the requested outcome and make remaining gaps visible." },
    ],
    resources: [
      { title: "Interface review skill", category: "Design", description: "Review responsive layouts, keyboard flow, and content hierarchy.", href: "/manasdesign", content: "---\nname: interface-review\ndescription: Review an interface against its intended user tasks.\n---\n\n# Interface review\n\nRead the intended flow and inspect the real interface. Test keyboard use, mobile layout, text wrapping, focus visibility, empty states, and error messages. Report findings with a specific screen and reproducible behavior. Distinguish observation from inference." },
      { title: "Workflow mapping skill", category: "Automation", description: "Map triggers, transformations, approvals, and failures before building.", href: "/manasn8n", content: "---\nname: workflow-mapping\ndescription: Turn a business process into an implementation-ready workflow map.\n---\n\n# Workflow mapping\n\nList the trigger, source systems, required fields, transformation rules, approvals, destinations, retries, and owner. Mark external actions explicitly. Check assumptions with representative records and define how failed runs are recovered." },
      { title: "Release review skill", category: "Engineering", description: "Check the result, configuration, and operating notes before handoff.", href: "/manas-framework", content: "---\nname: release-review\ndescription: Review whether a software change is ready for delivery.\n---\n\n# Release review\n\nCompare the final behavior with acceptance criteria. Run the relevant project checks. Inspect configuration, migrations, secrets handling, and rollback considerations. Record actual outcomes. Deliver a concise change note with any unresolved limitations." },
      { title: "Knowledge audit skill", category: "Content", description: "Review source quality, ownership, and gaps in a knowledge collection.", href: "/manasrank", content: "---\nname: knowledge-audit\ndescription: Audit the clarity and reliability of a knowledge collection.\n---\n\n# Knowledge audit\n\nInventory the sources and their owners. Check update dates, conflicting answers, missing evidence, and unclear terminology. Group content by user question. Produce a prioritized list of corrections with source references and review owners." },
    ],
    faqs: [
      { question: "What do I download?", answer: "A Markdown task brief written for this local ManasFlow library. Adapt the instructions to your repository, tools, and approval requirements before use." },
      { question: "Are third-party skill packages installed by this page?", answer: "No. The page provides readable and downloadable instructions. It does not install packages, invoke a terminal, or change your agent configuration." },
      { question: "Can ManasFlow create skills for our team?", answer: "Yes. Bring a repeatable task, examples of a good result, and the tools your team uses. We can scope a skill and validation process around that workflow." },
    ],
  },
  {
    name: "Manas Framework", slug: "manas-framework", eyebrow: "A clear cycle for agentic development", title: "Plan. Build. Review.", accent: "Test. Ship.", kind: "framework",
    description: "A structured development workflow that keeps the objective, implementation, evidence, and human decisions connected from the first brief to the final handoff.",
    features: [
      { title: "A shared definition of done", description: "Start with the intended behavior, constraints, and acceptance criteria." },
      { title: "Clear responsibilities", description: "Keep each change coherent, record dependencies, and make ownership explicit." },
      { title: "Reviewable delivery", description: "Present the result with checks, decisions, and enough context for the next maintainer." },
    ],
    resources: [
      { title: "Plan", category: "01", description: "Understand the current system and define a concrete outcome.", href: "/ai-strategy-consulting", content: "# Plan\n\nObjective:\nUser-visible outcome:\nRelevant files and systems:\nConstraints:\nDependencies:\nAcceptance criteria:\nQuestions requiring a decision:" },
      { title: "Build", category: "02", description: "Implement a coherent slice using the project's conventions.", href: "/saas-mvp-development", content: "# Build\n\nWork item:\nFiles owned:\nDependencies:\nBehavior implemented:\nConfiguration required:\nDecisions and reasons:\nKnown gaps:" },
      { title: "Review", category: "03", description: "Check behavior, data boundaries, and failure paths.", href: "/claude-code-agency", content: "# Review\n\nAcceptance criteria checked:\nCorrectness findings:\nData and authorization boundaries:\nFailure handling:\nCompatibility considerations:\nQuestions resolved:\nChanges still required:" },
      { title: "Test", category: "04", description: "Verify the important paths and record real outcomes.", href: "/custom-training", content: "# Test\n\nChecks run:\nRepresentative inputs:\nSuccess paths:\nFailure paths:\nObserved results:\nEnvironment:\nRemaining verification gaps:" },
      { title: "Ship", category: "05", description: "Deliver a reviewable result and practical handoff notes.", href: "/contact", content: "# Ship\n\nResult:\nWhat changed and why:\nValidation evidence:\nRequired configuration:\nDeployment steps:\nRecovery approach:\nOwner and follow-up:" },
    ],
    faqs: [
      { question: "Is this an installable framework package?", answer: "This page provides the local ManasFlow workflow and downloadable stage templates. It does not advertise an unconfigured package or execute a third-party installer." },
      { question: "Where do people approve the work?", answer: "The team should agree which decisions need approval, such as scope, external actions, and release. The templates make these decision points explicit rather than assuming that every step needs a gate." },
      { question: "Can we use it with our existing tools?", answer: "Yes. The cycle can live in your current issue tracker, repository, and review process. Start with one task and adapt the templates to the way your team delivers." },
    ],
  },
];

export const PRODUCT_ROUTES = PRODUCT_PAGES.map(product => `/${product.slug}`);
