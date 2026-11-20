import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("openclaw-nemoclaw-setup");

export default function Page() {
  return <PageSeo route="/openclaw-nemoclaw-setup">{<ServiceLandingPage slug="openclaw-nemoclaw-setup" />}</PageSeo>;
}
