import contentData from "@/data/manasflow/seo-content.json";
import services from "@/data/manasflow/service-pages.json";
import ecosystem from "@/data/manasflow/ecosystem-catalogs.json";
import company from "@/data/manasflow/company-pages.json";
import supplemental from "@/data/manasflow/supplemental-pages.json";
import models from "@/data/manasflow/models.json";
import homeFaqs from "@/data/manasflow/home-faqs.json";
import skillsFaqs from "@/data/manasflow/skills-faqs.json";
import { PRODUCT_PAGES } from "@/data/manasflow/products";
import { productLinks } from "@/data/manasflow/navigation";
import hubs from "@/data/manasflow/hub-metadata.json";
import { getInteractiveTool } from "./interactive-tool-data";
import { canonicalRoute, NOINDEX_ROUTES } from "./seo-routes";
import { site } from "./site";
import { WHATSAPP_PHONE, WHATSAPP_PROFILE_URL } from "./contact";

export type SeoContent = {
  title: string; description: string; source: string; seoTitle?: string; seoDescription?: string;
  modified?: string; firstRecorded?: string; published?: string; image?: string;
  faqs?: { question: string; answer: string }[];
  author?: string;
};
export type Breadcrumb = { name: string; route: string };
type JsonValue = string | number | boolean | JsonValue[] | { [key: string]: JsonValue };
export type SchemaNode = { [key: string]: JsonValue };
export const seoContent: Record<string, SeoContent> = contentData;
export const absoluteUrl = (route: string) => new URL(canonicalRoute(route), site.url).href;
export const indexableRoutes = () => Object.keys(seoContent).filter(route => canonicalRoute(route) === route && !NOINDEX_ROUTES.has(route));
export function pageBreadcrumbs(route: string): Breadcrumb[] {
  route = canonicalRoute(route);
  if (route === "/") return [];
  const page = seoContent[route];
  if (!page) return [];
  let parent: Breadcrumb | undefined;
  if (services.some(page => `/${page.slug}` === route)) parent = { name: "Services", route: "/services" };
  else if (PRODUCT_PAGES.some(page => `/${page.slug}` === route)) parent = { name: "Platform", route: "/platform" };
  else if (route.includes("?page=") && !route.startsWith("/blog")) parent = { name: seoContent[route.split("?")[0]].title, route: route.split("?")[0] };
  else if (getInteractiveTool(route.slice(1)) || ["/directory", "/ai-model-comparison", "/ai-model-pricing-index"].includes(route)) parent = { name: "Free Tools", route: "/tools" };
  else if (route.startsWith("/ai-tools/")) parent = { name: "AI Tools", route: "/ai-tools" };
  else if (route.startsWith("/resources/")) parent = { name: "Playbooks", route: "/playbooks" };
  else if (route.startsWith("/blog?")) parent = { name: "Blog", route: "/blog" };
  else {
    const segment = route.split("/")[1];
    const labels: Record<string, string> = { blog: "Blog", playbooks: "Playbooks", industries: "Industries", "case-studies": "Case Studies", models: "AI Model Comparison", "free-models": "Free AI Models Directory", "bot-directory": "Bot Directory", workflows: "Workflows", consultation: "Book a Call" };
    if (route.split("/").length > 2 && labels[segment]) parent = { name: labels[segment], route: canonicalRoute(`/${segment}`) };
    else if (route.startsWith("/workshops/") || route.startsWith("/fr/")) parent = { name: "Services", route: "/services" };
  }
  // Existing directory breadcrumbs use the category label without the heading's "Best" prefix.
  const category = ecosystem.categories.find(item => `/ai-tools/category/${item.slug}` === route);
  return [{ name: "Home", route: "/" }, ...(parent ? [parent] : []), { name: category?.title || page.title, route }];
}

export function pageFaqs(route: string): { question: string; answer: string }[] {
  route = route.split("?")[0];
  if (route === "/") return homeFaqs;
  if (route === "/skills") return skillsFaqs;
  const service = services.find(page => `/${page.slug}` === route);
  if (service) return service.faqs;
  const product = PRODUCT_PAGES.find(page => `/${page.slug}` === route);
  if (product) return product.faqs;
  const tool = getInteractiveTool(route.slice(1));
  if (tool) return tool.faqs;
  const supplement = supplemental.find(page => page.route === route);
  if (supplement) return supplement.faqs;
  const workflow = ecosystem.workflowDetails.find(page => page.route === route);
  if (workflow) return workflow.faqs;
  if (route === "/faq") return company.faqGroups.flatMap(group => group.items);
  if (route === "/services") return company.serviceFaqs;
  if (route === "/contact") return company.contactFaqs;
  if (route === "/directory") return models.faqs["free-models"];
  if (route === "/ai-model-pricing-index") return models.faqs["models--pricing"];
  if (route === "/ai-model-comparison") return models.faqs.models.map((faq, index) => index === 2 ? { ...faq, answer: "Select up to three models with the Compare checkboxes, then open the shortlist table. Adjust monthly input and output volumes to calculate the cost of the same workload across all selected models." } : faq);
  return seoContent[route]?.faqs || [];
}

const organizationId = `${site.url}/#organization`;
// These are the existing hero strings. Rendered validation guards against drift
// without changing the model directory's header or visible content.
const modelApplications: Record<string, { name: string; description: string }> = {
  "/directory": { name: "Free AI Models", description: "Explore free API tiers, open-weight models, and no-signup tools. Filter by provider, modality, and access to find the right starting point." },
  "/ai-model-comparison": { name: "AI Model Comparison", description: "Compare model context windows, published API prices, and workloads. Shortlist up to three models and review them side by side." },
  "/ai-model-pricing-index": { name: "AI Model Pricing Index", description: "Published input and output pricing in one place. Estimate your monthly token costs and compare providers for your actual workload." },
};
export function pageGraph(route: string) {
  route = canonicalRoute(route);
  const page = seoContent[route];
  if (!page) throw new Error(`Missing SEO record: ${route}`);
  const url = absoluteUrl(route);
  const crumbs = pageBreadcrumbs(route);
  const pageId = `${url}#webpage`;
  const graph: SchemaNode[] = [
    { "@type": "Organization", "@id": organizationId, name: site.name, url: site.url, logo: `${site.url}/logo.svg`, email: site.email,
      telephone: WHATSAPP_PHONE, sameAs: [WHATSAPP_PROFILE_URL],
      contactPoint: [{ "@type": "ContactPoint", contactType: "project enquiries", telephone: WHATSAPP_PHONE, url: WHATSAPP_PROFILE_URL }],
      description: site.description, knowsAbout: ["AI Automation", "n8n", "Claude Code", "LLM Agents", "SaaS Engineering"] },
    { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name, alternateName: "manasflow.com", publisher: { "@id": organizationId } },
    ...Object.entries(hubs).flatMap(([href, hub]) => "label" in hub ? [{ "@type": "SiteNavigationElement", "@id": `${site.url}/#nav-${href.slice(1)}`, name: hub.label, url: absoluteUrl(href), isPartOf: { "@id": `${site.url}/#website` } }] : []),
    { "@type": "WebPage", "@id": pageId, url, name: page.title, description: page.description, isPartOf: { "@id": `${site.url}/#website` }, publisher: { "@id": organizationId },
      ...(crumbs.length ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
      ...(page.modified ? { dateModified: page.modified } : {}) },
  ];
  if (crumbs.length) graph.push({ "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: crumbs.map((crumb, i) => ({ "@type": "ListItem", position: i + 1, name: crumb.name, item: absoluteUrl(crumb.route) })) });
  const service = services.find(page => `/${page.slug}` === route);
  if (service) graph.push({ "@type": "Service", "@id": `${url}#service`, url, name: service.badge, description: service.intro, serviceType: service.badge, areaServed: "Worldwide", provider: { "@id": organizationId }, mainEntityOfPage: { "@id": pageId } });
  const product = PRODUCT_PAGES.find(page => `/${page.slug}` === route);
  const interactiveTool = getInteractiveTool(route.slice(1));
  const modelApplication = modelApplications[route.split("?")[0]];
  if (product || interactiveTool || modelApplication) {
    const applicationUrl = modelApplication ? absoluteUrl(route.split("?")[0]) : url;
    graph.push({ "@type": "WebApplication", "@id": `${applicationUrl}#application`, name: product?.name || interactiveTool?.title || modelApplication.name, url: applicationUrl, description: product?.description || interactiveTool?.description || modelApplication.description, applicationCategory: "BusinessApplication", operatingSystem: "Web", publisher: { "@id": organizationId }, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, mainEntityOfPage: { "@id": pageId } });
  }
  if (modelApplication) {
    const free = route.startsWith("/directory");
    const pricing = route.startsWith("/ai-model-pricing-index");
    const pageNumber = Number(new URL(url).searchParams.get("page") || 1);
    const entries = free
      ? [...models.freeModels].sort((a, b) => b.votes - a.votes).map(model => ({ name: model.name, route: `/free-models/${model.slug}` }))
      : [...models.models].sort((a, b) => pricing ? (a.inputPricePerMTok ?? Infinity) * 10 + (a.outputPricePerMTok ?? Infinity) * 2 - ((b.inputPricePerMTok ?? Infinity) * 10 + (b.outputPricePerMTok ?? Infinity) * 2) : b.releaseDate.localeCompare(a.releaseDate)).map(model => ({ name: model.name, route: `/models/${model.slug}` }));
    const visible = entries.slice((pageNumber - 1) * 12, pageNumber * 12);
    graph.push({ "@type": "ItemList", "@id": `${url}#models`, numberOfItems: visible.length, itemListElement: visible.map((model, index) => ({ "@type": "ListItem", position: index + 1, name: model.name, url: absoluteUrl(model.route) })) });
    const webpage = graph.find(node => node["@id"] === pageId);
    if (webpage) { webpage["@type"] = "CollectionPage"; webpage.mainEntity = { "@id": `${url}#models` }; webpage.hasPart = { "@id": `${absoluteUrl(route.split("?")[0])}#application` }; }
  }
  if (route === "/platform") {
    graph.push({ "@type": "ItemList", "@id": `${url}#products`, numberOfItems: productLinks.length, itemListElement: productLinks.map((link, index) => ({ "@type": "ListItem", position: index + 1, name: link.label, url: absoluteUrl(link.href) })) });
    const webpage = graph.find(node => node["@id"] === pageId);
    if (webpage) { webpage["@type"] = "CollectionPage"; webpage.name = "Our Platform"; webpage.mainEntity = { "@id": `${url}#products` }; }
  }
  const category = ecosystem.categories.find(item => `/ai-tools/category/${item.slug}` === route);
  if (route === "/ai-tools" || category) {
    const tools = category ? ecosystem.tools.filter(tool => tool.categories.includes(category.slug)) : ecosystem.tools;
    graph.push({ "@type": "ItemList", "@id": `${url}#tools`, numberOfItems: tools.length, itemListElement: tools.map((tool, i) => ({ "@type": "ListItem", position: i + 1, name: tool.name, url: absoluteUrl(tool.route) })) });
    const webpage = graph.find(node => node["@id"] === pageId);
    if (webpage) { webpage["@type"] = "CollectionPage"; webpage.mainEntity = { "@id": `${url}#tools` }; }
  }
  const directoryTool = ecosystem.tools.find(tool => tool.route === route);
  if (directoryTool) {
    const related = ecosystem.tools.filter(tool => tool.route !== route && tool.categories.some(value => directoryTool.categories.includes(value))).slice(0, 6);
    graph.push({ "@type": "SoftwareApplication", "@id": `${url}#tool`, name: directoryTool.name, description: directoryTool.description, ...(directoryTool.website ? { url: directoryTool.website } : {}), mainEntityOfPage: { "@id": pageId } });
    graph.push({ "@type": "ItemList", "@id": `${url}#related-tools`, numberOfItems: related.length, itemListElement: related.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.name, url: absoluteUrl(tool.route) })) });
    const webpage = graph.find(node => node["@id"] === pageId);
    if (webpage) { webpage["@type"] = "CollectionPage"; webpage.mainEntity = { "@id": `${url}#tool` }; webpage.hasPart = { "@id": `${url}#related-tools` }; }
  }
  if (/^\/(blog|playbooks|resources)\//.test(route) && page.source.includes("/details/")) {
    graph.push({ "@type": route.startsWith("/blog/") ? "Article" : "TechArticle", "@id": `${url}#article`, headline: page.title, description: page.description, url,
      author: page.author ? { "@type": "Person", name: page.author } : { "@id": organizationId }, publisher: { "@id": organizationId }, mainEntityOfPage: { "@id": pageId },
      ...(page.published ? { datePublished: page.published } : {}), ...(page.modified ? { dateModified: page.modified } : {}), ...(page.image ? { image: absoluteUrl(page.image) } : {}) });
  }
  const faqs = pageFaqs(route);
  if (faqs.length) graph.push({ "@type": "FAQPage", "@id": `${url}#faq`, isPartOf: { "@id": pageId }, mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) });
  return { "@context": "https://schema.org", "@graph": graph };
}
