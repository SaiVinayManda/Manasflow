import { InteractiveTool } from "@/components/sites/manasflow/interactive-tools";
import { interactiveToolMetadata } from "@/lib/interactive-tool-data";

export const metadata = interactiveToolMetadata("ai-budget-planner");

export default function ToolPage() {
  return <InteractiveTool slug="ai-budget-planner" />;
}
