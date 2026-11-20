"use client";

import { useState } from "react";
import { ArrowRight, CircleCheckBig, Clock, FileText, Map, Search, Settings, TrendingUp, Users } from "lucide-react";
import { CallButton, Reveal, SectionHeading } from "./shared";

function CheckList({ points }: { points: readonly string[] }) { return <ul className="lower-check-list">{points.map(point => <li key={point}><CircleCheckBig size={20} aria-hidden="true" /><span>{point}</span></li>)}</ul>; }

const processSteps = [
  { title: "Discovery", duration: "Week 1", Icon: Search, description: "Free audit identifies automation opportunities", details: ["Comprehensive workflow analysis", "Bottleneck identification", "ROI opportunity assessment", "Custom automation roadmap"], deliverable: "Free Audit Report", involvement: "30-min consultation call", next: "Custom strategy delivered" },
  { title: "Strategy", duration: "Week 2", Icon: Map, description: "Custom roadmap delivered", details: ["Prioritized automation plan", "Integration architecture design", "Timeline & milestones", "ROI projections"], deliverable: "Automation Strategy Document", involvement: "Review & approve roadmap", next: "Implementation begins" },
  { title: "Implementation", duration: "Weeks 3-8", Icon: Settings, description: "Automation built & tested", details: ["Workflow development", "Integration setup", "Testing & quality assurance", "Team training & handoff"], deliverable: "Fully automated workflows", involvement: "Minimal—we handle everything", next: "Go live & monitor" },
  { title: "Optimization", duration: "Ongoing", Icon: TrendingUp, description: "Continuous improvement & support", details: ["Performance monitoring", "Regular optimizations", "24/7 support included", "New feature requests"], deliverable: "Continuous value delivery", involvement: "Feedback & growth planning", next: "Scale & expand automations" },
];

function StepDetails({ index }: { index: number }) {
  const step = processSteps[index];
  return <div className="lower-step-details">
    <div className="lower-step-facts">
      <div><span><Clock size={16} />Duration</span><p>{step.duration}</p></div>
      <div><span><FileText size={16} />Deliverable</span><p>{step.deliverable}</p></div>
      <div><span><Users size={16} />Your Involvement</span><p>{step.involvement}</p></div>
    </div>
    <div><h3>What We Do</h3><CheckList points={step.details} /></div>
    <div className="lower-next-step"><span><ArrowRight size={16} />Next Step</span><p>{step.next}</p></div>
  </div>;
}

export function Process() {
  const [active, setActive] = useState(0);
  return <section id="how-work-container" className="mf-section lower-process">
    <div className="mf-container">
      <SectionHeading badge="How We Work" title={<>Everything You Need to Become an <span className="accent">AI-First Company</span></>} description="Expert guidance, custom AI implementation, and hands-on training to help you adopt AI the right way." />
      <Reveal>
        <div className="lower-process-shared" data-active-step={active}>
          <div className="lower-process-track" aria-hidden="true"><span style={{ width: `${active / 3 * 100}%` }} /></div>
          <div className="lower-step-tabs" role="tablist" aria-label="Our implementation process">{processSteps.map(({ title, duration, Icon, description }, index) => <button key={title} id={`process-tab-${index}`} role="tab" aria-selected={active === index} aria-controls="process-details" className={`lower-step-tab ${active === index ? "active" : ""}`} onClick={() => setActive(index)}>
            <span className="lower-step-icon"><Icon size={32} aria-hidden="true" /></span>
            <span className="lower-step-body"><span className="lower-step-number">0{index + 1}<span>{duration}</span></span><strong>{title}</strong><span className="lower-step-description">{description}</span></span>
          </button>)}</div>
          <div role="tabpanel" id="process-details" aria-labelledby={`process-tab-${active}`} className="lower-process-details"><StepDetails key={active} index={active} /></div>
        </div>
      </Reveal>
      <div className="lower-centered lower-process-cta"><CallButton>Start Your Journey</CallButton></div>
    </div>
  </section>;
}

