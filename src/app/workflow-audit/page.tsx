import { PageSeo } from "@/components/seo/page-seo";
import { InteractiveTool } from "@/components/sites/manasflow/interactive-tools";
import { interactiveToolMetadata } from "@/lib/interactive-tool-data";

export const metadata = interactiveToolMetadata("workflow-audit");

export default function ToolPage() {
  return <PageSeo route="/workflow-audit">{<InteractiveTool slug="workflow-audit" />}</PageSeo>;
}
