import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("flutterflow-agency");

export default function Page() {
  return <PageSeo route="/flutterflow-agency">{<ServiceLandingPage slug="flutterflow-agency" />}</PageSeo>;
}
