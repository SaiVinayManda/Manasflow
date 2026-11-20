import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("replit-agency");

export default function Page() {
  return <PageSeo route="/replit-agency">{<ServiceLandingPage slug="replit-agency" />}</PageSeo>;
}
