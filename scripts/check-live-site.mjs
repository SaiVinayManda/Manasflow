import fs from "node:fs/promises";
import assert from "node:assert/strict";

const origin = process.env.MANASFLOW_PREVIEW_URL || "http://127.0.0.1:3000";
const required = "n8n-agency claude-code-agency cursor-agency codex-agency lovable-agency bubble-agency framer-agency supabase-agency flutterflow-agency replit-agency v0-agency salesforce-consultants hubspot-consultants zoho-consultants pipedrive-consultants attio-crm-agency clay-agency cold-email-agency linkedin-outreach-agency ai-strategy-consulting ai-agent-development workflow-automation custom-automation rag-pipeline-development saas-mvp-development ai-workshops engineer-placement hire-ai-developers custom-training maintenance-support openclaw-nemoclaw-setup ai-automation-agency ai-chatbot-development-agency workflow-automation-agency saas-development-agency no-code-development-agency marketing-automation-agency nextjs-ai-app-development directory ai-model-comparison ai-model-pricing-index roi-calculator ai-readiness-assessment ai-budget-planner workflow-audit ai-maturity-quiz ai-use-case-generator ai-tool-selector digital-transformation-scorecard ai-job-description-generator".split(" ").map(slug => `/${slug}`);
const routes = [...required, "/", "/blog", "/blog?page=2", "/industries", "/services", "/contact", "/consultation", "/golden-offer", "/workflows", "/workflows/n8n-workflow-builder", "/agency/n8n-dev", "/services/ai-agent-development", "/services/generative-ai-development-company", "/models/pricing", "/tools/roi-calculator", "/philosophy", "/workshops/n8n-automation", "/fr/agency/n8n-dev", "/claude-md-examples", "/grok-bot-examples", "/jev-builds", "/ai-tools/category/crm", "/ai-tools/hubspot-sales-hub", "/bot-directory/rss-to-slack-digest", "/skills", "/manasrank", "/manasdesign", "/manasn8n", "/manasclaude", "/manas-skills", "/manas-framework"];
const results = [];
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < routes.length) {
    const route = routes[cursor++];
    try {
      const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(60000) });
      const html = await response.text();
      const title = html.match(/<title>(.*?)<\/title>/s)?.[1] || "";
      const h1 = html.match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1]?.replace(/<[^>]+>/g, "") || "";
      results.push({ route, status: response.status, title, h1, valid: response.status === 200 && title.includes("ManasFlow") && Boolean(h1) });
    } catch (error) { results.push({ route, valid: false, error: String(error) }); }
  }
}));
const blockedPaths = ["/quarantine/source-editorial-assets/catalog-0037729a647ad8.png", "/sites/manasflow/tool-ayrank-com.png", "/sites/manasflow/pages/catalog-0037729a647ad8.png", "/agency/not-a-real-agency"];
const isolated = await Promise.all(blockedPaths.map(async route => ({ route, status: (await fetch(new URL(route, origin))).status })));
const report = { checkedAt: new Date().toISOString(), origin, requiredRoutes: required.length, passed: results.filter(result => result.valid).length, total: results.length, failures: results.filter(result => !result.valid), results, isolated };
await fs.mkdir("docs/research/manasflow/completion", { recursive: true });
await fs.writeFile("docs/research/manasflow/completion/live-audit.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, results: `${results.length} route responses checked` }, null, 2));
assert.equal(report.failures.length, 0, "A local page failed its response check");
assert.ok(isolated.every(route => route.status === 404), "An original asset or unknown agency route is publicly available");
