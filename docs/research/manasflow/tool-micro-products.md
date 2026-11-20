# Tool micro-product upgrade

## Inspected scope

30 canonical routes remain under `https://manasflow.com`:

- The 20 calculators, assessments, generators, and salary explorer registered in `src/data/manasflow/tools.json`, including tools served by the catch-all route.
- `/directory`, `/ai-model-comparison`, and `/ai-model-pricing-index`.
- `/manasrank`, `/manasdesign`, `/manasn8n`, `/manasclaude`, `/manas-skills`, and `/manas-framework`.
- `/platform`, the product hub. Its metadata and schema are covered; its linked workspaces own interactive results and booking cards.

Existing tool aliases retain their canonical redirects. Third-party vendor profile pages are editorial directory entries rather than ManasFlow applications.

## Implementation

`src/lib/tool-products.ts` is the shared product registry. Each route's OG and X metadata points to its own `/og/tools/<slug>` image. The Next.js image route renders a cached 1200×630 PNG with the title, subtitle, ManasFlow mark, and canonical product path. Image generation uses local code and requires no remote image service.

The shared SEO graph emits one `SoftwareApplication` per tool route, including model pagination, with a free USD offer (`price: "0"`), `isAccessibleForFree`, and provider `https://manasflow.com/#organization`.

`useToolState` synchronizes known input fields, assessment progress, selections, and result visibility to JSON-valued URL search parameters using the native History API. It preserves unrelated parameters and the URL fragment. The browser restores state after hydration; the server retains a stable initial render. URL validation rejects malformed types, bounds numbers and indices, validates select options, and prevents incomplete assessments from displaying a finished score.

Calculator and budget URLs include the last submitted assumptions separately from editable form inputs, preserving the existing submit/reset behavior. Results are recomputed by the existing calculation functions. Model links include token volumes, filters, sort, shortlist, and pagination. Platform links preserve readiness checks, design options, selected framework stage, and library filters. Generator links also retain editable output where applicable.

“Copy Share Link” provides success feedback and a selectable URL fallback if clipboard access fails. Result cards and product workspaces include an implementation CTA labeled “Book a Discovery Call”, using the existing `BookingLink` and Cal.com popup/fallback flow.

The formulas and scoring in `src/lib/tool-calculations.ts` are unchanged.

## Verification

- Production `npm run build` completed successfully.
- Scoped ESLint checks cover changed source files and the new regression script.
- `node --experimental-strip-types scripts/test-tool-calculations.mjs`: passed.
- `node scripts/test-cal-booking.mjs`: passed.
- `node scripts/test-tool-products.mjs`: validates all 30 metadata/schema records, restored results across all 20 tools and six platform workspaces, model usage/shortlist/pagination, malformed URL input, sharing, and reset behavior.
- With `TOOL_BASE_URL` set to the local production server, the same script verifies rendered metadata/schema and valid 1200×630 PNG images for all 30 routes.
- Chrome spot check: non-default ROI inputs restored the expected output, copied share links reopened the same result, the discovery card rendered beneath output, model token volumes and shortlist restored, and a generated social card displayed the expected branding and content.
