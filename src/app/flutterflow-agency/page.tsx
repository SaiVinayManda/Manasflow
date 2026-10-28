import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("flutterflow-agency");

export default function Page() {
  return <ServiceLandingPage slug="flutterflow-agency" />;
}
