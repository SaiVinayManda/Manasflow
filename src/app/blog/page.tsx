import { PageSeo } from "@/components/seo/page-seo";
import type { Metadata } from "next";
import { BlogCatalog } from "@/components/sites/manasflow/catalogs";
import catalogData from "@/data/manasflow/catalogs.json";
import { hubMetadata, pageMetadata } from "@/lib/metadata";

type BlogPageProps = { searchParams: Promise<{ page?: string | string[] }> };
const pageNumber = (input?: string | string[]) =>
  Math.min(
    catalogData.blog.totalPages,
    Math.max(
      1,
      Number.parseInt(Array.isArray(input) ? input[0] : input || "1", 10) || 1,
    ),
  );

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const page = pageNumber((await searchParams).page);
  if (page === 1) return hubMetadata("/blog");
  return pageMetadata(
      page > 1
        ? `AI Automation Blog — Page ${page}`
        : "AI Automation & n8n Workflow Blog",
      "Insights, tutorials and practical guides on AI automation, n8n workflows and intelligent agents from the ManasFlow team.",
      page > 1 ? `/blog?page=${page}` : "/blog",
  );
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = pageNumber((await searchParams).page);
  const pages: Record<string, (typeof catalogData.blog.pages)["1"]> =
    catalogData.blog.pages;
  return <PageSeo route={page > 1 ? `/blog?page=${page}` : "/blog"}>{(
    <BlogCatalog
      featured={catalogData.blog.featured}
      cards={pages[String(page)] || []}
      page={page}
      totalPages={catalogData.blog.totalPages}
    />
  )}</PageSeo>;
}
