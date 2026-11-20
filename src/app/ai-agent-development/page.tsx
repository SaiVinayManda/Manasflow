import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("ai-agent-development");

export default function Page() {
  return <PageSeo route="/ai-agent-development">{<ServiceLandingPage slug="ai-agent-development" />}</PageSeo>;
}
