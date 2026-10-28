import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { SITE_ROUTES } from "@/lib/routes";
import services from "@/data/manasflow/service-pages.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const aliases = new Set(["/privacy-policy", "/cookie-policy", "/models/pricing", "/models/compare", ...services.flatMap(page => [page.sourceRoute, `/services/${page.slug}`])]);
  return SITE_ROUTES.filter(route => !aliases.has(route) && !route.startsWith("/tools/")).map(route => ({ url: new URL(route, site.url).href }));
}
