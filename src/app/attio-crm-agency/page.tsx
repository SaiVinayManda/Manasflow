import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("attio-crm-agency");

export default function Page() {
  return <PageSeo route="/attio-crm-agency">{<ServiceLandingPage slug="attio-crm-agency" />}</PageSeo>;
}
