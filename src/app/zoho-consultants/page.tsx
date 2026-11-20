import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("zoho-consultants");

export default function Page() {
  return <PageSeo route="/zoho-consultants">{<ServiceLandingPage slug="zoho-consultants" />}</PageSeo>;
}
