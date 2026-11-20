import { PageSeo } from "@/components/seo/page-seo";
import { InteractiveTool } from "@/components/sites/manasflow/interactive-tools";
import { interactiveToolMetadata } from "@/lib/interactive-tool-data";

export const metadata = interactiveToolMetadata("ai-use-case-generator");

export default function ToolPage() {
  return <PageSeo route="/ai-use-case-generator">{<InteractiveTool slug="ai-use-case-generator" />}</PageSeo>;
}
