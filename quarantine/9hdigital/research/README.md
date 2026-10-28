# 9H Digital homepage clone

## Run and route map

Run `npm run dev`, then open http://127.0.0.1:3000.

| Source | Local | Ownership |
| --- | --- | --- |
| https://9hdigital.com/ | `/` | `src/app/page.tsx`, `src/components/sites/9hdigital/` |
| Source fonts, illustrations, photography, GIFs, hero video | `/sites/9hdigital/*` | `public/sites/9hdigital/` |

The original template homepage was untouched and was replaced. Existing user changes to `package-lock.json` and `.agents/skills/clone-website/agents/` were preserved. No other source pages were requested. About, work details, services, products, insights, contact, legal, and social links retain their original external destinations. Home links stay local.

## Page brief

- Source is a WordPress site with Tailwind styling and JavaScript motion, rather than a Framer page.
- Typography: original local Hubot Sans variable TTF, declared at weights 100–600. Primary ink `#242128`, white backgrounds, fine neutral borders, translucent rounded controls.
- Order: navigation; looping video hero; four service cards; industries and six case studies; five team tabs; six insights; CEO quotation; Vimeo film; five client stories; footer.
- At 1440 px: hero margins 32 px and top 28 px; inner left edge 96 px. Main content is 95vw with 36 px internal padding, giving a 72 px left edge. Services use two 400 px rows with a 32 px gap. Industry columns have a 112 px gap and 700 px tall case cards.
- Hero type is 41.6 px at the small desktop breakpoint, 57.6 px at 1280 px, and 64 px at 1536 px. It changes to the three-line “We build the tech…” heading on mobile.
- Mobile was inspected at 390 × 844; desktop at 1440 × 1000 and 1920 × 1080. The mobile hero is about 702 px tall and uses the original animated GIF.

## Interaction rules implemented

- Desktop Services opens a four-row menu. Mobile has its own full-screen menu and nested services. Escape closes menus; opening a menu locks background scrolling.
- Hero words reveal their original animated icons, colored glow, and 80 px movement on hover.
- Service card descriptions expand on hover/focus on desktop; mobile always displays them.
- Industry selection follows vertical scrolling on desktop while the list remains sticky. Buttons scroll to the corresponding case study. Mobile uses a single-open accordion.
- Team tabs change both explanatory text and person/quotation; left/right keyboard navigation is supported.
- Insight hover reveals the real post thumbnail near the pointer.
- Video opens the source Vimeo film in a dismissible modal.
- Desktop testimonials follow a pinned scroll section; arrows and mobile swipe also change stories, with bounded previous/next controls.
- Cookie consent dismisses, reopens, and saves selected categories locally. No analytics or marketing trackers are installed.

## Evidence and checks

- [Desktop comparison](comparison-desktop.png): source left, local right; 1440 × 1000.
- [Mobile comparison](comparison-mobile.png): source left, local right; 390 × 844.
- `source-section-*.png` and `local-section-*.png` compare services, industries, team panels, insights, and testimonials at corresponding section positions.
- `source-wide-1920.png` / `local-wide-1920.png` cover the wider desktop layout.
- `source-mobile-menu.png` / `local-mobile-menu.png` cover the menu state.
- `asset-map.json` records original URL, local URL, response MIME type, signature, and byte size. `final-qa.json` records decoded image dimensions and responsive overflow checks.
- `verification.json` records desktop/mobile tab, accordion, testimonial and video-dialog checks, with no browser page errors.
- Final `npm run check`: ESLint, TypeScript and the production build all passed.
- Final responsive check: no horizontal overflow at 360, 390, 768, 1024, 1440 or 1920 px. All 53 local image files decoded, and the saved custom cookie choices were verified.

For browser QA, Playwright and Prettier were installed only in ignored `temp/9h-tools/`; the app has no new runtime dependencies. The scripts are development evidence, and can be rerun after installing these packages into that temporary folder.

## Remaining differences

- The source's HubSpot live-chat launcher and remote chat service are omitted.
- Scroll and reveal easing is recreated in CSS/React; it is not the source's original animation engine. Testimonial transitions use discrete story selection during the pin, and may differ during intermediate scroll positions.
- The hero video and GIF run on their own clocks, so their backgrounds differ between independently captured screenshots.
- Small glass-shadow, consent-panel, quote-glyph and footer badge differences remain. This is a closely matched clone, not a claim of perfect pixel equivalence.
- Only the homepage is local. Outbound pages and the Vimeo player require network access.

Source HTML, styles, screenshots and DOM measurements are inspection references only. The delivered page uses editable React components and local assets; it does not embed the source page or run its production bundles.
