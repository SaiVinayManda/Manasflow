import tools from "@/data/manasflow/tools.json";
import { PRODUCT_PAGES } from "@/data/manasflow/products";

export type ToolProduct = { slug: string; title: string; subtitle: string; category: string };

// Canonical ManasFlow applications, including the workspaces linked from /platform.
export const TOOL_PRODUCTS: ToolProduct[] = [
  ...tools.tools.map(tool => ({ slug: tool.slug, title: tool.title, subtitle: tool.description, category: tool.category })),
  ...PRODUCT_PAGES.map(product => ({ slug: product.slug, title: product.name, subtitle: product.description, category: product.eyebrow })),
  { slug: "directory", title: "Free AI Models Directory", subtitle: "Find free API tiers and open-weight models for your next build.", category: "Model discovery" },
  { slug: "ai-model-comparison", title: "AI Model Comparison", subtitle: "Shortlist models and compare capabilities and costs for your workload.", category: "Model comparison" },
  { slug: "ai-model-pricing-index", title: "AI Model Pricing Index", subtitle: "Compare API prices and estimate monthly costs for your token usage.", category: "Model pricing" },
  { slug: "platform", title: "The ManasFlow Platform", subtitle: "Free workspaces, practical resources, and frameworks for your next build.", category: "ManasFlow products" },
];

export function getToolProduct(route: string) {
  return TOOL_PRODUCTS.find(tool => `/${tool.slug}` === route.split("?")[0]);
}

export const toolCardUrl = (slug: string) => `/og/tools/${slug}`;
