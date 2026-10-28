import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("clay-agency");

export default function Page() {
  return <ServiceLandingPage slug="clay-agency" />;
}
