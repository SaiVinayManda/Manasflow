import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("ai-agent-development");

export default function Page() {
  return <ServiceLandingPage slug="ai-agent-development" />;
}
