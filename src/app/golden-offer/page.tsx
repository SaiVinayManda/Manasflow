import { SupplementalPage, supplementalPageMetadata } from "@/components/sites/manasflow/supplemental-pages";

export const metadata = supplementalPageMetadata("/golden-offer");

export default function GoldenOfferPage() {
  return <SupplementalPage route="/golden-offer" />;
}
