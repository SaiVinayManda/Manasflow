import { PageSeo } from "@/components/seo/page-seo";
import { InteractiveTool } from "@/components/sites/manasflow/interactive-tools";
import { interactiveToolMetadata } from "@/lib/interactive-tool-data";

export const metadata = interactiveToolMetadata("digital-transformation-scorecard");

export default function ToolPage() {
  return <PageSeo route="/digital-transformation-scorecard">{<InteractiveTool slug="digital-transformation-scorecard" />}</PageSeo>;
}
