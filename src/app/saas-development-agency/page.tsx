import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("saas-development-agency");

export default function Page() {
  return <ServiceLandingPage slug="saas-development-agency" />;
}
