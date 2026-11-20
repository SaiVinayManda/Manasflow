import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("custom-training");

export default function Page() {
  return <PageSeo route="/custom-training">{<ServiceLandingPage slug="custom-training" />}</PageSeo>;
}
