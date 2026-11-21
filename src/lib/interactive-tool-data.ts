import type { Metadata } from "next";
import catalog from "@/data/manasflow/tools.json";
import evidence from "@/data/manasflow/tool-source-evidence.json";
import { pageMetadata } from "./metadata";

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
  return pageMetadata(tool.title, tool.description, pathname);
}
