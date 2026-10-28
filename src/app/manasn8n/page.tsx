import { ProductLandingPage } from "@/components/sites/manasflow/product-landing";
import { productMetadata } from "@/lib/product-metadata";

export const metadata = productMetadata("manasn8n");

export default function Page() {
  return <ProductLandingPage slug="manasn8n" />;
}
