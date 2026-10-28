/* Source SVGs and animated assets retain their native rendering. */
/* eslint-disable @next/next/no-img-element */
export const asset = (name: string) => `/sites/9hdigital/${name}`;
export const origin = "https://9hdigital.com";

export function Arrow({ straight = false }: { straight?: boolean }) {
  return straight ? (
    <svg viewBox="0 0 21 20" fill="none" aria-hidden="true">
      <path
        d="M8.263 4.096h8.079v8.079M5.028 15.409l11.2-11.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path
        d="M1 34.5L34.128 1.5M34.128 1.5c-3.778 4.921-8.892 17.195.872 26.921M34.128 1.5C29.77 5.842 18.436 11.921 7.974 1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function GlassLink({
  href,
  children,
  arrow = true,
}: {
  href: string;
  children: React.ReactNode;
  arrow?: boolean;
}) {
  return (
    <a className="glass-link" href={href}>
      {children}
      {arrow && <Arrow straight />}
    </a>
  );
}

export function SocialLinks() {
  return (
    <div className="social-links">
      {[
        ["Facebook", "facebook", "https://www.facebook.com/9hdigital/"],
        ["Instagram", "instagram", "https://www.instagram.com/9hdigital/"],
        [
          "Linkedin",
          "linkedin",
          "https://www.linkedin.com/company/9h-digital/",
        ],
      ].map(([label, icon, href]) => (
        <a
          key={icon}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noreferrer"
        >
          <img src={asset(`${icon}.svg`)} alt="" />
        </a>
      ))}
    </div>
  );
}
