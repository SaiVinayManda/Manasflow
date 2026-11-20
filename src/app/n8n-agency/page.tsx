import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("n8n-agency");

export default function Page() {
  return <PageSeo route="/n8n-agency">{<ServiceLandingPage slug="n8n-agency" />}</PageSeo>;
}
