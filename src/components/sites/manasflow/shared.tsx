"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { ArrowDownRight } from "lucide-react";
import { BookingLink } from "./booking-link";
import { isBookingDestination } from "@/lib/booking";

export const asset = (name: string) => `/sites/manasflow/${name}`;

export function SiteImage({ name, alt = "", className = "" }: { name: string; alt?: string; className?: string }) {
  // Source diagrams retain their native dimensions and crops.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset(name)} alt={alt} className={className} loading="lazy" />;
}

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    node.classList.add("will-reveal");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add("is-visible"); observer.disconnect(); }
    }, { threshold: 0.08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="section-badge"><span className="signal-dot" />{children}</span>;
}

export function SectionHeading({ badge, title, description, centered = true }: { badge: string; title: ReactNode; description?: ReactNode; centered?: boolean }) {
  return <Reveal className={`section-heading ${centered ? "text-center" : ""}`}>
    <Badge>{badge}</Badge>
    <h2>{title}</h2>
    {description && <p>{description}</p>}
  </Reveal>;
}

export function CallButton({ children = "Book a Call", secondary = false, href, className = "" }: { children?: ReactNode; secondary?: boolean; href?: string; className?: string }) {
  const classes = `mf-button ${secondary ? "mf-button-secondary" : ""} ${className}`;
  if (isBookingDestination(href, true)) return <BookingLink className={classes} withWhatsApp>{children}<ArrowDownRight size={20} /></BookingLink>;
  return <a href={href} className={classes}>{children}<ArrowDownRight size={20} /></a>;
}

export function CallStrip() {
  return <div className="call-strip"><CallButton /></div>;
}
