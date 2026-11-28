"use client";

import { useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { createSubmissionKey } from "@/lib/attribution";

export function Newsletter({ compact = false, formOnly = false, headingLevel = 3 }: { compact?: boolean; formOnly?: boolean; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "subscribed" | "draft" | "error">("idle");
  const [error, setError] = useState("");
  const emailId = useId();
  const loadedAtRef = useRef<number>(0);
  const keyRef = useRef<string>("");
  function markStart() {
    if (!loadedAtRef.current) loadedAtRef.current = Date.now();
    if (!keyRef.current) keyRef.current = createSubmissionKey("news");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = email.trim();
    if (!cleaned) return;
    const formData = new FormData(event.currentTarget);
    const trap = String(formData.get("contact_trap") || "");
    setStatus("submitting");
    setError("");
    const openFallback = () => {
      const subject = encodeURIComponent("ManasFlow automation brief — subscription request");
      const body = encodeURIComponent(`Please send the weekly ManasFlow automation brief to ${cleaned}.`);
      window.location.href = `mailto:info@manasflow.com?subject=${subject}&body=${body}`;
      setStatus("draft");
    };
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleaned,
          marketingConsent: true,
          source: compact ? "footer" : "inline",
          contact_trap: trap,
          formLoadedAt: loadedAtRef.current,
          idempotencyKey: keyRef.current,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; fallback?: string; error?: string };
      if (response.ok && result.ok) {
        trackEvent("newsletter_signup", { source: compact ? "footer" : "inline" }, { eventId: keyRef.current });
        keyRef.current = createSubmissionKey("news");
        setStatus("subscribed");
        setEmail("");
        return;
      }
      if (result.fallback === "mailto") {
        openFallback();
        return;
      }
      trackEvent("form_error", { form_name: "newsletter", status: response.status });
      setStatus("error");
      setError(result.error || "Unable to subscribe right now. Please email info@manasflow.com.");
    } catch {
      openFallback();
    }
  }

  const helperText = status === "error"
    ? error
    : status === "subscribed"
      ? "You’re subscribed to the weekly ManasFlow automation brief. Unsubscribe anytime."
      : status === "draft"
        ? "Direct signup is offline here, so your email app opened with your request."
        : "Separate marketing opt-in for weekly teardowns. Unsubscribe anytime via /api/newsletter/unsubscribe.";
  return <div className={`mf-newsletter ${compact ? "mf-newsletter-compact" : ""}`}>
    {!compact && !formOnly && <p className="mf-news-kicker">Free weekly brief</p>}
    {!formOnly && <><Heading className="mf-newsletter-title">{compact ? "Stay tuned" : "Steal our production automations"}</Heading>
    <p>{compact ? "Get the latest automation insights, playbooks, and case studies delivered to your inbox. No spam, ever." : "The exact n8n flows, Claude Code setups, and prompts we ship for clients, broken down step by step. No spam, unsubscribe anytime."}</p></>}
    <form onSubmit={submit} onFocusCapture={markStart}>
      <input name="contact_trap" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />
      <div className="mf-news-input">
        <label className="mf-sr-only" htmlFor={emailId}>Email address</label>
        <input id={emailId} type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setStatus("idle"); setError(""); }} placeholder={compact ? "Enter your email" : "you@company.com"} required />
        <button type="submit" disabled={status === "submitting"} aria-label={status === "submitting" ? "Submitting newsletter subscription" : "Subscribe to newsletter"}>{compact ? <ArrowRight size={16} /> : <>{status === "submitting" ? "Joining..." : "Get the teardowns"}<ArrowUpRight size={16} /></>}</button>
      </div>
      <small role="status" data-nosnippet="">{helperText}</small>
    </form>
  </div>;
}
