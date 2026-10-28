import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("attio-crm-agency");

export default function Page() {
  return <ServiceLandingPage slug="attio-crm-agency" />;
}
