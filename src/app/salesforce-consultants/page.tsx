import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("salesforce-consultants");

export default function Page() {
  return <PageSeo route="/salesforce-consultants">{<ServiceLandingPage slug="salesforce-consultants" />}</PageSeo>;
}
