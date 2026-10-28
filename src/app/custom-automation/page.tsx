import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("custom-automation");

export default function Page() {
  return <ServiceLandingPage slug="custom-automation" />;
}
