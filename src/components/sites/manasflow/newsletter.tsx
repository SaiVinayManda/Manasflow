"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function Newsletter({ compact = false, formOnly = false, headingLevel = 3 }: { compact?: boolean; formOnly?: boolean; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const [email, setEmail] = useState("");
  const [prepared, setPrepared] = useState(false);
  const emailId = useId();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent("ManasFlow automation brief — subscription request");
    const body = encodeURIComponent(`Please send the weekly ManasFlow automation brief to ${email}.`);
    window.location.href = `mailto:info@manasflow.com?subject=${subject}&body=${body}`;
    setPrepared(true);
  }
  return <div className={`mf-newsletter ${compact ? "mf-newsletter-compact" : ""}`}>
    {!compact && !formOnly && <p className="mf-news-kicker">Free weekly brief</p>}
    {!formOnly && <><Heading className="mf-newsletter-title">{compact ? "Stay tuned" : "Steal our production automations"}</Heading>
    <p>{compact ? "Get the latest automation insights, playbooks, and case studies delivered to your inbox. No spam, ever." : "The exact n8n flows, Claude Code setups, and prompts we ship for clients, broken down step by step. No spam, unsubscribe anytime."}</p></>}
    <form onSubmit={submit}>
      <div className="mf-news-input">
        <label className="mf-sr-only" htmlFor={emailId}>Email address</label>
        <input id={emailId} type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setPrepared(false); }} placeholder={compact ? "Enter your email" : "you@company.com"} required />
        <button type="submit" aria-label="Prepare newsletter request">{compact ? <ArrowRight size={16} /> : <>Get the teardowns<ArrowUpRight size={16} /></>}</button>
      </div>
      <small role="status" data-nosnippet="">{prepared ? "Your email app has been opened with your request. Send it to join the brief." : "Prepare a subscription request in your email app."}</small>
    </form>
  </div>;
}

