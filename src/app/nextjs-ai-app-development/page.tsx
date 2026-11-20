import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("nextjs-ai-app-development");

export default function Page() {
  return <PageSeo route="/nextjs-ai-app-development">{<ServiceLandingPage slug="nextjs-ai-app-development" />}</PageSeo>;
}
