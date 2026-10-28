import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("custom-training");

export default function Page() {
  return <ServiceLandingPage slug="custom-training" />;
}
