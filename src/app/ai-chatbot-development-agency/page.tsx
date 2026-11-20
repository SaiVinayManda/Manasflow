import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("ai-chatbot-development-agency");

export default function Page() {
  return <PageSeo route="/ai-chatbot-development-agency">{<ServiceLandingPage slug="ai-chatbot-development-agency" />}</PageSeo>;
}
