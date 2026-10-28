import type { Metadata } from "next";
import { site } from "./site";

export function pageMetadata(title: string, description: string, route: string): Metadata {
  const pageTitle = `${title.replace(/\s*\|\s*ManasFlow$/i, "")} | ${site.name}`;
  const summary = description || `${title}. Explore practical AI automation resources, implementation guidance, and engineering with ${site.name}.`;
  return {
    title: { absolute: pageTitle },
    description: summary,
    alternates: { canonical: route },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: pageTitle,
      description: summary,
      url: route,
      images: [{ url: "/sites/manasflow/social-card.png", width: 1200, height: 630, alt: `${site.name} — AI automation and engineering` }],
    },
    twitter: { card: "summary_large_image", title: pageTitle, description: summary, images: ["/sites/manasflow/social-card.png"] },
  };
}
