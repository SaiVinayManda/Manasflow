import type { Metadata } from "next";
import catalogs from "@/data/manasflow/ecosystem-catalogs.json";
import { pageMetadata } from "./metadata";

export const ECOSYSTEM_ROUTES = [
  "/ai-tools", "/bot-directory", "/skills", "/workflows",
  ...catalogs.categories.map(category => `/ai-tools/category/${category.slug}`),
  ...catalogs.tools.map(tool => tool.route),
  ...catalogs.bots.map(bot => bot.route),
  ...catalogs.workflowDetails.map(workflow => workflow.route),
];

export function ecosystemMetadata(route: string): Metadata | undefined {
  if (route === "/ai-tools") return pageMetadata("AI Tools Directory", "Explore 346 AI tools across 75 categories, with searchable listings and practical implementation guidance from ManasFlow.", route);
  if (route === "/bot-directory") return pageMetadata("Bot Directory & Automation Templates", "Explore 61 automation templates by category and integration, with clear setup steps and implementation guidance from ManasFlow.", route);
  if (route === "/skills") return pageMetadata("Skills & Agents — AI Capability Stack", "Browse 144 AI capabilities across agent orchestration, engineering, workflow automation, content, sales, and delivery with ManasFlow.", route);
  if (route === "/workflows") return pageMetadata("Automation Workflows", "Find practical automation patterns for sales, support, operations, and developer workflows. Explore setup guides and implementation options with ManasFlow.", route);
  const category = catalogs.categories.find(item => `/ai-tools/category/${item.slug}` === route);
  if (category) return pageMetadata(`Best ${category.title}`, category.description, route);
  const tool = catalogs.tools.find(item => item.route === route);
  if (tool) return pageMetadata(`${tool.name} — AI Tool Guide`, tool.description, route);
  const bot = catalogs.bots.find(item => item.route === route);
  if (bot) return pageMetadata(bot.name, bot.description, route);
  const workflow = catalogs.workflowDetails.find(item => item.route === route);
  if (workflow) return pageMetadata(workflow.name, workflow.description, route);
  return undefined;
}
