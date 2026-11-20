import { PageSeo } from "@/components/seo/page-seo";
import { hubMetadata } from "@/lib/metadata";
import { ManasFlowHome } from "@/components/sites/manasflow/home";

export const metadata = hubMetadata("/");

export default function Home() {
  return <PageSeo route="/">{<ManasFlowHome />}</PageSeo>;
}
