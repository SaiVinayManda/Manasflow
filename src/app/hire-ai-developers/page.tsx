import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("hire-ai-developers");

export default function Page() {
  return <PageSeo route="/hire-ai-developers">{<ServiceLandingPage slug="hire-ai-developers" />}</PageSeo>;
}
