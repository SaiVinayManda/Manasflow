import type { Metadata } from "next";
import { site } from "./site";
import { canonicalRoute, NOINDEX_ROUTES } from "./seo-routes";
import content from "@/data/manasflow/seo-content.json";
import hubMetadataData from "@/data/manasflow/hub-metadata.json";

export function pageMetadata(title: string, description: string, route: string): Metadata {
  route = canonicalRoute(route);
  const url = new URL(route, site.url).href;
  const record = (content as Record<string, { description: string; seoTitle?: string; seoDescription?: string }>)[route];
  const hub = (hubMetadataData as Record<string, { title: string; description: string }>)[route];
  const pageTitle = `${(hub?.title || record?.seoTitle || title).replace(/\s*\|\s*ManasFlow$/i, "")} | ${site.name}`;
  const summary = hub?.description || record?.seoDescription || description || record?.description || `${title}. Explore practical AI automation resources, implementation guidance, and engineering with ${site.name}.`;
  return {
    title: { absolute: pageTitle },
    description: summary,
    alternates: { canonical: url },
    robots: NOINDEX_ROUTES.has(route) ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: pageTitle,
      description: summary,
      url,
      images: [{ url: "/sites/manasflow/social-card.png", width: 1200, height: 630, alt: `${site.name} — AI automation and engineering` }],
    },
    twitter: { card: "summary_large_image", title: pageTitle, description: summary, images: ["/sites/manasflow/social-card.png"] },
  };
}

export function hubMetadata(route: keyof typeof hubMetadataData): Metadata {
  const hub = hubMetadataData[route];
  return pageMetadata(hub.title, hub.description, route);
}
