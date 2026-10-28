"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Calculator, Clock, ClipboardCheck, Sparkles } from "lucide-react";
import toolsData from "@/data/manasflow/tools.json";
import { Newsletter } from "./chrome";
import { SiteImage } from "./shared";
import "./free-tools.css";

export function FreeToolsHub() {
  const [category, setCategory] = useState("All");
  const filtered = toolsData.tools.filter(tool => category === "All" || tool.category === category);
  return <div className="mf-container free-tools-hub"><header><h1>Free AI &amp; Automation Tools</h1><p>Calculators, assessments, and generators to help you make smarter AI decisions—all free, no credit card required.</p></header><div className="tools-newsletter"><Newsletter compact /></div>
    <div className="tools-category-tabs" role="tablist" aria-label="Tool categories">{["All", "Calculators", "Assessments", "Generators"].map(label => <button key={label} role="tab" type="button" aria-selected={category === label} aria-controls="tools-panel" className={category === label ? "active" : ""} onClick={() => setCategory(label)}>{label}{label !== "All" && <span>{toolsData.tools.filter(tool => tool.category === label).length}</span>}</button>)}</div>
    <div className="tools-hub-grid" role="tabpanel" id="tools-panel" aria-label={`${category} tools`}>{filtered.map(tool => { const Icon = tool.category === "Calculators" ? Calculator : tool.category === "Assessments" ? ClipboardCheck : Sparkles; return <Link href={`/tools/${tool.slug}`} key={tool.slug} className="tools-hub-card"><div className="tools-card-preview"><SiteImage name={tool.image} alt={`${tool.title} preview`} />{tool.popular && <span className="tools-popular">Popular</span>}</div><div className="tools-card-copy"><span className="tools-card-icon"><Icon size={20} /></span><div><span className="tools-card-category">{tool.category}</span><h2>{tool.title}</h2><p>{tool.description}</p><div className="tools-card-bottom"><span><Clock size={12} />{tool.time}</span><span>Try it <ArrowRight size={14} /></span></div></div></div></Link>; })}</div>
  </div>;
}

export function ToolsBackLink() {
  return <Link href="/tools" className="tools-back-link"><ArrowLeft size={16} />All Tools</Link>;
}
