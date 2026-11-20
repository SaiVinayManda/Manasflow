import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("saas-mvp-development");

export default function Page() {
  return <PageSeo route="/saas-mvp-development">{<ServiceLandingPage slug="saas-mvp-development" />}</PageSeo>;
}
