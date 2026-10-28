import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("hubspot-consultants");

export default function Page() {
  return <ServiceLandingPage slug="hubspot-consultants" />;
}
