# ManasFlow technical SEO audit

Audited before implementation: 20 November 2026. Scope: the active Next.js application in `src/`; `quarantine/` is not served.

## Route and rendering inventory

- Next.js 16.3.5, React 19, App Router, standalone deployment; one root layout, 79 explicit page files, a general catch-all, and an agency catch-all. Metadata uses the Next Metadata API.
- `details-index.json`: 1,140 records: 468 blog posts, 5 case studies, 294 free models, 14 industries, 43 model routes, 6 playbooks, 244 resources, 45 service routes, 20 tool routes, and consultation.
- `service-pages.json`: 65 services. Each is addressable by a flat slug, a source URL, and `/services/<slug>`. These are duplicate URLs for the same content.
- `products.ts`: six platform products. There was no platform hub.
- `tools.json`: 20 interactive tools, each served at both a flat slug and `/tools/<slug>`.
- `ecosystem-catalogs.json`: four hubs, 75 AI directory categories, 346 tool details, 61 bot details, 11 workflow details. Skills are sections of `/skills`, not separate routes.
- `supplemental-pages.json`: 12 pages, including consultations, workshops, libraries, philosophy, and three French pages.
- Legal drafts: `/privacy`, `/terms`, `/cookies`; policy aliases redirect. These drafts already request noindex, but robots incorrectly prevented crawling two of them.
- Blog pagination uses real server-rendered `?page=` links. Model pagination was client state only. Catalog, calculator, comparison, FAQ, and product components are Client Components that Next prerenders; `use client` alone does not prevent SSR. No `ssr:false` content boundary was found.

## Findings

1. Services/resources menus and mobile navigation were conditionally absent from the initial DOM. Footer links were not wrapped in a navigation landmark. Booking links deliberately open Cal.com; navigation must also provide actual internal contact/consultation links without changing booking actions.
2. Metadata helpers exist, but all 1,140 detail descriptions are empty. Blog cards have source descriptions and publication dates that should be reused. Equivalent model directory URLs and service/tool aliases produce duplicated pages.
3. Sitemap contained aliases and noindex legal drafts, lacked dates and crawl hints, and provided no reliable shared definition of indexability.
4. Only Organization and Service JSON-LD existed, with disconnected provider identities. No breadcrumbs, application, directory, article, or FAQ schema; no Website identity or navigation graph.
5. Existing directory breadcrumbs cover categories, tools, bots, and workflows. Other children lack visible breadcrumbs. Some services/resources are not linked from their hubs.
6. Detail rendering promotes source H1 to H2, but source H3 can appear directly after the page H1. Rich content is available in initial HTML; non-default model result pages need crawlable URLs.
7. No llms endpoints. No verified social profiles in active source. No publication dates for playbooks/resources; do not invent publication dates, authors, offers, ratings, or social identities.

## Implementation and verification

`src/data/manasflow/seo-content.json` is generated from current source catalogs by `scripts/generate-seo-content.mjs`. `scripts/validate-seo.mjs` generates `docs/seo-route-map.json`, listing every discovered URL, canonical, hub, indexability, metadata, and date provenance. Run `npm run seo:generate` and `npm run seo:validate` after content updates (generation also runs before development/build).

Dates use actual Git history of content sources; known blog publication dates come from the editorial catalog. Unknown publication dates are omitted rather than inferred from a checkout/build time. No verified sameAs profiles exist; the Organization omits sameAs until evidence is supplied.

The completed route map has 1,886 discovered URLs, 1,768 canonical indexable URLs (including server-rendered pagination), 115 permanent aliases, and three noindex legal drafts. The general catch-all excludes aliases from static generation. Article authors use the existing Taha/Robel biographies where available; other pages identify the publishing organization. Visible FAQ data is shared by the homepage and skills templates, and extracted only within explicit FAQ sections of editorial pages, stopping before CTAs, newsletters, biographies, and related articles.

Checks: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run seo:validate`, and `npm run seo:validate-rendered`. The last command checks built HTML plus live server-rendered pagination, social metadata in the head, single H1 and heading order, one JSON-LD graph, exact visible FAQs, hub navigation, breadcrumbs, internal link destinations and same-page fragments, 308 redirects, noindex directives, real 404 responses, crawler rules, and both LLM endpoints. See `docs/seo-validation.json` for results. This is local validation; no production deployment or Search Console submission is performed.

Sitelinks remain selected by search engines. llms.txt is a discovery proposal, not an indexing or citation guarantee. References: https://developers.google.com/search/docs/appearance/sitelinks and https://llmstxt.org/.
