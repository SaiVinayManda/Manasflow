"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { contactHref, site } from "@/lib/site";

export function Wordmark() {
  return (
    <span className="wordmark">
      <svg viewBox="0 0 40 32" fill="none" aria-hidden="true">
        <path
          d="M3 27V13c0-7 10-7 10 0v14-20c0-7 11-7 11 0v20-14c0-7 11-7 11 0v14"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        manasflow<span className="wordmark-dot">.</span>
      </span>
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          aria-label="Manasflow home"
          onClick={() => setOpen(false)}
        >
          <Wordmark />
        </Link>
        <nav className="desktop-navigation" aria-label="Main navigation">
          <Link href="/#services">What we do</Link>
          <Link href="/#approach">How we work</Link>
          <Link href="/#about">About</Link>
        </nav>
        <Link href="/contact" className="header-contact">
          Start a conversation <ArrowUpRight size={17} />
        </Link>
        <button
          className="mobile-menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label="Mobile navigation"
        >
          <Link href="/#services" onClick={() => setOpen(false)}>
            What we do
          </Link>
          <Link href="/#approach" onClick={() => setOpen(false)}>
            How we work
          </Link>
          <Link href="/#about" onClick={() => setOpen(false)}>
            About Manasflow
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)}>
            Start a conversation <ArrowUpRight />
          </Link>
          <a href={contactHref}>{site.email}</a>
          <p>Milan, Italy · Remote-first across Europe</p>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Link href="/" aria-label="Manasflow home">
            <Wordmark />
          </Link>
          <p>
            Room for better ideas.
            <br />
            Care in the details.
          </p>
          <a className="footer-email" href={contactHref}>
            {site.email}
            <ArrowUpRight size={20} />
          </a>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Manasflow
            <br />
            <span>Registered in Milan, Italy. Remote-first across Europe.</span>
          </p>
          <nav aria-label="Legal navigation">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
