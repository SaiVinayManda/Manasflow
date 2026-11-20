"use client";

import { ActionLink as Link } from "./booking-link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, GitBranch, Workflow, Zap } from "lucide-react";
import { asset, Badge, CallButton, CallStrip, Reveal, SectionHeading, SiteImage } from "./shared";
import { Capabilities, Tools } from "./capabilities";
import { LowerSections } from "./lower-sections";
import { Newsletter } from "./chrome";
import "./home.css";

const partners = [
  ["ronin-global.webp", "Ronin Global", false], ["fleetforward-logo.webp", "FleetForward", false],
  ["untaylored.webp", "Untaylored", false], ["neoday.webp", "neoday", true],
  ["hello-customer.webp", "HelloCustomer", true], ["ambry-hill.svg", "AmbryHill", true],
  ["thinkone.webp", "ThinkOne", false], ["addictest.svg", "addictest", true],
  ["shems-pub.webp", "Shem’s Pub", false], ["wearview.webp", "Wearview", true],
  ["emprende-logo.webp", "Emprende.cl", false], ["kateb.webp", "Kateb", false],
  ["easyclickweb.svg", "EasyClic", false], ["dentakay-logo.svg", "Dentakay", true],
  ["humanoidz.webp", "Humanoidz", true], ["earl-logo.avif", "earleads.com", true],
] as const;

function Hero() {
  return <>
    <section className="mf-hero">
      <div className="hero-mountains" aria-hidden="true" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-dots" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true"><i /><i /><i /></div>
      <div className="hero-focus" aria-hidden="true" />
      <div className="mf-container hero-center">
        <div className="hero-text">
          <h1><span>Scale Your Business</span><strong>10X</strong><small>without hiring more staff
            <svg viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2,7 Q50,3 75,6 T150,7 Q200,10 250,5 T298,7" /></svg>
          </small></h1>
          <p className="hero-description">We embed a forward deployed engineer inside your team who learns how the work actually happens, then builds the AI systems that take the repetitive tasks off your plate. The leverage of a senior hire, without the headcount.</p>
          <div className="hero-actions"><CallButton>Book a Free Strategy Call</CallButton><CallButton href="/services" secondary>Explore Solutions</CallButton></div>
          <p className="hero-commitment">Free · 30 minutes · No commitment</p>
          <Link href="/blog" className="hero-newsletter">Not ready to talk? Read the weekly automation brief →</Link>
        </div>
      </div>
    </section>
    <CallStrip />
    <div className="mf-container start-here">
      <p className="micro-label">Start here</p>
      <div className="start-grid">
        <Link href="/resources/claude-code-challenge"><strong>52-Day Claude Code Challenge</strong><p>Free: setup, hooks, MCPs, agent swarms. 52 days of real builds.</p><ArrowUpRight size={16} /></Link>
        <Link href="/services"><strong>Automation in Action</strong><p>Connected workflows, intelligent agents, and the systems behind them.</p><ArrowUpRight size={16} /></Link>
        <Link href="/blog"><strong>Blog and Guides</strong><p>AI agents, models, tools, and automation tactics.</p><ArrowUpRight size={16} /></Link>
      </div>
    </div>
  </>;
}

function Partners() {
  return <section className="mf-section partners-section">
    <div className="mf-container">
      <SectionHeading badge="Trusted Partners" title={<>You’re in <span className="accent">Good Company</span></>} description="Powering AI automation for fast-growing US and European enterprises." />
      <div className="partner-grid">{partners.map(([name, label, invert]) => <Reveal key={name}><div className="partner-card"><SiteImage name={name} alt={`${label} logo`} className={invert ? "invert-logo" : ""} /></div></Reveal>)}</div>
      <Reveal className="government-partners"><h3>Trusted by Governments Worldwide</h3><div><SiteImage name="DGA-Logo.svg" alt="Saudi DGA" /><SiteImage name="maroc-gov.svg" alt="Maroc Government" /></div></Reveal>
      <Reveal className="partner-stats"><div><strong>+30</strong><span>Companies Served</span></div><i /><div><strong>200+</strong><span>Integrations Deployed</span></div></Reveal>
    </div>
  </section>;
}

const spotlights = [
  { title: "Connected workflows", subtitle: "Your tools. One seamless system.", image: "workflowmobile.webp", icon: Workflow },
  { title: "Intelligent agents", subtitle: "One human. Many possibilities.", image: "many-agents.svg", icon: GitBranch },
  { title: "Products that ship", subtitle: "From idea to production.", image: "ship-product.webp", icon: Zap },
  { title: "A clear AI strategy", subtitle: "Built around your business.", image: "ai-strategy-5-ways-we-automate.webp", icon: Workflow },
  { title: "Automation at scale", subtitle: "Systems that keep moving.", image: "money-refund.webp", icon: GitBranch },
];

function AutomationSpotlight() {
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);
  const select = (index: number) => setActive((index + spotlights.length) % spotlights.length);
  return <section className="spotlight-section" id="automation-in-action">
    <div className="mf-container"><SectionHeading badge="Built for Your Business" title={<>Real Systems, <span className="accent">Real Possibilities</span></>} description="Explore the connected workflows and intelligent systems behind your automation." /></div>
    <div className="spotlight-deck" onTouchStart={(event) => { touchX.current = event.changedTouches[0].clientX; }} onTouchEnd={(event) => { if (touchX.current === null) return; const delta = touchX.current - event.changedTouches[0].clientX; if (Math.abs(delta) > 40) select(active + (delta > 0 ? 1 : -1)); touchX.current = null; }}>
      {spotlights.map((item, index) => {
        let offset = (index - active + spotlights.length) % spotlights.length;
        if (offset > 2) offset -= spotlights.length;
        const Icon = item.icon;
        return <button key={item.title} className={`spotlight-card ${offset === 0 ? "active" : ""}`} style={{ "--offset": offset, "--distance": Math.abs(offset), zIndex: 10 - Math.abs(offset) } as CSSProperties} onClick={() => select(index)} aria-label={`Explore ${item.title}`} aria-pressed={active === index}>
          <span className="spotlight-index">MANASFLOW / 0{index + 1}</span>
          <span className="spotlight-visual"><SiteImage name={item.image} alt={item.title} /></span>
          <span className="spotlight-icon"><Icon size={24} /></span>
          <span className="spotlight-title">{item.title}</span><span className="spotlight-subtitle">{item.subtitle}</span>
        </button>;
      })}
    </div>
    <div className="spotlight-controls"><button onClick={() => select(active - 1)} aria-label="Previous automation"><ArrowLeft size={17} /></button><div>{spotlights.map((item,index) => <button key={item.title} className={index === active ? "active" : ""} onClick={() => select(index)} aria-label={`Go to ${item.title}`} aria-pressed={index === active} />)}</div><button onClick={() => select(active + 1)} aria-label="Next automation"><ArrowRight size={17} /></button></div>
    <div className="spotlight-more"><Link href="/services">Explore what we can automate <ArrowUpRight size={16} /></Link></div>
  </section>;
}

const stories = [
  ["The before", "Three months to hire, six months to onboard, twelve months to ship the roadmap. By the time the seat was filled, the market had already moved."],
  ["The shift", "Coding stopped being the bottleneck the moment Claude Code, MCP, and sandboxed agents matured. The bottleneck moved to orchestration."],
  ["Our move", "Generalists trained in-house to wire Claude Code, n8n, MCP connectors, and E2B into systems that ship. One human driving a bench of subagents."],
  ["The proof", "The multiplier is the stack, not the seniority. That is why we deploy across enterprise teams and solo operators without changing the model."],
  ["The promise", "Embed an engineer. Ship a whole product. If month one does not land, you get it back. No conversations, no exit fee, no notice beyond the current month."],
] as const;

function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!ref.current) return;
        const bounds = ref.current.getBoundingClientRect();
        setProgress(Math.min(1, Math.max(0, -bounds.top / Math.max(1, bounds.height - window.innerHeight))));
      });
    };
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  const active = Math.min(4, Math.floor(progress * 5));
  const wordProgress = Math.min(1, (progress * 5 - active) / .8);
  const words = stories[active][1].split(" ");
  return <div className="scroll-story" ref={ref}><div className="story-sticky">
    <p className="micro-label">Across 45+ companies shipped · Enterprise to solo operators</p>
    <h3>The new moat is <span className="accent">speed of execution</span>.</h3>
    <div className="story-label"><span>{stories[active][0]}</span><span>· 0{active + 1} / 05</span></div>
    <p className="story-sentence" aria-label={stories[active][1]}>{words.map((word, index) => <span key={`${active}-${index}`} aria-hidden="true" style={{ opacity: index / words.length <= wordProgress ? 1 : .18 }}>{word} </span>)}</p>
    <div className="story-progress" aria-hidden="true">{stories.map((_,index) => <span key={index}><i style={{ width: `${Math.max(0, Math.min(1, progress * 5 - index)) * 100}%` }} /></span>)}</div>
  </div></div>;
}

const stack = [
  { title: "Agent runtime", tag: "🎁 Included with every retainer", tools: [["Claude Code", "claude.png", "The brain. Subagents, hooks, MCP."], ["Anthropic", "anthropic.png", "Managed agents in production."], ["Cursor", "cursor.png", "IDE pair-programming with agents."]] },
  { title: "Orchestration", tag: "🔓 Open source · free forever", tools: [["n8n", "n8n.png", "Cron, webhooks, integration glue."], ["MCP", "mcp.svg", "One protocol, every tool you own."], ["Zapier", "zapier.png", "Quick triggers when n8n is overkill."]] },
  { title: "Compute & infra", tag: "💰 Pay per use · your account", tools: [["E2B", "e2b.png", "Sandboxed micro-VMs per agent call."], ["Supabase", "supabase.png", "Postgres + auth in one."], ["Vercel", "vercel.png", "Edge deploys in seconds."]] },
  { title: "Outbound & CRM", tag: "🔌 Plug into your accounts", tools: [["HubSpot", "hubspot.png", "CRM hygiene, deal pipelines."], ["Clay", "clay.png", "Lead enrichment at scale."], ["Apollo", "apollo.png", "Outbound contact discovery."]] },
  { title: "Where work happens", tag: "🤝 Your team’s already there", tools: [["Slack", "slack.png", "Alerts, approvals, daily standups."], ["Linear", "linear.png", "Tickets, sprints, roadmap."], ["GitHub", "github.png", "Every PR shipped is yours."]] },
];

function BuiltToShip() {
  return <section className="built-section" id="why-us"><div className="mf-container">
    <Reveal className="built-intro"><div><p className="micro-label">Built to ship</p><h2>We measure success in <span className="accent">weeks, not slide decks</span>.</h2></div><p>Real engineers, real agents, real product shipped into your repo. Below is what we actually run for clients, not what we promise on a sales call.</p></Reveal>
    <div className="demo-grid">{[
      ["agents", "cursor-agent.webm", "Claude Code agents shipping product features"],
      ["n8n", "n8n-hero.webm", "n8n revenue automation running 24/7"],
      ["make", "make-hero.webm", "Make orchestrations across your stack"],
    ].map(([label, video, title]) => <Reveal key={label}><article className="demo-window"><div className="window-toolbar"><i /><i /><i /><span>manasflow.dev/{label}</span><small><b />Live</small></div><video src={asset(video)} autoPlay muted loop playsInline preload="none" aria-label={title} /><p>{title}</p></article></Reveal>)}</div>
    <ScrollStory />
    <div className="stack-section" id="tech-stack"><Reveal><p className="micro-label">Inside the stack · 15 tools, zero glue code</p><h3>Every tool your engineer arrives with, and <span className="accent">who pays for what</span>.</h3><p className="stack-description">No surprise SaaS bills. Half the stack is open source, the other half plugs into accounts you already have. The agent runtime is on us.</p></Reveal>
      <div className="stack-rows">{stack.map((group) => <Reveal className="stack-row" key={group.title}><div><p className="micro-label">Category</p><h4>{group.title}</h4><span className="stack-tag">{group.tag}</span></div><div className="stack-cards">{group.tools.map(([title,image,description]) => <div className="stack-card" key={title}><div><SiteImage name={image} alt="" /><h5>{title}</h5></div><p>{description}</p></div>)}</div></Reveal>)}</div>
    </div>
    <div className="model-section"><p className="micro-label">The model · No exceptions</p>{[
      ["Ship a whole product", "Not a feature. Not a demo. A working system in your repo by month-end.", "ship-product.webp"],
      ["Month one fully refundable", "If month one does not land, you get it back. No conversation needed.", "money-refund.webp"],
      ["One human, many agents", "Co-engineer with a bench of subagents. The multiplier is the stack, not the seniority.", "many-agents.svg"],
    ].map(([title,description,image],index) => <Reveal className="model-row" key={title}><span>0{index + 1}</span><div><h4>{title}</h4><p>{description}</p></div><SiteImage name={image} alt={title} /></Reveal>)}</div>
    <Reveal className="fix-callout"><div><h3>Fix what’s slowing you down.</h3><p>Tell us the workflow that hurts. We embed an engineer, ship a whole product, refund the first month if it does not land.</p></div><Link href="/contact" withWhatsApp>Book a 15-min call <ArrowUpRight size={20} /></Link></Reveal>
  </div></section>;
}

export function ManasFlowHome() {
  return <div className="manasflow-home">
    <Hero />
    <Partners />
    <AutomationSpotlight />
    <CallStrip />
    <BuiltToShip />
    <CallStrip />
    <Capabilities />
    <CallStrip />
    <Tools />
    <CallStrip />
    <LowerSections />
    <section className="brief-section" id="newsletter"><div className="mf-container"><Reveal className="brief-card"><div><Badge>Free weekly brief</Badge><h2>Steal our production automations</h2><p>The exact n8n flows, Claude Code setups, and prompts we ship for clients, broken down step by step. No spam, unsubscribe anytime.</p></div><div><Newsletter formOnly /><p className="brief-footnote"><Check size={14} /> Practical workflows. Straight to your inbox.</p></div></Reveal></div></section>
  </div>;
}
