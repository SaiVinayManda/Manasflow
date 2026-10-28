"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Cable,
  Layers3,
  Workflow,
} from "lucide-react";

const services = [
  {
    title: "Digital products",
    summary: "Give a useful idea a place to live.",
    text: "An internal tool, a customer portal, or an idea that needs a first version. We work through the journeys, the design and the engineering together, with a clear scope for each step.",
    detail: [
      "Product discovery",
      "Interface design",
      "Web applications",
      "Ongoing iteration",
    ],
    icon: Braces,
  },
  {
    title: "Connected systems",
    summary: "Let your tools share the same conversation.",
    text: "When information lives in separate places, the handoffs need attention. We map what needs to move, decide where it belongs, and build the connections with their edge cases in mind.",
    detail: [
      "API integrations",
      "Data mapping",
      "Internal workflows",
      "Technical documentation",
    ],
    icon: Cable,
  },
  {
    title: "Practical automation",
    summary: "Start with the task. Question the technology.",
    text: "We look at the work before choosing a tool. Rules, automation and AI each have a place. Together we decide where they make sense, where a person stays involved, and how to check the result.",
    detail: [
      "Workflow mapping",
      "Automation prototypes",
      "AI-assisted tools",
      "Human review",
    ],
    icon: Workflow,
  },
  {
    title: "Product & web design",
    summary: "Make the next step feel considered.",
    text: "We turn a brief into a clear structure, then work through the words, interactions and visual details. A website should explain what matters and give people an understandable way forward.",
    detail: [
      "Website design",
      "Content structure",
      "Design systems",
      "Accessible interfaces",
    ],
    icon: Layers3,
  },
];

export function Services() {
  const [active, setActive] = useState(0);
  const current = services[active];
  const Icon = current.icon;
  return (
    <section className="services-section container" id="services">
      <div className="section-heading">
        <p className="eyebrow">01 / What we do</p>
        <h2>
          Good ideas deserve
          <br />
          <em>thoughtful execution.</em>
        </h2>
        <p>
          We can join at the question, the prototype, or the part that needs
          another look.
        </p>
      </div>
      <div className="services-layout">
        <div
          className="service-selectors"
          role="tablist"
          aria-label="Services"
          aria-orientation="vertical"
        >
          {services.map((service, index) => (
            <button
              role="tab"
              id={`service-tab-${index}`}
              aria-selected={active === index}
              aria-controls="service-panel"
              tabIndex={active === index ? 0 : -1}
              key={service.title}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  const next =
                    (index +
                      (event.key === "ArrowDown" ? 1 : services.length - 1)) %
                    services.length;
                  setActive(next);
                  document.getElementById(`service-tab-${next}`)?.focus();
                }
              }}
            >
              <span className="service-number">0{index + 1}</span>
              <span>{service.title}</span>
              <ArrowDown size={20} />
            </button>
          ))}
        </div>
        <div
          className="service-panel"
          id="service-panel"
          role="tabpanel"
          aria-labelledby={`service-tab-${active}`}
        >
          <div className="service-icon">
            <Icon size={52} strokeWidth={1} />
          </div>
          <p className="service-summary">{current.summary}</p>
          <p className="service-description">{current.text}</p>
          <ul>
            {current.detail.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link href={`/contact?topic=${encodeURIComponent(current.title)}`}>
            Talk through an idea <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </section>
  );
}
