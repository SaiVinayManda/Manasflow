import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("cold-email-agency");

export default function Page() {
  return <PageSeo route="/cold-email-agency">{<ServiceLandingPage slug="cold-email-agency" />}</PageSeo>;
}
