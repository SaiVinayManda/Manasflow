import { ProductLandingPage } from "@/components/sites/manasflow/product-landing";
import { productMetadata } from "@/lib/product-metadata";

export const metadata = productMetadata("manasdesign");

export default function Page() {
  return <ProductLandingPage slug="manasdesign" />;
}
