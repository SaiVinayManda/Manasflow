import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { CompanyServicesPage } from "@/components/sites/manasflow/company-pages";

export const metadata: Metadata = { ...{ title: "AI Services & Training", description: "Explore ManasFlow’s AI services: agent development, workflow automation, staff augmentation, AI strategy, training, and ongoing support.", alternates: { canonical: "/services" } }, ...pageMetadata("AI Services & Training", "Explore ManasFlow’s AI services: agent development, workflow automation, staff augmentation, AI strategy, training, and ongoing support.", "/services") };

export default function ServicesPage() {
  return <CompanyServicesPage />;
}
