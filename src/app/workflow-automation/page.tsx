import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("workflow-automation");

export default function Page() {
  return <PageSeo route="/workflow-automation">{<ServiceLandingPage slug="workflow-automation" />}</PageSeo>;
}
