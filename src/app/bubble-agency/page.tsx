import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("bubble-agency");

export default function Page() {
  return <ServiceLandingPage slug="bubble-agency" />;
}
