"use client";

import { ActionLink as Link } from "./booking-link";
import { useState } from "react";
import { ArrowRight, CalendarDays, Clock3, Cpu, GitBranch, Search, ShieldCheck, Zap } from "lucide-react";
import data from "@/data/manasflow/case-studies.json";
import { Badge, Reveal, SiteImage, asset } from "./shared";
import { SubpageHero } from "./subpage-shared";
import "./case-studies.css";

type Client = { name: string; descriptor: string; pattern: string; need: string; results: string[]; logo?: string; domain?: string };
const clients: Client[] = data.clients;

function ClientLogo({ client }: { client: Client }) {
  const [failed, setFailed] = useState(false);
  const initials = client.name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  if (!client.logo || failed) return <span className="mf-case-client-initials">{initials}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="mf-case-client-logo" src={asset(client.logo)} alt={`${client.name} logo`} width={48} height={48} loading="lazy" onError={() => setFailed(true)} />;
}

export function CaseStudiesPage() {
  const [pattern, setPattern] = useState("all");
  const [query, setQuery] = useState("");
  const filteredClients = clients.filter((client) => pattern === "all" || client.pattern === pattern);
  const stories = data.stories.filter((story) => `${story.title} ${story.description} ${story.category} ${story.tools.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));
  const count = (id: string) => clients.filter((client) => client.pattern === id).length;
  return <div className="mf-case-studies-page">
    <SubpageHero badge="Customer Stories" title={<>See Automation <span className="accent">in Action</span></>} description="Discover how businesses are transforming their operations with AI automation, saving time, reducing costs, and scaling efficiently with our proven workflows.">
      <Link href="/contact" className="mf-case-hero-button">Contact Sales<ArrowRight size={20} /></Link>
    </SubpageHero>
    <section className="mf-case-portfolio" aria-labelledby="portfolio-heading">
      <p className="mf-case-portfolio-eyebrow">Who we have done this for</p>
      <h2 id="portfolio-heading">From use case to operating system</h2>
      <p className="mf-case-portfolio-description">A working sample of what we have shipped for clients, grouped by the kind of transformation each one needed. This is a sample, not the full list. The pattern is what transfers to a new client, so that is how it is sorted. We are happy to walk through the real numbers behind any of these live.</p>
      <div className="mf-case-pattern-overview">{data.patterns.map((item, index) => <button key={item.id} aria-pressed={pattern === item.id} onClick={() => setPattern(item.id)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.id}</strong><p>{item.blurb}</p><small>{count(item.id)} clients</small></button>)}</div>
      <div className="mf-case-pattern-filters" role="group" aria-label="Filter clients by pattern"><button aria-pressed={pattern === "all"} onClick={() => setPattern("all")}>All {clients.length}</button>{data.patterns.map((item) => <button key={item.id} aria-pressed={pattern === item.id} onClick={() => setPattern(item.id)}>{item.id} {count(item.id)}</button>)}</div>
      <div className="mf-case-client-grid" aria-live="polite" aria-label={`${filteredClients.length} client projects`}>
        {filteredClients.map((client) => <article key={client.name} className="mf-case-client-card"><header><ClientLogo client={client} /><div><h3>{client.name}</h3><p>{client.descriptor}</p></div></header><span className="mf-case-client-pattern">{client.pattern}</span><p className="mf-case-client-need">{client.need}</p><ul>{client.results.map((result) => <li key={result}><span aria-hidden="true" />{result}</li>)}</ul></article>)}
      </div>
      <div className="mf-case-platform-values">
        <div><GitBranch size={28} /><h3>Ownership from day one</h3><p>One connected team, from the first workflow to the working system.</p></div>
        <div><Cpu size={28} /><h3>Expert implementation</h3><p>Practical engineering built around the tools and processes your business uses.</p></div>
        <div><ShieldCheck size={28} /><h3>Clear, useful guidance</h3><p>Technical recommendations and working solutions that keep your team moving.</p></div>
      </div>
      <div className="mf-case-workflow-callout"><p>Which of these is closest to the opportunity you have in mind?</p><Link href="/contact">Talk to us about your workflow</Link></div>
    </section>
    <section className="mf-case-search-section"><div className="mf-container"><div className="mf-case-search"><Search size={16} /><label className="sr-only" htmlFor="case-study-search">Search case studies</label><input id="case-study-search" type="search" placeholder="Search case studies..." value={query} onChange={(event) => setQuery(event.target.value)} /></div></div></section>
    <section className="mf-case-stories-section"><div className="mf-container">
      <div className="mf-case-story-list" aria-live="polite">
        {stories.map((story) => <Reveal key={story.href}><Link href={story.href} className="mf-case-story-card"><div className="mf-case-story-image"><SiteImage name={story.image} alt={story.title} /><span>{story.category}</span><i><Zap size={16} /></i></div><div className="mf-case-story-content"><p className="mf-case-story-meta"><strong>{story.category}</strong><span>•</span><time dateTime="2026-03-03">{story.date}</time></p><h3>{story.title}</h3><p className="mf-case-story-description">{story.description}</p><ul className="mf-case-story-metrics">{story.metrics.map((metric) => <li key={metric}>• {metric}</li>)}</ul><div className="mf-case-story-tools">{story.tools.map((tool) => <span key={tool}>{tool}</span>)}</div><footer><span><Clock3 size={16} />{story.minutes} min read</span><strong>Read Case Study<ArrowRight size={16} /></strong></footer></div></Link></Reveal>)}
        {stories.length === 0 && <div className="mf-case-no-results"><Search size={28} /><h3>No case studies found</h3><p>Try a different title, tool, or automation topic.</p><button onClick={() => setQuery("")}>Clear search</button></div>}
      </div>
      <Reveal className="mf-case-bottom-callout"><Badge>Ready to Automate?</Badge><h2>Ready to Transform Your Business?</h2><p>Join thousands of businesses already saving time and money with our proven automation workflows.</p><div><Link href="/contact">Get Started Today<ArrowRight size={20} /></Link><Link href="/contact">Schedule Consultation<CalendarDays size={20} /></Link></div></Reveal>
    </div></section>
  </div>;
}
