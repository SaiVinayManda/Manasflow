# Navigation, products, and ecosystem catalog audit

Audit date: 27 October 2026.

## Navigation

The existing source-style Services and Resources dropdown structure is retained. Services now includes the core service groups, seven solution pages, eleven platform agencies, and eight CRM/GTM specialties. Resources includes the existing learning pages, all twelve requested free-resource destinations, the AI tools and bot directories, skills, workflows, and six local ManasFlow products.

Header and footer destination data lives in `src/data/manasflow/navigation.ts`. The exported `NAVIGATION_ROUTES` provides the complete shared-menu route inventory. All company, booking, product, and contact destinations are local routes or the ManasFlow email address. External AI-summary shortcuts in the old footer were replaced with local resource destinations. Newsletter forms prepare a visible email request; input IDs use React `useId` so several newsletter blocks can coexist without duplicate IDs.

Menus support pointer hover, click, outside-click dismissal, Escape dismissal, ArrowDown into the open menu, focus indicators, and the existing mobile accordion navigation. Expanded menus keep the existing bordered panels and maximum-height scrolling.

## Product destinations

The source footer linked proprietary products to separate websites and GitHub repositories. Those destinations are adapted into local ManasFlow resources:

| Source product | Local product and route | Implemented behavior |
| --- | --- | --- |
| AyRank | ManasRank, `/manasrank` | Content-readiness checklist, derived score, prioritized actions, downloadable Markdown plan |
| AyDesign | ManasDesign, `/manasdesign` | Interactive color and density preview, downloadable design brief |
| Ayn8n | ManasN8N, `/manasn8n` | Searchable workflow blueprint library, category filters, readable/copyable/downloadable implementation briefs |
| Ayclaude | ManasClaude, `/manasclaude` | Searchable prompt and engineering-pattern library, copy/download actions |
| AY Skills | Manas Skills, `/manas-skills` | Reusable Markdown task briefs, search/filter/read/copy/download |
| AY Framework | Manas Framework, `/manas-framework` | Five-stage development workflow selector and downloadable stage templates |

The pages share `product-landing.tsx` and its scoped stylesheet. They use original ManasFlow resource briefs and geometric/code-native visual previews. They do not claim an external service, model account, package installer, live ranking monitor, or executable integration has been configured. Canonicals, Open Graph, Twitter metadata, titles, descriptions, actions, and downloadable briefs use ManasFlow.

## Ecosystem catalog coverage

The literal extraction script `scripts/extract-ecosystem-catalogs.mjs` reads the captured current source files under `temp/route-audit/`. It never evaluates a source script or renders source HTML. It extracts text, card destinations, category notes, HowTo steps, tools, and FAQ schemas into `src/data/manasflow/ecosystem-catalogs.json` and passes all strings through the project brand sanitizer.

| Catalog | Content captured | Local behavior |
| --- | --- | --- |
| `/ai-tools` | 346 distinct tools, 75 categories, 44 category implementation notes | Search, category selection, horizontal category navigation, local category/detail links |
| `/ai-tools/category/<slug>` | All 75 source categories and their actual tool memberships | Category introduction and implementation notes, search within category, tool cards |
| `/ai-tools/<slug>` | All 346 card destinations | Tool introduction, provider link, category context, integration considerations, related tools |
| `/bot-directory` | 61 templates across six categories | Search, category filter, integration filter, live result count |
| `/bot-directory/<slug>` | All 61 source HowTo records | Overview, integration grid, numbered setup steps, local review progress, related templates |
| `/skills` | 144 capabilities, 15 categories, six flagship systems | Search, category sidebar/filter, three sort modes, tag search, source-structured grids, FAQ |
| `/workflows` | Eleven source workflows grouped as Build, Automate, Grow, Operate | Grouped hub cards, workflow search, local consultation and newsletter actions |
| `/workflows/<slug>` | All eleven source HowTo/FAQ records | Timeline/stack/prerequisites overview, named steps, deliverables, fit considerations, resources, FAQ, CTA |

The original source listings for individual AI tools were not included in the source sitemap. Their local detail pages are built from the actual directory record, category description, and category implementation notes. The pages do not invent provider specifications, ratings, reviews, or pricing.

Route and metadata ownership is exposed through `ECOSYSTEM_ROUTES` and `ecosystemMetadata(route)` in `src/lib/ecosystem-catalogs.ts`; the root dispatcher renders `EcosystemPage({ route })`. This provides 497 ecosystem routes: four hubs, 75 categories, 346 tools, 61 templates, and eleven workflow details.

Five vendor logo files were already present locally and are reused. Other vendor tiles use neutral initials in the source-sized square container; the page does not request unconfigured remote logo APIs. No original source proprietary logo is used.

## Verification

- Extracted counts are checked by the script: 75 categories, at least 300 tools, 61 bots, and 144 capabilities. Current tool count is 346.
- Extracted data has no empty tool names/descriptions/provider destinations, empty bot names/descriptions/setup steps, or empty skill names/descriptions/categories.
- Every local vendor-logo filename is checked against `public/sites/manasflow/` during extraction.
- Focused ESLint checks cover the changed navigation, product, catalog, metadata, data modules, and extraction script. Final integrated checks and rendered comparison are recorded by the root implementation audit.
- A focused brand scan of all owned runtime/data files finds no original business, product, founder, or domain tokens.

## Remaining fidelity limits

Vendor logo initials differ from the source remote vendor icon tiles. The six proprietary product pages are local brand adaptations of the source product concepts and use the existing ManasFlow site design system, rather than copying separate external applications or advertising unconfigured services. Browser comparison and responsive interaction results must be assessed in the integrated application; no unperformed pixel-level comparison is claimed here.
