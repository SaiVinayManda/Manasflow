import { ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";

export const metadata = servicePageMetadata("nextjs-ai-app-development");

export default function Page() {
  return <ServiceLandingPage slug="nextjs-ai-app-development" />;
}
