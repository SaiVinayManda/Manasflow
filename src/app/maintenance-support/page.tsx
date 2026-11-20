import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("maintenance-support");

export default function Page() {
  return <PageSeo route="/maintenance-support">{<ServiceLandingPage slug="maintenance-support" />}</PageSeo>;
}
