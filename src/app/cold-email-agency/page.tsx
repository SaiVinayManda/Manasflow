import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("cold-email-agency");

export default function Page() {
  return <ServiceLandingPage slug="cold-email-agency" />;
}
