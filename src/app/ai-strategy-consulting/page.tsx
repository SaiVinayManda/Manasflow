import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("ai-strategy-consulting");

export default function Page() {
  return <PageSeo route="/ai-strategy-consulting">{<ServiceLandingPage slug="ai-strategy-consulting" />}</PageSeo>;
}
