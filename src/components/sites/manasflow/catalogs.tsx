"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ActionLink as Link } from "./booking-link";
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  Grid3X3,
  List,
  Search,
} from "lucide-react";
import { Newsletter } from "./chrome";
import { Badge, Reveal } from "./shared";
import "./catalogs.css";

export type BlogCard = {
  href: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  image: string;
  featured: boolean;
};
export type PlaybookCard = {
  href: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
};
export type CourseCard = {
  href: string;
  title: string;
  description: string;
  image: string;
  duration?: string;
  lessonCount?: number;
};

function CatalogHero({ playbooks = false }: { playbooks?: boolean }) {
  return (
    <header className="mf-catalog-hero">
      <div className="mf-container">
        <Reveal>
          <Badge>
            {playbooks ? "AI & Automation Playbooks" : "Insights & Resources"}
          </Badge>
          <h1>
            {playbooks ? "Step-by-Step Guides" : "Discover Insights,"}
            <br />
            <span className="accent">
              {playbooks ? "to Master Automation" : "Tutorials & Trends"}
            </span>
          </h1>
          <p>
            {playbooks
              ? "Comprehensive frameworks, guides, and resources to help you master AI-powered development and automation workflows."
              : "Explore the latest in AI automation, workflow optimization, and technology insights to transform your business."}
          </p>
        </Reveal>
      </div>
    </header>
  );
}

function BookOffer() {
  return (
    <section className="mf-catalog-band">
      <div className="mf-book-offer-wrapper">
        <Reveal className="mf-book-offer">
          <div
            className="mf-brief-book"
            aria-label="ManasFlow automation guide"
          >
            <div className="mf-brief-book-cover">
              <svg viewBox="0 0 200 200" aria-hidden="true">
                <defs>
                  <linearGradient
                    id="mf-book-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#8082c1" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity=".7" />
                  </linearGradient>
                </defs>
                <path
                  d="M100 30 C60 30 30 70 35 110 C38 140 60 155 80 160 L80 170 L120 170 L120 160 C140 155 162 140 165 110 C170 70 140 30 100 30Z"
                  fill="url(#mf-book-gradient)"
                  opacity=".85"
                />
                <path
                  d="M85 165V180H115V165Z M80 180H120L118 188H82Z"
                  fill="#8082c1"
                  opacity=".6"
                />
              </svg>
              <span>MANASFLOW</span>
            </div>
          </div>
          <span className="mf-book-chip">Free for subscribers</span>
          <h2>The production automations we build for clients, documented</h2>
          <div className="mf-book-description">
            <p>
              The exact n8n flows, Claude Code setups, and prompts we ship —
              broken down step by step.
            </p>
            <p>
              Teardowns of real automations. What worked, what did not, what
              shipped.
            </p>
          </div>
          <Newsletter formOnly />
        </Reveal>
      </div>
    </section>
  );
}

function BlogArticleCard({ card }: { card: BlogCard }) {
  return (
    <article
      className={`mf-blog-card${card.featured ? " mf-blog-card-featured" : ""}`}
    >
      <Link href={card.href} className="mf-blog-card-link">
        <div className="mf-blog-card-image">
          {card.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.image} alt={card.title} loading="lazy" />
          ) : (
            <BookOpen size={64} aria-hidden="true" />
          )}
        </div>
        <div className="mf-blog-card-copy">
          {card.featured && (
            <p className="mf-blog-featured-date">Featured · {card.date}</p>
          )}
          {card.featured ? <h3>{card.title}</h3> : <h2>{card.title}</h2>}
          <p className="mf-blog-card-description">{card.description}</p>
          {card.featured ? (
            <span className="mf-blog-read">
              Read article
              <ArrowDownRight size={16} />
            </span>
          ) : (
            <div className="mf-blog-meta">
              <span>{card.date}</span>
              <span>{card.readingTime}</span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

export function BlogCatalog({
  featured,
  cards,
  page,
  totalPages,
}: {
  featured: BlogCard[];
  cards: BlogCard[];
  page: number;
  totalPages: number;
}) {
  return (
    <div className="mf-catalog-page">
      <CatalogHero />
      <BookOffer />
      {featured.length > 0 && (
        <section className="mf-catalog-band">
          <div className="mf-container">
            <div className="mf-blog-featured-heading">
              <p>Featured</p>
              <h2>Hand-picked deep dives</h2>
            </div>
            <div className="mf-blog-grid">
              {featured.map((card) => (
                <BlogArticleCard key={card.href} card={card} />
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="mf-catalog-band">
        <div className="mf-container">
          <div className="mf-blog-grid">
            {cards.map((card) => (
              <BlogArticleCard key={card.href} card={card} />
            ))}
          </div>
          <nav className="mf-blog-pagination" aria-label="Blog pagination">
            {page > 1 ? (
              <Link
                rel="prev"
                href={page === 2 ? "/blog" : `/blog?page=${page - 1}`}
              >
                Previous
              </Link>
            ) : (
              <span aria-disabled="true">Previous</span>
            )}
            <span className="mf-current-page" aria-current="page">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Link rel="next" href={`/blog?page=${page + 1}`}>
                Next
              </Link>
            ) : (
              <span aria-disabled="true">Next</span>
            )}
          </nav>
        </div>
      </section>
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: "grid" | "list";
  onChange: (view: "grid" | "list") => void;
}) {
  return (
    <div className="mf-catalog-view-toggle" aria-label="Display layout">
      <button
        type="button"
        aria-label="Grid view"
        aria-pressed={view === "grid"}
        className={view === "grid" ? "is-active" : ""}
        onClick={() => onChange("grid")}
      >
        <Grid3X3 size={16} />
      </button>
      <button
        type="button"
        aria-label="List view"
        aria-pressed={view === "list"}
        className={view === "list" ? "is-active" : ""}
        onClick={() => onChange("list")}
      >
        <List size={16} />
      </button>
    </div>
  );
}

function CatalogEmpty({
  type,
  query,
}: {
  type: "Playbooks" | "Courses";
  query: string;
}) {
  return (
    <div className="mf-catalog-empty" role="status">
      {type === "Playbooks" && (
        <span>
          <BookOpen size={32} />
        </span>
      )}
      <h2>
        No {type} {query ? "Found" : "Available"}
      </h2>
      <p>
        {query
          ? `No ${type.toLowerCase()} match “${query}”. Try a different search term.`
          : `Check back soon for new ${type.toLowerCase()}!`}
      </p>
    </div>
  );
}

export function PlaybooksCatalog({
  cards,
  categories,
}: {
  cards: PlaybookCard[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const filtered = useMemo(
    () =>
      cards.filter(
        (card) =>
          (category === "all" || card.category === category) &&
          `${card.title} ${card.description} ${card.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [cards, query, category],
  );
  return (
    <div className="mf-catalog-page">
      <CatalogHero playbooks />
      <section className="mf-playbook-filter-band">
        <div className="mf-container mf-playbook-filters">
          <div
            className="mf-playbook-categories"
            aria-label="Playbook categories"
          >
            {["all", ...categories].map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={category === value}
                className={category === value ? "is-active" : ""}
                onClick={() => setCategory(value)}
              >
                {value === "all" ? "All" : value}
              </button>
            ))}
          </div>
          <div className="mf-catalog-search-and-view">
            <label className="mf-catalog-search">
              <Search size={16} />
              <span className="mf-sr-only">Search playbooks</span>
              <input
                type="search"
                placeholder="Search playbooks..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>
      </section>
      <section className="mf-catalog-band">
        <div className="mf-container">
          {filtered.length ? (
            <div
              className={`mf-playbook-grid${view === "list" ? " is-list" : ""}`}
            >
              {filtered.map((card) => (
                <Link
                  className="mf-playbook-card"
                  key={card.href}
                  href={card.href}
                >
                  <div className="mf-playbook-art">
                    <span>{card.category}</span>
                    <BookOpen size={48} aria-hidden="true" />
                  </div>
                  <div className="mf-playbook-copy">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <div className="mf-playbook-card-footer">
                      <span
                        className={`mf-playbook-level mf-level-${card.difficulty.toLowerCase()}`}
                      >
                        {card.difficulty}
                      </span>
                      <span>
                        Read Playbook
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <CatalogEmpty type="Playbooks" query={query} />
          )}
        </div>
      </section>
      <section className="mf-playbook-callout-band">
        <div className="mf-container">
          <div className="mf-catalog-inline-callout">
            <p>
              Rather have us build one of these into your stack?{" "}
              <Link href="/services/custom-workflow-automation">
                See our workflow automation service
              </Link>{" "}
              or <Link href="/consultation">book a free consultation</Link>.
            </p>
          </div>
        </div>
      </section>
      <section className="mf-playbook-callout-band">
        <div className="mf-container">
          <div className="mf-playbook-newsletter">
            <p className="mf-catalog-news-kicker">Free weekly brief</p>
            <h2>The production automations we build for clients, documented</h2>
            <p>
              The exact n8n flows, Claude Code setups, and prompts we ship,
              broken down step by step. No spam, unsubscribe anytime.
            </p>
            <Newsletter formOnly />
          </div>
        </div>
      </section>
    </div>
  );
}

export function CoursesCatalog({ cards }: { cards: CourseCard[] }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [limit, setLimit] = useState(12);
  const filtered = useMemo(
    () =>
      cards.filter((card) =>
        `${card.title} ${card.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [cards, query],
  );
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(input);
    setLimit(12);
  }
  return (
    <div className="mf-courses-page">
      <div className="mf-container">
        <header className="mf-courses-heading">
          <Link href="/">← Back to Home</Link>
          <h1>Courses</h1>
          <p>
            Learn new skills and advance your career with our comprehensive
            course collection.
          </p>
        </header>
        <div className="mf-courses-controls">
          <form onSubmit={search} className="mf-catalog-search">
            <Search size={16} />
            <label className="mf-sr-only" htmlFor="mf-course-search">
              Search courses
            </label>
            <input
              id="mf-course-search"
              type="search"
              placeholder="Search courses (press Enter to search)"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
          </form>
          <ViewToggle view={view} onChange={setView} />
        </div>
        {filtered.length ? (
          <>
            <div
              className={`mf-course-grid${view === "list" ? " is-list" : ""}`}
            >
              {filtered.slice(0, limit).map((card) => (
                <Link
                  className="mf-course-card"
                  href={card.href}
                  key={card.href}
                >
                  {card.image && (
                    <div className="mf-course-image">
                      {
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={card.image} alt={card.title} loading="lazy" />
                      }
                    </div>
                  )}
                  <div className="mf-course-copy">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <div>
                      <span>Beginner - Intermediate</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {limit < filtered.length ? (
              <button
                className="mf-course-load-more"
                type="button"
                onClick={() => setLimit(limit + 12)}
              >
                Load More Courses
                <ArrowRight size={16} />
              </button>
            ) : (
              <p className="mf-course-end">
                You’ve reached the end! Showing all {filtered.length} courses.
              </p>
            )}
          </>
        ) : (
          <CatalogEmpty type="Courses" query={query} />
        )}
        <div className="mf-catalog-inline-callout">
          <p>
            Rather have this built for you than DIY it?{" "}
            <Link href="/services/custom-automation">
              See our custom automation service
            </Link>{" "}
            or <Link href="/consultation">book a free consultation</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
