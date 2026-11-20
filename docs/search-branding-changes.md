# Search branding and hub metadata fixes

Converted the existing logo to opaque, high-contrast square PNG icons and a Windows ICO containing 16, 32, and 48px frames. The source SVG and Organization logo URL remain unchanged. The Next Metadata API emits explicit icon links into the SSR head on every route.

The six requested hubs now have shared title/description metadata and always-present server-rendered anchors in both header and footer. The footer and booking owner block use data-nosnippet without suppressing page snippets or AI retrieval globally.

## Metadata

| Route | Final title | Title characters | Description characters |
| --- | --- | ---: | ---: |
| `/` | AI Transformation & Automation \| ManasFlow | 42 | 150 |
| `/services` | AI Automation & SaaS Services \| ManasFlow | 41 | 150 |
| `/platform` | Platform & Frameworks \| ManasFlow | 33 | 146 |
| `/tools` | Free AI Tools & Calculators \| ManasFlow | 39 | 147 |
| `/ai-tools` | AI Tools Directory \| ManasFlow | 30 | 143 |
| `/blog` | AI Insights & Research \| ManasFlow | 34 | 153 |
| `/contact` | Book a Discovery Call \| ManasFlow | 33 | 143 |

Homepage description:

> ManasFlow builds AI automations, agents, and SaaS. Explore our platform, frameworks, and free AI tools to streamline workflows and grow your business.

WebSite JSON-LD uses name ManasFlow and alternateName manasflow.com. Hub last-modified dates continue to come from the real page/content source history.

## Modified files

- `docs/seo-route-map.json`
- `package.json`
- `public/favicon.ico`
- `scripts/generate-seo-content.mjs`
- `scripts/validate-rendered-seo.mjs`
- `src/app/blog/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/platform/page.tsx`
- `src/app/services/page.tsx`
- `src/app/tools/page.tsx`
- `src/components/sites/manasflow/booking-link.tsx`
- `src/components/sites/manasflow/chrome.css`
- `src/components/sites/manasflow/chrome.tsx`
- `src/data/manasflow/seo-content.json`
- `src/lib/ecosystem-catalogs.ts`
- `src/lib/metadata.ts`
- `src/lib/seo.ts`
- `src/lib/site.ts`

## Created files

- `docs/search-branding-changes.md`
- `public/apple-touch-icon.png`
- `public/favicon-48x48.png`
- `public/favicon-96x96.png`
- `scripts/generate-favicons.mjs`
- `src/components/seo/hub-navigation.tsx`
- `src/data/manasflow/hub-metadata.json`

## Verification

- Production build, TypeScript, lint, route/schema audit, and rendered SEO audit.
- PNG signatures and dimensions; ICO directory and DIB dimensions.
- Homepage and six hub titles/descriptions, favicon head links, static hub anchors, and WebSite identity.
- HTTP requests using Bingbot and Googlebot user agents, plus public icon status codes and MIME types.

Search engine display changes require deployment and recrawling; snippets and sitelinks are selected by search engines. References: https://developers.google.com/search/docs/appearance/favicon-in-search and https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a.
