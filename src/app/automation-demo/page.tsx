import { PageSeo } from "@/components/seo/page-seo";
import { pageMetadata } from "@/lib/metadata";
import { AutomationDemoSandbox } from "@/components/sites/manasflow/automation-demo";

export const metadata = pageMetadata(
  "Interactive Automation Demo Sandbox",
  "Test simulated AI lead qualification, invoice extraction with approval queues, and support triage workflows before booking a roadmap call.",
  "/automation-demo",
);

export default function AutomationDemoPage() {
  return <PageSeo route="/automation-demo">{<AutomationDemoSandbox />}</PageSeo>;
}
