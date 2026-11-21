# ManasFlow SEO, AEO, and GEO implementation

Audited and verified locally on 21 November 2026. Scope: the active Next.js application; no deployment or search-console submission was performed.

## Result

- Normalized unique search titles to fewer than 60 characters, including the ManasFlow suffix, and descriptions to 125–155 characters for all 1,768 canonical indexable pages. The existing homepage description meets the stricter 145–155 character requirement. Visible headlines and paragraphs retain their original text.
- Regenerated the existing raster assets from `public/logo.svg`: 48px and 96px PNGs, 180px Apple icon, and a conventional ICO containing 16px, 32px, and 48px frames. Regeneration produced identical assets, so no binary changes are necessary. The root `metadata.icons` declarations already expose all four files and retain SVG icons; rendered checks verify these links.
- Added snippet exclusions to the skip-link text, badges, duplicate marquee groups, live demo toolbars, newsletter utility content, email notices, and status messages. The existing footer exclusion remains intact.
- Kept the existing SSR footer links. Added three inline anchors around existing homepage words to expose Platform, Free AI Tools, and AI Tools Directory in the main content; Services and Blog were already linked. No text or styles changed.
- Preserved one JSON-LD graph per page. Navigation entity names now match the visible footer labels. Platform is represented as a collection of its products. Free tools and platform products use WebApplication with BusinessApplication, Web, and a zero-price offer. Model applications use the exact existing hero names and descriptions and retain stable application identities across pagination. Their collection item lists match the entries rendered on each page. AI directory detail pages describe the actual third-party application and the six related tools visible on that page, without inventing prices or claiming ManasFlow publishes that software.
- Retained canonical URLs, hierarchy breadcrumbs, Service/provider links, and Article/TechArticle headlines and author/publisher links. Removed duplicated FAQ lookup branches.
- Improved the existing `/llms.txt` and `/llms-full.txt` route handlers through their shared generator: all five requested sections, canonical URLs, a summary blockquote, and clean content summaries. The full endpoint now includes calculator input labels, output labels, and calculation notes from the actual calculator definitions.
- Split the seven named search/AI crawlers into explicit allow groups. The wildcard allow and canonical sitemap reference remain. The generated sitemap contains all 1,768 indexable URLs and uses recorded content-source Git dates, never request or build timestamps.

## Preservation evidence

The header component, its navigation data, its hub-navigation component, and every stylesheet were checked against baseline SHA-256 hashes: 25 protected files remained byte-identical. The root Header invocation remained unchanged. The rendered homepage header was also byte-for-byte identical to the pre-change build.

Every changed UI component was compared with Git HEAD after removing only the added snippet attributes, the skip-text span, and the three new inline anchors. The remaining source was identical. No visible copy, styling, heading text, navigation action, layout class, or existing destination was changed.

## Verification

- `npm run icons:generate`: passed; asset dimensions and all ICO frames also passed binary validation.
- `npm run seo:generate`: passed; 1,840 source metadata records.
- `npm run seo:validate`: passed; 1,886 known URLs, including aliases; canonical/indexability coverage, unique metadata, character limits, graph identities, schema fields, redirects, and recorded sitemap dates.
- `npm run lint`, `npm run typecheck`, and `npm run build`: passed with zero errors.
- `npm run seo:validate-rendered`: passed for all 1,768 indexable pages, checking SSR head metadata, canonical URLs, one H1, heading order, JSON-LD, exact visible schema text, collection links, 2,803 visible FAQ answers, 1,803 internal link targets, 115 redirects, legal noindex directives, actual 404 status, crawler rules, favicon declarations, and both LLM endpoints.

The Windows commands use `npm.cmd` because PowerShell script execution is disabled. The scripts themselves are unchanged commands from `package.json`. Detailed machine results are in `seo-validation.json` and `seo-route-map.json`.

## Publication-date evidence gap

All 468 blog articles have recorded editorial publication dates. Another 249 playbook/resource pages have no publication date in their editorial source. Their Article/TechArticle schemas retain author, publisher, headline, and recorded dateModified; datePublished is deliberately omitted. Git file-introduction dates are not evidence of public publication. Supply verified editorial dates to populate this remaining field; the complete affected-route list is in `seo-publication-gaps.json`.

Search engines select snippets and sitelinks themselves. These changes supply clean signals and exclusions; they cannot guarantee a particular displayed snippet, logo, sitelink set, ranking, or AI citation. See [Google's snippet documentation](https://developers.google.com/search/docs/appearance/snippet), [sitemap lastmod guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), and the [llms.txt proposal](https://llmstxt.org/).

## Files created or updated

| File | Change |
| --- | --- |
| `scripts/generate-seo-content.mjs` | Source-derived, length-bounded, unique metadata; aliases inherit their canonical metadata. |
| `src/data/manasflow/seo-content.json` | Regenerated search metadata, preserving original visible-copy fields. |
| `src/lib/interactive-tool-data.ts` | Route interactive-tool metadata through the shared metadata helper. |
| `src/lib/seo.ts` | Visible-text entity names, application and collection schemas, and navigation label consistency. |
| `src/lib/llms.ts` | Required discovery sections and source-derived calculator details. |
| `src/app/layout.tsx` | Skip-link snippet exclusion only; header and icon declarations preserved. |
| `src/app/robots.ts` | Explicit allow group for each requested crawler. |
| `src/app/sitemap.ts` | Document the preserved content-history lastmod policy. |
| `src/components/sites/manasflow/home.tsx` | Two existing-text hub links and utility snippet exclusions. |
| `src/components/sites/manasflow/lower-sections.tsx` | Existing-text Platform link and email snippet exclusion. |
| `src/components/sites/manasflow/shared.tsx` | Badge snippet exclusion. |
| `src/components/sites/manasflow/capabilities.tsx` | Snippet exclusion on decorative marquee copies only. |
| `src/components/sites/manasflow/catalog-explorer.tsx` | Status-message snippet exclusion. |
| `src/components/sites/manasflow/catalogs.tsx` | Status-message snippet exclusion. |
| `src/components/sites/manasflow/company-pages.tsx` | Status-message snippet exclusion. |
| `src/components/sites/manasflow/industries.tsx` | Status-message snippet exclusion. |
| `src/components/sites/manasflow/model-directory.tsx` | Status-message snippet exclusions. |
| `src/components/sites/manasflow/newsletter.tsx` | Status-message snippet exclusion. |
| `src/components/sites/manasflow/product-landing.tsx` | Status-message snippet exclusions. |
| `src/components/sites/manasflow/supplemental-examples.tsx` | Status-message snippet exclusions. |
| `src/components/sites/manasflow/tool-product-actions.tsx` | Status-message snippet exclusion. |
| `src/components/sites/manasflow/tool-ui.tsx` | Status-message snippet exclusion. |
| `scripts/validate-seo.mjs` | Metadata length, schema, sitemap-date checks, and publication-gap report. |
| `scripts/validate-rendered-seo.mjs` | All-page metadata limits, visible schema/list checks, homepage anchors, snippet exclusions, and LLM discovery checks. |
| `docs/seo-route-map.json` | Updated metadata and route inventory. |
| `docs/seo-validation.json` | Updated rendered verification results. |
| `docs/seo-publication-gaps.json` | New list of 249 routes requiring verified editorial publication dates. |
| `docs/seo-aeo-geo-audit.md` | This audit, verification evidence, and file summary. |

Existing icon assets, `metadata.icons`, the two LLM route-handler files, footer links, and header files required no changes and were verified in place.
