import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("pipedrive-consultants");

export default function Page() {
  return <PageSeo route="/pipedrive-consultants">{<ServiceLandingPage slug="pipedrive-consultants" />}</PageSeo>;
}
