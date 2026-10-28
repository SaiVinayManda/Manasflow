import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("engineer-placement");

export default function Page() {
  return <ServiceLandingPage slug="engineer-placement" />;
}
