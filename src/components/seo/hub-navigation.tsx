import hubs from "@/data/manasflow/hub-metadata.json";

export function HubNavigation({ placement }: { placement: "header" | "footer" }) {
  return <nav className={`seo-hub-navigation seo-hub-navigation-${placement}`} aria-label={placement === "header" ? "Primary hubs" : "Footer hubs"}>
    <ul className="mf-container">{Object.entries(hubs).map(([href, hub]) => "label" in hub && <li key={href}><a href={href}>{hub.label}</a></li>)}</ul>
  </nav>;
}
