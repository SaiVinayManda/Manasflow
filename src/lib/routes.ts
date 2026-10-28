import detailIndex from "@/data/manasflow/details-index.json";
import services from "@/data/manasflow/service-pages.json";
import { PRODUCT_ROUTES } from "@/data/manasflow/products";
import { ECOSYSTEM_ROUTES } from "./ecosystem-catalogs";
import { INTERACTIVE_TOOL_SLUGS } from "./interactive-tool-data";
import supplementalPages from "@/data/manasflow/supplemental-pages.json";

export const FIXED_ROUTES = [
  "/", "/industries", "/blog", "/case-studies", "/playbooks", "/courses", "/faq", "/contact", "/careers", "/services",
  "/tools", "/models", "/free-models", "/directory", "/ai-model-comparison", "/ai-model-pricing-index", "/models/pricing", "/models/compare",
  "/consultation", "/golden-offer", "/privacy", "/terms", "/cookies", "/privacy-policy", "/cookie-policy",
];

export const SITE_ROUTES = [...new Set([
  ...FIXED_ROUTES,
  ...detailIndex.map(page => page.route),
  ...services.flatMap(page => [`/${page.slug}`, page.sourceRoute, `/services/${page.slug}`]),
  ...INTERACTIVE_TOOL_SLUGS.flatMap(slug => [`/tools/${slug}`, `/${slug}`]),
  ...PRODUCT_ROUTES,
  ...ECOSYSTEM_ROUTES,
  ...supplementalPages.map(page => page.route),
])];
