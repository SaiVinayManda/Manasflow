import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("marketing-automation-agency");

export default function Page() {
  return <PageSeo route="/marketing-automation-agency">{<ServiceLandingPage slug="marketing-automation-agency" />}</PageSeo>;
}
