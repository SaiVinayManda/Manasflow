import { ProductLandingPage } from "@/components/sites/manasflow/product-landing";
import { productMetadata } from "@/lib/product-metadata";

export const metadata = productMetadata("manasrank");

export default function Page() {
  return <ProductLandingPage slug="manasrank" />;
}
