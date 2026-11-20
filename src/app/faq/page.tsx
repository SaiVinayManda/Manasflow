import { PageSeo } from "@/components/seo/page-seo";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { CompanyFAQPage } from "@/components/sites/manasflow/company-pages";

export const metadata: Metadata = { ...{ title: "FAQ – AI Automation & Staff Augmentation", description: "Answers to your questions about ManasFlow’s AI workflow automation, staff augmentation, services, and pricing.", alternates: { canonical: "/faq" } }, ...pageMetadata("FAQ – AI Automation & Staff Augmentation", "Answers to your questions about ManasFlow’s AI workflow automation, staff augmentation, services, and pricing.", "/faq") };

export default function FAQPage() {
  return <PageSeo route="/faq">{<CompanyFAQPage />}</PageSeo>;
}
