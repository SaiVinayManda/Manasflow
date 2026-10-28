"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import content from "./content.json";
import { asset, origin, Arrow, GlassLink } from "./shared";

export function Teams() {
  const [active, setActive] = useState(0);
  const team = content.teams[active];
  return (
    <section className="teams-section">
      <div className="shell">
        <h2>Why High-Performing Teams Choose 9H</h2>
        <p className="teams-intro">
          Every team has unique challenges. See how we help each function work
          smarter, move faster, and achieve more.
        </p>
        <div className="team-tabs" role="tablist" aria-label="Teams">
          {content.teams.map((t, i) => (
            <button
              id={`team-tab-${i}`}
              key={t.label}
              role="tab"
              aria-selected={active === i}
              aria-controls="team-panel"
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  const next = (i + (event.key === "ArrowRight" ? 1 : 4)) % 5;
                  setActive(next);
                  document.getElementById(`team-tab-${next}`)?.focus();
                }
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div
          className="team-panel"
          id="team-panel"
          role="tabpanel"
          aria-labelledby={`team-tab-${active}`}
        >
          <div className="team-description">
            <p>{team.description}</p>
          </div>
          <div className="team-quote">
            <blockquote>
              <span>&quot;</span>
              <p>{team.quote}</p>
              <span>&quot;</span>
            </blockquote>
            <div className="team-person">
              <img src={team.image} alt={team.name} />
              <div>
                <strong>{team.name}</strong>
                <span>{team.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Insights() {
  const [hover, setHover] = useState<{
    image: string;
    x: number;
    y: number;
  } | null>(null);
  return (
    <section className="insights-section shell">
      <div className="insights-heading">
        <h2>Our Insights Corner</h2>
        <p>
          Hear from the brands and people who’ve experienced the impact of our
          work firsthand.
        </p>
      </div>
      <div className="insight-list">
        {content.posts.map((post, i) => (
          <a
            className={`insight-row insight-${i}`}
            key={post.href}
            href={post.href}
            onMouseMove={(event) =>
              setHover({
                image: post.image,
                x: event.clientX,
                y: event.clientY,
              })
            }
            onMouseLeave={() => setHover(null)}
          >
            <span className="insight-label">Blog Post</span>
            <h3>{post.title}</h3>
            <span className="read-now">
              Read now <Arrow />
            </span>
          </a>
        ))}
      </div>
      {hover && (
        <img
          className="insight-preview"
          src={hover.image}
          alt=""
          style={{ left: hover.x + 20, top: hover.y - 100 }}
        />
      )}
      <GlassLink href={`${origin}/insights/`}>Discover all insights</GlassLink>
    </section>
  );
}

export function Film() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);
  return (
    <>
      <section className="belief-section">
        <div className="belief-copy">
          <img src={asset("quote.svg")} alt="" />
          <h2>
            We believe technology should fade into the background, so human
            connections can shine.
          </h2>
          <div className="belief-author">
            <strong>Timothy Buttigieg</strong>
            <span>CEO</span>
          </div>
        </div>
      </section>
      <section className="film-section shell">
        <button
          className="film-poster"
          aria-label="Play video"
          onClick={() => setOpen(true)}
        >
          <img
            className="film-photo"
            src={asset("Tim-Landscape-1.jpg")}
            alt="Timothy Buttigieg, CEO"
          />
          <span className="film-play">
            <img src={asset("play.svg")} alt="Play" />
          </span>
        </button>
      </section>
      <dialog
        ref={dialogRef}
        className="film-dialog"
        onCancel={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <button aria-label="Close video" onClick={() => setOpen(false)}>
          ×
        </button>
        {open && (
          <iframe
            src="https://player.vimeo.com/video/1172610660?autoplay=1"
            title="9H Digital film"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}
      </dialog>
    </>
  );
}

export function Testimonials() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef(0);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 1024 || !sectionRef.current) return;
      const bounds = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, -bounds.top / (bounds.height - window.innerHeight)),
      );
      setActive(Math.min(4, Math.floor(progress * 5)));
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const change = (direction: number) => {
    const next = Math.max(0, Math.min(4, active + direction));
    setActive(next);
    if (window.innerWidth >= 1024 && sectionRef.current) {
      const section = sectionRef.current;
      window.scrollTo({
        top:
          section.getBoundingClientRect().top +
          window.scrollY +
          (next / 4) * (section.offsetHeight - window.innerHeight),
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="testimonials-scroll" ref={sectionRef}>
      <section className="testimonials-section">
        <div className="testimonial-shell">
          <span className="section-label">Client Stories</span>
          <h2>Trusted By Industry Leaders</h2>
          <div className="testimonial-progress">
            <span>0{active + 1}</span>
            <div>
              <span style={{ width: `${(active + 1) * 20}%` }}>
                <svg viewBox="0 0 48 39" fill="none">
                  <path
                    d="M0 19.23l46.76.09M46.76 19.32C40.61 20.13 28.32 25.19 28.34 38.97M46.76 19.32C40.61 19.31 28.3 15.59 28.27.83"
                    stroke="currentColor"
                  />
                </svg>
              </span>
            </div>
            <span>05</span>
          </div>
          <div
            className="testimonial-window"
            onTouchStart={(e) => {
              touchStart.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const delta = touchStart.current - e.changedTouches[0].clientX;
              if (Math.abs(delta) > 40) change(delta > 0 ? 1 : -1);
            }}
          >
            <div
              className="testimonial-track"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {content.testimonials.map((item, i) => (
                <article
                  className="testimonial-slide"
                  key={item.person[1]}
                  aria-hidden={i !== active}
                >
                  <div className="testimonial-card">
                    <img
                      src={item.image}
                      alt={item.person[0] || item.person[1]}
                    />
                    <span className="testimonial-quote-mark">&quot;</span>
                    <div>
                      <p>{item.text}</p>
                      <strong>{item.person[0]}</strong>
                      <span>{item.person[1]}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="testimonial-controls">
            <button
              aria-label="Previous testimonial"
              onClick={() => change(-1)}
              disabled={active === 0}
            >
              <svg viewBox="0 0 48 39" fill="none">
                <path
                  d="M47.38 19.23l-46.76.09M.62 19.32C6.77 20.13 19.06 25.19 19.04 38.97M.62 19.32C6.77 19.31 19.08 15.59 19.11.83"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <button
              aria-label="Next testimonial"
              onClick={() => change(1)}
              disabled={active === 4}
            >
              <svg viewBox="0 0 48 39" fill="none">
                <path
                  d="M.38 19.23l46.76.09M47.14 19.32C40.99 20.13 28.69 25.19 28.72 38.97M47.14 19.32C40.98 19.31 28.67 15.59 28.64.83"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [choices, setChoices] = useState({
    preferences: false,
    statistics: false,
    marketing: false,
  });
  useEffect(() => {
    if (!localStorage.getItem("nine-h-consent")) {
      const timer = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);
  const save = (value: string) => {
    const selected =
      value === "all"
        ? { preferences: true, statistics: true, marketing: true }
        : value === "custom"
          ? choices
          : { preferences: false, statistics: false, marketing: false };
    setChoices(selected);
    localStorage.setItem(
      "nine-h-consent",
      JSON.stringify({ consent: value, choices: selected }),
    );
    setOpen(false);
    setPreferences(false);
  };
  return (
    <>
      {open ? (
        <aside className="cookie-banner" aria-label="Cookie consent">
          <div className="cookie-heading">
            <span>Manage Consent</span>
            <button
              aria-label="Close consent"
              onClick={() => save("necessary")}
            >
              ×
            </button>
          </div>
          <p>
            To provide the best experiences, we use technologies like cookies to
            store and/or access device information. Consenting to these
            technologies will allow us to process data such as browsing behavior
            or unique IDs on this site. Not consenting or withdrawing consent,
            may adversely affect certain features and functions.
          </p>
          {preferences && (
            <div className="cookie-preferences">
              <label>
                Functional <span>Always active</span>
              </label>
              <label>
                Preferences{" "}
                <input
                  type="checkbox"
                  checked={choices.preferences}
                  onChange={(event) =>
                    setChoices({
                      ...choices,
                      preferences: event.target.checked,
                    })
                  }
                />
              </label>
              <label>
                Statistics{" "}
                <input
                  type="checkbox"
                  checked={choices.statistics}
                  onChange={(event) =>
                    setChoices({ ...choices, statistics: event.target.checked })
                  }
                />
              </label>
              <label>
                Marketing{" "}
                <input
                  type="checkbox"
                  checked={choices.marketing}
                  onChange={(event) =>
                    setChoices({ ...choices, marketing: event.target.checked })
                  }
                />
              </label>
            </div>
          )}
          <div className="cookie-actions">
            <button onClick={() => save("all")}>Accept</button>
            <button onClick={() => save("necessary")}>Deny</button>
            <button
              onClick={() =>
                preferences ? save("custom") : setPreferences(true)
              }
            >
              {preferences ? "Save preferences" : "View preferences"}
            </button>
          </div>
          <div className="cookie-policy">
            <a href={`${origin}/cookie-policy/`}>Cookie Policy</a>
            <a href={`${origin}/privacy-policy/`}>Privacy Policy</a>
          </div>
        </aside>
      ) : (
        <button className="manage-consent" onClick={() => setOpen(true)}>
          Manage consent
        </button>
      )}
    </>
  );
}
