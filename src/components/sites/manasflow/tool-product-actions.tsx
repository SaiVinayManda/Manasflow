"use client";

import { useState } from "react";
import { Calendar, Check, Link as LinkIcon } from "lucide-react";
import { BookingLink } from "./booking-link";
import { useToolSearch } from "@/hooks/use-tool-state";
import "./tool-product-actions.css";

export function CopyShareLink() {
  const [copiedUrl, setCopiedUrl] = useState("");
  const [failedUrl, setFailedUrl] = useState("");
  const search = useToolSearch();
  const copy = async () => {
    const url = window.location.href;
    try { await navigator.clipboard.writeText(url); setCopiedUrl(url); setFailedUrl(""); }
    catch { setFailedUrl(url); setCopiedUrl(""); }
  };
  const copied = copiedUrl && new URL(copiedUrl).search === search;
  const failed = failedUrl && new URL(failedUrl).search === search;
  return <div className="mf-tool-share"><button type="button" onClick={copy}>{copied ? <Check size={16} aria-hidden="true" /> : <LinkIcon size={16} aria-hidden="true" />}Copy Share Link</button><span role="status" data-nosnippet="">{copied ? "Share link copied" : failed ? "Copy the link below to share these results." : ""}</span>{failed && <input aria-label="Share link" readOnly value={failedUrl} onFocus={event => event.currentTarget.select()} />}</div>;
}

export function ToolImplementationCta({ context = "your results" }: { context?: string }) {
  return <aside className="mf-tool-implementation" aria-label="Implementation support"><div><span>Bring it into your business</span><h3>Put {context} to work.</h3><p>Want ManasFlow to deploy the solution for you? Book a free implementation discovery call to discuss scope, integrations, and next steps.</p></div><BookingLink className="mf-tool-booking" withWhatsApp><Calendar size={17} aria-hidden="true" />Book a Discovery Call</BookingLink></aside>;
}
