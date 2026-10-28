import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Asterisk, MoveUpRight } from "lucide-react";
import { Services } from "./services";
import { contactHref } from "@/lib/site";

export function ManasFlowHome() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> Independent thinking. Shared
            direction.
          </p>
          <h1>
            A little clarity.
            <br />A lot of <em>possibility.</em>
          </h1>
          <p className="hero-description">
            Digital products, connected tools and practical automation. We bring
            care to the thinking, the making, and the work in between.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/contact">
              Let’s find a starting point <ArrowUpRight size={19} />
            </Link>
            <Link className="text-link" href="/#services">
              Explore what we do <ArrowDown size={17} />
            </Link>
          </div>
          <div className="hero-location">
            <span>Milan, Italy</span>
            <span>Working remotely across Europe</span>
          </div>
        </div>
        <div className="hero-art">
          <Image
            src="/brand/flow-study.svg"
            alt="Original abstract illustration of forest-green and terracotta paths weaving together."
            width={900}
            height={1050}
            priority
          />
          <div className="art-caption">
            <span>
              Different threads.
              <br />
              One considered direction.
            </span>
            <Asterisk size={32} strokeWidth={1.2} />
          </div>
          <span className="art-index">MANASFLOW / STUDY 001</span>
        </div>
      </section>
      <div className="intro-strip">
        <div className="container">
          <Asterisk size={30} strokeWidth={1} />
          <p>
            Start with what matters.
            <br className="mobile-break" /> Make room for what comes next.
          </p>
          <span>Design · Engineering · Automation</span>
        </div>
      </div>
      <Services />
      <section className="approach-section" id="approach">
        <div className="container">
          <div className="approach-intro">
            <p className="eyebrow">02 / How we work</p>
            <h2>
              Enough structure to move.
              <br />
              <em>Enough space to think.</em>
            </h2>
            <p>
              We start with a conversation and agree the work before we begin.
              The process stays visible as the project takes shape.
            </p>
          </div>
          <div className="approach-grid">
            {[
              [
                "01",
                "Find the real question",
                "We talk through the context, the constraints, and the people who will use what we make. Then we agree on a useful place to begin.",
              ],
              [
                "02",
                "Make something tangible",
                "A map, a prototype, a working slice. Something concrete gives us a shared way to ask better questions and decide what happens next.",
              ],
              [
                "03",
                "Build with intention",
                "We agree the scope, work through the details, and document the decisions. Review points give everyone a chance to shape the work.",
              ],
            ].map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <MoveUpRight size={27} strokeWidth={1} />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="about-section container" id="about">
        <div>
          <p className="eyebrow">03 / A note about us</p>
          <div className="about-art" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <Asterisk size={64} strokeWidth={0.8} />
          </div>
        </div>
        <div className="about-copy">
          <h2>
            Rooted in Milan.
            <br />
            <em>Open to Europe.</em>
          </h2>
          <p>
            ManasFlow is registered in Milan, Italy, and works remotely across
            Europe. Our work brings design, engineering and a habit of asking
            questions into the same conversation.
          </p>
          <p>
            We like clear language, useful tools, and decisions with a reason
            behind them. If that sounds like the way you want to work, we’d like
            to hear what you have in mind.
          </p>
          <a className="text-link" href={contactHref}>
            Meet us in your inbox <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <section className="contact-band">
        <div className="container">
          <p className="eyebrow">It starts with a conversation</p>
          <h2>
            What’s on
            <br />
            <em>your mind?</em>
          </h2>
          <div>
            <p>
              A new idea. A stubborn workflow.
              <br />A question you haven’t quite shaped yet.
            </p>
            <Link className="button button-light" href="/contact">
              Tell us about it <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
