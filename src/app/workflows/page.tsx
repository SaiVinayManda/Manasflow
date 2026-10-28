import { EcosystemPage } from "@/components/sites/manasflow/catalog-explorer";
import { ecosystemMetadata } from "@/lib/ecosystem-catalogs";
export const metadata = ecosystemMetadata("/workflows");
export default function WorkflowsPage() { return <EcosystemPage route="/workflows" />; }
