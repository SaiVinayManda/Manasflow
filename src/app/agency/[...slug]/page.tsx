import { notFound } from "next/navigation";
import { SERVICE_SOURCE_ROUTES, ServiceLandingPage, servicePageByRoute, servicePageMetadata } from "@/components/sites/manasflow/service-landing";
type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return SERVICE_SOURCE_ROUTES.filter(route => route.startsWith("/agency/")).map(route => ({ slug: route.slice("/agency/".length).split("/") }));
}

export async function generateMetadata({ params }: Props) {
  const page = servicePageByRoute(`/agency/${(await params).slug.join("/")}`);
  return page ? servicePageMetadata(page.slug) : {};
}

export default async function AgencyPage({ params }: Props) {
  const page = servicePageByRoute(`/agency/${(await params).slug.join("/")}`);
  if (!page) notFound();
  return <ServiceLandingPage slug={page.slug} />;
}
