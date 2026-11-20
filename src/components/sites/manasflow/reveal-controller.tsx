"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// One observer replaces one React effect/observer per decorative Reveal wrapper.
// Content is visible in SSR HTML and stays visible when JS or motion is disabled.
export function RevealController() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    const registered = new WeakSet<Element>();
    const register = (root: Element) => {
      const nodes = root.matches(".reveal") ? [root, ...root.querySelectorAll(".reveal")] : root.querySelectorAll(".reveal");
      for (const node of nodes) if (!registered.has(node)) {
        registered.add(node);
        node.classList.add("will-reveal");
        observer.observe(node);
      }
    };
    register(document.body);
    const mutations = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) if (node instanceof Element) register(node);
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); };
  }, [pathname]);
  return null;
}
