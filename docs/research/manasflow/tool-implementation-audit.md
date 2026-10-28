# ManasFlow interactive tool implementation

The existing tools hub links to twenty tools. All twenty now have an interactive implementation in `src/components/sites/manasflow/interactive-tools.tsx`, with shared assessment, planning, and form components. The nine requested root URLs have explicit `src/app/<tool>/page.tsx` files; the original `/tools/<tool>` URLs can use the same renderer through the catch-all route.

## Source evidence

The reference HTML already saved in `temp/linked-pages/details/` and its associated page chunks in `temp/linked-pages/chunks/` supply the page headings, form structure, question banks, and FAQ text. `scripts/extract-interactive-tool-evidence.mjs` reads those files with the TypeScript parser and extracts only literal data; it does not execute downloaded application code. Reconstructed React components remain editable local code.

The source uses a narrow centered workspace, dark cards, square controls, lavender accent color, a title/description/trust row, a form or assessment panel, FAQ accordions, three related-tool cards, and a closing contact CTA. The local scoped stylesheet follows those sections, the existing Lexend font, and existing site color tokens. Inputs collapse to a single column on mobile; numeric results wrap and tables scroll within their container.

Question banks preserve the source questions and answer options:

| Tool | Questions | Navigation |
| --- | ---: | --- |
| AI readiness | 15 | Five pillars, three questions per step |
| AI maturity | 10 | One question per step |
| Digital transformation | 20 | Five pillars, four questions per step |
| AI governance | 12 | Six pillars, two questions per step |
| Automation tool selector | 10 | One question per step; integrations allow multiple selections |

The ROI tool follows the source’s Process Info → Investment → Impact steps. Its calculation uses total team hours × hourly rate × 4.33; the headcount field is contextual and does not multiply hours a second time. It calculates labor and error savings, operating costs, first-year ROI, steady-state payback, efficiency, and a five-year projection with explicit 3% savings growth and 10% tool-cost growth assumptions.

## Functional coverage

- Ten calculators model ROI, budget, payback, agent token/review cost, build versus buy, meeting time, team cost, staffing models, human task cost versus agent cost, and platform cost assumptions.
- The salary explorer filters attributed public compensation snapshots by region and shows explicitly labeled interpolated experience bands. Original proprietary placement-price claims are omitted.
- Four assessment tools score real answer selections, show pillar breakdowns and a radar visualization, produce a 90-day plan, and clear answers on retake.
- The selector ranks implementation platforms from budget, technical skills, volume, complexity, team preferences, and timeline. It uses a transparent local heuristic.
- Workflow audit supports adding and removing workflows, calculating and ranking potential savings, and exporting the report.
- The use-case and process-finder generators tailor a rules-based shortlist to the department, industry, team profile, and process assumptions.
- The job-description generator produces an editable role-specific draft, interview questions, and an evaluation rubric.
- Generated results support copy and text download. Clipboard failure is reported accurately. No third-party form, booking, email capture, or AI endpoint is called.

Results are available directly instead of using the source site’s email gate. Pricing and budgeting inputs are editable estimates. These distinctions are shown in the relevant tool interfaces so visitors can interpret results correctly.

## Validation performed

`node --experimental-strip-types scripts/test-tool-calculations.mjs` passes. It checks the source-equivalent default ROI, no-payback and zero-investment cases, percentage clamping, token/review cost, build/buy break-even, finite zero-input results, currency metric labeling, budget reconciliation against both categories and monthly schedule, workflow labor savings, all-low/all-high assessment boundaries, and cleared-answer score reset behavior.

Scoped ESLint checks passed for the new tool components and libraries. A TypeScript check reported no errors in these tool files. Full integrated production and browser checks are owned by the main task; no rendered pixel comparison or browser click-through is claimed by this implementation note.

## Integration API

`src/lib/interactive-tool-data.ts` exports `INTERACTIVE_TOOL_SLUGS`, `getInteractiveTool(slug)`, and `interactiveToolMetadata(slug, pathname?)`. The metadata helper supplies an absolute ManasFlow title, description, canonical URL, Open Graph fields, and Twitter card.

`InteractiveTool({ slug })` from `src/components/sites/manasflow/interactive-tools.tsx` renders any of the twenty tools. Parent routes should key it by slug when replacing the component in place so a navigation creates a fresh form state.
