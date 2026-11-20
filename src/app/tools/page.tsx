import { PageSeo } from "@/components/seo/page-seo";
import { hubMetadata } from "@/lib/metadata";
import { FreeToolsHub } from "@/components/sites/manasflow/free-tools";

export const metadata = hubMetadata("/tools");

export default function ToolsPage() {
  return <PageSeo route="/tools">{<FreeToolsHub />}</PageSeo>;
}
