import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("framer-agency");

export default function Page() {
  return <PageSeo route="/framer-agency">{<ServiceLandingPage slug="framer-agency" />}</PageSeo>;
}
