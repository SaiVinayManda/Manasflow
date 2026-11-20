import services from "../data/manasflow/service-pages.json";
import tools from "../data/manasflow/tools.json";

export const ROUTE_ALIASES: Record<string, string> = {
  "/privacy-policy": "/privacy", "/cookie-policy": "/cookies",
  "/models/pricing": "/ai-model-pricing-index", "/models/compare": "/ai-model-comparison",
  "/models": "/ai-model-comparison", "/free-models": "/directory",
};
for (const page of services) {
  for (const route of [page.sourceRoute, `/services/${page.slug}`]) {
    if (route !== `/${page.slug}`) ROUTE_ALIASES[route] = `/${page.slug}`;
  }
}
for (const tool of tools.tools) ROUTE_ALIASES[`/tools/${tool.slug}`] = `/${tool.slug}`;

export const NOINDEX_ROUTES = new Set(["/privacy", "/terms", "/cookies"]);
export function canonicalRoute(route: string) {
  const normalized = route === "/" ? route : route.replace(/\/$/, "");
  return ROUTE_ALIASES[normalized] || normalized;
}

export { PRIMARY_NAVIGATION } from "./site-navigation";
