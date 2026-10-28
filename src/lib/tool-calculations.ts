export type ROIInputs = {
  hoursPerWeek: number;
  hourlyRate: number;
  monthlyCostOfErrors: number;
  toolCostPerMonth: number;
  implementationCost: number;
  trainingCost: number;
  setupTimeline: number;
  automationCoverage: number;
  timeSavings: number;
  errorReduction: number;
};

export const nonNegative = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;
export const percentage = (value: number) => Math.min(100, nonNegative(value)) / 100;

export function calculateROI(input: ROIInputs) {
  const monthlyLabor = nonNegative(input.hoursPerWeek) * nonNegative(input.hourlyRate) * 4.33;
  const laborSavings = monthlyLabor * percentage(input.automationCoverage) * percentage(input.timeSavings);
  const errorSavings = nonNegative(input.monthlyCostOfErrors) * percentage(input.errorReduction);
  const grossMonthlySavings = laborSavings + errorSavings;
  const monthlyNetSavings = grossMonthlySavings - nonNegative(input.toolCostPerMonth);
  const investment = nonNegative(input.implementationCost) + nonNegative(input.trainingCost);
  const annualOperatingCost = nonNegative(input.toolCostPerMonth) * 12;
  const annualSavings = grossMonthlySavings * 12;
  const yearOneCost = investment + annualOperatingCost;
  const yearOneNet = annualSavings - yearOneCost;
  const projections = Array.from({ length: 5 }, (_, index) => {
    const year = index + 1;
    const savings = annualSavings * Math.pow(1.03, index);
    const cost = annualOperatingCost * Math.pow(1.1, index) + (index === 0 ? investment : 0);
    return { year, savings, cost, net: savings - cost };
  });
  return { monthlyLabor, laborSavings, errorSavings, annualSavings, monthlyNetSavings, investment, yearOneNet, yearOneROI: yearOneCost > 0 ? yearOneNet / yearOneCost * 100 : 0, breakEvenMonth: monthlyNetSavings > 0 ? Math.ceil(investment / monthlyNetSavings) : null, fiveYearSavings: projections.reduce((total, year) => total + year.net, 0), efficiencyGain: percentage(input.automationCoverage) * percentage(input.timeSavings) * 100, projections };
}

export type Metric = { label: string; value: number | string; format?: "currency" | "percent" | "number"; detail?: string };
export type CalculatorResult = { metrics: Metric[]; note: string; rows?: { label: string; value: number }[] };

export function calculateTool(slug: string, input: Record<string, number>): CalculatorResult {
  const n = (key: string) => nonNegative(input[key] || 0);
  const p = (key: string) => percentage(input[key] || 0);
  const money = (label: string, value: number): Metric => ({ label, value, format: "currency" });
  if (slug === "automation-payback-calculator") {
    const saved = n("tasks") * n("minutes") / 60 * n("rate") * p("coverage");
    const net = saved - n("running");
    return { metrics: [money("Monthly gross savings", saved), money("Monthly net savings", net), { label: "Break-even", value: net > 0 ? `${Math.ceil(n("build") / net) + n("delay")} months` : "No payback at these inputs" }, money("Year-one net benefit", net * Math.max(0, 12 - n("delay")) - n("build"))], note: "Only fully automated tasks count as saved. Savings begin after the setup period and assume steady task volume." };
  }
  if (slug === "ai-agent-cost-calculator") {
    const calls = n("runs") * n("calls") * (1 + p("retry"));
    const tokens = calls * (n("inputTokens") * n("inputPrice") + n("outputTokens") * n("outputPrice")) / 1_000_000;
    const review = n("runs") * p("reviewShare") * n("reviewMinutes") / 60 * n("rate");
    const build = n("build") / Math.max(1, n("months"));
    const total = tokens + review + n("hosting") + build;
    return { metrics: [money("Total monthly cost", total), { ...money("Cost per agent run", n("runs") > 0 ? total / n("runs") : 0), detail: "Includes amortized build and human review" }, money("Model usage", tokens), money("Human review", review)], rows: [{ label: "Model calls", value: tokens }, { label: "Human review", value: review }, { label: "Infrastructure", value: n("hosting") }, { label: "Build amortization", value: build }], note: "Model prices are editable planning assumptions. Add your provider’s current per-million-token rates and measure actual agent loops." };
  }
  if (slug === "build-vs-buy-ai-calculator") {
    const months = Math.min(1200, Math.floor(n("months")));
    const buildInitial = n("hours") * n("rate");
    const monthlyBuild = buildInitial * p("maintenance") / 12 + n("infrastructure");
    const buyInitial = n("setup") + n("integration") * n("rate");
    let buyTotal = buyInitial;
    let breakEven: number | null = null;
    for (let month = 1; month <= months; month++) {
      buyTotal += n("subscription") * Math.pow(1 + p("increase"), Math.floor((month - 1) / 12));
      if (breakEven === null && buildInitial + monthlyBuild * month <= buyTotal) breakEven = month;
    }
    const buildTotal = buildInitial + monthlyBuild * months;
    return { metrics: [money("Build total cost", buildTotal), money("Buy total cost", buyTotal), money("Difference", Math.abs(buildTotal - buyTotal)), { label: "Build becomes cheaper", value: breakEven ? `Month ${breakEven}` : "Beyond this planning window" }], rows: [{ label: "Build", value: buildTotal }, { label: "Buy", value: buyTotal }], note: `${buildTotal <= buyTotal ? "Building" : "Buying"} has the lower modeled cost over ${months} months. Cost alone does not measure delivery risk, security, ownership, or feature fit.` };
  }
  if (slug === "meeting-automation-calculator") {
    const weeklyHours = n("meetings") * n("attendees") * n("minutes") / 60;
    const hourly = n("salary") / 2080;
    const annual = weeklyHours * hourly * 52;
    const saved = annual * p("reduction");
    return { metrics: [money("Annual meeting cost", annual), { label: "Hours reclaimed / year", value: weeklyHours * p("reduction") * 52, format: "number" }, money("Annual savings", saved), money("Net annual benefit", saved - n("tools") * 12)], note: "This models attendee time, not just meeting duration. Use reductions only for meetings that can become asynchronous without losing necessary collaboration." };
  }
  if (slug === "ai-team-cost-calculator") {
    const payroll = n("engineers") * n("engineerSalary") + n("scientists") * n("scientistSalary") + n("managers") * n("managerSalary");
    const inhouse = payroll * (1 + p("overhead")) * n("months") / 12 + n("recruiting");
    const partner = n("partner") * n("months");
    return { metrics: [money("In-house team cost", inhouse), money("Partner team cost", partner), money("Potential difference", inhouse - partner), money("In-house monthly cost", payroll * (1 + p("overhead")) / 12)], rows: [{ label: "In-house", value: inhouse }, { label: "Partner", value: partner }], note: "Edit salaries, employer overhead, recruiting, and partner rates to match real offers. The comparison assumes equivalent capacity and scope." };
  }
  if (slug === "staffing-model-calculator") {
    const months = n("months"), count = n("count");
    const employed = count * (n("salary") * (1 + p("overhead")) * months / 12 + n("recruiting"));
    const augmented = count * n("hourly") * n("hours") * months;
    const outsourced = n("outsourcing") * months;
    return { metrics: [money("Direct hiring", employed), money("Staff augmentation", augmented), money("Outsourced delivery", outsourced), { label: "Lowest modeled cost", value: employed <= augmented && employed <= outsourced ? "Direct hiring" : augmented <= outsourced ? "Staff augmentation" : "Outsourced delivery" }], rows: [{ label: "Hiring", value: employed }, { label: "Augmentation", value: augmented }, { label: "Outsourcing", value: outsourced }], note: "Compare equivalent working hours and responsibility. Outsourcing is a delivery contract; direct hiring and augmentation purchase people’s time." };
  }
  if (slug === "ai-vs-human-employee-cost") {
    const human = n("salary") * (1 + p("overhead")) / 12 * Math.min(40, n("hours")) / 40;
    const net = human - n("agent");
    return { metrics: [money("Equivalent human task cost / month", human), money("Agent running cost / month", n("agent")), money("Monthly potential savings", net), { label: "Setup payback", value: net > 0 ? `${Math.ceil(n("setup") / net)} months` : "No payback at these inputs" }], note: "Automating task hours usually augments a role. It does not imply that an employee can or should be replaced; review quality and exceptions remain necessary." };
  }
  if (slug === "n8n-vs-zapier-vs-make-cost-calculator") {
    const actions = n("runs") * n("actions");
    const costs = [
      { label: "n8n cloud", value: n("n8nBase") * n("exchange") + Math.max(0, n("runs") - n("includedRuns")) / 1000 * n("n8nOverage") },
      { label: "Zapier", value: n("zapierBase") + Math.max(0, actions - n("includedActions")) / 1000 * n("zapierOverage") },
      { label: "Make", value: n("makeBase") + Math.max(0, actions - n("includedActions")) / 1000 * n("makeOverage") },
      { label: "n8n self-hosted", value: n("hosting") },
    ];
    return { metrics: costs.map(cost => money(cost.label, cost.value)), rows: costs, note: `Modeling ${n("runs").toLocaleString("en-US")} executions and ${actions.toLocaleString("en-US")} billable actions per month. The editable allowance and overage assumptions are a planning comparison, not live vendor quotes. Self-hosting excludes your administration time.` };
  }
  return { metrics: [], note: "" };
}

export function scoreQuestions(questions: { id: string; pillar: string; options: { points: number }[] }[], answers: Record<string, number>) {
  if (questions.length === 0) return { score: 0, dimensions: [] };
  const pillars = [...new Set(questions.map(question => question.pillar))];
  const dimensions = pillars.map(pillar => {
    const selected = questions.filter(question => question.pillar === pillar);
    return { name: pillar, score: Math.round(selected.reduce((total, question) => total + (question.options[answers[question.id]]?.points || 0), 0) / selected.length) };
  });
  return { score: Math.round(dimensions.reduce((total, dimension) => total + dimension.score, 0) / dimensions.length), dimensions };
}

export function calculateBudget(input: { type: string; scope: string; urgency: string; data: string; team: string; complexity: string; months: number; contingency: number }) {
  const base = ({ "Workflow automation": 8000, "AI chatbot / agent": 16000, "RAG / knowledge system": 24000, "Custom ML model": 45000, "AI-powered product": 35000 } as Record<string, number>)[input.type] || 16000;
  const scope = input.scope === "Enterprise rollout" ? 2.5 : input.scope === "Production system" ? 1.6 : 1;
  const complexity = input.complexity === "High" ? 1.8 : input.complexity === "Medium" ? 1.3 : 1;
  const urgency = input.urgency === "Urgent" ? 1.25 : 1;
  const build = base * scope * complexity * urgency;
  const preparation = input.data === "Ready to use" ? build * 0.05 : input.data === "Needs cleanup" ? build * 0.15 : build * 0.3;
  const talent = input.team === "Dedicated internal team" ? build * 0.1 : input.team === "Some internal capacity" ? build * 0.2 : build * 0.35;
  const tools = input.type === "Custom ML model" ? 1200 : 400;
  const infrastructure = input.scope === "Enterprise rollout" ? 1500 : 300;
  const training = Math.max(1000, build * 0.08);
  const months = Math.min(120, Math.max(1, Math.round(nonNegative(input.months))));
  const subtotal = build + preparation + talent + training + (tools + infrastructure) * months;
  const reserve = subtotal * percentage(input.contingency);
  const total = subtotal + reserve;
  const rows = [{ label: "Build and integration", value: build }, { label: "Data preparation", value: preparation }, { label: "Team capacity", value: talent }, { label: "Training", value: training }, { label: "Tools and infrastructure", value: (tools + infrastructure) * months }, { label: "Contingency", value: reserve }];
  const schedule = Array.from({ length: months }, (_, index) => ({ label: `Month ${index + 1}`, value: (build + preparation + talent + training + reserve) / months + tools + infrastructure }));
  return { total, monthlyOperating: tools + infrastructure, reserve, rows, schedule };
}

export function calculateWorkflowSavings(input: { hours: number; people: number; rate: number; coverage: number }) {
  const monthlyHours = nonNegative(input.hours) * nonNegative(input.people) * 4.33 * percentage(input.coverage);
  return { monthlyHours, monthlySavings: monthlyHours * nonNegative(input.rate) };
}
