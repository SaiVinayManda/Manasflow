import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("replit-agency");

export default function Page() {
  return <ServiceLandingPage slug="replit-agency" />;
}
