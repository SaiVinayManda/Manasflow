import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("ai-automation-agency");

export default function Page() {
  return <PageSeo route="/ai-automation-agency">{<ServiceLandingPage slug="ai-automation-agency" />}</PageSeo>;
}
