import type { Metadata } from "next";
import { ActionLink as Link } from "./booking-link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Bot, Check, Code2, GitBranch, Layers3, ShieldCheck, Workflow, X, Zap } from "lucide-react";
import pageData from "@/data/manasflow/service-pages.json";
import { pageMetadata } from "@/lib/metadata";
import { Badge, CallButton, Reveal } from "./shared";
import { ContactBooking } from "./company-pages";
import "./service-landing.css";

type ServiceCard = { title: string; body: string[]; items: string[] };
type ServiceFigure = { label: string; aspect: string; split: boolean; first: boolean; kind: string };
type ServiceSection = {
  title: string;
  body: string[];
  cards: ServiceCard[];
  items: string[];
  steps: string[];
  tables: { headers: string[]; rows: string[][] }[];
  links: { label: string; href: string }[];
  figures: ServiceFigure[];
  layout: string;
};
type ServicePage = {
  slug: string;
  sourceRoute: string;
  title: string;
  accent: string;
  description: string;
  badge: string;
  intro: string;
  note: string;
  centered: boolean;
  visualTitle: string;
  visualItems: string[];
  cta: string;
  sections: ServiceSection[];
  faqs: { question: string; answer: string }[];
};
const pages: ServicePage[] = pageData;

export const SERVICE_PAGE_ROUTES = pages.map(page => `/${page.slug}`);
export const SERVICE_SOURCE_ROUTES = pages.map(page => page.sourceRoute);

export function servicePageByRoute(route: string) {
  const normalized = route.replace(/\/$/, "");
  return pages.find(page => page.sourceRoute === normalized || `/${page.slug}` === normalized || `/services/${page.slug}` === normalized);
}

export function servicePageMetadata(slug: string, route = `/${slug}`): Metadata {
  const page = pages.find(page => page.slug === slug);
  if (!page) return {};
  return pageMetadata(page.title, `${page.description} Work with ManasFlow.`, route);
}

function HeroTitle({ page }: { page: ServicePage }) {
  const accentIndex = page.accent ? page.title.indexOf(page.accent) : -1;
  if (accentIndex < 0) return <>{page.title}</>;
  return <>{page.title.slice(0, accentIndex)}<span>{page.accent}</span>{page.title.slice(accentIndex + page.accent.length)}</>;
}

function HeroPanel({ page }: { page: ServicePage }) {
  const featureCards = page.sections.find(section => /^What (?:Our|We)|^Four (?:Parts|Ways)|^Built lean|^Roles we/i.test(section.title))?.cards;
  const features = page.visualItems.length ? page.visualItems : featureCards?.slice(0, 3).map(card => card.title) || ["Architecture built around your workflow", "Production integrations and guardrails", "Documentation, handover, and ongoing support"];
  return <aside className="service-hero-panel" aria-label="What we build">
    <div className="service-panel-label">{page.visualTitle}</div>
    <div className="service-panel-features">{features.map(feature => <p key={feature}>{feature}</p>)}</div>
  </aside>;
}

function FeatureCards({ section }: { section: ServiceSection }) {
  const icons = [Workflow, ShieldCheck, GitBranch, Bot, Code2, Layers3];
  const isProcess = section.layout === "process";
  return <div className={`service-card-grid${isProcess ? " service-process-grid" : ""}${section.cards.length === 2 ? " service-two-cards" : ""}${section.cards.length === 4 ? " service-four-cards" : ""}`}>
    {section.cards.map((card, index) => {
      const Icon = icons[index % icons.length];
      return <article className="service-feature-card" key={`${card.title}-${index}`}>
        {isProcess ? <span className="service-step-number">{"// "}{String(index + 1).padStart(2, "0")}</span> : <Icon className="service-feature-icon" size={28} strokeWidth={1.5} aria-hidden="true" />}
        <h3>{card.title}</h3>
        {card.body.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)}
        {card.items.length > 0 && <ul>{card.items.map((item, index) => <li key={`${item}-${index}`}><Check size={16} aria-hidden="true" /><span>{item}</span></li>)}</ul>}
      </article>;
    })}
  </div>;
}

function ServiceDiagram({ figure, section, page }: { figure: ServiceFigure; section: ServiceSection; page: ServicePage }) {
  const buildCards = page.sections.find(item => /What (?:Our|We)|Four (?:Parts|Ways)|Roles we/i.test(item.title))?.cards;
  const cards = section.cards.length ? section.cards : buildCards?.length ? buildCards : page.sections.find(item => item.cards.length >= 3)?.cards || [];
  const labels = cards.length ? cards.slice(0, 4).map(item => item.title.replace(/^\d+\s*[-–]\s*/, "")) : page.visualItems.length ? page.visualItems.slice(0, 4) : ["Your data", "Tool integrations", "Human review", "Production workflow"];
  return <figure className={`service-diagram service-diagram-${figure.kind} service-diagram-${figure.aspect}`}>
    <div className="service-diagram-chrome" aria-hidden="true"><span><i /><i /><i /></span><span>ManasFlow / {figure.kind === "process" ? "Delivery map" : "System architecture"}</span><span><ShieldCheck size={11} /> YOUR SYSTEM</span></div>
    <div className="service-diagram-canvas" aria-hidden="true">
      {figure.kind === "problem" ? <><div className="service-diagram-before"><span className="service-diagram-label">Manual handoffs</span><div className="service-fragment"><Code2 size={18} /><span>Data</span><X size={12} /></div><div className="service-fragment"><GitBranch size={18} /><span>Tools</span><X size={12} /></div><div className="service-fragment"><Workflow size={18} /><span>Process</span><X size={12} /></div><svg viewBox="0 0 200 200" preserveAspectRatio="none"><path d="M30 30 L150 70 L60 120 L160 170 M50 170 L130 110 L70 70" /></svg></div><div className="service-diagram-after"><span className="service-diagram-label">Connected workflow</span><div className="service-diagram-hub"><Workflow size={25} /><strong>ManasFlow</strong><span>{page.badge}</span></div><div className="service-diagram-status"><Check size={13} /> Controlled. Connected. Documented.</div></div></> : figure.kind === "process" ? <><div className="service-process-rail" /><div className="service-diagram-process-nodes">{labels.map((label, index) => <div key={`${label}-${index}`}><span className="service-diagram-node-step">{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><span>{cards[index]?.body.at(-1) || "Reviewable deliverable"}</span></div>)}</div><div className="service-diagram-status"><Check size={13} /> Your code. Your data. Your infrastructure.</div></> : <><svg className="service-diagram-connectors" viewBox="0 0 1000 560" preserveAspectRatio="none"><path d="M210 130 H360 V280 H500 M790 130 H640 V280 H500 M210 430 H360 V280 M790 430 H640 V280" /><circle cx="360" cy="280" r="6" /><circle cx="640" cy="280" r="6" /></svg><div className="service-diagram-hub"><Workflow size={28} /><strong>ManasFlow</strong><span>{page.badge}</span></div><div className="service-diagram-nodes">{labels.map((label, index) => <div className={`service-diagram-node service-diagram-node-${index + 1}`} key={`${label}-${index}`}><span><Code2 size={15} />{String(index + 1).padStart(2, "0")}<Check size={12} /></span><strong>{label}</strong></div>)}</div></>}
    </div>
    <figcaption>{figure.label}<span>MANASFLOW ENGINEERING</span></figcaption>
  </figure>;
}

function SourceSection({ section, index, page }: { section: ServiceSection; index: number; page: ServicePage }) {
  const hasContent = section.cards.length > 0 || section.tables.length > 0 || section.items.length > 0 || section.steps.length > 0;
  const figure = section.figures[0];
  return <section className={`service-content-section${!hasContent ? " service-prose-section" : ""}`} id={`section-${index + 1}`}>
    <div className={`mf-container${figure?.split ? ` service-media-layout${figure.first ? " service-media-first" : ""}` : ""}`}>
      <div className="service-section-copy">
      <Reveal className="service-section-heading"><h2>{section.title}</h2>{section.body.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)}</Reveal>
      {section.cards.length > 0 && <Reveal><FeatureCards section={section} /></Reveal>}
      {section.steps.length > 0 && <ol className="service-step-list">{section.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol>}
      {section.items.length > 0 && <ul className="service-checklist">{section.items.map((item, index) => <li key={`${item}-${index}`}><Check size={18} aria-hidden="true" /><span>{item}</span></li>)}</ul>}
      {section.tables.map((table, index) => <div className="service-table-scroll" key={index}><table><thead><tr>{table.headers.map((header, index) => <th scope="col" key={`${header}-${index}`}>{header}</th>)}</tr></thead><tbody>{table.rows.map((row, index) => <tr key={index}>{row.map((cell, index) => index === 0 ? <th key={index} scope="row">{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>)}
      {section.links.length > 0 && <nav className="service-section-links" aria-label={`${section.title} resources`}>{section.links.map((link, index) => <Link href={link.href} key={`${link.href}-${index}`}>{link.label}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}</nav>}
      </div>
      {figure && <Reveal className={`service-section-figure${figure.split ? " service-section-figure-split" : ""}`}><ServiceDiagram figure={figure} section={section} page={page} /></Reveal>}
    </div>
  </section>;
}

function RelatedServices({ page }: { page: ServicePage }) {
  const agency = page.sourceRoute.startsWith("/agency/");
  const related = pages.filter(candidate => candidate.slug !== page.slug && candidate.sourceRoute.startsWith(agency ? "/agency/" : "/services/")).slice(0, 6);
  return <section className="service-related"><div className="mf-container"><p className="service-overline">Build the complete system</p><h2>Recommended services</h2><div>{related.map(item => <Link key={item.slug} href={`/${item.slug}`}><span>{item.badge}</span><ArrowUpRight size={19} aria-hidden="true" /></Link>)}</div></div></section>;
}

export function ServiceLandingPage({ slug }: { slug: string }) {
  const page = pages.find(page => page.slug === slug);
  if (!page) notFound();
  return <div className="mf-service-page">
    <section className={`service-hero${page.centered ? " service-hero-centered" : ""}`}>
      <div className="service-hero-background" aria-hidden="true" />
      <div className="mf-container service-hero-grid">
        <div className="service-hero-copy"><Badge>{page.badge}</Badge><h1><HeroTitle page={page} /></h1><p className="service-hero-description">{page.intro}</p><div className="service-hero-actions"><CallButton href={`/contact?service=${encodeURIComponent(page.badge)}`}>{page.cta}</CallButton><Link href="#service-details">Explore the service<ArrowRight size={16} aria-hidden="true" /></Link></div><p className="service-hero-note">{page.note}</p></div>
        {!page.centered && <HeroPanel page={page} />}
      </div>
    </section>
    <div className="service-principles" id="service-details"><div className="mf-container"><span><Code2 size={18} /> Your code. Your infrastructure.</span><span><ShieldCheck size={18} /> Production guardrails.</span><span><Workflow size={18} /> Built around your workflow.</span><span><Zap size={18} /> One accountable engineering team.</span></div></div>
    {page.sections.map((section, index) => <SourceSection key={`${section.title}-${index}`} section={section} index={index} page={page} />)}
    <ContactBooking />
    <RelatedServices page={page} />
    {page.faqs.length > 0 && <section className="service-faq"><div className="mf-container"><div className="service-faq-heading"><p className="service-overline">Before we build</p><h2>{page.badge} questions</h2><p>Practical answers about scope, delivery, ownership, and working with ManasFlow.</p></div><div className="service-faq-list">{page.faqs.map((faq, index) => <details key={`${faq.question}-${index}`} name={`faq-${page.slug}`} open={index === 0}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></div></section>}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Service", name: page.badge, description: page.description, provider: { "@type": "Organization", name: "ManasFlow", url: "https://manasflow.com" }, url: `https://manasflow.com/${page.slug}` }).replace(/</g, "\\u003c") }} />
  </div>;
}
