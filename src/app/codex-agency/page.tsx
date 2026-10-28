import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("codex-agency");

export default function Page() {
  return <ServiceLandingPage slug="codex-agency" />;
}
