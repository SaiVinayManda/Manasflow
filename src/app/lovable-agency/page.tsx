import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("lovable-agency");

export default function Page() {
  return <PageSeo route="/lovable-agency">{<ServiceLandingPage slug="lovable-agency" />}</PageSeo>;
}
