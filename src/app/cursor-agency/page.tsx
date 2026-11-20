import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("cursor-agency");

export default function Page() {
  return <PageSeo route="/cursor-agency">{<ServiceLandingPage slug="cursor-agency" />}</PageSeo>;
}
