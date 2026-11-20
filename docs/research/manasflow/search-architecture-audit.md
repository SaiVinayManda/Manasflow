# Search, snippet, and conversion audit

## Findings and implementation

- The six requested hubs already existed and met the requested metadata limits: titles are 30–41 characters including the brand; descriptions are 143–153 characters. Their copy is preserved. The header now presents Solutions, Platform, Free Tools, AI Directory, Insights, and Book a Call as direct links in the primary desktop row and mobile menu. Separate buttons retain access to the larger menus. Navigation JSON-LD and the footer use the same six-link registry.
- The four-copy tool marquee already marked clones with `aria-hidden`. Its three decorative copies now also have `data-nosnippet` and `inert`. The implementation-process section previously rendered one desktop details block and four mobile blocks. It now has a single responsive, interactive details panel, so “What We Do” appears once in SSR content.
- The skip link, repeated call strips, deployment-status text, and footer legal block have snippet exclusions on supported `div` or `span` elements. The existing footer-wide exclusion is retained.
- All four requested raster icons already existed and were wired into the root Metadata API. Regenerating them from `public/logo.svg` produced identical assets. The ICO includes a 48px frame plus 16px/32px compatibility frames; the PNG sizes are 48px, 96px, and 180px. SVG browser icons and the Organization logo URL remain intact.
- All 75 category templates now link to a relevant free tool immediately after the limitations section, or before the search controls when no limitations section exists. Every one of the 468 blog templates includes the same contextual card within its article body. Links use canonical tool URLs, avoiding redirects. Topic matching chooses the selector, ROI calculator, or readiness assessment.
- CollectionPage and ItemList schema already covered every category. The list now also names the collection and declares its unordered display. Tests compare every listed URL with the category's actual tool membership.
- All 468 blog records already had publication and modification dates. Article schema preserves those editorial dates, supports Git-history provenance as a fallback, and rejects blog records without date provenance. The publisher remains `https://manasflow.com/#organization`.
- Both LLM endpoints and the requested crawler allowances already existed. `/llms.txt` now keeps secondary pages in one Optional section. `/llms-full.txt` includes complete detail blocks instead of stopping after 16 blocks, and adds category context and tool links. Tests check canonical coverage of every service, platform product, free tool, directory category, blog post, and playbook/resource.
- IndexNow has a persistent root verification file, idempotent setup, canonical-host validation, URL deduplication, 10,000-URL batches, and a dry-run mode. The submit command checks that the deployed key matches before sending anything. No production notification was sent during this task.

## Verification

- `npm run build`: passed.
- `npm run typecheck`: passed.
- Scoped ESLint: passed.
- `npm run seo:validate`: 1,886 URLs and all JSON-LD graphs validated.
- `npm run seo:validate-rendered`: 1,768 indexable pages, zero errors and warnings.
- `SEO_BASE_URL=http://127.0.0.1:3108 node scripts/test-search-architecture.mjs`: all six hubs, snippet exclusions, 75 category pages, 468 blog posts, LLM coverage, crawler rules, and the verification file passed.
- Existing tool-product and Cal.com regression scripts passed.
- IndexNow dry run: one batch of 1,768 canonical indexable URLs; no outbound submission.
- The Windows browser spot check was stopped by Computer Use because it could not reliably determine the browser URL. Visual browser verification is not claimed; the rendered checks above use the local production server and generated HTML.

After deploying this checkout, run `npm run indexnow:submit` to notify IndexNow about the canonical sitemap URLs. To submit selected pages, use `npm run indexnow:submit -- /services /tools`. Preview requests with `--dry-run`.

## Files created or updated in this task

| File | Change |
| --- | --- |
| `src/lib/site-navigation.ts` | Six canonical hub links and labels. |
| `src/data/manasflow/hub-metadata.json` | Align hub navigation labels. |
| `src/components/seo/hub-navigation.tsx` | Reuse the navigation registry. |
| `src/components/sites/manasflow/chrome.tsx` | Direct desktop/mobile hub links, separate menu controls, utility exclusions. |
| `src/components/sites/manasflow/chrome.css` | Responsive six-hub header styling. |
| `src/app/layout.tsx` | Remove duplicate header bar; protect skip-link snippets. |
| `src/components/sites/manasflow/capabilities.tsx` | Exclude decorative marquee copies from snippets and focus. |
| `src/components/sites/manasflow/lower-sections.tsx` | One shared process details panel. |
| `src/components/sites/manasflow/lower-sections.css` | Responsive placement of the shared panel. |
| `src/components/sites/manasflow/shared.tsx` | Protect repeated call strips from snippets. |
| `src/lib/tool-recommendations.ts` | Match topics to canonical interactive tools. |
| `src/components/seo/tool-funnel-card.tsx` | Accessible contextual tool card. |
| `src/components/seo/tool-funnel-card.css` | Responsive internal-link card styles. |
| `src/components/sites/manasflow/catalog-explorer.tsx` | Place cards below category limitations. |
| `src/components/sites/manasflow/detail-content.tsx` | Insert a tool card inside article prose. |
| `src/app/[...slug]/page.tsx` | Pass blog context into article rendering. |
| `src/lib/seo.ts` | List names/order and Article date-provenance guard. |
| `src/lib/llms.ts` | Complete full-text content and clearer index grouping. |
| `public/indexnow-key.txt` | Root IndexNow ownership verification. |
| `scripts/lib/indexnow.mjs` | Protocol payload validation and URL normalization. |
| `scripts/setup-indexnow.mjs` | Idempotent key setup. |
| `scripts/submit-indexnow.mjs` | Verified, batched submission and dry run. |
| `package.json` | IndexNow setup and submission commands. |
| `scripts/test-search-architecture.mjs` | Targeted source and rendered regression coverage. |
| `scripts/validate-rendered-seo.mjs` | Check primary navigation and strict metadata limits. |
| `docs/seo-validation.json` | Updated full-site validation evidence. |
| `docs/research/manasflow/search-architecture-audit.md` | Findings, verification, and this file summary. |

The raster icons, root icon metadata, `robots.ts`, and both LLM route handlers were verified and reused; their existing files did not need replacement. Earlier tool micro-product changes remain intact.

## References

- [Google sitelinks](https://developers.google.com/search/docs/appearance/sitelinks): useful internal navigation supports discovery; Google selects the displayed sitelinks.
- [Google snippet exclusions](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#data-nosnippet-attr): use supported span, div, and section elements.
- [llms.txt format](https://llmstxt.org/): site summary, H2 file lists, canonical links with descriptions, and an Optional section.
- [IndexNow protocol](https://www.indexnow.org/documentation): ownership verification and URL submission requirements.
