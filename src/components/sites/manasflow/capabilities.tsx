"use client";

import { useEffect, useState } from "react";
import { ActionLink as Link } from "./booking-link";
import { Code2, Globe, PenTool, Search, TrendingUp, Users } from "lucide-react";
import { Reveal, SectionHeading, SiteImage } from "./shared";
import "./capabilities.css";

const codeLines = [
  "class AIAgent:",
  "  def __init__(self, name):",
  "    self.name = name",
  "    self.mode = 'listening'",
  "",
  "  def run(self, task):",
  "    result = self.think(task)",
  "    self.act(result)",
  "    return result",
];

const workflowTools = [
  ["Notion", "service-notion.webp"], ["Slack", "service-slack.webp"],
  ["Google", "service-google.webp"], ["Microsoft", "service-microsoft.webp"],
  ["Salesforce", "service-salesforce.svg"], ["HubSpot", "service-hubspot.svg"],
  ["Zapier", "service-zapier.svg"], ["Trello", "service-trello.svg"],
  ["Jira", "service-jira.svg"], ["Asana", "integration-14-asana.svg"],
  ["Airtable", "integration-09-airtable.svg"], ["Monday", "service-monday.svg"],
  ["Mailchimp", "integration-05-mailchimp.svg"], ["Discord", "service-discord.svg"],
  ["Figma", "service-figma.svg"], ["GitHub", "service-github.svg"],
  ["Stripe", "service-stripe.svg"], ["Webflow", "service-webflow.svg"],
  ["Shopify", "service-shopify.svg"], ["Intercom", "service-intercom.svg"],
  ["Zendesk", "service-zendesk.svg"], ["Atlassian", "service-atlassian.svg"],
  ["Adobe", "service-adobe.svg"], ["Canva", "service-canva.svg"],
  ["Spotify", "service-spotify.svg"], ["Netflix", "service-netflix.svg"],
  ["Zoom", "service-zoom.svg"],
] as const;

function TaskStatus({ kind }: { kind: "check" | "working" | "empty" }) {
  if (kind === "empty") return <span className="mf-task-empty" />;
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    {kind === "check"
      ? <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" />
      : <path d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 .849976 7.49998 .849976C3.43716 .849976 .849976 4.18537 .849976 7.49998C.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z" fill="currentColor" />}
  </svg>;
}

function TaskList() {
  return <div className="mf-task-list">
    {["Social media post", "Employee Tracking", "Payment reminder", "Goal management"].map((task, index) => <div className={`mf-task-row ${index === 1 ? "mf-task-active" : "mf-task-disabled"}`} key={task}>
      {index === 0 ? <span className="mf-task-cross">❌</span> : index === 1 ? <Users size={20} /> : <svg width="20" height="20" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M7.50009 .877014C3.84241 .877014 .877258 3.84216 .877258 7.49984C.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 .877014 7.50009 .877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z" fill="currentColor" /></svg>}
      <span>{task}</span><TaskStatus kind={index === 1 ? "working" : index === 3 ? "empty" : "check"} />
    </div>)}
  </div>;
}

function WorkflowDiagram() {
  return <>
    <SiteImage name="workflowmobile.webp" alt="Connected automation tools" className="mf-workflow-mobile" />
    <div className="mf-workflow-desktop" aria-label="27 tools connected to your workflows">
      {workflowTools.map(([name, logo], index) => <div className="mf-workflow-icon" title={name} key={name} style={{ left: `${(index % 9) * 11.5}%`, top: `${5 + Math.floor(index / 9) * 30}%` }}>
        <SiteImage name={logo} alt={name} />
      </div>)}
    </div>
  </>;
}

function AgentEditor() {
  const [characters, setCharacters] = useState<number | null>(null);
  const code = codeLines.join("\n");
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let count = 0;
    let holdUntil = 0;
    const timer = window.setInterval(() => {
      if (Date.now() < holdUntil) return;
      count += 1;
      if (count > code.length) count = 0;
      if (count === code.length) holdUntil = Date.now() + 3000;
      setCharacters(count);
    }, 150);
    return () => window.clearInterval(timer);
  }, [code]);
  const displayed = characters === null ? codeLines : code.slice(0, characters).split("\n");
  return <div className="mf-agent-editor">
    <div className="mf-agent-toolbar"><span className="mf-editor-lights"><i /><i /><i /></span><span>agent.py <Code2 size={16} /></span></div>
    <div className="mf-agent-code" aria-label="Example AI agent Python code">
      {codeLines.map((line, index) => <div className="mf-code-line" key={index}><span>{index + 1}</span><pre>{displayed[index] ?? " "}</pre></div>)}
    </div>
  </div>;
}

function ResearchPreview() {
  const categories = [{ text: "Software & app industry", Icon: Globe }, { text: "UX/UI design industry", Icon: PenTool }, { text: "High Converting customer", Icon: Users }];
  return <div className="mf-research-preview">
    <div className="mf-research-input"><Search size={16} /><span>Research anything...</span><span className="mf-research-label">Research</span></div>
    {categories.map(({ text, Icon }) => <div className="mf-research-category" key={text}><Icon size={20} /><span>{text}</span><TrendingUp size={16} /></div>)}
  </div>;
}

const capabilities = [
  { title: "Automate Repetitive Tasks", description: "Eliminate up to 80% of repetitive tasks and reclaim 20+ hours per week to focus on high-value strategic work", graphic: <TaskList />, className: "mf-capability-tasks" },
  { title: "Automated Workflows", description: "Connect 100+ tools seamlessly. Build intelligent workflows that run 24/7 autonomously, eliminating manual intervention", graphic: <WorkflowDiagram />, className: "mf-capability-workflows" },
  { title: "Custom AI Agent Development", description: "Custom AI agents that intelligently handle customer inquiries, qualify leads, and close deals automatically around the clock", graphic: <AgentEditor />, className: "mf-capability-agent" },
  { title: "Real-Time Intelligence", description: "Access real-time business intelligence that predicts market trends and identifies opportunities before your competitors can react", graphic: <ResearchPreview />, className: "mf-capability-research" },
  { title: "AI Strategy Consulting", description: "A ranked, scoped AI roadmap designed by automation experts, not a slide deck of trends", graphic: <SiteImage name="ai-strategy-5-ways-we-automate.webp" alt="AI strategy cycle and connected analytics" className="mf-strategy-graphic" />, className: "mf-capability-strategy" },
];

export function Capabilities() {
  return <section id="services" className="mf-section mf-capabilities">
    <div className="mf-container">
      <SectionHeading badge="Our Capabilities" title={<>5 Ways We Automate Your <span className="accent">Business Growth</span></>} description="Transform repetitive tasks into intelligent workflows. Automate what matters most and scale what delivers results." />
      <div className="mf-capability-grid">
        {capabilities.map((capability) => <Reveal key={capability.title} className={`mf-capability-card ${capability.className}`}>
          <div className="mf-capability-graphic">{capability.graphic}</div>
          <div className="mf-capability-copy"><h3>{capability.title}</h3><p>{capability.description}</p></div>
        </Reveal>)}
      </div>
    </div>
  </section>;
}

const tools = [
  { name: "N8n Automation", description: "No-code workflow builder that seamlessly connects 400+ apps, unlocking unlimited automation possibilities for your business", image: "tool-n8n.webp", logo: "n8n-color.webp" },
  { name: "Make Integration", description: "Enterprise-grade automation platform connecting 6,000+ apps with zero coding required, perfect for scaling operations", image: "tool-make.webp", logo: "service-make.webp" },
  { name: "Cursor IDE", description: "AI-powered development platform that writes, debugs, and refactors code faster using full-repository context", image: "tool-cursor.webp", logo: "cursor-logo.webp" },
  { name: "Claude Code", description: "Anthropic's agentic coding tool that reads your codebase, edits files, runs commands, and ships features end-to-end", image: "tool-claude-code.webp", logo: "tool-claude-code.webp" },
];

export function Tools() {
  return <section id="our-services" className="mf-section mf-tools">
    <div className="mf-container">
      <SectionHeading badge="Certified Experts" title={<>Powerful Tools, <span className="accent">Expert Implementation</span></>} description={<>We&apos;re certified experts in the world&apos;s most powerful automation platforms, delivering custom solutions that integrate seamlessly with your existing tech stack. See our <Link href="/services">AI automation services</Link> in action.</>} />
      <Reveal>
        <div className="mf-tools-viewport" tabIndex={0} role="region" aria-label="Automation platforms; hover or focus to pause">
          <div className="mf-tools-track">
            {[0, 1].map((copy) => <div className="mf-tools-group" key={copy} aria-hidden={copy > 0 ? true : undefined} data-nosnippet={copy > 0 ? "" : undefined} inert={copy > 0 ? true : undefined}>
              {tools.map((tool) => <article className="mf-tool-card" key={tool.name}>
                <SiteImage name={tool.image} alt={`${tool.name} screenshot`} className="mf-tool-screenshot" />
                <div className="mf-tool-copy"><span className="mf-tool-logo"><SiteImage name={tool.logo} /></span><div><h3>{tool.name}</h3><p>{tool.description}</p></div></div>
              </article>)}
            </div>)}
          </div>
        </div>
      </Reveal>
    </div>
  </section>;
}
