"use client";

import NextLink from "next/link";
import { isValidElement } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { EmbedEvent } from "@calcom/embed-react";
import { ArrowRight, Calendar, Clock, Workflow } from "lucide-react";
import { CAL_BOOKING_URL, CAL_CONFIG, CAL_LINK, CAL_LOAD_TIMEOUT_MS, CAL_ORIGIN, CAL_TRIGGER_ATTRIBUTES, isBookingDestination } from "@/lib/booking";
import { initializeCal } from "./cal-provider";
import { ContactActions } from "./whatsapp-contact";

type AnchorProps = ComponentPropsWithoutRef<"a">;
let cancelPendingBooking: (() => void) | undefined;

export function BookingLink({ children, onClick, onMouseEnter, withWhatsApp = false, ...props }: Omit<AnchorProps, "href"> & { withWhatsApp?: boolean }) {
  const link = <a {...props} {...CAL_TRIGGER_ATTRIBUTES} href={CAL_BOOKING_URL} onMouseEnter={event => {
    onMouseEnter?.(event);
    void initializeCal().catch(() => undefined);
  }} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (props.target && props.target !== "_self")) return;
    event.preventDefault();
    cancelPendingBooking?.();
    let active = true;
    let api: Awaited<ReturnType<typeof initializeCal>> | undefined;
    const finish = () => {
      if (!active) return;
      active = false;
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", onKeyDown);
      api?.("off", { action: "*", callback: onCalEvent });
      if (cancelPendingBooking === finish) cancelPendingBooking = undefined;
    };
    const fallback = () => {
      if (!active) return;
      finish();
      window.location.assign(CAL_BOOKING_URL);
    };
    const onKeyDown = (keyEvent: KeyboardEvent) => { if (keyEvent.key === "Escape") finish(); };
    const onCalEvent = (calEvent: EmbedEvent<"*">) => {
      const action = calEvent.detail.type;
      if (["linkReady", "bookerReady", "bookerReopened", "__closeIframe"].includes(action)) finish();
      else if (action === "linkFailed") fallback();
    };
    const timeout = window.setTimeout(fallback, CAL_LOAD_TIMEOUT_MS);
    window.addEventListener("keydown", onKeyDown);
    cancelPendingBooking = finish;
    void initializeCal().then(cal => {
      if (!active) return;
      api = cal;
      cal("on", { action: "*", callback: onCalEvent });
      cal("modal", { calLink: CAL_LINK, calOrigin: CAL_ORIGIN, config: CAL_CONFIG });
    }).catch(fallback);
  }}>{children}</a>;
  return withWhatsApp ? <ContactActions>{link}</ContactActions> : link;
}

function linkText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(linkText).join(" ");
  if (isValidElement<{ children?: ReactNode }>(children)) return linkText(children.props.children);
  return "";
}

export function ActionLink({ href, children, withWhatsApp, prefetch = false, ...props }: AnchorProps & { href: string; withWhatsApp?: boolean; prefetch?: boolean }) {
  const bookingLabel = /\b(book|schedule|consultation|strategy (?:call|session)|free call|talk to (?:an?|our|the)|discuss|plan a workshop|consult our|get started|build with)\b/i.test(linkText(children));
  const primaryCta = /(?:^|\s)(?:mf-button|it-primary|lower-outline-button|mf-deploy-call|mf-industry-hero-link)(?:\s|$)/.test(props.className || "");
  if (isBookingDestination(href, bookingLabel)) return <BookingLink {...props} withWhatsApp={withWhatsApp ?? primaryCta}>{children}</BookingLink>;
  return <NextLink prefetch={prefetch} {...props} href={href}>{children}</NextLink>;
}

export function BookingCard({ id }: { id: string }) {
  return <div className="lower-strategy-card" id={id}>
    <div className="lower-strategy-owner" data-nosnippet=""><span className="lower-owner-icon"><Workflow size={25} aria-hidden="true" /></span><div><strong>ManasFlow Automation Team</strong><a href="mailto:info@manasflow.com">info@manasflow.com</a></div></div>
    <h3>Choose your time</h3>
    <p className="lower-call-intro">Book your free 30-minute strategy call. Choose an available date and time in your timezone.</p>
    <div className="lower-strategy-form"><BookingLink className="mf-button" withWhatsApp><Calendar size={18} aria-hidden="true" />Book a Free Strategy Call<ArrowRight size={16} aria-hidden="true" /></BookingLink><p className="lower-email-handoff">Your calendar opens here. You can also <a href={CAL_BOOKING_URL}>open the booking page</a> or <a href="mailto:info@manasflow.com">email us</a>.</p></div>
    <div className="lower-call-tags"><span><Clock size={16} aria-hidden="true" />30 minutes</span><span><Calendar size={16} aria-hidden="true" />Live availability</span></div>
  </div>;
}
