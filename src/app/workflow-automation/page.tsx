import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("workflow-automation");

export default function Page() {
  return <ServiceLandingPage slug="workflow-automation" />;
}
