import { PageSeo } from "@/components/seo/page-seo";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { IndustriesPage } from "@/components/sites/manasflow/industries";

export const metadata: Metadata = { ...{
  title: "AI Automation by Industry",
  description: "Explore ManasFlow automation workflows, industry playbooks, and outcomes for consulting, legal, marketing, finance, logistics, ecommerce, and more.",
  alternates: { canonical: "/industries" },
}, ...pageMetadata("AI Automation by Industry", "Explore ManasFlow automation workflows, industry playbooks, and outcomes for consulting, legal, marketing, finance, logistics, ecommerce, and more.", "/industries") };

export default function Page() {
  return <PageSeo route="/industries">{<IndustriesPage />}</PageSeo>;
}
