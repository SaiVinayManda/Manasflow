import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { FreeToolsHub } from "@/components/sites/manasflow/free-tools";

export const metadata: Metadata = { ...{ title: "20 Free AI Automation Tools", description: "Free calculators, assessments, and generators from ManasFlow to help you make smarter AI decisions. No credit card required.", alternates: { canonical: "/tools" } }, ...pageMetadata("20 Free AI Automation Tools", "Free calculators, assessments, and generators from ManasFlow to help you make smarter AI decisions. No credit card required.", "/tools") };

export default function ToolsPage() {
  return <FreeToolsHub />;
}
