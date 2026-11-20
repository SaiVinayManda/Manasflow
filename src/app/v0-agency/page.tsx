import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("v0-agency");

export default function Page() {
  return <PageSeo route="/v0-agency">{<ServiceLandingPage slug="v0-agency" />}</PageSeo>;
}
