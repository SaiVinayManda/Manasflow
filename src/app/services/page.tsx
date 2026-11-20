import { PageSeo } from "@/components/seo/page-seo";
import { hubMetadata } from "@/lib/metadata";
import { CompanyServicesPage } from "@/components/sites/manasflow/company-pages";

export const metadata = hubMetadata("/services");

export default function ServicesPage() {
  return <PageSeo route="/services">{<CompanyServicesPage />}</PageSeo>;
}
