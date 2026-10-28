# ManasFlow Cal.com integration

The booking target is `https://cal.com/manasflow/30min`. Every booking trigger uses the `30min` namespace, light `month_view`, and `useSlotsViewOnSmallScreen: "true"`. Event details stay visible.

## Implementation

- `src/lib/booking.ts` owns the link, namespace, and stable data attributes.
- `cal-provider.tsx` initializes `@calcom/embed-react` from the root layout. One shared promise prevents duplicate configuration and preload during Strict Mode remounts. Both the SDK URL and namespaced initialization explicitly use `https://cal.com`. SDK commands queue until the remote script loads; there is no separate script-load flag or DOM listener.
- `booking-link.tsx` supplies native anchors and invokes the namespaced modal API directly. It uses `data-booking-link` rather than `data-cal-link` so Cal's delegated handler cannot open a second modal. Ordinary popup clicks cancel anchor navigation and propagate normally. Modified clicks, right-click menus, and explicit new tabs retain the real hosted URL.
- The modal's ready/reopened events cancel a four-second fallback timer. A failure event, SDK rejection, or unresponsive embed opens the hosted booking page. Escape and iframe-close events cancel pending fallback. Late SDK responses cannot open a modal after fallback. Pending state survives a mobile menu closing after its CTA is clicked.
- The root head preconnects to both Cal hosts. The installed SDK deliberately normalizes hosted embed iframes to `app.cal.com`; origin initialization includes its namespace because an init call without it is ignored by this SDK version.
- `ActionLink` recognizes booking destinations and booking-labeled contact CTAs. General Contact Us links, solution browsing, product/library links, and email actions retain their existing behavior.
- `CallButton`, `PageCallout`, navbar/footer, heroes, industry and product callouts, dynamic service/resource links, and tool callouts use the shared behavior. The homepage and `/consultation` booking cards offer direct calendar buttons instead of an email-only time request.
- The site's content policy permits the SDK, booking frames, and embed font on `app.cal.com` and `cal.com`. Storage/privacy text describes the scheduling integration.

## Verification

`node scripts/test-cal-booking.mjs` exercises the actual transpiled components with a mocked SDK and clock: duplicate-effect initialization/preload, namespaced origin, single popup, readiness/failure/four-second fallback, late SDK responses, Escape, rapid clicks, native new tabs, and preservation of non-booking links.

`node scripts/audit-cal-booking.mjs` checks every prerendered anchor for correct booking configuration and fallback URLs, and detects booking links still pointing at internal contact/consultation destinations. Its detailed result is in `build-audit.json`.

Representative live homepage, consultation, industry, and agency routes return HTTP 200 with the booking attributes. An initial native Chrome test loaded the actual event calendar and exposed an anchor-navigation issue; that click-handling bug was corrected and covered by the automated checks. A final browser click-through after the correction was limited by unreliable native window focus. No appointment or attendee data was submitted.

The repository's full `npm.cmd run check` validates ESLint, TypeScript, and the production build. Booking configuration can be changed centrally in `src/lib/booking.ts`.
