"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { markets } from "./markets-data";
import { asset, origin } from "./shared";

function CaseCard({ index }: { index: number }) {
  const market = markets[index];
  return (
    <a
      className="case-card"
      href={`${origin}/work/${market.slug}/`}
      data-case={index}
    >
      <img src={asset(market.image)} alt={market.title} />
      <span className="case-badge">Featured Case Study</span>
      <div className="case-shade" />
      <div className="case-copy">
        <h3>{market.title}</h3>
        <p>{market.subtitle}</p>
        <div className="case-tags">
          {market.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </a>
  );
}

export function Markets() {
  const [active, setActive] = useState<number | null>(0);
  const cardsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 1024) return;
      const cards =
        cardsRef.current?.querySelectorAll<HTMLElement>("[data-case]");
      if (!cards) return;
      let current = 0;
      cards.forEach((card, i) => {
        if (card.getBoundingClientRect().top < window.innerHeight * 0.55)
          current = i;
      });
      setActive(current);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const select = (i: number) => {
    if (window.innerWidth < 1024) {
      setActive(active === i ? null : i);
      return;
    }
    const card = cardsRef.current?.querySelector(`[data-case="${i}"]`);
    if (card)
      window.scrollTo({
        top: card.getBoundingClientRect().top + window.scrollY - 96,
        behavior: "smooth",
      });
    setActive(i);
  };
  return (
    <section className="markets-section shell">
      <div className="section-intro">
        <h2>Markets We Power</h2>
        <p>Built for enterprise. Proven across industries.</p>
      </div>
      <div className="markets-layout">
        <div className="market-list">
          {markets.map((market, i) => (
            <div
              className={`market-item ${active === i ? "selected" : ""}`}
              key={market.name}
            >
              <button
                onClick={() => select(i)}
                aria-expanded={active === i}
                aria-controls={`market-detail-${i}`}
              >
                <span>{market.name}</span>
                <span className="circle-chevron">
                  <svg viewBox="0 0 10 6" fill="none">
                    <path
                      d="M1 1l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div
                className="market-detail"
                id={`market-detail-${i}`}
                hidden={active !== i}
              >
                <p>{market.description}</p>
                <div className="mobile-case">
                  <CaseCard index={i} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="market-cards" ref={cardsRef}>
          {markets.map((market, i) => (
            <CaseCard key={market.name} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
