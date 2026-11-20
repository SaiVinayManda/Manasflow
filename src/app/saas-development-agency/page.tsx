import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("saas-development-agency");

export default function Page() {
  return <PageSeo route="/saas-development-agency">{<ServiceLandingPage slug="saas-development-agency" />}</PageSeo>;
}
