"use client";

import skillsFaqs from "@/data/manasflow/skills-faqs.json";

import { ActionLink as Link } from "./booking-link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Bot, Check, ChevronDown, ChevronRight, ExternalLink, Layers, Search, Workflow } from "lucide-react";
import catalogs from "@/data/manasflow/ecosystem-catalogs.json";
import { Badge, SiteImage } from "./shared";
import { Newsletter } from "./chrome";
import "./catalog-explorer.css";

type Category = (typeof catalogs.categories)[number];
type Tool = (typeof catalogs.tools)[number];
type BotTemplate = (typeof catalogs.bots)[number];

function useSearchShortcut() {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const focus = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); input.current?.focus(); } };
    document.addEventListener("keydown", focus);
    return () => document.removeEventListener("keydown", focus);
  }, []);
  return input;
}

function Breadcrumb({ parent, parentHref, title }: { parent: string; parentHref: string; title: string }) {
  return <nav className="mf-ecosystem-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight size={12} /><Link href={parentHref}>{parent}</Link><ChevronRight size={12} /><span>{title}</span></nav>;
}

function CatalogCallout({ label = "Want this working in your business?" }: { label?: string }) {
  return <section className="mf-ecosystem-callout"><div><p className="mf-ecosystem-kicker">FROM A PATTERN TO YOUR SYSTEM</p><h2>{label}</h2><p>Bring your tools, data, and operating requirements. ManasFlow can help you scope the implementation around the way your business works.</p></div><Link href="/consultation">Talk to an engineer<ArrowUpRight size={18} /></Link></section>;
}

function ToolCard({ tool, headingLevel = 3 }: { tool: Tool; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return <article className="mf-ecosystem-tool-card"><div className="mf-ecosystem-tool-icon">{tool.logo ? <SiteImage name={tool.logo} alt={`${tool.name} logo`} /> : <span aria-hidden="true">{tool.name.slice(0, 1).toUpperCase()}</span>}</div><div><Heading className="mf-tool-card-title"><Link href={tool.route}>{tool.name}</Link></Heading><p>{tool.description}</p><div className="mf-ecosystem-tool-actions"><Link href={tool.route}>Details<ArrowRight size={12} /></Link>{tool.website && <a href={tool.website} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} />{tool.domain}</a>}</div></div></article>;
}

function CategoryNote({ category }: { category: Category }) {
  if (!category.limitations.length) return null;
  return <aside className="mf-ecosystem-category-note"><p>Where a point solution breaks</p><ul>{category.limitations.map(item => <li key={item}>{item}</li>)}</ul>{category.solution && <div>{category.solution}</div>}<Link href="/consultation">Talk to an embedded engineer<ArrowUpRight size={13} /></Link></aside>;
}

function AiToolsDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const search = useSearchShortcut();
  const searchTerm = query.toLowerCase().trim();
  const filtered = catalogs.tools.filter(tool => (category === "all" || tool.categories.includes(category)) && `${tool.name} ${tool.description} ${tool.domain}`.toLowerCase().includes(searchTerm));
  const groups = catalogs.categories.filter(item => (category === "all" || category === item.slug) && filtered.some(tool => tool.categories.includes(item.slug)));
  return <div className="mf-ecosystem-page"><header className="mf-ecosystem-directory-hero"><div className="mf-container"><Badge>Curated for your next build</Badge><p className="mf-ecosystem-kicker">MANASFLOW · TOOLS BY BUSINESS FUNCTION</p><h1>The <em>AI Tools Directory</em><br />for every function<br className="mf-ecosystem-mobile-break" /> in your business.</h1><p>{catalogs.tools.length} AI tools across sales, marketing, content, design, video, coding, data, support, HR, finance, productivity, automation, SEO, and voice. Search the catalog and explore where each tool fits.</p><div className="mf-ecosystem-hero-actions"><Link href="/consultation">Talk to an embedded AI engineer<ArrowRight size={17} /></Link><Link href="/case-studies">See implementation patterns<ArrowUpRight size={17} /></Link></div><div className="mf-ecosystem-stats"><div><strong>{catalogs.tools.length}</strong><span>Tools in the catalog</span></div><div><strong>{catalogs.categories.length}</strong><span>Categories covered</span></div><div><strong>{catalogs.categories.filter(item => item.limitations.length).length}</strong><span>Build-vs-buy notes</span></div></div></div></header>
    <div className="mf-container"><div className="mf-ecosystem-toolbar"><div className="mf-ecosystem-search"><Search size={19} /><input ref={search} type="search" aria-label="Search AI tools" placeholder="Search tools, tasks, or providers..." value={query} onChange={event => setQuery(event.target.value)} /><kbd>Ctrl K</kbd></div><select aria-label="Filter AI tools by category" value={category} onChange={event => setCategory(event.target.value)}><option value="all">All categories</option>{catalogs.categories.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select><span aria-live="polite">{filtered.length} tools</span></div><nav className="mf-ecosystem-category-nav" aria-label="AI tool categories">{catalogs.categories.map(item => <Link key={item.slug} href={`/ai-tools/category/${item.slug}`}>{item.title.replace(/^AI /, "").replace(/ Tools$/, "")}</Link>)}</nav>
      <div className="mf-ecosystem-tool-groups">{groups.map(item => <section key={item.slug} className="mf-ecosystem-tool-group" id={`category-${item.slug}`}><header><h2>{item.title}</h2><p>{item.description}</p><Link href={`/ai-tools/category/${item.slug}`}>View the full category<ArrowRight size={13} /></Link></header>{!searchTerm && <CategoryNote category={item} />}<div className="mf-ecosystem-tool-grid">{filtered.filter(tool => tool.categories.includes(item.slug)).map(tool => <ToolCard key={tool.route} tool={tool} />)}</div></section>)}</div>
      {filtered.length === 0 && <EmptyResults reset={() => { setQuery(""); setCategory("all"); }} />}<CatalogCallout label="When the tool needs to become a system." />
    </div></div>;
}

function ToolCategory({ category }: { category: Category }) {
  const [query, setQuery] = useState("");
  const tools = catalogs.tools.filter(tool => tool.categories.includes(category.slug) && `${tool.name} ${tool.description}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <article className="mf-ecosystem-page"><header className="mf-ecosystem-detail-hero"><div className="mf-container"><Breadcrumb parent="AI Tools" parentHref="/ai-tools" title={category.title} /><h1>Best {category.title}</h1><p>{category.description}</p><span className="mf-ecosystem-kicker">{category.tools.length} TOOLS · MANASFLOW DIRECTORY</span></div></header><div className="mf-container mf-ecosystem-detail-content"><CategoryNote category={category} /><div className="mf-ecosystem-search mf-ecosystem-category-search"><Search size={18} /><input aria-label={`Search ${category.title}`} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search ${category.title.toLowerCase()}...`} /><span aria-live="polite">{tools.length} results</span></div><div className="mf-ecosystem-tool-grid">{tools.map(tool => <ToolCard key={tool.route} tool={tool} headingLevel={2} />)}</div>{tools.length === 0 && <EmptyResults reset={() => setQuery("")} />}<CatalogCallout /><Link className="mf-ecosystem-back" href="/ai-tools"><ArrowLeft size={15} />Browse all AI tool categories</Link></div></article>;
}

function ToolDetail({ tool }: { tool: Tool }) {
  const category = catalogs.categories.find(item => item.slug === tool.categories[0]);
  const related = catalogs.tools.filter(item => item.route !== tool.route && item.categories.some(value => tool.categories.includes(value))).slice(0, 6);
  return <article className="mf-ecosystem-page"><header className="mf-ecosystem-detail-hero"><div className="mf-container"><Breadcrumb parent="AI Tools" parentHref="/ai-tools" title={tool.name} /><div className="mf-ecosystem-tags">{tool.categories.map(value => <Link key={value} href={`/ai-tools/category/${value}`}>{catalogs.categories.find(item => item.slug === value)?.title}</Link>)}</div><h1>{tool.name}</h1><p>{tool.description}</p><div className="mf-ecosystem-hero-actions">{tool.website && <a href={tool.website} target="_blank" rel="noopener noreferrer">Visit {tool.domain}<ExternalLink size={16} /></a>}<Link href="/consultation">Discuss an integration<ArrowUpRight size={16} /></Link></div></div></header><div className="mf-container mf-ecosystem-detail-content"><div className="mf-ecosystem-detail-layout"><div><section className="mf-ecosystem-detail-section"><h2>Where it fits</h2><p>{tool.description}</p>{category && <p>{category.description}</p>}</section><section className="mf-ecosystem-detail-section"><h2>Before you choose a tool</h2><ul className="mf-ecosystem-checklist"><li><Check size={17} />Define the specific task and the data the tool needs.</li><li><Check size={17} />Confirm the provider&apos;s current features, pricing, and account requirements.</li><li><Check size={17} />Check access controls, integration options, and data handling against your requirements.</li><li><Check size={17} />Try representative inputs and plan how exceptions will be reviewed.</li></ul></section>{category && <CategoryNote category={category} />}</div><aside className="mf-ecosystem-detail-sidebar"><Layers size={25} /><h2>Connect the tool<br />to the workflow.</h2><p>Map the trigger, data, rules, and destination before building an integration.</p><Link href="/workflow-audit">Audit your workflow<ArrowRight size={15} /></Link><Link href="/contact">Talk to ManasFlow<ArrowUpRight size={15} /></Link></aside></div>{related.length > 0 && <section className="mf-ecosystem-detail-section"><h2>Related tools</h2><div className="mf-ecosystem-tool-grid">{related.map(item => <ToolCard key={item.route} tool={item} />)}</div></section>}<Link className="mf-ecosystem-back" href="/ai-tools"><ArrowLeft size={15} />Back to the AI tools directory</Link></div></article>;
}

function EmptyResults({ reset }: { reset: () => void }) {
  return <div className="mf-ecosystem-empty" role="status"><Search size={25} /><h3>No matching results</h3><p>Try a broader term or clear the selected filters.</p><button type="button" onClick={reset}>Clear filters<ArrowRight size={14} /></button></div>;
}

function BotCard({ bot }: { bot: BotTemplate }) {
  return <article className="mf-ecosystem-bot-card"><div className="mf-ecosystem-tags"><span>{bot.category}</span><span>ManasFlow</span></div><h2><Link href={bot.route}>{bot.name}</Link></h2><p>{bot.description}</p><div className="mf-ecosystem-bot-integrations">{bot.integrations.slice(0, 4).map(item => <span key={item}>{item}</span>)}</div><Link className="mf-ecosystem-card-link" href={bot.route}>View template<ArrowRight size={13} /></Link></article>;
}

function BotDirectory({ workflows = false }: { workflows?: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [integration, setIntegration] = useState("all");
  const search = useSearchShortcut();
  const categories = [...new Map(catalogs.bots.map(bot => [bot.category, bot.categoryTitle])).entries()];
  const integrations = [...new Set(catalogs.bots.flatMap(bot => bot.integrations))].sort();
  const filtered = catalogs.bots.filter(bot => (category === "all" || bot.category === category) && (integration === "all" || bot.integrations.includes(integration)) && `${bot.name} ${bot.description} ${bot.integrations.join(" ")}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <div className="mf-ecosystem-page"><header className="mf-ecosystem-directory-hero"><div className="mf-container"><Badge>Practical automation patterns</Badge><h1>{workflows ? <>Connected <em>workflows.</em><br />Clear next steps.</> : <>The <em>Bot Directory</em><br />of automation templates.</>}</h1><p>{catalogs.bots.length} automation patterns for sales, marketing, operations, support, personal, and developer workflows. Search by category and integration, then follow the setup guide.</p><div className="mf-ecosystem-hero-actions"><Link href="/consultation">Have us build or customize one<ArrowRight size={17} /></Link><Link href="/skills">Explore the capability library<ArrowUpRight size={17} /></Link></div><div className="mf-ecosystem-stats"><div><strong>{catalogs.bots.length}</strong><span>Automation templates</span></div><div><strong>{categories.length}</strong><span>Categories</span></div><div><strong>{integrations.length}</strong><span>Integrations covered</span></div></div></div></header><div className="mf-container"><div className="mf-ecosystem-toolbar"><div className="mf-ecosystem-search"><Search size={18} /><input ref={search} type="search" aria-label="Search automation templates" placeholder="Search templates or integrations..." value={query} onChange={event => setQuery(event.target.value)} /><kbd>Ctrl K</kbd></div><select aria-label="Filter automation templates by category" value={category} onChange={event => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select aria-label="Filter automation templates by integration" value={integration} onChange={event => setIntegration(event.target.value)}><option value="all">All integrations</option>{integrations.map(value => <option key={value} value={value}>{value}</option>)}</select></div><p className="mf-ecosystem-result-count" aria-live="polite">Showing <strong>{filtered.length}</strong> of {catalogs.bots.length} templates</p><div className="mf-ecosystem-bot-grid">{filtered.map(bot => <BotCard key={bot.route} bot={bot} />)}</div>{filtered.length === 0 && <EmptyResults reset={() => { setQuery(""); setCategory("all"); setIntegration("all"); }} />}<CatalogCallout label="A template is the starting point." /></div></div>;
}

function BotDetail({ bot }: { bot: BotTemplate }) {
  const [completed, setCompleted] = useState<number[]>([]);
  const related = catalogs.bots.filter(item => item.category === bot.category && item.route !== bot.route).slice(0, 4);
  return <article className="mf-ecosystem-page"><header className="mf-ecosystem-detail-hero"><div className="mf-container"><Breadcrumb parent="Bot Directory" parentHref="/bot-directory" title={bot.name} /><div className="mf-ecosystem-tags"><span>{bot.category}</span><span>ManasFlow blueprint</span></div><h1>{bot.name}</h1><p>{bot.description}</p><div className="mf-ecosystem-hero-actions"><Link href="/consultation">Have ManasFlow build this<ArrowRight size={16} /></Link><Link href="/bot-directory">Back to directory<ArrowLeft size={16} /></Link></div></div></header><div className="mf-container mf-ecosystem-detail-content"><div className="mf-ecosystem-detail-layout"><div><section className="mf-ecosystem-detail-section"><h2>What this template does</h2>{(bot.paragraphs.length ? bot.paragraphs : [bot.description]).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section><section className="mf-ecosystem-detail-section"><h2>Integrations</h2><div className="mf-ecosystem-integration-grid">{bot.integrations.map(item => <div key={item}><Workflow size={16} /><span>{item}</span></div>)}</div></section><section className="mf-ecosystem-detail-section"><div className="mf-ecosystem-steps-heading"><h2>Setup steps</h2><span aria-live="polite">{completed.length}/{bot.steps.length} reviewed</span></div><ol className="mf-ecosystem-setup-steps">{bot.steps.map((step, index) => <li key={index}><label><input type="checkbox" checked={completed.includes(index)} onChange={event => setCompleted(previous => event.target.checked ? [...previous, index] : previous.filter(value => value !== index))} /><span className="mf-ecosystem-step-number">{completed.includes(index) ? <Check size={13} /> : index + 1}</span><span>{step}</span></label></li>)}</ol><small className="mf-ecosystem-setup-note">Track your review in this page. Connectors, credentials, and live actions are configured in your own systems.</small></section></div><aside className="mf-ecosystem-detail-sidebar"><Bot size={26} /><h2>{bot.categoryTitle}</h2><p>Use this pattern as a starting point and adapt it to your actual tools, data, and approval requirements.</p><Link href="/consultation">Plan the implementation<ArrowRight size={15} /></Link><Link href="/bot-directory">Browse all templates<ArrowUpRight size={15} /></Link></aside></div><section className="mf-ecosystem-detail-section"><h2>More {bot.category.toLowerCase()} templates</h2><div className="mf-ecosystem-bot-grid">{related.map(item => <BotCard key={item.route} bot={item} />)}</div></section><CatalogCallout /></div></article>;
}

function SkillsCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const search = useSearchShortcut();
  const categories = [...new Set(catalogs.skills.map(skill => skill.category))];
  const filtered = catalogs.skills.filter(skill => (category === "all" || skill.category === category) && `${skill.name} ${skill.description} ${skill.category} ${skill.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase().trim())).sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "category" ? a.category.localeCompare(b.category) || a.name.localeCompare(b.name) : a.order - b.order);
  return <div className="mf-ecosystem-page"><header className="mf-ecosystem-skills-hero mf-container"><div><Badge>{catalogs.skills.length} capabilities · {catalogs.flagships.length} systems</Badge><h1>The AI <em>capability stack</em><br />for your next build.</h1><p>Explore skills, agent patterns, and automation systems for planning, building, reviewing, and delivering connected software with ManasFlow.</p><a className="mf-ecosystem-inline-link" href="#capabilities">Browse the capabilities<ArrowRight size={16} /></a></div><div className="mf-ecosystem-terminal" aria-label="Illustrative capability planning session"><div><i /><i /><i /><span>ManasFlow · capability workspace</span></div><pre><span>$ define the outcome</span>{"\n"}Map the work, data, and constraints.{"\n\n"}<span>$ choose the capabilities</span>{"\n"}Orchestration → implementation → review{"\n\n"}<span>$ verify the result</span>{"\n"}Record the checks. Prepare the handoff.{"\n\n"}<strong>✓ Ready to plan the next step</strong></pre></div></header>
    <section className="mf-container mf-ecosystem-flagship-section"><p className="mf-ecosystem-kicker">FLAGSHIP SYSTEMS</p><h2>Connected capabilities,<br />from a shared foundation.</h2><div className="mf-ecosystem-flagship-grid">{catalogs.flagships.map(system => <article key={system.name}><div><span>{system.count} capabilities</span><Workflow size={22} /></div><h3>{system.name}</h3><p>{system.description}</p><button type="button" onClick={() => { setCategory(system.category); document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth" }); }}>{system.category}<ArrowRight size={13} /></button></article>)}</div></section>
    <section id="capabilities" className="mf-container mf-ecosystem-capabilities"><header><div><p className="mf-ecosystem-kicker">THE FULL STACK</p><h2>Browse All Capabilities</h2></div><div className="mf-ecosystem-search"><Search size={18} /><input ref={search} type="search" aria-label="Search AI capabilities" placeholder="Search capabilities..." value={query} onChange={event => setQuery(event.target.value)} /><kbd>Ctrl K</kbd></div></header><div className="mf-ecosystem-capability-layout"><aside className="mf-ecosystem-skill-filters" aria-label="Capability categories"><button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>All Capabilities<span>{catalogs.skills.length}</span></button>{categories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}<span>{catalogs.skills.filter(skill => skill.category === item).length}</span></button>)}</aside><div><div className="mf-ecosystem-skill-results"><p aria-live="polite"><strong>{filtered.length}</strong> results</p><label>Sort<select aria-label="Sort capabilities" value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Featured</option><option value="name">A–Z</option><option value="category">Category</option></select></label></div><div className="mf-ecosystem-skill-grid">{filtered.map(skill => <article key={skill.name}><h3>{skill.name}</h3><p>{skill.description}</p><div className="mf-ecosystem-skill-tags"><span>{skill.category}</span>{skill.tags.map(tag => <button key={tag} type="button" onClick={() => setQuery(tag)}>{tag}</button>)}</div></article>)}</div>{filtered.length === 0 && <EmptyResults reset={() => { setQuery(""); setCategory("all"); }} />}</div></div></section>
    <section className="mf-container mf-ecosystem-skills-faq"><h2>Frequently asked questions</h2>{skillsFaqs.map(({question, answer}) => <details key={question}><summary>{question}<ChevronDown size={17} /></summary><p>{answer}</p></details>)}<Link className="mf-ecosystem-inline-link" href="/manas-skills">Explore the Manas Skills starter library<ArrowUpRight size={16} /></Link></section><div className="mf-container"><CatalogCallout label="Bring the right capabilities into your team." /></div></div>;
}

function WorkflowsHub() {
  const [query, setQuery] = useState("");
  const filtered = catalogs.workflowGroups.map(group => ({ ...group, workflows: group.workflows.filter(workflow => `${workflow.name} ${workflow.description} ${group.name}`.toLowerCase().includes(query.toLowerCase().trim())) })).filter(group => group.workflows.length);
  return <article className="mf-ecosystem-page mf-ecosystem-workflows"><div className="mf-container"><header className="mf-ecosystem-workflows-hero"><Badge>The operational library</Badge><h1>How we <em>actually work</em></h1><p>Step-by-step implementation patterns for AI products, n8n automation, revenue workflows, and production operations. Explore the tools, sequence, and planning considerations for each build.</p><div className="mf-ecosystem-search"><Search size={18} /><input type="search" aria-label="Search operational workflows" placeholder="Find a workflow..." value={query} onChange={event => setQuery(event.target.value)} /></div></header>{filtered.map(group => <section key={group.name} className="mf-ecosystem-workflow-group"><h2>{group.name}</h2><div>{group.workflows.map(workflow => <Link key={workflow.route} href={workflow.route}><h3>{workflow.name}<ArrowUpRight size={17} /></h3><p>{workflow.description}</p><small>{workflow.timeline}</small></Link>)}</div></section>)}{filtered.length === 0 && <EmptyResults reset={() => setQuery("")} />}<div className="mf-ecosystem-workflow-contact"><h2>Want one of these running in your business?</h2><p>Our <Link href="/custom-automation">custom automation team</Link> can help scope the implementation. <Link href="/consultation">Book a free consultation<ArrowUpRight size={14} /></Link></p></div><div className="mf-ecosystem-workflow-newsletter"><Newsletter /></div></div></article>;
}

function WorkflowDetail({ workflow }: { workflow: (typeof catalogs.workflowDetails)[number] }) {
  return <article className="mf-ecosystem-page mf-ecosystem-workflow-detail"><div className="mf-container"><header><Breadcrumb parent="Workflows" parentHref="/workflows" title={workflow.name} /><p className="mf-ecosystem-kicker">{workflow.group} workflow</p><h1>{workflow.name}</h1><p>{workflow.description}</p></header><div className="mf-ecosystem-workflow-overview"><div><h2>Typical timeline</h2><p>{workflow.timeline}</p></div><div><h2>Stack</h2><p>{workflow.stack.join(" · ")}</p></div><div><h2>What we need to start</h2><ul>{workflow.prerequisites.map(item => <li key={item}>{item}</li>)}</ul></div></div><section className="mf-ecosystem-workflow-steps"><h2>How it works</h2><ol>{workflow.steps.map((step, index) => <li key={step.name}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.name}</h3><p>{step.text}</p>{step.tools && <small>Tools: {step.tools}</small>}</div></li>)}</ol></section><div className="mf-ecosystem-workflow-outcomes"><section><h2>You get</h2><ul>{workflow.deliverables.map(item => <li key={item}><Check size={14} /><span>{item}</span></li>)}</ul></section><section><h2>When to choose another approach</h2><ul>{workflow.limitations.map(item => <li key={item}><span>·</span><span>{item}</span></li>)}</ul></section></div>{workflow.resources.length > 0 && <section className="mf-ecosystem-workflow-resources"><h2>Open resources</h2><div>{workflow.resources.map(resource => <Link key={resource.href} href={resource.href}>{resource.title}<ArrowUpRight size={14} /></Link>)}</div></section>}<section className="mf-ecosystem-skills-faq"><h2>Frequently asked</h2>{workflow.faqs.map(faq => <details key={faq.question}><summary>{faq.question}<ChevronDown size={17} /></summary><p>{faq.answer}</p></details>)}</section><CatalogCallout /><div className="mf-ecosystem-workflow-newsletter"><Newsletter /></div></div></article>;
}

export function EcosystemPage({ route }: { route: string }) {
  if (route === "/ai-tools") return <AiToolsDirectory />;
  if (route === "/bot-directory") return <BotDirectory />;
  if (route === "/workflows") return <WorkflowsHub />;
  if (route === "/skills") return <SkillsCatalog />;
  const category = catalogs.categories.find(item => `/ai-tools/category/${item.slug}` === route);
  if (category) return <ToolCategory category={category} />;
  const tool = catalogs.tools.find(item => item.route === route);
  if (tool) return <ToolDetail tool={tool} />;
  const bot = catalogs.bots.find(item => item.route === route);
  if (bot) return <BotDetail bot={bot} />;
  const workflow = catalogs.workflowDetails.find(item => item.route === route);
  if (workflow) return <WorkflowDetail workflow={workflow} />;
  return null;
}
