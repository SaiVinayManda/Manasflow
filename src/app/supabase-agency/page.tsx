import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("supabase-agency");

export default function Page() {
  return <ServiceLandingPage slug="supabase-agency" />;
}
