import Link from "next/link";
import type { ReactNode } from "react";
import { canonicalRoute } from "@/lib/seo-routes";
import { pageBreadcrumbs, pageGraph, seoContent } from "@/lib/seo";
import { HubLinks } from "./hub-links";

export function PageSeo({ route, children }: { route: string; children: ReactNode }) {
  route = canonicalRoute(route);
  if (!seoContent[route]) return children;
  const crumbs = pageBreadcrumbs(route);
  // These templates already render the same visible Home > hub > page trail.
  const existingBreadcrumb = /^\/(ai-tools|bot-directory|workflows)\//.test(route);
  return <>
    <script id="manasflow-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph(route)).replace(/</g, "\\u003c") }} />
    {children}
    <HubLinks route={route} />
    {!existingBreadcrumb && crumbs.length > 0 && <nav className="seo-breadcrumbs mf-container" aria-label="Breadcrumb"><ol>{crumbs.map((crumb, index) => <li key={crumb.route}>{index > 0 && <span aria-hidden="true">/</span>}{index === crumbs.length - 1 ? <span aria-current="page">{crumb.name}</span> : <Link href={crumb.route}>{crumb.name}</Link>}</li>)}</ol></nav>}
  </>;
}
