import { PageSeo } from "@/components/seo/page-seo";
import { InteractiveTool } from "@/components/sites/manasflow/interactive-tools";
import { interactiveToolMetadata } from "@/lib/interactive-tool-data";

export const metadata = interactiveToolMetadata("ai-tool-selector");

export default function ToolPage() {
  return <PageSeo route="/ai-tool-selector">{<InteractiveTool slug="ai-tool-selector" />}</PageSeo>;
}
