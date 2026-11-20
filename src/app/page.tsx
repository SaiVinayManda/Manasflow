import { PageSeo } from "@/components/seo/page-seo";
import { pageMetadata } from "@/lib/metadata";
import { ManasFlowHome } from "@/components/sites/manasflow/home";
import type { Metadata } from "next";

export const metadata: Metadata = { ...{ alternates: { canonical: "/" } }, ...pageMetadata("AI Transformation & Automation", "Explore ai transformation & automation with ManasFlow. Practical AI automation, engineering, and resources for your business.", "/") };

export default function Home() {
  return <PageSeo route="/">{<ManasFlowHome />}</PageSeo>;
}
