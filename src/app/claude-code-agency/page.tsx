import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("claude-code-agency");

export default function Page() {
  return <ServiceLandingPage slug="claude-code-agency" />;
}
