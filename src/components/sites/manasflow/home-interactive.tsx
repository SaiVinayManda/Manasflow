"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, GitBranch, Workflow, Zap } from "lucide-react";
import { ActionLink as Link } from "./booking-link";
import { SectionHeading, SiteImage } from "./shared";

const spotlights = [
  { title: "Connected workflows", subtitle: "Your tools. One seamless system.", image: "workflowmobile.webp", icon: Workflow },
  { title: "Intelligent agents", subtitle: "One human. Many possibilities.", image: "many-agents.svg", icon: GitBranch },
  { title: "Products that ship", subtitle: "From idea to production.", image: "ship-product.webp", icon: Zap },
  { title: "A clear AI strategy", subtitle: "Built around your business.", image: "ai-strategy-5-ways-we-automate.webp", icon: Workflow },
  { title: "Automation at scale", subtitle: "Systems that keep moving.", image: "money-refund.webp", icon: GitBranch },
];

export function AutomationSpotlight() {
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

export function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let nearViewport = false;
    let previous = -1;
    const update = () => {
      if (!nearViewport || frame || document.visibilityState === "hidden") return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const bounds = node.getBoundingClientRect();
        const next = Math.round(Math.min(1, Math.max(0, -bounds.top / Math.max(1, bounds.height - window.innerHeight))) * 200) / 200;
        if (next !== previous) { previous = next; setProgress(next); }
      });
    };
    const observer = new IntersectionObserver(([entry]) => { nearViewport = entry.isIntersecting; if (nearViewport) update(); }, { rootMargin: "100% 0px" });
    observer.observe(node);
    window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
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

