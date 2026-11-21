import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { indexableRoutes, seoContent } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes().map(route => ({
    // Use recorded content history, never the request/build time as lastmod.
    url: new URL(route, site.url).href,
    ...(seoContent[route].modified ? { lastModified: seoContent[route].modified } : {}),
    changeFrequency: route === "/" || ["/blog", "/ai-tools", "/tools", "/directory"].includes(route) ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.split("/").length === 2 && !route.includes("?") ? 0.8 : 0.6,
  }));
}
