import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("framer-agency");

export default function Page() {
  return <ServiceLandingPage slug="framer-agency" />;
}
