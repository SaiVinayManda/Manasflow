import type { Metadata } from "next";
import catalog from "@/data/manasflow/tools.json";
import evidence from "@/data/manasflow/tool-source-evidence.json";

export const INTERACTIVE_TOOL_SLUGS = catalog.tools.map(tool => tool.slug);
export type ToolQuestion = {
  id: string;
  pillar: string;
  text: string;
  subtitle: string;
  multiple?: boolean;
  options: { label: string; value: string; points: number; description?: string }[];
};
export type ToolEvidence = { questions: ToolQuestion[]; faqs: { question: string; answer: string }[] };

export function getInteractiveTool(slug: string) {
  const tool = catalog.tools.find(item => item.slug === slug);
  if (!tool) return undefined;
  return { ...tool, ...(evidence as Record<string, ToolEvidence>)[slug] };
}

export function interactiveToolMetadata(slug: string, pathname = `/${slug}`): Metadata {
  const tool = getInteractiveTool(slug);
  if (!tool) return {};
  const title = `${tool.title} | ManasFlow`;
  return {
    title: { absolute: title },
    description: tool.description,
    alternates: { canonical: pathname },
    openGraph: { title, description: tool.description, siteName: "ManasFlow", type: "website", url: pathname, images: [{ url: "/sites/manasflow/social-card.png", width: 1200, height: 630, alt: tool.title }] },
    twitter: { card: "summary_large_image", title, description: tool.description, images: ["/sites/manasflow/social-card.png"] },
  };
}
