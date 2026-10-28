import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("zoho-consultants");

export default function Page() {
  return <ServiceLandingPage slug="zoho-consultants" />;
}
