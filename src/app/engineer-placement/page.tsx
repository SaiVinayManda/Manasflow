import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("engineer-placement");

export default function Page() {
  return <PageSeo route="/engineer-placement">{<ServiceLandingPage slug="engineer-placement" />}</PageSeo>;
}
