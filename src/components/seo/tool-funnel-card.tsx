import Link from "next/link";
import { relatedInteractiveTool } from "@/lib/tool-recommendations";
import "./tool-funnel-card.css";

export function ToolFunnelCard({ context }: { context: string }) {
  const tool = relatedInteractiveTool(context);
  return <aside className="mf-tool-funnel" aria-label="Related free interactive tool"><span>Try the free interactive tool</span><strong>{tool.title}</strong><p>{tool.description}</p><Link href={tool.href}>{tool.anchor}</Link></aside>;
}
