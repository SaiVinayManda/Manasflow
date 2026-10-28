import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("lovable-agency");

export default function Page() {
  return <ServiceLandingPage slug="lovable-agency" />;
}
