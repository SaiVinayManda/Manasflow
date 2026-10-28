"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import content from "./content.json";
import { asset, origin, GlassLink, SocialLinks } from "./shared";

function ServiceMenu({ mobile = false }: { mobile?: boolean }) {
  const menuLabels = [
    [
      "Laravel",
      "Legacy Modernization",
      "API Development",
      "Scalable Architecture",
      "Rescue Projects",
    ],
    [
      "AP Automation",
      "Demand Intelligence",
      "Automated Procurement",
      "Enterprise AI",
    ],
  ];
  return (
    <div className={`service-menu-items ${mobile ? "mobile-services" : ""}`}>
      {content.services.map((service, i) => (
        <div
          className={`service-menu-row service-color-${i}`}
          key={service.title}
        >
          <a href={service.links[0].href}>
            <img src={service.image} alt="" />
          </a>
          <div>
            <a className="service-menu-title" href={service.links[0].href}>
              {i === 1 ? "AI & Automations" : service.title}
            </a>
            <div className="service-tags">
              {service.links.slice(1, i === 3 ? 7 : -1).map((link, j) => (
                <a href={link.href} key={link.href}>
                  {menuLabels[i]?.[j] || link.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", update, { passive: true });
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("keydown", close);
    };
  }, []);
  useEffect(() => {
    if (!menuOpen && !servicesOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen, servicesOpen]);
  return (
    <>
      <header className={`nine-header ${scrolled ? "scrolled" : ""}`}>
        <div className="desktop-nav">
          <div className="nav-main">
            <Link className="nav-logo" href="/" aria-label="9H home">
              <img src={asset("9H-logo.svg")} alt="9H" />
            </Link>
            <nav aria-label="Main navigation">
              <Link className="active" href="/">
                Home
              </Link>
              <a href={`${origin}/about-us/`}>About</a>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
              >
                Services <span>{servicesOpen ? "−" : "+"}</span>
              </button>
              <a href={`${origin}/work/`}>Our Work</a>
              <a href={`${origin}/products/`}>Products</a>
            </nav>
            <div className="nav-rule" />
            <SocialLinks />
          </div>
          <GlassLink href={`${origin}/contact/`} arrow={false}>
            Book a call with us
          </GlassLink>
        </div>
        <div className="mobile-nav">
          <Link className="mobile-logo" href="/" aria-label="9H home">
            <img src={asset("9H-logo.svg")} alt="9H" />
          </Link>
          <button
            className="menu-toggle"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      {servicesOpen && !menuOpen && (
        <div className="mega-menu" id="services-menu">
          <ServiceMenu />
        </div>
      )}
      {menuOpen && (
        <div className="mobile-menu" id="mobile-menu">
          <div className="mobile-menu-top">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <img src={asset("9H-logo.svg")} alt="9H" />
            </Link>
            <button
              className="menu-toggle close-toggle"
              aria-label="Close menu"
              onClick={() => {
                setMenuOpen(false);
                setServicesOpen(false);
              }}
            >
              ×
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <a href={`${origin}/about-us/`}>About</a>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              aria-expanded={servicesOpen}
            >
              Services <span>{servicesOpen ? "−" : "+"}</span>
            </button>
            {servicesOpen && <ServiceMenu mobile />}
            <a href={`${origin}/work/`}>Our Work</a>
            <a href={`${origin}/products/`}>Products</a>
          </nav>
          <SocialLinks />
          <GlassLink href={`${origin}/contact/`}>Book a call with us</GlassLink>
        </div>
      )}
    </>
  );
}
