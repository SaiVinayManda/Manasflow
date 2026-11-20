"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

// The summary owns its open state natively. CSS reveals its sibling panel, so
// both desktop and mobile links share one server-rendered menu tree.
export function HeaderNavigation({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (menu.current?.open && !root.current?.contains(event.target as Node)) menu.current.open = false;
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  return <div className="mf-navigation" ref={root} onKeyDown={event => {
    if (event.key === "Escape" && menu.current) { menu.current.open = false; menu.current.querySelector("summary")?.focus(); }
  }} onClickCapture={event => {
    if ((event.target as Element).closest("a") && menu.current) menu.current.open = false;
  }}>
    <details className="mf-mobile-disclosure" ref={menu}><summary className="mf-mobile-toggle" aria-label="Navigation menu" aria-controls="mf-navigation-links"><Menu className="mf-menu-open-icon" size={24} /><X className="mf-menu-close-icon" size={24} /></summary></details>
    <div id="mf-navigation-links" className="mf-navigation-links">{children}</div>
  </div>;
}

// Native <details> toggles before hydration and does not schedule a React
// render. Effects only add keyboard/outside-click dismissal after hydration.
export function HeaderDropdown({ type, label, children }: { type: "services" | "resources"; label: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (ref.current?.open && !ref.current.contains(event.target as Node)) ref.current.open = false;
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  return <details className="mf-header-dropdown" name="mf-header-menus" ref={ref} onKeyDown={event => {
    if (event.key === "Escape") {
      event.stopPropagation();
      event.currentTarget.open = false;
      event.currentTarget.querySelector("summary")?.focus();
    } else if (event.key === "ArrowDown" && event.target === event.currentTarget.querySelector("summary")) {
      event.preventDefault();
      event.currentTarget.open = true;
      event.currentTarget.querySelector<HTMLAnchorElement>(".mf-menu-panel a")?.focus();
    }
  }} onClickCapture={event => {
    if ((event.target as Element).closest(".mf-menu-panel a")) event.currentTarget.open = false;
  }}>
    <summary aria-label={`Browse ${type === "services" ? "solutions" : "resources"}`} aria-controls={`mf-menu-${type}`}>{label}<ChevronDown size={15} /></summary>
    <div className="mf-menu-panel">{children}</div>
  </details>;
}
