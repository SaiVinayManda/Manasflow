import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("bubble-agency");

export default function Page() {
  return <PageSeo route="/bubble-agency">{<ServiceLandingPage slug="bubble-agency" />}</PageSeo>;
}
