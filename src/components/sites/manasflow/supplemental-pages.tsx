import type { Metadata } from "next";
import { ActionLink as Link } from "./booking-link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Bot, Check, ChevronDown, Code2, GitBranch, GraduationCap, Layers3, ShieldCheck, Workflow } from "lucide-react";
import rawPages from "@/data/manasflow/supplemental-pages.json";
import { pageMetadata } from "@/lib/metadata";
import { ContactBooking } from "./company-pages";
import { Badge, CallButton, Reveal } from "./shared";
import { StarterInstructions, SupplementalExamples } from "./supplemental-examples";
import type { SupplementalExample } from "./supplemental-examples";
import "./supplemental-pages.css";

type SupplementalCard = { title: string; body: string[]; items: string[]; links: { label: string; href: string }[] };
type SupplementalSection = { title: string; body: string[]; cards: SupplementalCard[]; items: string[]; tables: { headers: string[]; rows: string[][] }[]; code: string[]; links: { label: string; href: string }[]; numbered: boolean };
type SupplementalData = { route: string; kind: string; title: string; description: string; sections: SupplementalSection[]; faqs: { question: string; answer: string }[]; heroCards: { title: string; body: string; items: string[] }[]; examples: SupplementalExample[]; language: string };
const pages: SupplementalData[] = rawPages;

export const SUPPLEMENTAL_ROUTES = pages.map(page => page.route);
export function supplementalPageByRoute(route: string) { return pages.find(page => page.route === route.replace(/\/$/, "")); }
export function supplementalPageMetadata(route: string): Metadata {
  const page = supplementalPageByRoute(route);
  return page ? pageMetadata(page.title, page.description, page.route) : {};
}

function EngineeringPanel() {
  return <aside className="supp-engineering-panel"><div><span /><span /><span /><p>manasflow / engineering</p></div><section><Code2 size={28} /><p>One accountable engineer</p><strong>Your team.<br />A coordinated agent fleet.</strong><div className="supp-agent-flow">{[{ Icon: Bot, label: "Build" }, { Icon: ShieldCheck, label: "Review" }, { Icon: GitBranch, label: "Ship" }].map(({ Icon, label }) => <div key={label}><Icon size={22} /><span>{label}</span></div>)}</div><p className="supp-panel-footer">Your repository · Your infrastructure · Your roadmap</p></section></aside>;
}

function WorkshopPanel({ page }: { page: SupplementalData }) {
  const capabilities = page.sections.find(section => /Master These/.test(section.title));
  return <aside className="supp-workshop-panel"><span className="supp-workshop-label"><GraduationCap size={16} />Hands-on workshop</span><h2>Learn it.<br /><span>Build it. Use it.</span></h2><div>{capabilities?.items.map(item => <p key={item}><Check size={17} />{item}</p>)}</div><div className="supp-workshop-foot"><span>Full day</span><span>Hands-on</span><span>Your team’s workflows</span></div></aside>;
}

function PageSection({ section, index, kind }: { section: SupplementalSection; index: number; kind: string }) {
  if (section.title === "Generate a starter CLAUDE.md and AGENTS.md") return <StarterInstructions />;
  const philosophy = kind === "philosophy" && index < 5;
  const icons = [Workflow, Code2, Bot, GitBranch, Layers3, ShieldCheck];
  return <section className={`supp-content-section${philosophy ? " supp-principle" : ""}${section.numbered ? " supp-numbered-section" : ""}`} id={`page-section-${index + 1}`}><div className="supp-section-inner"><Reveal><header className="supp-section-heading">{philosophy && <p className="supp-overline">Principle {index + 1}</p>}<h2>{section.title}</h2>{section.body.map((paragraph, paragraphIndex) => <p key={`${paragraph}-${paragraphIndex}`}>{paragraph}</p>)}</header></Reveal>{section.cards.length > 0 && <div className={`supp-card-grid${section.cards.length === 2 ? " supp-two-cards" : ""}${section.numbered ? " supp-process-grid" : ""}`}>{section.cards.map((card, cardIndex) => { const Icon = icons[cardIndex % icons.length]; return <article key={`${card.title}-${cardIndex}`} className="supp-content-card">{section.numbered ? <span className="supp-card-number">{String(cardIndex + 1).padStart(2, "0")}</span> : <Icon className="supp-card-icon" size={26} />}<h3>{card.title}</h3>{card.body.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)}{card.items.length > 0 && <ul>{card.items.map((item, index) => <li key={`${item}-${index}`}><Check size={15} />{item}</li>)}</ul>}{card.links.map((link, index) => <Link href={link.href} key={`${link.href}-${index}`}>{link.label}<ArrowUpRight size={14} /></Link>)}</article>; })}</div>}{section.items.length > 0 && <ul className="supp-feature-list">{section.items.map((item, index) => <li key={`${item}-${index}`}><Check size={18} /><span>{item}</span></li>)}</ul>}{section.tables.map((table, index) => <div className="supp-table-wrap" key={index}><table><thead><tr>{table.headers.map((cell, index) => <th key={`${cell}-${index}`}>{cell}</th>)}</tr></thead><tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, index) => <td key={`${cell}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div>)}{section.code.map((code, index) => <pre key={index} className="supp-static-code" tabIndex={0}><code>{code}</code></pre>)}{section.links.length > 0 && <div className="supp-section-links">{section.links.map((link, index) => <Link href={link.href} key={`${link.href}-${index}`}>{link.label}<ArrowUpRight size={14} /></Link>)}</div>}</div></section>;
}

export function SupplementalPage({ route }: { route: string }) {
  const page = supplementalPageByRoute(route);
  if (!page) notFound();
  const french = page.language === "fr";
  const library = page.kind === "examples";
  const split = ["offer", "workshop", "french"].includes(page.kind);
  const badge = french ? "Ingénierie & automatisation IA" : page.kind === "offer" ? "Dedicated AI engineering" : page.kind === "workshop" ? "Corporate AI training" : page.kind === "consultation" ? "A practical working session" : page.kind === "philosophy" ? "The way we work" : "Public examples & reference material";
  return <article className={`mf-supplemental supp-${page.kind}${library ? " supp-wide" : ""}`} lang={page.language}><header className={`supp-hero${split ? " supp-split-hero" : ""}`}><div className="supp-hero-inner"><div><Badge>{badge}</Badge><h1>{page.title}</h1><p>{page.description}</p>{!library && <div className="supp-hero-actions"><CallButton href="#supp-booking">{french ? "Parlons de votre projet" : page.kind === "workshop" ? "Plan a workshop" : page.kind === "philosophy" ? "Build with us" : "Talk through your roadmap"}</CallButton><a href={page.kind === "consultation" ? "#supp-faq" : "#supp-content"}>{french ? "Découvrir notre approche" : "Explore the approach"}<ArrowRight size={16} /></a></div>}{library && <p className="supp-library-intro">{page.examples.length} references in this local collection · Source links and attribution retained · Search and filtering run in your browser</p>}</div>{split && (page.kind === "workshop" ? <WorkshopPanel page={page} /> : <EngineeringPanel />)}</div></header>{page.kind === "consultation" && <div className="supp-consultation-benefits"><div><Workflow /><h2>A free 30-minute strategy call</h2><p>Walk through the work your team does today and where AI agents or automation may help.</p></div><div><GitBranch /><h2>A scoped automation roadmap</h2><p>Discuss the systems, constraints, and priorities behind a useful first implementation.</p></div><div><Check /><h2>A clear next step</h2><p>Review the options and decide whether working together fits your team’s goals.</p></div></div>}<div id="supp-content">{library && <SupplementalExamples route={page.route} entries={page.examples} />}{page.sections.map((section, index) => <PageSection section={section} index={index} kind={page.kind} key={`${section.title}-${index}`} />)}</div>{!library && <div id="supp-booking" className="supp-booking"><ContactBooking /></div>}{page.faqs.length > 0 && <section className="supp-faq" id="supp-faq"><div><p className="supp-overline">{french ? "Avant de commencer" : "Before you start"}</p><h2>{french ? "Questions fréquentes" : "Questions and practical answers"}</h2><div>{page.faqs.map((faq, index) => <details key={`${faq.question}-${index}`}><summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}<ChevronDown size={19} /></summary><p>{faq.answer}</p></details>)}</div></div></section>}<section className="supp-closing"><div><p className="supp-overline">ManasFlow</p><h2>{french ? "Transformons votre prochain workflow." : library ? "Turn a useful example into a working system." : "Build around the way your team works."}</h2><p>{french ? "Discutons de votre stack, de vos processus et du prochain chantier utile." : "Bring your workflow, stack, and constraints. We’ll work through the next practical step together."}</p><CallButton href="/contact">{french ? "Nous contacter" : "Talk to ManasFlow"}</CallButton></div></section></article>;
}
