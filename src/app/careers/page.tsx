import { PageSeo } from "@/components/seo/page-seo";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { CompanyCareersPage } from "@/components/sites/manasflow/company-pages";

export const metadata: Metadata = { ...{ title: "Careers – AI Engineer & Automation Jobs", description: "Build AI that actually runs. Join ManasFlow as an AI engineer, n8n developer, or automation specialist. Show us what you’ve built.", alternates: { canonical: "/careers" } }, ...pageMetadata("Careers – AI Engineer & Automation Jobs", "Build AI that actually runs. Join ManasFlow as an AI engineer, n8n developer, or automation specialist. Show us what you’ve built.", "/careers") };

export default function CareersPage() {
  return <PageSeo route="/careers">{<CompanyCareersPage />}</PageSeo>;
}
