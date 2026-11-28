"use client";

import { useState } from "react";
import { ActionLink as Link } from "./booking-link";
import { ArrowRight, Bot, CheckCircle2, FileText, MailCheck, Play, ShieldCheck, Workflow } from "lucide-react";
import { Badge, CallButton } from "./shared";
import { trackEvent } from "@/lib/analytics";
import "./automation-demo.css";

type DemoId = "lead-qual" | "invoice-ocr" | "support-triage";

type DemoScenario = {
  id: DemoId;
  label: string;
  service: string;
  inputLabel: string;
  samples: {
    name: string;
    input: string;
    extracted: { key: string; value: string }[];
    decision: string;
    action: string;
    approvalNote: string;
  }[];
};

const SCENARIOS: DemoScenario[] = [
  {
    id: "lead-qual",
    label: "AI Lead Qualification & Routing",
    service: "Lead Qualification",
    inputLabel: "Simulated inbound web enquiry",
    samples: [
      {
        name: "B2B SaaS Operations Team",
        input: "Hi, we run a 65-person SaaS company using HubSpot, Slack, and Postgres. Our reps spend 6 hours a day manually researching inbound signups and updating CRM notes before discovery calls.",
        extracted: [
          { key: "Segment", value: "B2B SaaS (51-200 staff)" },
          { key: "Stack Detected", value: "HubSpot, Slack, Postgres" },
          { key: "Indicative Score", value: "82 / 100 (High fit)" },
          { key: "Recommended Route", value: "Direct Engineering Discovery Queue" },
        ],
        decision: "Enrich domain, check duplicate account in HubSpot, assign Senior AI Engineer owner, and prepare pre-call brief in Slack.",
        action: "HubSpot Deal created + Slack brief queued for AE confirmation",
        approvalNote: "Human-in-the-loop gate: Outbound personalized reply waits for rep click before sending.",
      },
      {
        name: "Early Exploratory Inquiry",
        input: "We are a small 4-person consultancy curious about automating weekly client reporting spreadsheets next quarter.",
        extracted: [
          { key: "Segment", value: "Consultancy (1-10 staff)" },
          { key: "Stack Detected", value: "Spreadsheets / Reporting" },
          { key: "Indicative Score", value: "48 / 100 (Standard / Discovery)" },
          { key: "Recommended Route", value: "ROI Assessment + Playbook Resource" },
        ],
        decision: "Send curated Workflow Audit checklist first and offer optional 30-min scoping call — never auto-discard early enquiries.",
        action: "Tagged for advisory follow-up + starter checklist prepared",
        approvalNote: "Policy safeguard: Low automated score never rejects legitimate prospects without human review.",
      },
    ],
  },
  {
    id: "invoice-ocr",
    label: "Intelligent Document & Invoice Extraction",
    service: "Business Automation",
    inputLabel: "Simulated supplier delivery note & invoice",
    samples: [
      {
        name: "Quantity Mismatch Exception",
        input: "Supplier: Nordic Logistics GmbH | PO #48219 | Billed: 40 units @ $115 ($4,600) | Warehouse Received Scan: 36 units | Tax ID: DE-verified.",
        extracted: [
          { key: "Vendor & PO", value: "Nordic Logistics GmbH · PO #48219" },
          { key: "Line Discrepancy", value: "4 units short vs delivery scan (-$460)" },
          { key: "Extraction Confidence", value: "0.96 (Header) / Exception Flagged" },
          { key: "Queue Status", value: "Held for Finance Approval" },
        ],
        decision: "Match clean fields automatically to ERP draft ledger; pause payment posting and route only the 4-unit delta to AP clerk.",
        action: "Exception ticket created with side-by-side PO & receipt diff",
        approvalNote: "Financial control: ERP payment release strictly blocked until human finance sign-off.",
      },
      {
        name: "Exact Three-Way Match",
        input: "Supplier: CloudOps Infra Ltd | PO #48302 | Billed: Monthly compute Tier B ($1,250.00) | Approved Contract Rate: $1,250.00.",
        extracted: [
          { key: "Vendor & PO", value: "CloudOps Infra Ltd · PO #48302" },
          { key: "Variance Check", value: "$0.00 variance vs contract" },
          { key: "Extraction Confidence", value: "0.99 (Verified)" },
          { key: "Queue Status", value: "Ready for Batched Settlement" },
        ],
        decision: "Auto-reconcile line item against approved PO and log immutable audit entry with source PDF hash.",
        action: "Ledger entry staged + weekly AP digest updated",
        approvalNote: "Audit log: Correlation ID and extracted JSON archived for compliance.",
      },
    ],
  },
  {
    id: "support-triage",
    label: "AI Support Triage & Escalation",
    service: "AI Agent Development",
    inputLabel: "Simulated customer support ticket",
    samples: [
      {
        name: "Account Billing Dispute (Escalate)",
        input: "Hello, we were billed twice on invoice #9912 for our enterprise workspace. Please refund the duplicate charge immediately before Monday.",
        extracted: [
          { key: "Intent", value: "Billing / Refund Request" },
          { key: "Urgency", value: "High (financial / duplicate charge)" },
          { key: "Policy Action", value: "Mandatory Human Escalation" },
          { key: "KB Source Matched", value: "Billing Policy §4.2 — Refund SLA" },
        ],
        decision: "Fetch Stripe invoice history read-only, attach payment intent IDs to ticket, and escalate immediately to Billing Support lead.",
        action: "Priority ticket assigned with pre-verified Stripe transaction links",
        approvalNote: "Guardrail: Agent has read-only Stripe scope and cannot issue refunds autonomously.",
      },
      {
        name: "SSO Configuration Question (Cited Draft)",
        input: "How do we rotate the SAML signing certificate for Okta SSO in our sandbox workspace?",
        extracted: [
          { key: "Intent", value: "Technical Configuration / SSO" },
          { key: "Urgency", value: "Normal" },
          { key: "KB Source Matched", value: "Okta SAML Rotation Runbook v2.4" },
          { key: "Citation Check", value: "Grounded (2 verified doc sections)" },
        ],
        decision: "Compose cited step-by-step response grounded strictly in official documentation and include sandbox validation command.",
        action: "Cited reply drafted in Zendesk/Intercom for 1-click agent send",
        approvalNote: "Reliability check: Answers with zero KB match automatically abstain and route to L2 support.",
      },
    ],
  },
];

export function AutomationDemoSandbox() {
  const [scenarioId, setScenarioId] = useState<DemoId>("lead-qual");
  const [sampleIndex, setSampleIndex] = useState(0);
  const [hasRun, setHasRun] = useState(false);

  const scenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
  const sample = scenario.samples[sampleIndex] || scenario.samples[0];

  function selectScenario(nextId: DemoId) {
    setScenarioId(nextId);
    setSampleIndex(0);
    setHasRun(false);
    trackEvent("demo_started", { demo_id: nextId });
  }

  function runSimulation() {
    setHasRun(true);
    trackEvent("demo_completed", { demo_id: scenario.id, sample: sample.name });
  }

  return (
    <div className="mf-demo-page">
      <section className="demo-hero">
        <div className="mf-container">
          <Badge>Simulated Workflow Sandbox</Badge>
          <h1>See Production Automation Patterns in Action</h1>
          <p className="demo-lead">
            Explore how ManasFlow structures validation, deterministic routing, human approval gates, and audit trails across common business workflows.
          </p>
          <p className="demo-disclaimer" role="note">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              <strong>Synthetic Simulation Notice:</strong> This sandbox runs locally in your browser using synthetic sample records so zero customer data or live external APIs are triggered.
            </span>
          </p>
        </div>
      </section>

      <section className="mf-section">
        <div className="mf-container demo-workspace">
          <div className="demo-tabs" role="tablist" aria-label="Select workflow pattern">
            {SCENARIOS.map(item => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={scenario.id === item.id}
                className={scenario.id === item.id ? "active" : ""}
                onClick={() => selectScenario(item.id)}
              >
                {item.id === "lead-qual" ? <Bot size={16} /> : item.id === "invoice-ocr" ? <FileText size={16} /> : <Workflow size={16} />}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="demo-grid-panel">
            <div className="demo-card">
              <p className="demo-overline">Step 1 · Choose sample payload</p>
              <h2>{scenario.inputLabel}</h2>
              <div className="demo-sample-picks">
                {scenario.samples.map((entry, idx) => (
                  <button
                    key={entry.name}
                    type="button"
                    aria-pressed={sampleIndex === idx}
                    className={sampleIndex === idx ? "selected" : ""}
                    onClick={() => {
                      setSampleIndex(idx);
                      setHasRun(false);
                    }}
                  >
                    {entry.name}
                  </button>
                ))}
              </div>
              <pre className="demo-input-preview">{sample.input}</pre>
              <button type="button" className="mf-button demo-run-btn" onClick={runSimulation}>
                <Play size={16} aria-hidden="true" />
                {hasRun ? "Re-run Workflow Trace" : "Simulate Workflow Execution"}
              </button>
            </div>

            <div className="demo-card" aria-live="polite">
              <p className="demo-overline">Step 2 · Structured output &amp; guardrail decision</p>
              <h2>{hasRun ? "Execution Trace (Simulated)" : "Click Simulate to inspect output"}</h2>
              {hasRun ? (
                <div className="demo-output">
                  <dl className="demo-kv">
                    {sample.extracted.map(row => (
                      <div key={row.key}>
                        <dt>{row.key}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="demo-decision">
                    <strong><CheckCircle2 size={16} aria-hidden="true" /> Workflow Routing</strong>
                    <p>{sample.decision}</p>
                    <strong><MailCheck size={16} aria-hidden="true" /> Down-stream Action</strong>
                    <p>{sample.action}</p>
                  </div>
                  <p className="demo-guardrail">{sample.approvalNote}</p>
                </div>
              ) : (
                <p className="demo-placeholder">
                  Choose a scenario sample on the left and run the trace to see structured extraction, routing rules, and human approval boundaries.
                </p>
              )}
            </div>
          </div>

          <div className="demo-cta-strip">
            <div>
              <h3>Want this pattern built on your actual tools?</h3>
              <p>Pass this workflow focus directly into our scoping form or book a 30-minute engineering review.</p>
            </div>
            <div className="demo-cta-actions">
              <Link href={`/contact?service=${encodeURIComponent(scenario.service)}`} className="mf-button">
                Scope {scenario.service} <ArrowRight size={16} />
              </Link>
              <CallButton href="/consultation" secondary>
                Book 30-min call
              </CallButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
