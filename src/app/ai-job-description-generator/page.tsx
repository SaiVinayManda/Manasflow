import { PageSeo } from "@/components/seo/page-seo";
import { InteractiveTool } from "@/components/sites/manasflow/interactive-tools";
import { interactiveToolMetadata } from "@/lib/interactive-tool-data";

export const metadata = interactiveToolMetadata("ai-job-description-generator");

export default function ToolPage() {
  return <PageSeo route="/ai-job-description-generator">{<InteractiveTool slug="ai-job-description-generator" />}</PageSeo>;
}
