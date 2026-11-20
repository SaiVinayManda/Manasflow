"use client";

import { useEffect, useRef } from "react";

export function ViewportVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let nearby = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      if (!nearby || document.visibilityState === "hidden") { node.pause(); return; }
      if (!node.getAttribute("src")) node.src = src;
      if (reduceMotion) node.controls = true;
      else void node.play().catch(() => { node.controls = true; });
    };
    const observer = new IntersectionObserver(([entry]) => { nearby = entry.isIntersecting; update(); }, { rootMargin: "200px 0px" });
    observer.observe(node);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); node.pause(); };
  }, [src]);
  // autoplay overrides preload="none". Withholding src is what actually keeps
  // below-fold demos from downloading and decoding during the initial load.
  return <video ref={ref} data-video-src={src} muted loop playsInline preload="none" aria-label={label} />;
}
