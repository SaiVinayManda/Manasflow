import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("pipedrive-consultants");

export default function Page() {
  return <ServiceLandingPage slug="pipedrive-consultants" />;
}
