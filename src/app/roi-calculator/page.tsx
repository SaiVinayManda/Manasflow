import { PageSeo } from "@/components/seo/page-seo";
import { InteractiveTool } from "@/components/sites/manasflow/interactive-tools";
import { interactiveToolMetadata } from "@/lib/interactive-tool-data";

export const metadata = interactiveToolMetadata("roi-calculator");

export default function ToolPage() {
  return <PageSeo route="/roi-calculator">{<InteractiveTool slug="roi-calculator" />}</PageSeo>;
}
