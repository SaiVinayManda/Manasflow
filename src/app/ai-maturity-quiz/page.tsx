import { PageSeo } from "@/components/seo/page-seo";
import { InteractiveTool } from "@/components/sites/manasflow/interactive-tools";
import { interactiveToolMetadata } from "@/lib/interactive-tool-data";

export const metadata = interactiveToolMetadata("ai-maturity-quiz");

export default function ToolPage() {
  return <PageSeo route="/ai-maturity-quiz">{<InteractiveTool slug="ai-maturity-quiz" />}</PageSeo>;
}
