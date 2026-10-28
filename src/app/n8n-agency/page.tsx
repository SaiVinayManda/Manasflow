import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("n8n-agency");

export default function Page() {
  return <ServiceLandingPage slug="n8n-agency" />;
}
