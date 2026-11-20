import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("claude-code-agency");

export default function Page() {
  return <PageSeo route="/claude-code-agency">{<ServiceLandingPage slug="claude-code-agency" />}</PageSeo>;
}
