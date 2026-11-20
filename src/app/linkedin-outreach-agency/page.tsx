import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("linkedin-outreach-agency");

export default function Page() {
  return <PageSeo route="/linkedin-outreach-agency">{<ServiceLandingPage slug="linkedin-outreach-agency" />}</PageSeo>;
}
