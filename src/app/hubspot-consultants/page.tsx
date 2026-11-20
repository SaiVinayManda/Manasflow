import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("hubspot-consultants");

export default function Page() {
  return <PageSeo route="/hubspot-consultants">{<ServiceLandingPage slug="hubspot-consultants" />}</PageSeo>;
}
