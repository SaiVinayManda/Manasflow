"use client";

import { ActionLink as Link } from "./booking-link";
import { useId, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Bot, Building2, Check, ChevronDown, CircleCheckBig, Clock, Code2, Cpu, Earth, FileText, GraduationCap, Layers3, Lock, Mail, Mic, ShieldCheck, Truck, Users, Video, Workflow, Zap } from "lucide-react";
import data from "@/data/manasflow/company-pages.json";
import { Badge, CallButton, Reveal, SectionHeading, SiteImage, asset } from "./shared";
import { BookingCard } from "./booking-link";
import "./company-pages.css";
import "./lower-sections.css";

type Question = { question: string; answer: string };

const answerLinks: [string, string][] = [
  ["ROI Calculator", "/tools/roi-calculator"],
  ["Staffing Model Calculator", "/tools/staffing-model-calculator"],
  ["engineer placement service", "/services/engineer-placement"],
  ["forward deployed engineers service", "/services/forward-deployed-engineers"],
  ["forward deployed engineers page", "/services/forward-deployed-engineers"],
  ["custom workflow automation", "/services/custom-workflow-automation"],
  ["n8n development agency page", "/services/n8n-agency"],
];

function Answer({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;
  while (remaining) {
    const match = answerLinks.map(([label, href]) => ({ label, href, index: remaining.indexOf(label) })).filter(item => item.index >= 0).sort((a, b) => a.index - b.index)[0];
    if (!match) { parts.push(remaining); break; }
    parts.push(remaining.slice(0, match.index), <Link key={key++} href={match.href}>{match.label}</Link>);
    remaining = remaining.slice(match.index + match.label.length);
  }
  return <>{parts}</>;
}

function CompanyAccordion({ items }: { items: Question[] }) {
  const [active, setActive] = useState<number | null>(null);
  const id = useId();
  return <div className="company-accordion">{items.map(({ question, answer }, index) => <div key={question} className={`company-accordion-item ${active === index ? "open" : ""}`}>
    <h3><button type="button" id={`${id}-q-${index}`} aria-expanded={active === index} aria-controls={`${id}-a-${index}`} onClick={() => setActive(active === index ? null : index)}>{question}<ChevronDown size={16} aria-hidden="true" /></button></h3>
    <div className="company-accordion-collapse" id={`${id}-a-${index}`} role="region" aria-labelledby={`${id}-q-${index}`} inert={active !== index}><div><p><Answer text={answer} /></p></div></div>
  </div>)}</div>;
}

export function CompanyFAQPage() {
  return <div className="company-faq-page mf-container company-standard-page">
    <header className="company-faq-hero"><p className="company-eyebrow">ManasFlow</p><h1>Frequently Asked Questions</h1><p>Everything you need to know about AI workflow automation, staff augmentation, dedicated teams, and working with ManasFlow.</p></header>
    <div className="company-faq-groups">{data.faqGroups.map(group => <section key={group.title}><h2>{group.title}</h2><CompanyAccordion items={group.items} /></section>)}</div>
    <section className="company-faq-callout"><h2>Still have questions?</h2><p>Book a free 30-minute discovery call. We’ll assess your automation opportunities and recommend next steps—no obligation.</p><div><CallButton href="/contact">Book a Free Consultation</CallButton><Link className="company-text-link" href="/contact">Contact Us <ArrowUpRight size={16} /></Link></div></section>
  </div>;
}

function openEmail(subject: string, body: string) {
  window.location.href = `mailto:info@manasflow.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function EmailDraftNotice({ ready }: { ready: boolean }) {
  return <p className="company-email-notice" role="status">{ready ? "Your email draft is ready. Review it and send it from your email app to info@manasflow.com." : "This prepares an email draft to info@manasflow.com. You review and send it from your email app."}</p>;
}

export function ContactBooking() {
  return <section id="consultation" className="company-booking-section">
    <SectionHeading badge="Book a Call" title={<>Talk to <span className="accent">an AI engineer</span></>} description="Choose a time for your free 30-minute strategy call. Live availability is shown in your timezone." />
    <Reveal className="lower-consultation-panel">
      <div className="lower-consultation-copy">
        <h3>Book a 30min Free Strategy Call</h3><p className="lower-consultation-lead">In this call, we?ll walk through your project scope, timeline, and goals?so we can both check if we?re a fit. No obligation, no slide deck, just a working session.</p>
        <p className="lower-direct-email">Don?t want a call? Email <a href="mailto:info@manasflow.com">info@manasflow.com</a></p><Link href="/consultation" className="lower-outline-button">Book Now <ArrowUpRight size={20} /></Link>
        <ul className="lower-consultation-benefits"><li><Users size={17} />Free 30-min Strategy Call</li><li><CircleCheckBig size={17} />Custom Solution Design</li><li><Clock size={17} />Choose a time that suits you</li></ul>
        <div className="lower-company-promise"><Workflow size={27} /><p>One connected approach, from the first workflow to a company that runs smarter.</p><span>Built around your business. Powered by ManasFlow.</span></div>
        <div className="lower-featured"><p>Built with the tools your team already knows</p><div><SiteImage name="claude.png" alt="Claude" /><SiteImage name="n8n.png" alt="n8n" /><SiteImage name="supabase.png" alt="Supabase" /><SiteImage name="github.png" alt="GitHub" /></div></div>
      </div>
      <div className="lower-consultation-form"><BookingCard id="contact-call-request" /></div>
    </Reveal>
    <div className="lower-consultation-notes"><span><Clock size={16} />A practical working session</span><span><Zap size={16} />No commitment required</span></div>
  </section>;
}

function ContactForm() {
  const [ready, setReady] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    openEmail(`Project enquiry: ${form.get("company")}`, `Hello ManasFlow,\n\nName: ${form.get("name")}\nEmail: ${form.get("email")}\nCompany: ${form.get("company")}\nService: ${form.get("service")}\nProject budget: ${form.get("budget")}\n\nProject details:\n${form.get("details") || ""}`);
    setReady(true);
  }
  return <form className="company-contact-form company-form" onSubmit={submit}>
    <div className="company-field-row"><label>Name *<input name="name" autoComplete="name" placeholder="Your name" required maxLength={100} /></label><label>Email *<input name="email" type="email" autoComplete="email" placeholder="example@mail.com" required /></label></div>
    <label>Company Name *<input name="company" autoComplete="organization" placeholder="Your company" required /></label>
    <div className="company-field-row"><label>Select Service *<select name="service" defaultValue="" required><option value="" disabled>Select Your Service</option>{["AI Voice Agents", "Business Automation", "Lead Qualification", "Call Management", "Custom AI Solutions"].map(item => <option key={item}>{item}</option>)}</select></label><label>Project Budget *<select name="budget" defaultValue="" required><option value="" disabled>Select Your Range</option>{["Under $5,000", "$5,000 - $15,000", "$15,000 - $30,000", "$30,000 - $50,000", "$50,000+"].map(item => <option key={item}>{item}</option>)}</select></label></div>
    <label>Project Details<textarea name="details" placeholder="Tell us more about your project" rows={5} /></label>
    <button className="company-submit" type="submit">Prepare enquiry email <ArrowRight size={17} /></button><EmailDraftNotice ready={ready} /><div className="company-form-trust"><span><Lock size={14} />Your email app</span><span><ShieldCheck size={14} />Your choice to send</span><span><Mail size={14} />No spam, ever</span></div>
  </form>;
}

export function CompanyContactPage() {
  return <div className="company-contact-page"><div className="mf-container"><header className="company-contact-hero"><p>Let’s Talk</p><h1>We’re Here To Help</h1><p>Ready to elevate your project with AI solutions? Contact us today!</p></header><ContactBooking />
    <div className="company-form-divider"><span />Or fill out the form below<span /></div><div className="company-contact-form-shell"><ContactForm /></div>
    <div className="company-contact-details"><div><Workflow size={20} /><h3>Company</h3><p>ManasFlow</p></div><div><Video size={20} /><h3>Let’s Talk</h3><p>Request a free strategy call</p></div><div><Mail size={20} /><h3>Email</h3><a href="mailto:info@manasflow.com">info@manasflow.com</a></div></div>
    <section className="company-static-faq"><h2>Before You Reach Out</h2><div>{data.contactFaqs.map(item => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</div><Link className="company-privacy-link" href="/privacy">Read our privacy notice <ArrowUpRight size={15} /></Link></section>
  </div></div>;
}

function CareerApplication() {
  const [languages, setLanguages] = useState(["EN"]);
  const [skills, setSkills] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  function toggle(value: string, values: string[], update: (next: string[]) => void) { update(values.includes(value) ? values.filter(item => item !== value) : [...values, value]); setError(""); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!languages.length || !skills.length) { setError("Please select at least one language and one skill."); return; }
    const form = new FormData(event.currentTarget);
    const body = `Hello ManasFlow,\n\nI'd like to join your team.\n\nFull name: ${form.get("fullName")}\nEmail: ${form.get("email")}\nPhone: ${form.get("phone") || "Not provided"}\nLinkedIn: ${form.get("linkedin")}\nGitHub: ${form.get("github")}\nDemo video: ${form.get("video")}\nLanguages: ${languages.join(", ")}\nSkills: ${skills.map(skill => skill === "Other" ? `Other: ${form.get("otherSkills")}` : skill).join(", ")}\n`;
    openEmail(`ManasFlow application: ${form.get("fullName")}`, body);
    setReady(true);
  }
  return <section id="apply" className="company-apply-section"><header><p className="company-eyebrow">Apply</p><h2>No CV. Show us what you’ve built.</h2><p>A short voice-narrated walkthrough of a real project gets you to the top of the pile.</p></header><form className="company-form company-careers-form" onSubmit={submit}>
    <div className="company-field-row"><label>Full name *<input name="fullName" placeholder="Your full name" autoComplete="name" required maxLength={100} /></label><label>Email *<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label></div>
    <label>Phone<input name="phone" type="tel" placeholder="+1 234 567 8900" autoComplete="tel" /></label>
    <div className="company-field-row"><label>LinkedIn *<input name="linkedin" type="url" placeholder="https://linkedin.com/in/..." required /></label><label>GitHub *<input name="github" type="url" placeholder="https://github.com/..." required /></label></div>
    <label>Demo video *<input name="video" type="url" placeholder="https://loom.com/share/..." required /><span className="company-field-help">Loom, YouTube, any public link. An AI agent running in a real app wins.</span></label><p className="company-voice-note"><Mic size={17} />Voice narration required. Walk us through what you built and why. Silent recordings are skipped.</p>
    <fieldset className="company-chip-field"><legend>Languages *</legend><div>{["EN", "FR"].map(language => <button type="button" key={language} aria-pressed={languages.includes(language)} onClick={() => toggle(language, languages, setLanguages)} className={languages.includes(language) ? "selected" : ""}>{language}</button>)}</div></fieldset>
    <fieldset className="company-chip-field"><legend>Skills *</legend><p>Pick everything that applies.</p><div>{data.skills.map(skill => <button type="button" key={skill} aria-pressed={skills.includes(skill)} onClick={() => toggle(skill, skills, setSkills)} className={skills.includes(skill) ? "selected" : ""}>{skill}</button>)}</div>{skills.includes("Other") && <label className="company-other-skills"><span className="sr-only">Other skills</span><input name="otherSkills" placeholder="Tell us your other skills" required /></label>}</fieldset>
    {error && <p className="company-form-error" role="alert">{error}</p>}<button className="company-submit" type="submit">Prepare application email <ArrowUpRight size={17} /></button><EmailDraftNotice ready={ready} />
  </form></section>;
}

export function CompanyCareersPage() {
  const valueIcons = [Cpu, Earth, Zap, Clock];
  return <div className="company-careers-page mf-container company-standard-page"><header className="company-careers-hero"><p className="company-eyebrow">We’re hiring · ManasFlow</p><h1>Build AI that actually runs.</h1><p>We embed engineers inside client teams to ship working agents, not slide decks. Two months in, partners and operators are running on what you built.</p><dl>{data.careerStats.map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl></header>
    <section className="company-career-values">{data.careerValues.map((value, index) => { const Icon = valueIcons[index]; return <article key={value.title}><Icon size={20} aria-hidden="true" /><h2>{value.title}</h2><p>{value.description}</p></article>; })}</section>
    <section className="company-career-builds"><p className="company-line-eyebrow">What you’ll build at ManasFlow</p><div>{[{ Icon: Bot, title: "Intelligent agents", text: "Build AI agents that work inside real products, connected to the tools businesses use every day." }, { Icon: Workflow, title: "Connected workflows", text: "Turn complex business operations into clear, dependable systems with n8n, Python, and modern infrastructure." }, { Icon: Code2, title: "Production software", text: "Own the work from the first prototype to the deployment. Ship useful systems and improve them with real feedback." }].map(({ Icon, title, text }) => <article key={title}><div className="company-abstract-build" aria-hidden="true"><i /><i /><Icon size={54} strokeWidth={1.25} /></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="company-career-fit"><div><p className="company-eyebrow">Who fits</p><h2>Builders who ship.<br />Not architects who deck.</h2><p>Senior or self-taught. We care about what’s running in your repo and whether real users touched it.</p></div><ol>{data.careerFit.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></section><CareerApplication />
  </div>;
}

const stack = [
  { name: "Claude Code", logo: "claude.png", role: "the brain · subagents · MCP" },
  { name: "Anthropic", logo: "anthropic.png", role: "managed agents · runtime" },
  { name: "Cursor", logo: "cursor.png", role: "IDE pair-programming" },
  { name: "n8n", logo: "n8n.png", role: "cron · webhooks · glue" },
  { name: "E2B", logo: "e2b.png", role: "sandboxed compute" },
];

function serviceImage(source: string) {
  const name = source.split("/").at(-1) || "";
  return name === "ai-staff-augmentation-browserbase.webp" || name === "engineer-placement-browserbase.webp" ? `pages/${name}` : name;
}

export function CompanyServicesPage() {
  const sectorIcons = [Truck, Building2, FileText];
  const governanceIcons = [ShieldCheck, Lock, Earth, Layers3];
  return <div className="company-services-page">
    <section className="mf-section company-services-hero"><div className="mf-container"><Reveal><Badge>Enterprise AI Solutions</Badge><h1>Enterprise Generative AI Solutions &amp;<br /><span className="accent">Automation Agency</span></h1><p>We bridge the gap between AI potential and business reality. From strategic <strong>AI Consulting Services</strong> to full-scale <strong>Enterprise AI Implementation</strong>, we build the systems that drive measurable ROI.</p><div className="company-service-actions"><Link href="/contact">Consult Our Experts <ArrowUpRight size={20} /></Link><Link href="/industries">Explore Our Expertise</Link></div><div className="company-service-trust"><p>Shipped for teams at</p><div>{["sage.png", "wonderbox.png", "neoday.png", "xgrowth.png", "arcads.png", "argil.svg", "earleads.png", "justrussel.svg"].map(name => <SiteImage name={`pages/${name}`} key={name} alt={name.split(".")[0]} />)}</div></div></Reveal></div></section>
    <section id="services" className="mf-section"><div className="mf-container"><Reveal className="company-service-section-heading"><h2>End-to-End AI Integration Framework</h2><p>Scaling AI requires more than just tools. It requires a synergy between specialized talent, automated workflows, and a trained workforce.</p></Reveal><div className="company-service-catalog">{data.services.map((service, index) => { const Icon = index === 0 ? Users : index === 2 ? GraduationCap : index === 9 ? ShieldCheck : Workflow; return <Reveal key={service.link} className="company-service-card"><SiteImage name={serviceImage(service.imageSrc)} alt={service.title} /><div><h3><span><Icon size={24} /></span>{service.title}</h3><p>{service.description}</p><h4>Key Capabilities:</h4><ul>{service.features.map(feature => <li key={feature}><Check size={12} />{feature}</li>)}</ul><p className="company-service-duration"><Clock size={16} />{service.duration}</p><Link href={service.link}>{index === 0 ? "Hire Experts" : index === 2 ? "Start Training" : "Build Workflows"}<ArrowUpRight size={16} /></Link></div></Reveal>; })}</div></div></section>
    <section className="company-service-sectors"><div className="mf-container"><h2>Specialized AI Solutions for High-Impact Sectors</h2><div>{data.sectors.map((sector, index) => { const Icon = sectorIcons[index]; return <Reveal key={sector.title}><Icon size={40} /><h3>{sector.title}</h3><p>{sector.description}</p></Reveal>; })}</div></div></section>
    <section className="mf-section company-service-comparison"><div className="mf-container"><div className="company-service-section-heading"><h2>Quantifiable Impact: Manual vs. AI-Driven Operations</h2><p>Transitioning to Secure AI Integration is not just a trend; it is a fundamental shift in operational efficiency.</p></div><div className="company-service-table" tabIndex={0} aria-label="Operational efficiency comparison"><table><thead><tr><th>Operational Metric</th><th>Traditional Manual Process</th><th>ManasFlow AI Ecosystem</th></tr></thead><tbody>{data.comparison.map(row => <tr key={row.metric}><th scope="row">{row.metric}</th><td>{row.manual}</td><td><Check size={16} />{row.ai}</td></tr>)}</tbody></table></div></div></section>
    <section className="mf-section"><div className="mf-container company-service-stack"><div><p className="company-line-eyebrow">The new AI software engineering</p><h2>Coding changed. Engineers stopped being the bottleneck.</h2><p>Our engineers ship with the same agent stack we run ourselves. <span className="accent">Claude Code</span> is the brain, MCP connects to your tools, E2B sandboxes every action. That is why one of our engineers ships like three normal hires.</p></div><ol>{stack.map((tool, index) => <li key={tool.name}><span>0{index + 1}</span><SiteImage name={tool.logo} alt="" /><strong>{tool.name}</strong><span>{tool.role}</span></li>)}</ol></div></section>
    <section className="company-service-production"><div className="mf-container"><div className="company-service-production-heading"><div><p className="company-line-eyebrow">Built to work</p><h2>Production systems,<br /><span className="accent">built around your business.</span></h2></div><p>Connected workflows. Intelligent agents. One approach, from the first idea to the systems your team runs every day.</p></div><div className="company-service-demos">{[["cursor-agent.webm", "AI agents shipping product features"], ["n8n-hero.webm", "Revenue automation running 24/7"], ["make-hero.webm", "Connected orchestrations across your stack"]].map(([video, title]) => <article key={video}><div><span /><span /><span /><p>manasflow / {video.split("-")[0]}</p></div><video autoPlay muted loop playsInline preload="metadata" aria-label={title}><source src={asset(video)} type="video/webm" /></video><h3>{title}</h3></article>)}</div></div></section>
    <section className="mf-section"><div className="mf-container"><div className="company-service-section-heading"><h2>Enterprise AI Governance &amp; <span className="accent">Data Security</span></h2><p>Security is not an afterthought; it is the foundation of every Secure AI Integration we deploy.</p></div><div className="company-service-governance">{data.governance.map((item, index) => { const Icon = governanceIcons[index]; return <Reveal key={item.title}><span><Icon size={24} /></span><div><h3>{item.title}</h3><p>{item.description}</p></div></Reveal>; })}</div></div></section>
    <section className="mf-section company-service-next"><div className="mf-container"><h2>Ready to Architect Your AI Future?</h2><p>Schedule a discovery call with our consultants to define your roadmap.</p><div className="company-service-actions"><Link href="/contact">Get Started Now <ArrowUpRight size={20} /></Link><Link href="/playbooks"><FileText size={20} />Explore Playbooks</Link></div><p className="company-service-support">Native FR/EN/AR Support · Secure Data Silos · GDPR Compliant</p></div></section>
    <section className="company-service-agencies"><div className="mf-container"><p className="company-eyebrow">Explore Solutions</p><h2>Find the engagement that fits</h2><div>{data.agencies.map(agency => <Link href={agency.href} key={agency.href}><h3>{agency.title}</h3><p>{agency.desc}</p></Link>)}</div></div></section>
    <section className="company-static-faq company-service-faq"><p className="company-eyebrow">Common Questions</p><h2>AI Services &amp; Engagement FAQ</h2><div>{data.serviceFaqs.map(item => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</div><CallButton href="/contact">Talk to Our Experts</CallButton></section>
  </div>;
}
