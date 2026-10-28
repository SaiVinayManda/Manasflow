import { ActionLink as Link } from "./booking-link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Badge, Reveal } from "./shared";
import "./subpages.css";

export function SubpageHero({ badge, title, description, children }: { badge: string; title: ReactNode; description?: ReactNode; children?: ReactNode }) {
  return <header className="mf-subpage-hero"><div className="mf-container"><Reveal>
    <Badge>{badge}</Badge><h1>{title}</h1>{description && <p>{description}</p>}{children}
  </Reveal></div></header>;
}

export function PageCallout({ title = "Ready to transform your business?", description = "Let’s turn your next automation opportunity into a system that works.", label = "Book a Free Strategy Call", href = "/contact" }: { title?: string; description?: string; label?: string; href?: string }) {
  return <section className="mf-subpage-callout"><div className="mf-container"><Reveal><h2>{title}</h2><p>{description}</p><Link href={href}>{label}<ArrowUpRight size={20} /></Link></Reveal></div></section>;
}
