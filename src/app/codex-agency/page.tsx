import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("codex-agency");

export default function Page() {
  return <PageSeo route="/codex-agency">{<ServiceLandingPage slug="codex-agency" />}</PageSeo>;
}
