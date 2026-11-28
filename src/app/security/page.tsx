import { PageSeo } from "@/components/seo/page-seo";
import { pageMetadata } from "@/lib/metadata";
import { SecurityArchitecturePage } from "@/components/sites/manasflow/security-page";

export const metadata = pageMetadata(
  "Security & Delivery Architecture",
  "Review ManasFlow deployment architecture, credential isolation, human-in-the-loop safeguards, audit logs, and US/EU timezone overlap.",
  "/security",
);

export default function SecurityPage() {
  return <PageSeo route="/security">{<SecurityArchitecturePage />}</PageSeo>;
}
