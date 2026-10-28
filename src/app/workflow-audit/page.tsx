import { InteractiveTool } from "@/components/sites/manasflow/interactive-tools";
import { interactiveToolMetadata } from "@/lib/interactive-tool-data";

export const metadata = interactiveToolMetadata("workflow-audit");

export default function ToolPage() {
  return <InteractiveTool slug="workflow-audit" />;
}
