import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { permanentRedirect } from "next/navigation";
import { PageSeo } from "@/components/seo/page-seo";
import { canonicalRoute } from "@/lib/seo-routes";
import { seoContent } from "@/lib/seo";
import { readdirSync } from "node:fs";
import { PageCallout, SubpageHero } from "@/components/sites/manasflow/subpage-shared";
import { DetailContent } from "@/components/sites/manasflow/detail-content";
import detailIndex from "@/data/manasflow/details-index.json";
import { pageMetadata } from "@/lib/metadata";
import { SITE_ROUTES } from "@/lib/routes";
import { servicePageByRoute, ServiceLandingPage, servicePageMetadata } from "@/components/sites/manasflow/service-landing";
import { getInteractiveTool, interactiveToolMetadata } from "@/lib/interactive-tool-data";
import { InteractiveTool } from "@/components/sites/manasflow/interactive-tools";
import { ECOSYSTEM_ROUTES, ecosystemMetadata } from "@/lib/ecosystem-catalogs";
import { EcosystemPage } from "@/components/sites/manasflow/catalog-explorer";
import { ModelDirectory } from "@/components/sites/manasflow/model-directory";
import { SupplementalPage, supplementalPageByRoute, supplementalPageMetadata } from "@/components/sites/manasflow/supplemental-pages";

type Props = { params: Promise<{ slug: string[] }> };
const routes = new Map(detailIndex.map(page => [page.route.replace(/\/$/, ""), page]));

export function generateStaticParams() {
  const explicit = new Set(readdirSync(path.join(process.cwd(), "src/app"), { withFileTypes: true }).filter(entry => entry.isDirectory() && !entry.name.startsWith("[")).map(entry => `/${entry.name}`));
  return SITE_ROUTES.filter(route => canonicalRoute(route) === route && route !== "/" && !explicit.has(route) && !route.startsWith("/agency/")).map(route => ({ slug: route.slice(1).split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = `/${slug.join("/")}`;
  const service = servicePageByRoute(route);
  if (service) return servicePageMetadata(service.slug);
  const tool = slug.length === 1 ? slug[0] : slug.length === 2 && slug[0] === "tools" ? slug[1] : undefined;
  if (tool && getInteractiveTool(tool)) return interactiveToolMetadata(tool);
  const ecosystem = ecosystemMetadata(route);
  if (ecosystem) return ecosystem;
  if (supplementalPageByRoute(route)) return supplementalPageMetadata(route);
  if (route === "/models/pricing") return pageMetadata("AI Model Pricing Index", "Compare published API prices and estimate monthly model costs with ManasFlow.", "/ai-model-pricing-index");
  if (route === "/models/compare") return pageMetadata("AI Model Comparison", "Compare model capabilities, providers, context, and costs with ManasFlow.", "/ai-model-comparison");
  const page = routes.get(route);
  if (!page) return {};
  return pageMetadata(page.title, seoContent[route]?.description || page.description, page.route);
}

async function DetailPage({ params }: Props) {
  const { slug } = await params;
  const route = `/${slug.join("/")}`;
  const service = servicePageByRoute(route);
  if (service) return <ServiceLandingPage slug={service.slug} />;
  const tool = slug.length === 1 ? slug[0] : slug.length === 2 && slug[0] === "tools" ? slug[1] : undefined;
  if (tool && getInteractiveTool(tool)) return <InteractiveTool key={tool} slug={tool} />;
  if (ECOSYSTEM_ROUTES.includes(route)) return <EcosystemPage key={route} route={route} />;
  if (supplementalPageByRoute(route)) return <SupplementalPage route={route} />;
  if (route === "/models/pricing") return <ModelDirectory pricing />;
  if (route === "/models/compare") return <ModelDirectory />;
  const summary = routes.get(route);
  if (!summary) notFound();
  let content: { blocks: { kind: string; level?: number; text: string }[] };
  try {
    const filename = `${Buffer.from(route).toString("base64url")}.json`;
    content = JSON.parse(await readFile(path.join(process.cwd(), "src/data/manasflow/details", filename), "utf8")) as typeof content;
  } catch { notFound(); }
  return <article className="mf-detail-page">
    <SubpageHero badge={route.split("/")[1]?.replaceAll("-", " ") || "ManasFlow"} title={summary.title} description={summary.description} />
    <DetailContent blocks={content.blocks.filter((block, index) => !(index === 0 && block.kind === "heading" && block.level === 1))} />
    <nav className="mf-detail-related" aria-label="Related pages"><Link href="/blog">Blog</Link><Link href="/playbooks">Playbooks</Link><Link href="/industries">Industries</Link><Link href="/case-studies">Case studies</Link></nav>
    <PageCallout />
  </article>;
}

export default async function SeoDetailPage({ params }: Props) {
  const route = `/${(await params).slug.join("/")}`;
  const canonical = canonicalRoute(route);
  if (canonical !== route) permanentRedirect(canonical);
  return <PageSeo route={route}><DetailPage params={params} /></PageSeo>;
}
