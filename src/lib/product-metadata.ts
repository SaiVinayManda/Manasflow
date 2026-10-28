import type { Metadata } from "next";
import { PRODUCT_PAGES } from "@/data/manasflow/products";
import { pageMetadata } from "./metadata";

export function productMetadata(slug: string): Metadata {
  const product = PRODUCT_PAGES.find(item => item.slug === slug);
  if (!product) throw new Error(`Unknown ManasFlow product: ${slug}`);
  return pageMetadata(product.name, product.description, `/${slug}`);
}
