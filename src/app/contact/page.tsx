import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { CompanyContactPage } from "@/components/sites/manasflow/company-pages";

export const metadata: Metadata = { ...{
  title: "Contact Us – Get in Touch",
  description:
    "Contact ManasFlow to discuss AI automation, intelligent agents, and your next project. Email info@manasflow.com or request a free strategy call.",
  alternates: { canonical: "/contact" },
}, ...pageMetadata("Contact Us – Get in Touch", "Contact ManasFlow to discuss AI automation, intelligent agents, and your next project. Email info@manasflow.com or request a free strategy call.", "/contact") };

export default function ContactPage() {
  return <CompanyContactPage />;
}
