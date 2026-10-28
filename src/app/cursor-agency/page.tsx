import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("cursor-agency");

export default function Page() {
  return <ServiceLandingPage slug="cursor-agency" />;
}
