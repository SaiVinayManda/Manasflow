import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { calculateROI, calculateTool, calculateBudget, calculateWorkflowSavings, scoreQuestions, percentage } from "../src/lib/tool-calculations.ts";

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.000001, `${actual} != ${expected}`);
const defaults = { hoursPerWeek: 40, hourlyRate: 50, monthlyCostOfErrors: 2000, toolCostPerMonth: 500, implementationCost: 10000, trainingCost: 0, setupTimeline: 4, automationCoverage: 70, timeSavings: 60, errorReduction: 80 };
const roi = calculateROI(defaults);
close(roi.monthlyLabor, 8660);
close(roi.annualSavings, 62846.4);
close(roi.monthlyNetSavings, 4737.2);
assert.equal(roi.breakEvenMonth, 3);
close(roi.yearOneROI, 292.79);
assert.equal(roi.projections.length, 5);
close(roi.fiveYearSavings, roi.projections.reduce((sum, row) => sum + row.savings - row.cost, 0));
assert.equal(calculateROI({ ...defaults, automationCoverage: 0, errorReduction: 0 }).breakEvenMonth, null);
assert.equal(calculateROI({ ...defaults, implementationCost: 0, trainingCost: 0 }).breakEvenMonth, 0);
assert.equal(calculateROI({ ...defaults, automationCoverage: 100, timeSavings: 100 }).efficiencyGain, 100);
assert.equal(percentage(-5), 0);
assert.equal(percentage(150), 1);
assert.equal(percentage(Number.NaN), 0);

const payback = calculateTool("automation-payback-calculator", { tasks: 600, minutes: 10, rate: 50, coverage: 50, build: 10000, running: 500, delay: 2 });
assert.equal(payback.metrics.find(item => item.label === "Break-even").value, "7 months");
const noPayback = calculateTool("automation-payback-calculator", { tasks: 0, minutes: 0, rate: 0, coverage: 0, build: 10000, running: 500, delay: 2 });
assert.equal(noPayback.metrics.find(item => item.label === "Break-even").value, "No payback at these inputs");
const agent = calculateTool("ai-agent-cost-calculator", { runs: 1000, calls: 2, retry: 0, inputTokens: 1000, outputTokens: 100, inputPrice: 3, outputPrice: 15, hosting: 20, reviewShare: 10, reviewMinutes: 1, rate: 60, build: 1200, months: 12 });
assert.equal(agent.metrics[0].format, "currency");
close(agent.metrics[0].value, 229);
assert.equal(calculateTool("ai-agent-cost-calculator", {}).metrics[1].value, 0);
const build = calculateTool("build-vs-buy-ai-calculator", { months: 24, hours: 100, rate: 100, maintenance: 0, infrastructure: 0, setup: 0, integration: 0, subscription: 1000, increase: 0 });
assert.equal(build.metrics[0].value, 10000);
assert.equal(build.metrics[1].value, 24000);
assert.equal(build.metrics[3].value, "Month 10");
for (const slug of ["ai-agent-cost-calculator", "build-vs-buy-ai-calculator", "meeting-automation-calculator", "ai-team-cost-calculator", "staffing-model-calculator", "ai-vs-human-employee-cost", "n8n-vs-zapier-vs-make-cost-calculator"]) {
  const result = calculateTool(slug, {});
  assert.ok(result.metrics.every(metric => typeof metric.value !== "number" || Number.isFinite(metric.value)), `${slug} must handle zero inputs`);
}
const budget = calculateBudget({ type: "AI chatbot / agent", scope: "Production system", urgency: "Standard", data: "Needs cleanup", team: "Some internal capacity", complexity: "Medium", months: 6, contingency: 20 });
assert.equal(budget.schedule.length, 6);
close(budget.total, budget.rows.reduce((sum, row) => sum + row.value, 0));
close(budget.total, budget.schedule.reduce((sum, row) => sum + row.value, 0));
const workflow = calculateWorkflowSavings({ hours: 10, people: 2, rate: 40, coverage: 50 });
close(workflow.monthlyHours, 43.3);
close(workflow.monthlySavings, 1732);

const evidence = JSON.parse(await fs.readFile("src/data/manasflow/tool-source-evidence.json", "utf8"));
for (const slug of ["ai-readiness-assessment", "ai-maturity-quiz", "digital-transformation-scorecard", "ai-governance-maturity-assessment"]) {
  const questions = evidence[slug].questions;
  const low = Object.fromEntries(questions.map(question => [question.id, 0]));
  const high = Object.fromEntries(questions.map(question => [question.id, question.options.length - 1]));
  assert.equal(scoreQuestions(questions, low).score, 0, `${slug} lower boundary`);
  assert.equal(scoreQuestions(questions, high).score, 100, `${slug} upper boundary`);
  assert.ok(scoreQuestions(questions, {}).dimensions.every(dimension => dimension.score === 0), `${slug} cleared answers reset to zero`);
}
assert.deepEqual(scoreQuestions([], {}), { score: 0, dimensions: [] });
assert.equal(evidence["ai-readiness-assessment"].questions.length, 15);
assert.equal(evidence["ai-maturity-quiz"].questions.length, 10);
assert.equal(evidence["digital-transformation-scorecard"].questions.length, 20);
assert.equal(evidence["ai-tool-selector"].questions.length, 10);
console.log("Tool calculation checks passed: ROI, payback, zero and invalid input, cost comparisons, currency metrics, budget reconciliation, workflow savings, and assessment scoring/reset boundaries.");
