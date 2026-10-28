import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("rag-pipeline-development");

export default function Page() {
  return <ServiceLandingPage slug="rag-pipeline-development" />;
}
