"use client";

import { ActionLink as Link } from "./booking-link";
import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { ArrowRight, ArrowUpRight, Bot, CheckCircle2, Database, GitBranch, Layers3, Network, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import data from "@/data/manasflow/industries.json";
import { Badge, Reveal, SiteImage } from "./shared";
import { SubpageHero } from "./subpage-shared";
import "./industries.css";

type Industry = typeof data.industries[number];

function BlueprintForm({ industry }: { industry: Industry }) {
  const [draft, setDraft] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const body = [
      `Industry: ${industry.label}`,
      `Name: ${String(fields.get("name") || "")}`,
      `Email: ${String(fields.get("email") || "")}`,
      `Company: ${String(fields.get("company") || "")}`,
      `Service: ${String(fields.get("service") || "")}`,
      `Budget: ${String(fields.get("budget") || "")}`,
      "",
      String(fields.get("details") || ""),
    ].join("\n");
    const href = `mailto:info@manasflow.com?subject=${encodeURIComponent(`${industry.label} automation blueprint`)}&body=${encodeURIComponent(body)}`;
    setDraft(href);
    window.location.href = href;
  }
  return <form className="mf-industry-form" onSubmit={submit}>
    <h3><Sparkles size={20} />Request Your {industry.label} Blueprint</h3>
    <div className="mf-industry-form-pair">
      <label>Name<input required name="name" autoComplete="name" placeholder="Your Name" /></label>
      <label>Email<input required type="email" name="email" autoComplete="email" placeholder="work@company.com" /></label>
    </div>
    <label>Company<input name="company" autoComplete="organization" placeholder="Company Name" /></label>
    <div className="mf-industry-form-pair">
      <label>Service<select name="service" defaultValue=""><option value="" disabled>Select Service</option><option>Workflow Automation</option><option>Custom AI Agents</option><option>AI Strategy</option></select></label>
      <label>Budget<select name="budget" defaultValue=""><option value="" disabled>Budget Range</option><option>$5k - $15k</option><option>$15k - $50k</option><option>$50k+</option></select></label>
    </div>
    <label>Project Details<textarea name="details" placeholder="Tell us about your bottlenecks..." /></label>
    <button type="submit">Get My Blueprint<ArrowRight size={16} /></button>
    <p className="mf-industry-form-note" role="status">{draft ? <>Your email request is ready. <a href={draft}>Open it in your email app</a>.</> : "Opens an email request to info@manasflow.com."}</p>
  </form>;
}

function IndustryPanel({ industry }: { industry: Industry }) {
  return <div key={industry.slug} className="mf-industry-panel" id="industry-panel" role="tabpanel" aria-label={`${industry.label} automations`}>
    <div className="mf-industry-panel-heading">
      <div><Badge>{industry.label}</Badge><h2>{industry.headline}</h2><p>{industry.summary}</p></div>
      <Link href={industry.href} className="mf-industry-guide">Full Industry Guide<ArrowUpRight size={16} /></Link>
    </div>
    <div className="mf-industry-stats">{industry.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>
    <div className="mf-industry-two-cols">
      <div className="mf-industry-card"><h3>Top Challenges</h3><ul className="mf-industry-pains">{industry.pains.map((pain) => <li key={pain}><span />{pain}</li>)}</ul></div>
      <div className="mf-industry-card mf-industry-solutions"><h3>What We Automate</h3><ul>{industry.solutions.map((solution) => <li key={solution}><CheckCircle2 size={16} />{solution}</li>)}</ul></div>
    </div>
    <div className="mf-industry-playbooks"><h3>Included Playbooks</h3><div className="mf-industry-two-cols">{industry.playbooks.map((playbook) => <div className="mf-industry-card" key={playbook.title}><p className="mf-industry-overline">Playbook</p><h4>{playbook.title}</h4><p>{playbook.description}</p><ul>{playbook.deliverables.map((deliverable) => <li key={deliverable}><span />{deliverable}</li>)}</ul></div>)}</div></div>
    <div className="mf-industry-two-cols">
      <div className="mf-industry-card"><h3 className="mf-industry-stack-label">Preferred Stack</h3><div className="mf-industry-stack">{industry.techStack.map((tool) => <span key={tool}>{tool}</span>)}</div></div>
      <div className="mf-industry-card mf-industry-platform-card"><div className="mf-industry-platform-icons" aria-hidden="true"><Database /><GitBranch /><Bot /></div><p>Connected workflows. Clear outcomes.</p><span>Built around the tools and processes your {industry.label.toLowerCase()} team already uses.</span></div>
    </div>
  </div>;
}

export function IndustriesPage() {
  const [selected, setSelected] = useState(0);
  const industry = data.industries[selected];
  function tabKey(event: KeyboardEvent<HTMLElement>) {
    const isVertical = event.currentTarget.getAttribute("aria-orientation") === "vertical";
    const nextKeys = isVertical ? ["ArrowDown"] : ["ArrowRight"];
    const previousKeys = isVertical ? ["ArrowUp"] : ["ArrowLeft"];
    let next = selected;
    if (nextKeys.includes(event.key)) next = (selected + 1) % data.industries.length;
    else if (previousKeys.includes(event.key)) next = (selected - 1 + data.industries.length) % data.industries.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = data.industries.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    event.currentTarget.querySelectorAll<HTMLButtonElement>("[role='tab']")[next]?.focus();
  }
  return <div className="mf-industries-page">
    <SubpageHero badge="Industry Playbooks" title={<>Use cases built for teams that need <span className="accent">revenue-ready automations</span></>} description="Select your industry to instantly see the automations, playbooks, and outcomes we deliver - no scrolling required.">
      <Link className="mf-industry-hero-link" href="/contact">Book a Strategy Session<ArrowUpRight size={20} /></Link>
      <div className="mf-industry-trust"><p>Industries we ship for</p><div>{data.logos.map((logo) => <SiteImage key={logo.alt} name={logo.local} alt={logo.alt} />)}</div></div>
    </SubpageHero>
    <section className="mf-industry-selector"><div className="mf-container">
      <div className="mf-industry-mobile-tabs" role="tablist" aria-label="Select industry" aria-orientation="horizontal" onKeyDown={tabKey}>{data.industries.map((item, index) => <button key={item.slug} role="tab" aria-selected={selected === index} aria-controls="industry-panel" tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)}>{item.label}</button>)}</div>
      <div className="mf-industry-workspace">
        <nav className="mf-industry-nav"><p>Select Industry</p><div role="tablist" aria-label="Select industry" aria-orientation="vertical" onKeyDown={tabKey}>{data.industries.map((item, index) => <button key={item.slug} role="tab" aria-selected={selected === index} aria-controls="industry-panel" tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}{selected === index && <Sparkles size={12} />}</button>)}</div><Link href="/contact">Book a Free Workshop</Link></nav>
        <IndustryPanel industry={industry} />
      </div>
    </div></section>
    <section className="mf-section mf-industry-blueprint"><div className="mf-container"><Reveal className="mf-industry-blueprint-grid">
      <div><h2>Get a custom <span className="accent">{industry.label}</span> automation roadmap</h2><p>Ready to stop chasing status updates and start scaling? Tell us about your bottlenecks, and we&apos;ll show you exactly how to automate them.</p><ul>{[`Industry-specific workflows for ${industry.label}`, "Tool-by-tool integration map for your stack", "Direct ROI projection and time-to-value report"].map((item) => <li key={item}><CheckCircle2 size={20} />{item}</li>)}</ul></div>
      <BlueprintForm key={industry.slug} industry={industry} />
    </Reveal></div></section>
    <section className="mf-industry-proof"><div className="mf-container"><Reveal>
      <div className="mf-industry-proof-heading"><div><p>Built for your operations</p><h2>One connected platform.<br /><span className="accent">Every part of your business.</span></h2></div><p>Different industries, one connected approach. Turn scattered tools and manual handoffs into systems that work together.</p></div>
      <div className="mf-industry-system" aria-label="Data connects through AI agents and automated workflows"><div className="mf-industry-system-node"><Database size={36} /><span>Your business data</span></div><div className="mf-industry-system-connection" /><div className="mf-industry-system-core"><Network size={64} /><strong>ManasFlow</strong><span>Connected intelligence</span></div><div className="mf-industry-system-connection" /><div className="mf-industry-system-node"><Workflow size={36} /><span>Automated workflows</span></div></div>
      <div className="mf-industry-system-values"><div><Layers3 size={24} /><h3>Fits your stack</h3><p>Keep the tools your team knows. Connect the work between them.</p></div><div><Bot size={24} /><h3>Built to work</h3><p>AI agents and automations designed around your daily operations.</p></div><div><ShieldCheck size={24} /><h3>Control stays with you</h3><p>Clear handoffs, reliable systems, and visibility into every workflow.</p></div></div>
    </Reveal></div></section>
    <section className="mf-section mf-industry-workshop"><div className="mf-container"><Reveal><Badge>High-Conversion Workshop</Badge><h2>Get a free 45-minute workshop tailored to your industry&apos;s <span className="accent">highest-leverage automations.</span></h2><p>We&apos;ll map your current workflow, highlight automation quick wins, and deliver a roadmap showing the exact impact on revenue, pipeline, and delivery speed.</p><Link href="/contact">Reserve My Workshop<ArrowRight size={20} /></Link></Reveal></div></section>
  </div>;
}
