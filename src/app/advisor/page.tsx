import { PageSeo } from "@/components/seo/page-seo";
import { pageMetadata } from "@/lib/metadata";
import { SolutionsAdvisor } from "@/components/sites/manasflow/solutions-advisor";

export const metadata = pageMetadata(
  "AI Solutions Advisor",
  "Match your workflow bottlenecks and stack constraints against ManasFlow services, verified case studies, and implementation models in minutes.",
  "/advisor",
);

export default function AdvisorPage() {
  return <PageSeo route="/advisor">{<SolutionsAdvisor />}</PageSeo>;
}
