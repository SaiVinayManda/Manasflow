import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("workflow-automation-agency");

export default function Page() {
  return <PageSeo route="/workflow-automation-agency">{<ServiceLandingPage slug="workflow-automation-agency" />}</PageSeo>;
}
