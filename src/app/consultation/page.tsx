import { SupplementalPage, supplementalPageMetadata } from "@/components/sites/manasflow/supplemental-pages";

export const metadata = supplementalPageMetadata("/consultation");

export default function ConsultationPage() {
  return <SupplementalPage route="/consultation" />;
}
