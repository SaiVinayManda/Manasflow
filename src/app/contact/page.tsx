import { PageSeo } from "@/components/seo/page-seo";
import { hubMetadata } from "@/lib/metadata";
import { CompanyContactPage } from "@/components/sites/manasflow/company-pages";

export const metadata = hubMetadata("/contact");

export default function ContactPage() {
  return <PageSeo route="/contact">{<CompanyContactPage />}</PageSeo>;
}
