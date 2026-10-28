import { ProductLandingPage } from "@/components/sites/manasflow/product-landing";
import { productMetadata } from "@/lib/product-metadata";

export const metadata = productMetadata("manas-skills");

export default function Page() {
  return <ProductLandingPage slug="manas-skills" />;
}
