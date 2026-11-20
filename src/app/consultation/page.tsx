import { PageSeo } from "@/components/seo/page-seo";
import { SupplementalPage, supplementalPageMetadata } from "@/components/sites/manasflow/supplemental-pages";

export const metadata = supplementalPageMetadata("/consultation");

export default function ConsultationPage() {
  return <PageSeo route="/consultation">{<SupplementalPage route="/consultation" />}</PageSeo>;
}
