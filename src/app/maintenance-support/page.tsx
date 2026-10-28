import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("maintenance-support");

export default function Page() {
  return <ServiceLandingPage slug="maintenance-support" />;
}
