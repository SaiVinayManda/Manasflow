import { PageSeo } from "@/components/seo/page-seo";
import { EcosystemPage } from "@/components/sites/manasflow/catalog-explorer";
import { ecosystemMetadata } from "@/lib/ecosystem-catalogs";
export const metadata = ecosystemMetadata("/workflows");
export default function WorkflowsPage() { return <PageSeo route="/workflows">{<EcosystemPage route="/workflows" />}</PageSeo>; }
