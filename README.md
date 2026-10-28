# ManasFlow

A Next.js App Router site for ManasFlow with local service pages, platform agencies, resource catalogs, and interactive planning tools.

## Run locally

```sh
npm install
npm run dev
```

Open <http://localhost:3000>. In Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`. Keep the server running while using the local URL. `npm run check` runs lint, strict TypeScript checking, and the production build. `npm run start` serves a production build.

## Pages

The site includes all 50 requested top-level routes, the original service and agency path aliases, model comparison and pricing, twenty working calculators/assessments/planning tools, and local article/resource pages. `/ai-tools`, `/bot-directory`, `/skills`, and `/workflows` provide searchable catalogs and implementation guides. The six local products are `/manasrank`, `/manasdesign`, `/manasn8n`, `/manasclaude`, `/manas-skills`, and `/manas-framework`. Header and footer navigation stays within the app. Contact and newsletter forms prepare an email to `info@manasflow.com`.

Page components and styles live in `src/components/sites/manasflow/`; page data is in `src/data/manasflow/`; local media and fonts are in `public/sites/manasflow/`.

## Booking

Booking CTAs open the Cal.com popup for `manasflow/30min`, using the `30min` namespace, light month view, and mobile slots view. `CalProvider` initializes and preloads the SDK once with an explicit `https://cal.com` origin. `BookingLink` calls the modal API directly, without a second delegated click handler or script-load flag. If the calendar reports failure or does not respond within four seconds, the browser opens the hosted booking page. Native anchors also preserve no-JavaScript, right-click, and new-tab navigation. `/consultation` provides a direct booking card. Booking configuration is shared in `src/lib/booking.ts`.

The content policy allows the Cal.com script and frame hosts. `node scripts/test-cal-booking.mjs` checks initialization, popup click handling, fallback behavior, and ordinary navigation. After a production build, `node scripts/audit-cal-booking.mjs` checks every rendered booking trigger.

## Verification

Run `npm run check`, then `node scripts/audit-complete-site.mjs` to validate built route coverage, metadata, local links, assets, and brand sanitization against the captured source sitemap. `node --experimental-strip-types scripts/test-tool-calculations.mjs` checks calculation and scoring boundaries. With the server running, `node scripts/check-live-site.mjs` checks all requested URLs and representative page families. Audit evidence and the source-to-local route map are in `docs/research/manasflow/completion/`.

Original branded editorial media is kept outside the public application under `quarantine/`, excluded from deployment and tracing. Original ManasFlow SVG covers, diagrams, favicons, and social artwork replace those public assets. Vendor names and software/font licenses retain their attribution. Browser screenshot comparisons remain a separate verification step; `scripts/check-rendered-site.mjs` is prepared for the installed Playwright test setup.

The legal pages are drafts pending the business details listed in [REBRAND.md](REBRAND.md). Third-party font licenses are retained with their local assets.
