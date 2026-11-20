# Header and initial-load performance audit

## Concrete bottlenecks

1. The root CalProvider called initializeCal on mount. That loaded the embed and preloaded scheduling data on every page, before any booking intent. The scheduling SDK was also a static import. The provider and preconnect/DNS hints are removed; a booking click now dynamically imports the SDK. The link provides a busy acknowledgement immediately. The four-second failure fallback remains an error guard, not an opening delay.
2. Header open/close state lived above the entire header. Every toggle rebuilt the navigation/catalog JSX and re-registered document listeners. Both desktop and mobile copies of two menus were mounted: four menu trees, 1865 header elements, and 196 anchors. The header/footer are now Server Components. Native details disclosures own both desktop and mobile state; they work before hydration and do not schedule React updates. Small leaf handlers add Escape, ArrowDown, outside-click, and destination-click dismissal.
3. Secondary navigation and footer ActionLinks inherited Next.js default route prefetching. They now explicitly use prefetch=false, and ActionLink defaults to false. Only the five primary hub links (/services, /platform, /tools, /ai-tools, /blog) retain default prefetch behavior. No hover-prefetch override is installed.
4. The fixed header applied a 12px backdrop blur. It now uses an opaque background. Dropdown transitions only animate opacity and transform for 100ms, with reduced-motion support. No dropdown timer, spring, or fullscreen blur is used.
5. The homepage and shared chrome were broad client boundaries. Static content now renders on the server, with separate carousel/story, FAQ, process, newsletter, and video leaves. One reveal observer replaces many per-wrapper effects. Scroll-story geometry and state updates are skipped outside its neighborhood, and the decorative 150ms code typewriter interval is removed.
6. The tool marquee mounted four repeated groups; two provide the same seamless loop. The three below-fold demos had src plus autoplay; autoplay can override preload=none. Their local files total 2,248,380 bytes. Src is now assigned only near the viewport, and playback pauses outside it or when the document is hidden.

No Leadchatbot.tsx, chatbot mount, or chatbot script exists in this checkout. There is no chatbot dependency to defer.

## Production measurements

Next.js 16.3.5's build output does not print a First Load JS column. These numbers come from unique modern script files referenced by generated production HTML, compressed individually with gzip. They include Next/React runtime code. The unchanged noModule compatibility script is excluded from both snapshots; the first exploratory count included it. Lazy SDK chunks, HTML/RSC payloads, and actual network timings are not part of these totals.

| Route | Initial JS before (gzip) | Initial JS after (gzip) |
| --- | --- | --- |
| / | 160.6 KiB | 145.3 KiB |
| /contact | 163.4 KiB | 156.6 KiB |
| /services | 163.4 KiB | 156.6 KiB |
| /platform | 146.3 KiB | 138.4 KiB |
| /roi-calculator | 199.0 KiB | 191.3 KiB |

Shared initial JS across these routes: **146.3 → 138.4 KiB gzip**. The changed shared chunk set decreases from **18.7 to 10.9 KiB gzip**; unchanged framework chunks make up the remaining shared total.

| HTML structure | Before | After |
| --- | --- | --- |
| Header elements | 1865 | 952 |
| Header anchors | 196 | 102 |
| Header menu trees | 4 | 2 |
| Homepage elements | 3575 | 2593 |
| Tool marquee groups | 4 | 2 |

Element counts use the same generated-HTML tag counter in both snapshots. Raw homepage HTML grows from 249,294 to 347,623 bytes as more static markup crosses the server/RSC boundary. This is a tradeoff for less executable client code and hydration work, not a claim that every transferred resource became smaller. Actual compressed HTML transfer, LCP, INP, and real-device sub-16ms menu paint were not profiled. Tests establish zero React state updates and no delay timers in the disclosure path; they do not substitute for a browser performance trace.

## Verification

- npm run build: passed, including TypeScript and all static route generation.
- npm run typecheck and scoped ESLint: passed.
- node scripts/test-navigation-performance.mjs: passed; PERF_BASE_URL adds production HTML checks.
- node scripts/test-cal-booking.mjs: passed, including zero initialization at import/render and click-only SDK initialization.
- node scripts/test-tool-products.mjs: passed; existing tool behavior is preserved.
- node scripts/test-search-architecture.mjs with SEO_BASE_URL: passed.
- Full rendered SEO validation: 1,768 pages, zero errors and warnings.

## Files created or modified

| File | Change |
| --- | --- |
| `src/app/layout.tsx` | Remove eager Cal initialization and connection hints; mount one reveal observer controller. |
| `src/components/sites/manasflow/chrome.tsx` | Server-render the header/footer; explicitly disable secondary link prefetch; share menu contents across breakpoints. |
| `src/components/sites/manasflow/chrome.css` | Native responsive disclosure styling, 100ms opacity/transform panels, opaque header, pending booking feedback. |
| `src/components/sites/manasflow/header-navigation.tsx` | Native desktop and mobile open state, Escape/outside/link dismissal, no React state or timers. |
| `src/components/sites/manasflow/newsletter.tsx` | Isolate newsletter form state from server-rendered chrome. |
| `src/components/sites/manasflow/booking-link.tsx` | Default secondary ActionLink prefetch to false and acknowledge booking clicks with an immediate busy state. |
| `src/components/sites/manasflow/cal-provider.tsx` | Import the scheduling SDK only inside the click-driven initializer; remove the provider and preload call. |
| `src/components/sites/manasflow/shared.tsx` | Make static shared helpers server-compatible; render Reveal wrappers without per-element effects. |
| `src/components/sites/manasflow/reveal-controller.tsx` | Use one intersection observer for reveal wrappers, including route changes and streamed content. |
| `src/components/sites/manasflow/home.tsx` | Keep the homepage composition/static sections on the server; reference small interactive leaves. |
| `src/components/sites/manasflow/home-interactive.tsx` | Isolate carousel/story interactions; gate scroll measurements to the story viewport and quantize updates. |
| `src/components/sites/manasflow/home-faq.tsx` | Isolate FAQ accordion state. |
| `src/components/sites/manasflow/viewport-video.tsx` | Withhold video src until nearby, pause when offscreen/hidden, and respect reduced motion. |
| `src/components/sites/manasflow/capabilities.tsx` | Server-render static capability cards; remove the 150ms typewriter interval; reduce marquee groups from four to two. |
| `src/components/sites/manasflow/capabilities.css` | Preserve marquee travel speed with the smaller seamless loop. |
| `src/components/sites/manasflow/lower-sections.tsx` | Keep static lower homepage sections on the server. |
| `src/components/sites/manasflow/process-tabs.tsx` | Isolate process-tab state and the existing shared details panel. |
| `src/components/sites/manasflow/catalog-explorer.tsx` | Import the newsletter leaf directly. |
| `src/components/sites/manasflow/catalogs.tsx` | Import the newsletter leaf directly. |
| `src/components/sites/manasflow/free-tools.tsx` | Import the newsletter leaf directly. |
| `scripts/audit-performance.mjs` | Measure modern initial chunks, gzip weights, HTML size, and element/menu counts before and after. |
| `scripts/test-navigation-performance.mjs` | Verify prefetch limits, native disclosure behavior, zero dropdown React updates, and viewport-only media. |
| `scripts/test-cal-booking.mjs` | Verify no startup SDK work, immediate click acknowledgement, lazy initialization, fallback, retry, and native links. |
| `scripts/test-search-architecture.mjs` | Recognize primary links inside native menus and the reduced decorative marquee copies. |
| `docs/research/manasflow/performance-audit.json` | Captured baseline, rebuilt measurements, and exact chunk comparison. |
| `docs/research/manasflow/performance-audit.md` | This diagnosis, verification, measurement limits, and complete file list. |

Earlier repository changes remain intact. No production deployment was performed.
