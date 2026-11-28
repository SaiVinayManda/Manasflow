import { ActionLink as Link } from "./booking-link";
import { ArrowRight, CheckCircle2, Clock, Cpu, GitBranch, KeyRound, Lock, ShieldCheck, Users } from "lucide-react";
import { Badge, CallButton, Reveal } from "./shared";
import { site } from "@/lib/site";
import "./security-page.css";

const safeguards = [
  {
    Icon: KeyRound,
    title: "Scoped credentials & secrets isolation",
    description:
      "Agents and workflows run with short-lived API keys or least-privilege service accounts inside isolated runtime secrets rather than broad personal administrator tokens.",
  },
  {
    Icon: ShieldCheck,
    title: "Human-in-the-loop approval gates",
    description:
      "Sensitive side effects — financial payouts, external customer emails, or CRM record deletions — pass through deterministic confidence thresholds and explicit Slack or UI sign-off queues.",
  },
  {
    Icon: Cpu,
    title: "Sandboxed execution & code isolation",
    description:
      "Automated code evaluation and tool execution run inside ephemeral micro-VM sandboxes (such as E2B) or customer-controlled worker nodes with bounded network egress.",
  },
  {
    Icon: Clock,
    title: "Structured monitoring & audit trails",
    description:
      "Every automated trigger, model invocation, tool call, and exception route logs non-sensitive correlation IDs and execution outcomes so operators can audit what ran and why.",
  },
];

const deploymentModes = [
  {
    name: "Self-hosted inside your VPC or cluster",
    summary: "Run n8n workers, Python agent services, and vector stores directly on your AWS, GCP, Azure, or on-premise infrastructure.",
    points: [
      "Customer retains direct ownership of compute, networking, and databases",
      "Direct integration with internal VPNs, Postgres replicas, and SSO directories",
      "Full repository and Terraform/Docker deployment definitions committed to your Git",
    ],
  },
  {
    name: "Managed cloud stack on customer accounts",
    summary: "Deploy across modern SaaS & serverless infrastructure (Vercel, Supabase, managed model APIs) provisioned under your organization's accounts.",
    points: [
      "Zero middleman markup on external cloud or token billing",
      "Clean separation between development, staging, and production secrets",
      "Clear handoff runbooks and post-deployment observability",
    ],
  },
];

const engagementModels = [
  {
    step: "01",
    title: "Free 30-Min Automation Assessment",
    description: "Map your highest-friction workflows with a senior engineer and receive a practical prioritization summary.",
  },
  {
    step: "02",
    title: "Scoped Automation Pilot",
    description: "Ship one production workflow or internal agent into your stack with measurable latency, accuracy, and time-saved checks.",
  },
  {
    step: "03",
    title: "Embedded Forward-Deployed Engineer",
    description: `Dedicated engineering capacity inside your sprint cadence — pairing one human lead with specialized coding and QA agents across ${site.stats.connectedTools} supported tools.`,
  },
  {
    step: "04",
    title: "Ongoing Managed Reliability",
    description: "Continuous model evaluation, prompt/connector maintenance, API upgrades, and workflow expansion as your business scales.",
  },
];

export function SecurityArchitecturePage() {
  return (
    <div className="mf-security-page">
      <section className="sec-hero">
        <div className="mf-container sec-hero-inner">
          <Badge>Security, Ownership &amp; Delivery</Badge>
          <h1>
            Built to run safely inside <span className="accent">your infrastructure</span>
          </h1>
          <p className="sec-hero-lead">
            Every ManasFlow engagement is engineered around customer code ownership, credential isolation, human oversight, and transparent third-party licensing — without black-box lock-in.
          </p>
          <div className="sec-hero-actions">
            <CallButton href="/consultation">Book a {site.stats.consultationMinutes}-Min Architecture Call</CallButton>
            <Link href="/contact?service=Custom%20AI%20Solutions" className="sec-outline-link">
              Discuss security requirements <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mf-section sec-pillars">
        <div className="mf-container">
          <div className="sec-section-head">
            <p className="sec-eyebrow">Core safeguards</p>
            <h2>Operational security &amp; runtime controls</h2>
            <p>Practical engineering controls applied across AI agents, workflow orchestrators, and internal tools.</p>
          </div>
          <div className="sec-grid-2">
            {safeguards.map(({ Icon, title, description }) => (
              <Reveal key={title} className="sec-card">
                <Icon size={24} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mf-section sec-deployment">
        <div className="mf-container">
          <div className="sec-section-head">
            <p className="sec-eyebrow">Infrastructure &amp; data isolation</p>
            <h2>Self-hosted vs. customer-account cloud</h2>
            <p>You keep control over data residency, vendor model agreements, and source repositories from day one.</p>
          </div>
          <div className="sec-grid-2">
            {deploymentModes.map(mode => (
              <Reveal key={mode.name} className="sec-card">
                <Lock size={22} aria-hidden="true" />
                <h3>{mode.name}</h3>
                <p>{mode.summary}</p>
                <ul>
                  {mode.points.map(point => (
                    <li key={point}>
                      <CheckCircle2 size={16} aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mf-section sec-models">
        <div className="mf-container">
          <div className="sec-section-head">
            <p className="sec-eyebrow">Commercial transparency</p>
            <h2>How engagements work &amp; timezone coverage</h2>
            <p>Structured delivery stages, customer-owned IP, and daily working-hour overlap for US and European teams.</p>
          </div>
          <div className="sec-grid-4">
            {engagementModels.map(model => (
              <article key={model.step} className="sec-step-card">
                <span>{model.step}</span>
                <h3>{model.title}</h3>
                <p>{model.description}</p>
              </article>
            ))}
          </div>
          <div className="sec-transparency-grid">
            <div className="sec-card">
              <GitBranch size={22} aria-hidden="true" />
              <h3>Code, IP &amp; Third-Party Costs</h3>
              <p>
                Production repositories, custom workflows, and documentation live in your organization’s GitHub/infrastructure. Self-hostable open-source core tools run inside your environment, commercial SaaS or model APIs run on your accounts, and month-one retainer guarantees follow written eligibility terms in{" "}
                <Link href="/terms#refund-policy">Section 9 of our Website Terms</Link>.
              </p>
            </div>
            <div className="sec-card">
              <Users size={22} aria-hidden="true" />
              <h3>US &amp; International Collaboration</h3>
              <p>
                Registered in Milan, Italy and operating remote-first across Europe (`CET`/`CEST`), our engineering team schedules live working sessions, sprint check-ins, and support coverage during US morning and early afternoon hours (`8:00 AM–2:00 PM EST` / `7:00 AM–1:00 PM CST`), alongside European business hours.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
