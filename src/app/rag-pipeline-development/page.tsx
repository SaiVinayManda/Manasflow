import { PageSeo } from "@/components/seo/page-seo";
import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("rag-pipeline-development");

export default function Page() {
  return <PageSeo route="/rag-pipeline-development">{<ServiceLandingPage slug="rag-pipeline-development" />}</PageSeo>;
}
