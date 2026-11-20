import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("no-code-development-agency");

export default function Page() {
  return <PageSeo route="/no-code-development-agency">{<ServiceLandingPage slug="no-code-development-agency" />}</PageSeo>;
}
