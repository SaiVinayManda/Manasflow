import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { CaseStudiesPage } from "@/components/sites/manasflow/case-studies";

export const metadata: Metadata = { ...{
  title: "Case Studies — AI Automation Success Stories",
  description: "Explore ManasFlow AI automation projects, client use cases, and detailed stories across operations, growth, product engineering, and customer support.",
  alternates: { canonical: "/case-studies" },
}, ...pageMetadata("Case Studies — AI Automation Success Stories", "Explore ManasFlow AI automation projects, client use cases, and detailed stories across operations, growth, product engineering, and customer support.", "/case-studies") };

export default function Page() {
  return <CaseStudiesPage />;
}
