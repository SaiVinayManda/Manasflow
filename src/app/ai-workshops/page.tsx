import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("ai-workshops");

export default function Page() {
  return <ServiceLandingPage slug="ai-workshops" />;
}
