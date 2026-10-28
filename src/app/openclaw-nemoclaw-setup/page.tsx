import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("openclaw-nemoclaw-setup");

export default function Page() {
  return <ServiceLandingPage slug="openclaw-nemoclaw-setup" />;
}
