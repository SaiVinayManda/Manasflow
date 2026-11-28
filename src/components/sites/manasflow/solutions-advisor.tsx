"use client";

import { useMemo, useState } from "react";
import { ActionLink as Link } from "./booking-link";
import { ArrowRight, Bot, Check, ShieldCheck } from "lucide-react";
import caseStudiesData from "@/data/manasflow/case-studies.json";
import servicePagesData from "@/data/manasflow/service-pages.json";
import { Badge, CallButton } from "./shared";
import { trackEvent } from "@/lib/analytics";
import "./automation-demo.css";

const GOALS = [
  { id: "workflow", label: "Automate repetitive back-office or document work", service: "Workflow Automation", route: "/workflow-automation", pattern: "Documents to Decisions" },
  { id: "agents", label: "Build custom AI agents for support or internal operations", service: "AI Agent Development", route: "/ai-agent-development", pattern: "Knowledge in daily work" },
  { id: "growth", label: "Automate lead research, CRM enrichment & outbound", service: "Lead Qualification", route: "/marketing-automation-agency", pattern: "Growth workflow" },
  { id: "engineer", label: "Embed a dedicated forward-deployed AI engineer", service: "Engineer Placement", route: "/engineer-placement", pattern: "Execution capacity" },
  { id: "saas", label: "Build or modernize an AI SaaS product / MVP", service: "SaaS MVP Development", route: "/saas-mvp-development", pattern: "AI features in product" },
] as const;

function sanitizeQuery(raw: string): string {
  return raw.replace(/[<>{}`]/g, "").slice(0, 180).trim();
}

/**
 * Deterministic Solutions Advisor backed strictly by verified ManasFlow services
 * and case studies — zero unverified external LLM spend, zero invented pricing/claims.
 */
export function SolutionsAdvisor() {
  const [goalId, setGoalId] = useState<string>(GOALS[0].id);
  const [deployment, setDeployment] = useState<"vpc" | "cloud" | "undecided">("undecided");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedGoal = useMemo(() => GOALS.find(g => g.id === goalId) || GOALS[0], [goalId]);
  const cleanNotes = sanitizeQuery(notes);

  const matchedService = useMemo(() => {
    const slug = selectedGoal.route.slice(1);
    return servicePagesData.find(s => s.slug === slug);
  }, [selectedGoal]);

  const matchedClients = useMemo(
    () => caseStudiesData.clients.filter(c => c.pattern === selectedGoal.pattern).slice(0, 2),
    [selectedGoal],
  );

  return (
    <div className="mf-demo-page">
      <section className="demo-hero">
        <div className="mf-container">
          <Badge>Grounded Solutions Advisor</Badge>
          <h1>Match Your Stack &amp; Priority to a Delivery Path</h1>
          <p className="demo-lead">
            Select your primary bottleneck and deployment preference to inspect matching ManasFlow services, verified reference engagements, and security safeguards — without generic chatbot hallucination.
          </p>
          <p className="demo-disclaimer" role="note">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              <strong>Deterministic Advisor Notice:</strong> Recommendations draw strictly from published ManasFlow service specs and verified client patterns. Scope estimates and timelines are finalized only with a human engineer.
            </span>
          </p>
        </div>
      </section>

      <section className="mf-section">
        <div className="mf-container demo-grid-panel">
          <form
            className="demo-card"
            onSubmit={event => {
              event.preventDefault();
              setSubmitted(true);
              trackEvent("cta_click", { cta: "solutions_advisor_match", goal: selectedGoal.id, deployment });
            }}
          >
            <p className="demo-overline">Your requirements</p>
            <h2><Bot size={20} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: 8 }} aria-hidden="true" />Scope inputs</h2>
            <label style={{ display: "grid", gap: 8, fontSize: 14, fontWeight: 600 }}>
              Primary outcome needed
              <select
                value={goalId}
                onChange={e => setGoalId(e.target.value)}
                style={{ padding: "12px", background: "#0f0f15", color: "#fff", border: "1px solid var(--border)" }}
              >
                {GOALS.map(item => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: 8, fontSize: 14, fontWeight: 600 }}>
              Infrastructure preference
              <select
                value={deployment}
                onChange={e => setDeployment(e.target.value as "vpc" | "cloud" | "undecided")}
                style={{ padding: "12px", background: "#0f0f15", color: "#fff", border: "1px solid var(--border)" }}
              >
                <option value="undecided">Undecided — recommend best fit</option>
                <option value="vpc">Self-hosted / inside our VPC</option>
                <option value="cloud">Customer-owned cloud &amp; SaaS stack</option>
              </select>
            </label>
            <label style={{ display: "grid", gap: 8, fontSize: 14, fontWeight: 600 }}>
              Existing tools or constraint notes (optional)
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g., HubSpot, Postgres, Slack, SOC-aligned review rules"
                style={{ padding: "12px", background: "#0f0f15", color: "#fff", border: "1px solid var(--border)" }}
              />
            </label>
            <button type="submit" className="mf-button demo-run-btn">
              Match Recommended Path <ArrowRight size={16} />
            </button>
          </form>

          <div className="demo-card" aria-live="polite">
            <p className="demo-overline">Recommended track</p>
            <h2>{matchedService?.badge || selectedGoal.service}</h2>
            <p className="demo-placeholder">
              {matchedService?.intro || selectedGoal.label}
              {cleanNotes ? ` (Noted constraints: ${cleanNotes})` : ""}
            </p>
            <div className="demo-decision">
              <strong>Deployment &amp; Ownership Posture</strong>
              <p>
                {deployment === "vpc"
                  ? "Deploy workflows and Python agents directly inside your private cluster or VPC with scoped credentials."
                  : deployment === "cloud"
                    ? "Deploy under your organization's own Vercel, Supabase, n8n, or model vendor accounts with full repository ownership."
                    : "Flexible self-hosted core (n8n / MCP) or customer-owned cloud stack, decided during your 30-min scoping session."}
              </p>
              <strong>Verified Reference Patterns</strong>
              {matchedClients.map(client => (
                <p key={client.name} style={{ margin: "4px 0" }}>
                  <Check size={14} style={{ display: "inline", marginRight: 6 }} aria-hidden="true" />
                  <strong>{client.name}</strong> ({client.descriptor}): {client.results[0]}
                </p>
              ))}
            </div>
            <div className="demo-cta-actions">
              <Link
                href={`/contact?service=${encodeURIComponent(selectedGoal.service)}`}
                className="mf-button"
              >
                Request Scoped Estimate <ArrowRight size={16} />
              </Link>
              <Link href={selectedGoal.route} className="sec-outline-link">
                Inspect {selectedGoal.service}
              </Link>
              {submitted && (
                <CallButton href="/consultation" secondary>
                  Escalate to Human Engineer
                </CallButton>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
