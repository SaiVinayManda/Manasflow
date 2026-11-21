"use client";

import { ActionLink as Link } from "./booking-link";
import { useId, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, CheckCheck, ChevronDown, Code2, Copy, Download, Layers, Search, Sparkles, Workflow } from "lucide-react";
import { PRODUCT_PAGES } from "@/data/manasflow/products";
import type { ProductPageData, ProductResource } from "@/data/manasflow/products";
import { Badge, Reveal } from "./shared";
import "./product-landing.css";

function downloadBrief(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

function ResourceCard({ resource, productName }: { resource: ProductResource; productName: string }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const brief = `${resource.content}\n\nPrepared with ${productName} · ManasFlow\nhttps://manasflow.com\n`;
  async function copy() {
    try { await navigator.clipboard.writeText(brief); setCopied(true); setCopyFailed(false); }
    catch { setCopyFailed(true); }
  }
  return <article className="mf-product-resource">
    <div className="mf-product-resource-top"><span>{resource.category}</span><Code2 size={20} /></div>
    <h3>{resource.title}</h3><p>{resource.description}</p>
    <details><summary>Read the brief<ChevronDown size={15} /></summary><pre>{resource.content}</pre></details>
    <div className="mf-product-resource-actions">
      <button type="button" onClick={copy}>{copied ? <CheckCheck size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy"}</button>
      <button type="button" onClick={() => downloadBrief(`${productName}-${resource.title}`, brief)}><Download size={15} />Download</button>
      <Link href={resource.href} aria-label={`Explore ${resource.title}`}><ArrowUpRight size={17} /></Link>
    </div>
    {copyFailed && <small role="status" data-nosnippet="">Copy is unavailable in this browser. Use Download to save the brief.</small>}
  </article>;
}

function ResourceLibrary({ product }: { product: ProductPageData }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(product.resources.map(item => item.category))];
  const searchId = useId();
  const filtered = product.resources.filter(item => (category === "All" || item.category === category) && `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <div className="mf-product-library">
    <div className="mf-product-search"><Search size={19} /><label className="mf-sr-only" htmlFor={searchId}>Search {product.name} resources</label><input id={searchId} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by task, tool, or topic..." /><span aria-live="polite">{filtered.length} resources</span></div>
    <div className="mf-product-filters" aria-label="Resource categories">{categories.map(label => <button key={label} type="button" aria-pressed={category === label} onClick={() => setCategory(label)}>{label}</button>)}</div>
    <div className="mf-product-resources">{filtered.map(resource => <ResourceCard key={resource.title} resource={resource} productName={product.name} />)}</div>
    {filtered.length === 0 && <p className="mf-product-empty" role="status" data-nosnippet="">No resources match that search. Try a broader term or choose another category.</p>}
  </div>;
}

const rankChecks = [
  { title: "My key pages explain exactly who I help and what I deliver.", action: "Clarify the audience, service, and deliverable on each important page." },
  { title: "I answer real buyer questions in clear, direct language.", action: "Publish useful answers to the questions customers ask before a purchase." },
  { title: "My claims are supported by evidence and current sources.", action: "Add relevant examples, source links, and review dates to important claims." },
  { title: "My business identity and contact details are consistent.", action: "Align your business name, contact route, and service information across your site." },
  { title: "I maintain an agreed set of questions and a review baseline.", action: "Choose a representative query set and record observations over time." },
];

function RankWorkbench() {
  const [checked, setChecked] = useState<number[]>([]);
  const [company, setCompany] = useState("");
  const companyId = useId();
  const remaining = rankChecks.filter((_, index) => !checked.includes(index));
  const score = checked.length * 20;
  const brief = `# ManasRank content readiness brief\n\nBusiness: ${company.trim() || "My business"}\nSelf-assessed readiness: ${score}/100\n\n## Next actions\n${remaining.length ? remaining.map(item => `- ${item.action}`).join("\n") : "- Maintain your content and review observations regularly."}\n\nThis is a content self-assessment, not a live AI ranking measurement.\n\nPrepared with ManasFlow · https://manasflow.com\n`;
  return <div className="mf-product-workbench mf-rank-workbench">
    <div className="mf-rank-inputs"><p className="mf-product-eyebrow">CONTENT READINESS · SELF-ASSESSMENT</p><h3>How clear is your online footprint?</h3><label htmlFor={companyId}>Business or website <small>Optional</small></label><input id={companyId} value={company} onChange={event => setCompany(event.target.value)} placeholder="Your business or website" />
      <div className="mf-rank-checks">{rankChecks.map((item, index) => <label key={item.title}><input type="checkbox" checked={checked.includes(index)} onChange={event => setChecked(current => event.target.checked ? [...current, index] : current.filter(value => value !== index))} /><span>{item.title}</span></label>)}</div>
    </div>
    <div className="mf-rank-results" aria-live="polite"><span className="mf-product-eyebrow">YOUR STARTING POINT</span><strong>{score}<small>/100</small></strong><div className="mf-rank-meter" role="meter" aria-label="Self-assessed content readiness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}><span style={{ width: `${score}%` }} /></div><h3>{score < 40 ? "Build your foundations" : score < 80 ? "Strengthen the evidence" : "Keep measuring and improving"}</h3><p>Based on your answers. This checklist reviews content readiness.</p><ul>{remaining.slice(0, 3).map(item => <li key={item.action}><ArrowRight size={14} /><span>{item.action}</span></li>)}{remaining.length === 0 && <li><Check size={15} /><span>Foundations covered. Keep your sources current and review real query observations.</span></li>}</ul><button type="button" className="mf-product-action" onClick={() => downloadBrief("manasrank-readiness", brief)}>Download action plan<Download size={17} /></button></div>
  </div>;
}

function DesignWorkbench() {
  const [tone, setTone] = useState("Violet");
  const [density, setDensity] = useState("Comfortable");
  const brief = `# ManasDesign direction brief\n\nDirection: ${tone}\nDensity: ${density}\n\n## Foundations\n- A clear primary task on every screen.\n- A consistent spacing and typography scale.\n- Semantic colors with sufficient contrast.\n- Visible keyboard focus and descriptive labels.\n- Deliberate empty, loading, success, and error states.\n- Responsive layouts using real content.\n\nPrepared with ManasFlow · https://manasflow.com\n`;
  return <div className="mf-product-workbench mf-design-workbench">
    <div className="mf-design-controls"><p className="mf-product-eyebrow">EXPLORE A DIRECTION</p><h3>A small system. A clear identity.</h3><p>Compare color and density in a working interface preview.</p><fieldset><legend>Color direction</legend><div className="mf-design-options">{["Violet", "Teal", "Amber"].map(item => <button key={item} data-tone={item} type="button" aria-pressed={tone === item} onClick={() => setTone(item)}><i />{item}</button>)}</div></fieldset><fieldset><legend>Interface density</legend><div className="mf-design-options">{["Comfortable", "Compact"].map(item => <button key={item} type="button" aria-pressed={density === item} onClick={() => setDensity(item)}>{item}</button>)}</div></fieldset><button type="button" className="mf-product-action" onClick={() => downloadBrief("manasdesign-direction", brief)}>Download design brief<Download size={17} /></button></div>
    <div className="mf-design-preview" data-tone={tone} data-density={density} aria-label={`${tone}, ${density.toLowerCase()} interface preview`}><div className="mf-design-preview-bar"><span><Layers size={16} />Flowboard</span><span>Workspace <ChevronDown size={13} /></span></div><div className="mf-design-preview-content"><span className="mf-design-preview-badge">YOUR WORK, CONNECTED</span><h4>A clearer view<br />of what comes next.</h4><p>Bring your team&apos;s projects, knowledge, and next actions together.</p><div className="mf-design-preview-stats"><div><small>Active projects</small><strong>12</strong></div><div><small>Tasks completed</small><strong>86</strong></div></div><div className="mf-design-preview-task"><span><Check size={13} /></span><div><strong>Review the product brief</strong><small>Design system · Ready for review</small></div><ArrowUpRight size={16} /></div><div className="mf-design-preview-button">Continue your work<ArrowRight size={15} /></div><small className="mf-design-example-note">Illustrative interface preview</small></div></div>
  </div>;
}

function FrameworkWorkbench({ product }: { product: ProductPageData }) {
  const [stage, setStage] = useState(0);
  const current = product.resources[stage];
  return <div className="mf-framework-workbench"><div className="mf-framework-stages" aria-label="Development stages">{product.resources.map((resource, index) => <button type="button" key={resource.title} aria-pressed={stage === index} onClick={() => setStage(index)}><span>{resource.category}</span>{resource.title}<ArrowRight size={16} /></button>)}</div><div className="mf-framework-stage"><div><p className="mf-product-eyebrow">STAGE {current.category}</p><h3>{current.title} with a clear outcome.</h3><p>{current.description}</p><Link href={current.href}>Explore the related service<ArrowUpRight size={15} /></Link></div><ResourceCard resource={current} productName={product.name} /></div></div>;
}

export function ProductLandingPage({ slug }: { slug: string }) {
  const product = PRODUCT_PAGES.find(item => item.slug === slug);
  if (!product) return null;
  const Icon = product.kind === "rank" ? Search : product.kind === "design" ? Layers : product.kind === "framework" ? Workflow : Code2;
  return <article className={`mf-product-page mf-product-${product.kind}`}>
    <header className="mf-product-hero"><div className="mf-product-hero-grid" aria-hidden="true" /><div className="mf-container"><Reveal><Badge>{product.eyebrow}</Badge><div className="mf-product-name"><Icon size={21} /><span>{product.name}</span><small>by ManasFlow</small></div><h1>{product.title}<span>{product.accent}</span></h1><p>{product.description}</p><div className="mf-product-hero-actions"><a href="#product-workspace" className="mf-button">{product.kind === "rank" ? "Review your readiness" : product.kind === "design" ? "Explore a direction" : product.kind === "framework" ? "Explore the framework" : "Explore the library"}<ArrowDown size={18} /></a><Link href="/contact" className="mf-button mf-button-secondary">Build with ManasFlow<ArrowUpRight size={18} /></Link></div><div className="mf-product-assurance"><span><Check size={13} />Free local resources</span><span><Check size={13} />No account needed</span><span><Check size={13} />Your tools, your project</span></div></Reveal></div></header>
    <section className="mf-product-feature-section mf-container"><div className="mf-product-feature-grid">{product.features.map((feature, index) => <Reveal key={feature.title}><article><span>0{index + 1}</span><h2>{feature.title}</h2><p>{feature.description}</p></article></Reveal>)}</div></section>
    <section id="product-workspace" className="mf-product-workspace mf-container"><Reveal><div className="mf-product-section-heading"><span className="mf-product-eyebrow">{product.name.toUpperCase()} · WORKSPACE</span><h2>{product.kind === "rank" ? "Start with your content." : product.kind === "design" ? "Make the direction tangible." : product.kind === "framework" ? "One cycle. Five clear stages." : "A starting point for your next build."}</h2><p>{product.kind === "library" ? "Find a useful pattern, read the brief, and save it for your project." : "Explore the options below and take a practical brief into your next project."}</p></div></Reveal>
      {product.kind === "rank" && <RankWorkbench />}{product.kind === "design" && <DesignWorkbench />}{product.kind === "framework" && <FrameworkWorkbench product={product} />}{product.kind === "library" && <ResourceLibrary product={product} />}
      {(product.kind === "rank" || product.kind === "design") && <div className="mf-product-supporting-resources"><h3>Keep building your foundations</h3><ResourceLibrary product={product} /></div>}
    </section>
    <section className="mf-product-faq mf-container"><div><Badge>Questions, answered</Badge><h2>Before you<br /><span>get started.</span></h2><p>More questions about adapting these resources to your business?</p><Link href="/contact">Talk to ManasFlow<ArrowUpRight size={17} /></Link></div><div className="mf-product-faq-items">{product.faqs.map(faq => <details key={faq.question}><summary>{faq.question}<ChevronDown size={18} /></summary><p>{faq.answer}</p></details>)}</div></section>
    <section className="mf-product-callout"><div className="mf-container"><Sparkles size={28} /><span className="mf-product-eyebrow">FROM A STARTING POINT TO A WORKING SYSTEM</span><h2>Make it work<br /><span>for your business.</span></h2><p>Bring the task, the tools, and the result you need. We will help you scope the next step.</p><Link href="/consultation" className="mf-button">Book a free strategy call<ArrowUpRight size={19} /></Link></div></section>
  </article>;
}
