import { readFile } from "node:fs/promises";
import path from "node:path";
import { absoluteUrl, indexableRoutes, seoContent } from "./seo";
import { pageBreadcrumbs } from "./seo";
import { site } from "./site";
import services from "@/data/manasflow/service-pages.json";
import { PRODUCT_PAGES } from "@/data/manasflow/products";
import { getInteractiveTool } from "./interactive-tool-data";
import { pageFaqs } from "./seo";
import { CALCULATOR_CONFIG } from "./calculator-config";
import { calculateTool } from "./tool-calculations";

const intro = `# ManasFlow\n\n> ${site.description}\n\nCanonical website: ${site.url}\nContact: ${site.email}\n`;
function groupName(route: string) {
  const hub = pageBreadcrumbs(route)[1]?.route;
  if (route === "/services" || hub === "/services") return "Core Services";
  if (route === "/platform" || hub === "/platform" || ["/skills", "/workflows"].includes(route) || route.startsWith("/workflows/")) return "Platform & Frameworks";
  if (route === "/tools" || hub === "/tools" || /^\/(models|free-models)\//.test(route)) return "Free AI Tools";
  if (route.startsWith("/ai-tools") || route.startsWith("/bot-directory")) return "AI Tools Directory";
  if (/^\/(blog|playbooks|resources)(\/|$)/.test(route)) return "Playbooks & Insights";
  return "Optional";
}
export async function llmsMarkdown(full = false) {
  const groups = ["Core Services", "Platform & Frameworks", "Free AI Tools", "AI Tools Directory", "Playbooks & Insights", "Optional"];
  const routes = indexableRoutes().filter(route => !route.includes("?"));
  const sections = await Promise.all(groups.map(async group => {
    const entries = await Promise.all(routes.filter(route => groupName(route) === group).sort().map(async route => {
      const page = seoContent[route];
      const title = page.title.replace(/[\[\]\n]/g, " ");
      if (!full) return `- [${title}](${absoluteUrl(route)}): ${page.description}`;
      let body = "";
      if (page.source.includes("/details/")) {
        const detail: { blocks: { kind: string; level?: number; text: string }[] } = JSON.parse(await readFile(path.join(process.cwd(), "src/data/manasflow/details", `${Buffer.from(route).toString("base64url")}.json`), "utf8"));
        body = detail.blocks.filter(block => !(block.kind === "heading" && block.level === 1)).slice(0, 16).map(block => block.kind === "heading" ? `#### ${block.text}` : block.kind === "list" ? `- ${block.text}` : block.text).join("\n\n");
      }
      const service = services.find(item => `/${item.slug}` === route);
      if (service) body = [service.intro, ...service.sections.map(section => `#### ${section.title}\n\n${section.body.join("\n\n")}\n\n${section.steps.map(step => `- ${step}`).join("\n")}`)].join("\n\n");
      const product = PRODUCT_PAGES.find(item => `/${item.slug}` === route);
      if (product) body = [...product.features.map(feature => `#### ${feature.title}\n\n${feature.description}`), ...product.resources.map(resource => `#### ${resource.title}\n\n${resource.description}\n\n${resource.content}`)].join("\n\n");
      const tool = getInteractiveTool(route.slice(1));
      if (tool?.questions?.length) body = tool.questions.map(question => `- ${question.text}`).join("\n");
      const calculator = CALCULATOR_CONFIG[route.slice(1)];
      if (tool && calculator) {
        const result = calculateTool(tool.slug, Object.fromEntries(calculator.fields.map(field => [field.id, field.value])));
        body = `#### ${calculator.heading}\n\n${calculator.fields.map(field => `- ${field.label}${field.help ? `: ${field.help}` : ""}`).join("\n")}\n\n#### Outputs\n\n${result.metrics.map(metric => `- ${metric.label}`).join("\n")}\n\n${result.note}`;
      }
      const faqs = pageFaqs(route);
      if (faqs.length) body += `\n\n#### Frequently asked questions\n\n${faqs.map(faq => `**${faq.question}**\n\n${faq.answer}`).join("\n\n")}`;
      return `### ${title}\n\nURL: ${absoluteUrl(route)}\n\n${page.description}${body ? `\n\n${body}` : ""}`;
    }));
    if (group === "Optional") entries.push(`- [Full site context](${site.url}/llms-full.txt): Structured page content and summaries.`, `- [Sitemap](${site.url}/sitemap.xml): Canonical indexable URLs.`);
    return `## ${group}\n\n${entries.join(full ? "\n\n---\n\n" : "\n")}`;
  }));
  return `${intro}\n${sections.join("\n\n")}\n`;
}
