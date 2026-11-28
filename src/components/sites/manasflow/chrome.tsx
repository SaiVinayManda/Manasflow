"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ActionLink as Link } from "./booking-link";
import NextLink from "next/link";
import { PRIMARY_NAVIGATION } from "@/lib/site-navigation";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowRight, ArrowUpRight, BookOpen, Bot, Boxes,
  Calendar, ChevronDown, Code2, Hammer, Layers,
  Mail, Menu, Network, Rocket, Search, Sparkles,
  Users, Workflow, X, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge, Reveal, SiteImage } from "./shared";
import { WhatsAppLink } from "./whatsapp-contact";
import { trackEvent } from "@/lib/analytics";
import { createSubmissionKey } from "@/lib/attribution";
import { WHATSAPP_DISPLAY_PHONE } from "@/lib/contact";
import { site } from "@/lib/site";
import { agencyLinks, crmLinks, freeToolLinks as freeTools, productLinks, resourceGroups, serviceGroups, serviceLinks, solutionLinks as solutions } from "@/data/manasflow/navigation";
import "./chrome.css";

const menuIcons: Record<string, LucideIcon> = {
  Automate: Bot, Build: Code2, Grow: Users, Solutions: Zap,
  "Platform Agencies": Boxes, "GTM & CRM": Network,
  Learn: BookOpen, Playbooks: Layers, Explore: Search,
  "Free Tools": Hammer, "Our Builds": Sparkles,
};

export function Logo({ footer = false }: { footer?: boolean }) {
  return <Link className={`mf-logo${footer ? " mf-logo-footer" : ""}`} href="/" aria-label="ManasFlow home">
    <span className="mf-logo-mark"><SiteImage name="logo_no_nodes.svg" /></span>
    <span>ManasFlow</span>
  </Link>;
}

function MegaMenu({ type, close, mobile = false }: { type: "services" | "resources"; close: () => void; mobile?: boolean }) {
  const services = type === "services";
  const groups = services ? serviceGroups : resourceGroups;
  return <div id={`mf-${mobile ? "mobile-" : ""}menu-${type}`} className="mf-mega-menu">
    <div className="mf-mega-inner">
      <div className="mf-mega-groups">
        {!services && <nav aria-label="Site sections"><p className="mf-menu-label">ManasFlow</p><div className="mf-menu-links">{PRIMARY_NAVIGATION.map(link => <NextLink key={link.href} href={link.href} onClick={close}><span><strong>{link.label}</strong></span></NextLink>)}</div></nav>}
        {groups.map((group) => <div key={group.title}>
          <p className="mf-menu-label">{group.title}</p>
          <div className="mf-menu-links">
            {group.links.map((link) => {
              const Icon = menuIcons[group.title] || Sparkles; return <Link key={link.label} href={link.href} onClick={close}>
                <span className="mf-menu-icon"><Icon size={16} /></span>
                <span><strong>{link.label}</strong><small>{link.detail}</small></span>
              </Link>;
            })}
          </div>
        </div>)}
      </div>
      <div className="mf-menu-feature">
        <p className="mf-menu-label">Featured Content</p>
        <Link className="mf-feature-image" href={services ? "/engineer-placement" : `/resources/claude-code-challenge`} onClick={close}>
          <SiteImage name={services ? "many-agents.svg" : "ship-product.webp"} alt={services ? "AI-native engineering and connected agents" : "A complete product, ready to ship"} />
        </Link>
        <div className="mf-feature-copy">
          <p>Featured</p>
          <h3>{services ? "AI-Native Engineers" : site.stats.challengeName}</h3>
          <span>{services ? "Embed senior AI-Native engineers directly into your team. Ship faster without the hiring overhead." : "A free daily challenge to level up your AI development skills, one project at a time."}</span>
          <Link href={services ? "/engineer-placement" : `/resources/claude-code-challenge`} onClick={close}>{services ? "Explore engineer placement" : "Start the challenge"}<ArrowUpRight size={13} /></Link>
        </div>
      </div>
    </div>
  </div>;
}

export function Header({ navigation }: { navigation?: ReactNode }) {
  const [open, setOpen] = useState<"services" | "resources" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) { setOpen(null); setMobileOpen(false); } };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { header.current?.querySelector<HTMLButtonElement>(`[data-menu-trigger="${open}"]`)?.focus(); setOpen(null); setMobileOpen(false); } };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const close = () => { setOpen(null); setMobileOpen(false); };
  return <header className="mf-header" ref={header} onMouseLeave={() => { if (!mobileOpen) setOpen(null); }}>
    <nav aria-label="Main navigation" className="mf-nav-bar">
      <div className="mf-nav-inner">
        <Logo />
        <div className="mf-desktop-nav">
          {(["services", "resources"] as const).map((type) => <button key={type} data-menu-trigger={type} type="button" onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setOpen(type); requestAnimationFrame(() => header.current?.querySelector<HTMLAnchorElement>(`#mf-menu-${type} a`)?.focus()); } }} aria-expanded={open === type} aria-controls={`mf-menu-${type}`} onMouseEnter={() => setOpen(type)} onClick={() => setOpen(open === type ? null : type)}>{type === "services" ? "Services" : "Resources"}<ChevronDown size={16} className={open === type ? "mf-chevron-open" : ""} /></button>)}
        </div>
        <div className="mf-nav-actions">
          <Link className="mf-nav-book" href="/consultation" onClick={close}><Calendar size={16} />Book a Call</Link>
          <Link className="mf-nav-offer" href="/golden-offer" onClick={close}>Skip the Hiring Grind<ArrowUpRight size={16} /></Link>
          <button className="mf-mobile-toggle" type="button" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-controls="mf-mobile-menu" aria-expanded={mobileOpen} onClick={() => { setMobileOpen(!mobileOpen); setOpen(null); }}>{mobileOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
    </nav>
    {navigation}
    {(["services", "resources"] as const).map(type => <nav key={type} hidden={open !== type || mobileOpen} className="mf-desktop-mega" aria-label={`${type === "services" ? "Services" : "Resources"} navigation`}><MegaMenu type={type} close={close} /></nav>)}
    <nav id="mf-mobile-menu" hidden={!mobileOpen} className="mf-mobile-menu" aria-label="Mobile navigation">
      {(["services", "resources"] as const).map((type) => <div key={type}>
        <button type="button" className="mf-mobile-category" aria-expanded={open === type} onClick={() => setOpen(open === type ? null : type)}>{type === "services" ? "Services" : "Resources"}<ChevronDown size={18} className={open === type ? "mf-chevron-open" : ""} /></button>
        <div hidden={open !== type}><MegaMenu type={type} close={close} mobile /></div>
      </div>)}
      <Link className="mf-nav-offer" href="/golden-offer" onClick={close}>Skip the Hiring Grind<ArrowUpRight size={16} /></Link>
    </nav>
    <noscript><nav className="seo-nojs-navigation" aria-label="Site sections">{PRIMARY_NAVIGATION.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav></noscript>
  </header>;
}

export function Newsletter({ compact = false, formOnly = false, headingLevel = 3 }: { compact?: boolean; formOnly?: boolean; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "subscribed" | "draft" | "error">("idle");
  const [error, setError] = useState("");
  const emailId = useId();
  const loadedAtRef = useRef<number>(0);
  const keyRef = useRef<string>("");
  useEffect(() => {
    loadedAtRef.current = Date.now();
    keyRef.current = createSubmissionKey("news");
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = email.trim();
    if (!cleaned) return;
    const formData = new FormData(event.currentTarget);
    const trap = String(formData.get("contact_trap") || "");
    setStatus("submitting");
    setError("");
    const openFallback = () => {
      const subject = encodeURIComponent("ManasFlow automation brief — subscription request");
      const body = encodeURIComponent(`Please send the weekly ManasFlow automation brief to ${cleaned}.`);
      window.location.href = `mailto:info@manasflow.com?subject=${subject}&body=${body}`;
      setStatus("draft");
    };
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleaned,
          marketingConsent: true,
          source: compact ? "footer" : "inline",
          contact_trap: trap,
          formLoadedAt: loadedAtRef.current,
          idempotencyKey: keyRef.current,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; fallback?: string; error?: string };
      if (response.ok && result.ok) {
        trackEvent("newsletter_signup", { source: compact ? "footer" : "inline" }, { eventId: keyRef.current });
        keyRef.current = createSubmissionKey("news");
        setStatus("subscribed");
        setEmail("");
        return;
      }
      if (result.fallback === "mailto") {
        openFallback();
        return;
      }
      trackEvent("form_error", { form_name: "newsletter", status: response.status });
      setStatus("error");
      setError(result.error || "Unable to subscribe right now. Please email info@manasflow.com.");
    } catch {
      openFallback();
    }
  }
  const helperText = status === "error"
    ? error
    : status === "subscribed"
      ? "You’re subscribed to the weekly ManasFlow automation brief. Unsubscribe anytime."
      : status === "draft"
        ? "Direct signup is offline here, so your email app opened with your request."
        : "Separate marketing opt-in for weekly teardowns. Unsubscribe anytime via /api/newsletter/unsubscribe.";
  return <div className={`mf-newsletter ${compact ? "mf-newsletter-compact" : ""}`}>
    {!compact && !formOnly && <p className="mf-news-kicker">Free weekly brief</p>}
    {!formOnly && <><Heading className="mf-newsletter-title">{compact ? "Stay tuned" : "Steal our production automations"}</Heading>
      <p>{compact ? "Get the latest automation insights, playbooks, and case studies delivered to your inbox. No spam, ever." : "The exact n8n flows, Claude Code setups, and prompts we ship for clients, broken down step by step. No spam, unsubscribe anytime."}</p></>}
    <form onSubmit={submit}>
      <input name="contact_trap" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />
      <div className="mf-news-input">
        <label className="mf-sr-only" htmlFor={emailId}>Email address</label>
        <input id={emailId} type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setStatus("idle"); setError(""); }} placeholder={compact ? "Enter your email" : "you@company.com"} required />
        <button type="submit" disabled={status === "submitting"} aria-label={status === "submitting" ? "Submitting newsletter subscription" : "Subscribe to newsletter"}>{compact ? <ArrowRight size={16} /> : <>{status === "submitting" ? "Joining..." : "Get the teardowns"}<ArrowUpRight size={16} /></>}</button>
      </div>
      <small role="status">{helperText}</small>
    </form>
  </div>;
}

type FooterLink = readonly [string, string];
function FooterColumn({ title, links, children, className = "" }: { title: string; links?: readonly FooterLink[]; children?: ReactNode; className?: string }) {
  return <div className={`mf-footer-cell ${className}`}><p className="mf-menu-label">{title}</p><div className="mf-footer-cell-content">{links && <ul>{links.map(([label, href]) => <li key={label}><Link href={href}>{label}</Link></li>)}</ul>}{children}</div></div>;
}

const resourceLinks: FooterLink[] = [["Workflows", "/workflows"], ["Automation Demo", "/automation-demo"], ["Solutions Advisor", "/advisor"], ["AI Tools Directory", "/ai-tools"], ["Bot Directory", "/bot-directory"], ["Skills & Agents", "/skills"], ["Security & Delivery", "/security"], ["Industries", `/industries`], ["Blog", `/blog`], ["Case Studies", `/case-studies`], ["Playbooks", `/playbooks`], ["Courses", `/courses`], ["FAQ", "/faq"], ["Contact Us", "/contact"], ["Careers", "/careers"]];
const summaries = [
  ["Directory", "689246be4a5f38523c0c038a_chat-gpt-summary.svg", "/directory"],
  ["Compare", "689246be2ac20799fd1b6571_claude-summary.svg", "/ai-model-comparison"],
  ["Pricing", "689246bee65f98c2f8bbfb17_perplexity-summary.svg", "/ai-model-pricing-index"],
  ["Tools", "689246bec89d73201bb5b515_google-ai-summary.svg", "/tools"],
  ["Playbooks", "689246befbb3221c2188951e_grok-summary.svg", "/playbooks"],
  ["Contact", "copilot.ico", "/contact"],
];

export function Footer({ navigation }: { navigation?: ReactNode }) {
  const [showSolutions, setShowSolutions] = useState(true);
  const [showPlatforms, setShowPlatforms] = useState(true);
  return <footer id="contact" className="mf-footer">
    <div className="mf-deploy">
      <div className="mf-deploy-grid mf-deploy-grid-top" aria-hidden="true" /><div className="mf-deploy-grid mf-deploy-grid-bottom" aria-hidden="true" />
      <Reveal className="mf-deploy-content">
        <div className="mf-floating-tools">{[["n8n", "tool-n8n-io.png"], ["Claude", "tool-claude-ai.png"], ["Cursor", "tool-cursor-com.png"], ["Make", "tool-make-com.png"], ["OpenAI", "tool-openai-com.png"]].map(([label, name]) => <Link href="/services" key={label} aria-label={`Explore ${label} automation`}><SiteImage name={name} alt={`${label} logo`} /></Link>)}</div>
        <Badge>Automation Gateway</Badge>
        <h2>DEPLOY<span>AUTOMATION</span></h2>
        <p><span>&gt;</span> System status: <strong>READY_FOR_DEPLOYMENT</strong><br />Transform your business operations today.</p>
        <div className="mf-deploy-actions"><Link href="/consultation" className="mf-initialize"><Zap size={22} />Initialize Automation<ArrowUpRight size={22} /></Link><Link href="/consultation" className="mf-deploy-call"><Calendar size={16} />Book Free Call<ArrowRight size={16} /></Link></div>
      </Reveal>
    </div>
    <nav className="mf-footer-directory" aria-label="Footer navigation">
      <div className="mf-footer-grid">
        <FooterColumn title="Company" className="mf-company-cell">
          <Logo footer />
          <p className="mf-footer-minilabel">Connect with us</p>
          <Link className="mf-connect-email" href="mailto:info@manasflow.com"><Mail size={22} /><span>Email ManasFlow</span></Link>
          <WhatsAppLink className="mf-footer-whatsapp">WhatsApp Us</WhatsAppLink>
          <p className="mf-footer-minilabel">Explore AI Resources</p>
          <div className="mf-ai-summaries">{summaries.map(([label, name, href]) => <Link key={label} href={href}><SiteImage name={name} /><span>{label}</span></Link>)}</div>
        </FooterColumn>
        <FooterColumn title="Free Tools" links={freeTools}><Link className="mf-footer-more" href={`/tools`}>Browse all free tools<ArrowUpRight size={13} /></Link></FooterColumn>
        <FooterColumn title="Our Platform">
          <ul className="mf-platform-links">{productLinks.map(({ label, detail, href }, index) => {
            const PlatformIcon = [Search, Layers, Workflow, Bot, BookOpen, Network][index];
            return <li key={label}><Link href={href}><PlatformIcon size={19} /><span>{label}<small>{detail}</small></span></Link></li>;
          })}</ul>
        </FooterColumn>
        <FooterColumn title="Services" links={serviceLinks}>
          <button className="mf-footer-disclosure" type="button" onClick={() => setShowSolutions(!showSolutions)} aria-expanded={showSolutions}>Explore Solutions<ChevronDown size={14} className={showSolutions ? "mf-chevron-open" : ""} /></button>
          {showSolutions && <ul>{solutions.map(([label, href]) => <li key={label}><Link href={href}>{label}</Link></li>)}</ul>}
        </FooterColumn>
        <FooterColumn title="Platform Agencies">
          <button className="mf-footer-disclosure mf-footer-disclosure-top" type="button" onClick={() => setShowPlatforms(!showPlatforms)} aria-expanded={showPlatforms}>Platform Agencies<ChevronDown size={14} className={showPlatforms ? "mf-chevron-open" : ""} /></button>
          {showPlatforms && <ul>{agencyLinks.map(([label, href]) => <li key={label}><Link href={href}>{label}</Link></li>)}</ul>}
          <p className="mf-footer-minilabel">GTM &amp; CRM</p><ul>{crmLinks.map(([label, href]) => <li key={label}><Link href={href}>{label}</Link></li>)}</ul>
        </FooterColumn>
        <FooterColumn title="Resources" links={resourceLinks} />
        <FooterColumn title="Stay Updated" className="mf-newsletter-cell"><div id="newsletter-footer"><Newsletter compact /></div></FooterColumn>
        <FooterColumn title="Featured" className="mf-featured-cell">
          <Link href={`/resources/claude-code-challenge`}><SiteImage name="claude.png" /><span><strong>{site.stats.challengeName}</strong><small>Daily challenges + agents</small></span></Link>
          <Link href={`/resources/ai-automation-playbook`}><SiteImage name="n8n.png" /><span><strong>AI Automation Playbook</strong><small>Free guide · 1,000+ hours saved</small></span></Link>
          <Link href="/golden-offer"><Rocket size={32} /><span><strong>Build with ManasFlow</strong><small>Scale your company without hiring more staff</small></span></Link>
        </FooterColumn>
        <FooterColumn title="Get in touch" className="mf-contact-cell">
          <Link className="mf-company-contact" href="/consultation"><span><Workflow size={25} /></span><div><strong>ManasFlow</strong><small>AI &amp; Automation</small></div><ArrowUpRight size={16} /></Link>
          <Link className="mf-company-contact" href="/contact"><span><Network size={25} /></span><div><strong>Let’s build together</strong><small>One connected platform</small></div></Link>
          <Link className="mf-footer-email" href="mailto:info@manasflow.com"><Mail size={17} />info@manasflow.com</Link>
          <WhatsAppLink className="mf-footer-whatsapp"><span className="mf-sr-only">WhatsApp </span>{WHATSAPP_DISPLAY_PHONE}</WhatsAppLink>
        </FooterColumn>
      </div>
    </nav>
    {navigation || <nav className="seo-site-sections mf-container" aria-label="Site sections">{PRIMARY_NAVIGATION.map(link => <NextLink href={link.href} key={link.href}>{link.label}</NextLink>)}</nav>}
    <div className="mf-footer-global"><p>Operating Globally</p><span><strong>Serving clients worldwide</strong> - across North America, Europe, MENA, Asia &amp; beyond.</span></div>
    <div className="mf-footer-bottom mf-container"><p>© 2026 ManasFlow. All rights reserved.</p><p>Milan, Italy</p><div><Link href="/terms">Terms of Use</Link><Link href="/privacy">Privacy Policy</Link></div></div>
  </footer>;
}
