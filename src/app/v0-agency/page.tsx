import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("v0-agency");

export default function Page() {
  return <ServiceLandingPage slug="v0-agency" />;
}
