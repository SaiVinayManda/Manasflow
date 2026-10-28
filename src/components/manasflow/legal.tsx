import { site } from "@/lib/site";

export type LegalSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export function LegalPage({
  title,
  intro,
  sections,
  draft = false,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  draft?: boolean;
}) {
  return (
    <div className="container">
      <header className="page-intro">
        <p className="eyebrow">
          ManasFlow / Legal · Updated {site.legalUpdated}
        </p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>
      <div className="legal-layout">
        <nav className="legal-toc" aria-label="On this page">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title}
            </a>
          ))}
        </nav>
        <div className="legal-content">
          {draft && (
            <aside className="legal-notice">
              <strong>Draft notice.</strong> ManasFlow’s full registered entity
              name, postal address and service-provider details are awaiting
              confirmation. This page describes the current website setup and
              must be reviewed against the business’s actual practices before
              publication.
            </aside>
          )}
          {sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.content}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
