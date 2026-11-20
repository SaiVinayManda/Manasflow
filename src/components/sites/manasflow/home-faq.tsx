"use client";

import { useState } from "react";
import homeFaqs from "@/data/manasflow/home-faqs.json";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { Reveal, SectionHeading } from "./shared";

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

