/* Original media uses native img to preserve animated GIFs and source SVGs. */
/* eslint-disable @next/next/no-img-element */
import content from "./content.json";
import Link from "next/link";
import { Header } from "./header";
import { Markets } from "./markets";
import {
  CookieConsent,
  Film,
  Insights,
  Teams,
  Testimonials,
} from "./experience";
import { asset, origin, Arrow, GlassLink, SocialLinks } from "./shared";
import "./nine-h.css";

function Hero() {
  return (
    <section className="nine-hero">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster={asset("hero-placeholder-DOL305-B.png")}
      >
        <source src={asset("looping-video-e-PUQuDR.mp4")} type="video/mp4" />
      </video>
      <img
        className="hero-mobile-bg"
        src={asset("looping-mobile-BtnwhDf1.gif")}
        alt=""
      />
      <div className="hero-content">
        <h2 className="hero-eyebrow">
          We build the tech that powers your business.
        </h2>
        <h1 className="hero-heading">
          {[
            ["Understand", "your challenges.", "2.gif"],
            ["Scale", "your vision.", "3.gif"],
            ["Connect", "with the future.", "1.gif"],
          ].map(([word, rest, gif], i) => (
            <span className={`hero-line hero-line-${i}`} key={word}>
              <img src={asset(gif)} alt="" />
              <span className="hero-line-text">
                <strong>
                  {word}
                  <Arrow />
                </strong>
                <span>{rest}</span>
              </span>
            </span>
          ))}
        </h1>
        <p className="hero-description">
          From platforms to integrations, we connect the dots between people,
          processes and data, giving you systems that scale, automate the
          repetitive, and unlock new growth. The result? A business that runs
          faster, smarter, and always in control.
        </p>
        <GlassLink href={`${origin}/work/`}>Discover All Projects</GlassLink>
        <a
          className="scroll-cue"
          href="#services"
          aria-label="Scroll to services"
        >
          <svg width="8" height="50" viewBox="0 0 8 50" fill="none">
            <path
              d="M4 49.753L7.753 46 4 42.247.247 46 4 49.753ZM4 0v46"
              stroke="currentColor"
              strokeWidth="1.3"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="services-section shell" id="services">
      <h2 className="services-heading">
        With 9H, you don’t just get <strong>Tech.</strong>
        <br />
        You get the backbone that drives your <strong>Future.</strong>
      </h2>
      <div className="service-grid">
        {content.services.map((service, i) => (
          <article
            className={`service-card service-color-${i}`}
            key={service.title}
            tabIndex={0}
          >
            <div className="service-visual">
              <img src={service.image} alt="" />
              <a className="service-explore" href={service.links[0].href}>
                Explore Services <Arrow />
              </a>
            </div>
            <div className="service-copy">
              <h3>{service.title}</h3>
              <div className="service-description">
                <p>{service.description}</p>
              </div>
              <div className="service-tags">
                {service.links.slice(1, -1).map((link) => (
                  <a href={link.href} key={link.href}>
                    {link.text}
                  </a>
                ))}
              </div>
              <a className="mobile-explore" href={service.links[0].href}>
                Explore Services <Arrow />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  const groups = [
    {
      title: "Services",
      links: [
        ["AI & Automations", "/services/ai-automations/"],
        ["Custom Web Applications", "/services/custom-web-applications/"],
        ["Integrations", "/services/integrations/"],
        ["Brand Building", "/services/brand-building/"],
      ],
    },
    {
      title: "Company",
      links: [
        ["About", "/about-us/"],
        ["Our Work", "/work/"],
        ["Insights", "/insights/"],
        ["Services", "/services/"],
      ],
    },
    {
      title: "Useful Links",
      links: [
        ["Careers", "/careers/"],
        ["Our People", "/our-people/"],
        ["Technology Partners", "/technology-partners/"],
        ["Investors", "https://www.9hcapital.com/investors/"],
        ["Privacy Policy", "/privacy-policy/"],
      ],
    },
  ];
  return (
    <footer className="nine-footer">
      <div className="shell">
        <div className="footer-cta">
          <div>
            <h2>
              With 9H, you don’t just get tech.
              <br />
              You get the engine that drives your future.
            </h2>
            <p>Turning complexity into clarity, at speed.</p>
          </div>
          <GlassLink href={`${origin}/contact/`}>Talk to Our Team</GlassLink>
        </div>
        <div className="footer-columns">
          <div className="footer-brand">
            <Link href="/">
              <img src={asset("9H-logo.svg")} alt="9H" />
            </Link>
            <p>
              Turning complexity into
              <br />
              clarity, at speed.
            </p>
            <SocialLinks />
            <a
              className="google-source"
              href="https://www.google.com/preferences/source?q=https://9hdigital.com"
              target="_blank"
              rel="noreferrer"
            >
              <span>G</span>
              <span>
                Add as a preferred
                <br />
                source on Google
              </span>
            </a>
          </div>
          {groups.map((group) => (
            <div key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href.startsWith("https") ? href : origin + href}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="footer-copyright">
        © 2026 <Link href="/">9H</Link>. All rights reserved.
      </div>
    </footer>
  );
}

export function NineHHome() {
  return (
    <div className="nine-site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <Markets />
        <Teams />
        <Insights />
        <Film />
        <Testimonials />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
