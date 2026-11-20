import { PageSeo } from "@/components/seo/page-seo";
import { SupplementalPage, supplementalPageMetadata } from "@/components/sites/manasflow/supplemental-pages";

export const metadata = supplementalPageMetadata("/golden-offer");

export default function GoldenOfferPage() {
  return <PageSeo route="/golden-offer">{<SupplementalPage route="/golden-offer" />}</PageSeo>;
}
