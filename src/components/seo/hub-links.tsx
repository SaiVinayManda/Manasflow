import Link from "next/link";
import { indexableRoutes, pageBreadcrumbs, seoContent } from "@/lib/seo";

const hubs: Record<string, string> = {
  "/services": "Services", "/tools": "Free Tools", "/playbooks": "Playbooks",
  "/industries": "Industries", "/case-studies": "Case Studies",
};

export function HubLinks({ route }: { route: string }) {
  const label = hubs[route];
  if (!label) return null;
  const children = indexableRoutes().filter(child => !child.includes("?") && pageBreadcrumbs(child)[1]?.route === route && child !== route);
  return <nav className="seo-hub-links mf-container" aria-label={`${label} index`}><details><summary>{label}</summary><ul>{children.map(child => <li key={child}><Link href={child}>{seoContent[child].title}</Link></li>)}</ul></details></nav>;
}
