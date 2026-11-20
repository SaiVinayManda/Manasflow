import { PageSeo } from "@/components/seo/page-seo";
import { ProductLandingPage } from "@/components/sites/manasflow/product-landing";
import { productMetadata } from "@/lib/product-metadata";

export const metadata = productMetadata("manas-framework");

export default function Page() {
  return <PageSeo route="/manas-framework">{<ProductLandingPage slug="manas-framework" />}</PageSeo>;
}
