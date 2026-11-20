import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("custom-automation");

export default function Page() {
  return <PageSeo route="/custom-automation">{<ServiceLandingPage slug="custom-automation" />}</PageSeo>;
}
