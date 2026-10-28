import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("saas-mvp-development");

export default function Page() {
  return <ServiceLandingPage slug="saas-mvp-development" />;
}
