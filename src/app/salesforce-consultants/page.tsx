import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("salesforce-consultants");

export default function Page() {
  return <ServiceLandingPage slug="salesforce-consultants" />;
}
