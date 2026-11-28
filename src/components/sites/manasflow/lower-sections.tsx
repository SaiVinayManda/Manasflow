"use client";

import homeFaqs from "@/data/manasflow/home-faqs.json";

import { useState } from "react";
import { ActionLink as Link } from "./booking-link";
import {
  ArrowRight, ArrowUpRight, CircleCheckBig, Clock, Cpu, FileText,
  Layers3, Map, Minus, Plus, Search, Settings,
  ShieldCheck, Sparkles, TrendingUp, Users, Workflow, Zap,
} from "lucide-react";
import { CallButton, CallStrip, Reveal, SectionHeading, SiteImage } from "./shared";
import { BookingCard } from "./booking-link";
import "./lower-sections.css";

const solutions = [
  { title: "AI Consulting", image: "consulting", description: "Expert guidance on where and how to start becoming a leader in AI adoption", points: ["Strategic AI roadmap", "Technology assessment", "ROI analysis", "Best practice recommendations"] },
  { title: "AI Implementation", image: "implementation", description: "Custom-built AI solutions with seamless automation—from broken to production-ready", points: ["End-to-end development", "Seamless integrations", "Quality assurance", "Production-ready architecture"] },
  { title: "AI Training & Placement", image: "training", description: "Hands-on training and engineer placement to embed expertise in your organization", points: ["Interactive workshops", "Engineer placement", "Custom training programs", "Ongoing support"] },
];

function CheckList({ points }: { points: readonly string[] }) {
  return <ul className="lower-check-list">{points.map(point => <li key={point}><CircleCheckBig size={20} aria-hidden="true" /><span>{point}</span></li>)}</ul>;
}

export function Solutions() {
  return <section id="how-we-do-it" className="mf-section lower-solutions">
    <div className="mf-container">
      <SectionHeading badge="Our Solutions" title={<>Innovation Level: <span className="accent">High</span><br />Implementation Phase: <span className="broken-word">Broken</span> <span className="accent seamless-word">Seamless</span></>} description="Companies have incredible AI innovations ready to deploy. We make them work seamlessly in the real world." />
      <div className="lower-solution-grid">{solutions.map(item => <Reveal key={item.title} className="lower-solution-card">
        <div role="img" aria-label={item.title} className={`lower-solution-art lower-solution-art-${item.image}`} />
        <h3>{item.title}</h3><p>{item.description}</p><CheckList points={item.points} />
      </Reveal>)}</div>
      <div className="lower-centered"><CallButton>Make Your AI Implementation Seamless</CallButton></div>
    </div>
  </section>;
}

const processSteps = [
  { title: "Discovery", duration: "Week 1", Icon: Search, description: "Free audit identifies automation opportunities", details: ["Comprehensive workflow analysis", "Bottleneck identification", "ROI opportunity assessment", "Custom automation roadmap"], deliverable: "Free Audit Report", involvement: "30-min consultation call", next: "Custom strategy delivered" },
  { title: "Strategy", duration: "Week 2", Icon: Map, description: "Custom roadmap delivered", details: ["Prioritized automation plan", "Integration architecture design", "Timeline & milestones", "ROI projections"], deliverable: "Automation Strategy Document", involvement: "Review & approve roadmap", next: "Implementation begins" },
  { title: "Implementation", duration: "Weeks 3-8", Icon: Settings, description: "Automation built & tested", details: ["Workflow development", "Integration setup", "Testing & quality assurance", "Team training & handoff"], deliverable: "Fully automated workflows", involvement: "Minimal—we handle everything", next: "Go live & monitor" },
  { title: "Optimization", duration: "Ongoing", Icon: TrendingUp, description: "Continuous improvement & support", details: ["Performance monitoring", "Regular optimizations", "24/7 support included", "New feature requests"], deliverable: "Continuous value delivery", involvement: "Feedback & growth planning", next: "Scale & expand automations" },
];

function StepDetails({ index, mobile = false }: { index: number; mobile?: boolean }) {
  const step = processSteps[index];
  return <div className={`lower-step-details ${mobile ? "lower-step-details-mobile" : ""}`}>
    <div className="lower-step-facts">
      <div><span><Clock size={16} />Duration</span><p>{step.duration}</p></div>
      <div><span><FileText size={16} />Deliverable</span><p>{step.deliverable}</p></div>
      {!mobile && <div><span><Users size={16} />Your Involvement</span><p>{step.involvement}</p></div>}
    </div>
    <div><h3>What We Do</h3><CheckList points={step.details} /></div>
    {!mobile && <div className="lower-next-step"><span><ArrowRight size={16} />Next Step</span><p>{step.next}</p></div>}
  </div>;
}

export function Process() {
  const [active, setActive] = useState(0);
  return <section id="how-work-container" className="mf-section lower-process">
    <div className="mf-container">
      <SectionHeading badge="How We Work" title={<>Everything You Need to Become an <span className="accent">AI-First Company</span></>} description="Expert guidance, custom AI implementation, and hands-on training to help you adopt AI the right way." />
      <Reveal className="lower-process-desktop">
        <div className="lower-process-track"><span style={{ width: `${active / 3 * 100}%` }} /></div>
        <div className="lower-step-tabs" role="tablist" aria-label="Our implementation process">{processSteps.map(({ title, duration, Icon, description }, index) => <button key={title} id={`process-tab-${index}`} role="tab" aria-selected={active === index} aria-controls="process-details" className={`lower-step-tab ${active === index ? "active" : ""}`} onClick={() => setActive(index)}>
          <span className="lower-step-icon"><Icon size={32} aria-hidden="true" /></span>
          <span className="lower-step-number">0{index + 1}<span>{duration}</span></span>
          <strong>{title}</strong><span className="lower-step-description">{description}</span>
        </button>)}</div>
        <div role="tabpanel" id="process-details" aria-labelledby={`process-tab-${active}`} className="lower-desktop-details"><StepDetails key={active} index={active} /></div>
      </Reveal>
      <div className="lower-process-mobile">{processSteps.map(({ title, duration, Icon, description }, index) => <Reveal key={title} className={`lower-mobile-step ${active === index ? "active" : ""}`}>
        <button aria-expanded={active === index} aria-controls={`mobile-step-${index}`} onClick={() => setActive(index)}>
          <span className="lower-step-icon"><Icon size={28} aria-hidden="true" /></span><span className="lower-mobile-step-copy"><span className="lower-step-number">0{index + 1}<span>{duration}</span></span><strong>{title}</strong><span className="lower-step-description">{description}</span></span>
        </button>
        <div id={`mobile-step-${index}`} className={`lower-mobile-step-collapse ${active === index ? "open" : ""}`} inert={active !== index}><div><StepDetails index={index} mobile /></div></div>
      </Reveal>)}</div>
      <div className="lower-centered lower-process-cta"><CallButton>Start Your Journey</CallButton></div>
    </div>
  </section>;
}

const platformValues = [
  { title: "Clarity by Design", label: "Strategy & Direction", Icon: Layers3, description: "Start with the work that matters. Turn complex challenges into a clear, practical automation roadmap." },
  { title: "Intelligent Systems", label: "Architecture & Engineering", Icon: Cpu, description: "Purpose-built AI agents and connected workflows that make your tools work together, around the clock." },
  { title: "Built on Trust", label: "Security & Reliability", Icon: ShieldCheck, description: "Keep control of your systems and data with thoughtful architecture, transparent delivery, and dependable support." },
  { title: "Designed to Scale", label: "Automation & Growth", Icon: Workflow, description: "Build a foundation that grows with your business. Improve continuously, without adding unnecessary complexity." },
];

export function PlatformValues() {
  return <section id="team" className="mf-section lower-platform">
    <div className="mf-container">
      <SectionHeading centered={false} badge="The ManasFlow Approach" title={<>The Systems Behind the Possibilities<br /><strong>Powering <span className="accent">Your Automation</span></strong></>} description={<>A connected <Link href="/platform">platform</Link> of strategy, engineering, and intelligent automation.<br />Making AI work for your business, every step of the way.</>} />
      <div className="lower-values-grid">{platformValues.map(({ title, label, Icon, description }, index) => <Reveal key={title} className="lower-value-card">
        <div className={`lower-value-art lower-value-art-${index}`} aria-hidden="true"><span className="lower-value-ring" /><span className="lower-value-orbit" /><Icon size={60} strokeWidth={1.25} /><i /><i /><i /></div>
        <div className="lower-value-copy"><h3>{title}</h3><span>{label}</span><p>{description}</p></div>
      </Reveal>)}</div>
    </div>
  </section>;
}

export function Consultation() {
  return <section id="consultation" className="mf-section lower-consultation">
    <div className="mf-container">
      <SectionHeading badge="Free Consultation" title={<>See What Your Team Can Hand to <span className="accent">AI Agents</span></>} description="Book a free 30-minute call. One of our senior engineers maps your workflows and shows you exactly what a fleet of AI agents could take off your plate, measured in hours back to your team. You keep the roadmap, whether we work together or not." />
      <Reveal className="lower-consultation-panel">
        <div className="lower-consultation-copy">
          <h3>Book a Free 30-Minute Call</h3><p className="lower-consultation-lead">We’ll map your workflows and show you exactly what a fleet of AI agents, run by one senior engineer, could take off your team’s plate. No slide deck, no sales pitch. Just a working session, and a plan you can use whether we work together or not.</p>
          <p className="lower-direct-email" data-nosnippet="">Don’t want a call? Email <a href="mailto:info@manasflow.com">info@manasflow.com</a></p>
          <Link href="/contact" className="lower-outline-button">Book a Free Call <ArrowUpRight size={20} /></Link>
          <ul className="lower-consultation-benefits"><li><Users size={17} />Free 30-Minute Strategy Call</li><li><CircleCheckBig size={17} />Scoped Automation Roadmap</li><li><Clock size={17} />Same-Day Response</li></ul>
          <div className="lower-company-promise"><Sparkles size={27} aria-hidden="true" /><p>One connected approach. From the first workflow to a company that runs smarter.</p><span>Built around your business. Powered by ManasFlow.</span></div>
          <div className="lower-featured"><p>Built with the tools your team already knows</p><div><SiteImage name="claude.png" alt="Claude" /><SiteImage name="n8n.png" alt="n8n" /><SiteImage name="supabase.png" alt="Supabase" /><SiteImage name="github.png" alt="GitHub" /></div></div>
        </div>
        <div className="lower-consultation-form"><BookingCard id="strategy-request" /></div>
      </Reveal>
      <Reveal className="lower-consultation-notes"><span><Clock size={16} />US morning (ET/CT/PT) &amp; EU overlap</span><span><Zap size={16} />No commitment required</span><span><CircleCheckBig size={16} />A roadmap you can keep</span><span><ShieldCheck size={16} />Senior engineer led</span></Reveal>
    </div>
  </section>;
}

const faqs = homeFaqs;

export function FAQ() {
  const [active, setActive] = useState<number | null>(0);
  return <section id="faq" className="mf-section lower-faq"><div className="mf-container">
    <SectionHeading badge="FAQ’s" title={<>Get Your Questions <span className="accent">Answered</span></>} description="Get answers to common questions about our automation process, pricing, and results." />
    <Reveal><div className="lower-faq-list">{faqs.map(({ question, answer }, index) => <div key={question} className={`lower-faq-item ${active === index ? "open" : ""}`}>
      <button type="button" id={`faq-question-${index}`} aria-expanded={active === index} aria-controls={`faq-answer-${index}`} onClick={() => setActive(active === index ? null : index)}><span>{question}</span>{active === index ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}</button>
      <div id={`faq-answer-${index}`} className="lower-faq-collapse" role="region" aria-labelledby={`faq-question-${index}`} inert={active !== index}><div><p>{answer}</p></div></div>
    </div>)}</div></Reveal>
    <Reveal className="lower-questions-card"><h3>Still Have Questions?</h3><p>Feel free to get in touch with us today!</p><a href="mailto:info@manasflow.com" className="lower-outline-button">Ask A Question <ArrowUpRight size={16} /></a></Reveal>
  </div></section>;
}

export function LowerSections() {
  return <><Solutions /><Process /><PlatformValues /><CallStrip /><Consultation /><FAQ /></>;
}
