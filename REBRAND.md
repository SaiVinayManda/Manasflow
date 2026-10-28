# Manasflow rebrand audit and inventory

Audit date: 17 October 2026. Scope: the cloned application, all downloaded assets, clone tooling and captured source evidence. This is an inventory of the repository and rendered application, not an audit of accounts or infrastructure outside this workspace.

## Result

The original business’s content has been removed from the active application and quarantined, not relabelled. The replacement is Manasflow: `info@manasflow.com`, registered in Milan, Italy, remote-first across Europe. Its copy, artwork, palette, typefaces, hero and service layout are new. There are no testimonials, case studies, client logos, staff biographies, customer-success assertions, rankings, revenue claims or numerical performance claims in the replacement.

The pre-change inventory covers **125 files**, including **56 downloaded assets** and **32 files with matched identity text**. Original paths, complete matching lines, original JSON-LD and SHA-256 hashes are preserved in [inventory-before.json](quarantine/9hdigital/inventory-before.json). [identity-locations.md](quarantine/9hdigital/identity-locations.md) indexes the matching files and line numbers. Full originals remain available for inspection in quarantine.

## Identity inventory and disposition

| Surface | Original identity / location | Change |
| --- | --- | --- |
| Page and brand copy | `src/components/sites/9hdigital/home.tsx`: hero, “With 9H…”, “Turning complexity into clarity, at speed”, footer and copyright | Entire component quarantined. New copy in `src/components/manasflow/home.tsx` and `chrome.tsx`; no search-and-replace reuse. |
| Navigation and contact | `header.tsx`, `shared.tsx`, `home.tsx`: origin `https://9hdigital.com`, contact page, service/deep links, About, Work, Products, Insights, Careers, People, Partners | All original business destinations removed. Local section anchors and `/contact`; all email actions address `info@manasflow.com`. |
| Social and affiliations | Original Facebook/Instagram `9hdigital`, LinkedIn `9h-digital`, `9hcapital.com/investors`, Google preferred-source link | Removed. No guessed Manasflow social profiles, investor link or preferred-source badge. |
| Case studies and client identifiers | `markets-data.ts`, `markets.tsx`: MFSA, Kindred Cheltenham, Crosscraft, Al Balad Hospitality, Insinet, Malta Gaming Authority; sector descriptions, service tags and project destinations | Components, data and six project photographs quarantined in full. No replacement client stories invented. |
| Testimonials | `content.json` / `experience.tsx`: Kurt Zammit / The Supp Store; Peter Bugeja / Mapfre; Kenneth Mifsud / Vitelhome; Shaima A. / MISK; NetRefer | All five quotations, names, organisations, portrait/logo images and the slider removed and quarantined. |
| Team and attributed quotations | James / Head of Tech, Jamie / Business Analyst, Emily / Chief Creative Officer, Timothy / CEO, James / Director of Finance; Timothy Buttigieg CEO statement | All biographies, headshots, roles and quotations quarantined. No person is presented as Manasflow staff. |
| Performance and reputation claims | “Built for enterprise. Proven across industries”, “Trusted By Industry Leaders”, “High-Performing Teams”, source metadata’s “Malta’s largest…”, sales/retention and other outcomes in quotations | Removed with their source context. New copy describes proposed work and process without claiming a track record or guaranteed results. |
| Blog/content identity | Six original titles, post URLs and hover thumbnails in `content.json`; source author “Yara Omara” in Twitter metadata | Removed and quarantined. No copied blog posts or fictitious Manasflow articles. |
| Main imagery and icons | Source logo, service SVGs, three GIFs, looping MP4/mobile GIF, poster, gradients, footer background, quote/play and social vectors | All 56 source assets moved out of `public/`. New original `mark.svg`, `flow-study.svg`, `social-card.svg` and generated icons. New UI icons use the existing Lucide dependency. |
| Typography | `nine-h.css` `@font-face`: HubotSans (100–600), Cairo; downloaded TTFs; source Swiper icon font in reference CSS | Original fonts/styles quarantined. Self-hosted DM Sans and Instrument Serif (regular + true italic), with SIL OFL licences in `public/brand/fonts/`. No Google Fonts network calls. |
| CSS tokens and selectors | `#242128` primary; `--color-primary`, `--color-body`, `--color-gray`, `--gradient-*`, `--fw-gradient-*`, `--hero-bg`, `--hero-gif`; `nine-*`, glass controls and source card/hero styles | Old stylesheet quarantined. New `--paper`, `--forest`, `--terracotta`, `--clay`, `--muted`, `--line`, `--surface` in `src/app/globals.css`. Editorial split hero, arched original illustration, service selector/detail layout; old pinned scenes and card grid removed. |
| App metadata | `src/app/layout.tsx`: original title, description and favicon path | New Manasflow title/template, description, author, creator, publisher, icons, Open Graph and Twitter image metadata. Canonicals use the proposed `https://manasflow.com` base. |
| Captured source metadata | Source canonical, `og:url/site_name/title/description/image`, Twitter fields, locale, author and source dates in captured HTML | Reference HTML quarantined. These fields are not copied into the replacement. `en_GB` remains only as an English language/region format, not a business affiliation. |
| JSON-LD | Source Organization, WebSite/SearchAction, ImageObject, WebPage and Article graph: original name, origin, OG URL, publisher, dates and ranking claim | Old graph preserved only in quarantine. New minimal Organization contains Manasflow, its email, proposed URL, original logo, Milan/IT and Europe. No invented legal entity, street address, VAT, ratings, clients or founding date. |
| Favicons and OG assets | `9H-logo.svg`, `Og.png`, five `cropped-Favicon-1-*` images; root `src/app/favicon.ico` was a starter-template icon, not the source business’s icon | All archived separately. New `/favicon.ico`, SVG mark, 180px Apple icon, 512px app icon, 1200×630 social image and web manifest. |
| Contact details | No literal email address, telephone number or postal address was found in the captured homepage; the clone sent visitors to the original contact page | New email, Milan location and Europe working footprint are the user-provided facts. No telephone number, street address or registration/VAT number invented. |
| Legal pages | Clone had outbound Privacy/Cookie Policy links and generic consent copy; no local Privacy or Terms document | New local `/privacy`, `/terms`, `/cookies`. Former local legal URL spellings redirect to the new local pages. Privacy/Terms are visibly marked drafts and noindexed while required facts remain unconfirmed. |
| Forms and submission | No `<form>` or form action in either the prior clone or captured homepage. Original contact CTA was an outbound link; reference includes lead-source/Gravity Forms integration code | No old endpoint retained. `/contact` uses explicit email links; no POST, CRM handoff, form receiver or fake success message. New form endpoint is awaiting the owner’s details. |
| Consent/browser state | Original clone stored `nine-h-consent`; reference uses Complianz/CookieDatabase links and vendor placeholders | Old component and scripts quarantined. Replacement does not set or read cookies/localStorage. Returning browsers’ old stored key is not read or reused as consent; see open items below. |
| Analytics / third-party code | IDs and URLs listed in the next table | All source references quarantined. Replacement has no analytics SDK or tracking ID and no remote script, video, chat or form integration. Its CSP restricts requests to the site and blocks frames/media/forms. |
| Repository/tooling identity | Original component and asset folder names, source extraction/download/QA scripts, comparison screenshots and research briefs | Entire source-specific trees quarantined. New implementation uses `src/components/manasflow/`, `public/brand/`, and new audit/QA evidence. Package metadata and README now describe Manasflow. |

### Analytics, embedded services and scripts

Distinction: the original clone **did not execute the source’s analytics tags**. Those tags were found in saved source HTML. The clone did execute a Vimeo player when opened. Neither is present in the replacement.

| Source integration | Exact identifier / destination | Previous status | Current status |
| --- | --- | --- | --- |
| Google Tag Manager | `GTM-KNS22Q2T`; `www.googletagmanager.com/ns.html?id=GTM-KNS22Q2T` | Captured source reference only | Quarantined; no container installed |
| HubSpot / lead-in / chat | `139678809`; `https://js-eu1.hs-scripts.com/139678809.js` | Captured source reference; chat not connected in clone | Quarantined; no Manasflow portal supplied |
| VisibilityKit | `093bc08beececdc3`; `https://cdn.visibilitykit.ai/t/093bc08beececdc3/vk.js` | Captured source reference only | Quarantined; no replacement tracker |
| Vimeo | Film `1172610660`; `vimeo.com/1172610660`; `player.vimeo.com/video/1172610660` | Source link + clone’s click-loaded iframe | Film, poster, modal and iframe removed |
| Complianz | `/app/plugins/complianz-gdpr/cookiebanner/js/complianz.min.js`; source banner CSS / CookieDatabase links | Captured source reference only; separate imitation banner in clone | Both archived; no consent vendor or banner installed |
| Lead-source / Gravity Forms helper | `/app/plugins/lead-source-tracker-gravity-forms/js/js.cookie.min.js` | Captured reference only; no local form | Quarantined; no submission code |
| Original theme bundle | `/app/themes/niu-theme/public/build/assets/app-7BgoYa3f.js`, source theme CSS | Reference only, never used as the clone implementation | Quarantined; new Next/React implementation |
| WordPress emoji loader | Source inline module and `s.w.org/images/core/emoji/17.0.2/…` | Captured source reference only | Quarantined; not imported |
| Rank Math / WordPress metadata | Rank Math schema and WordPress REST/oEmbed/feed links | Captured reference only | Quarantined; no WordPress endpoints or SEO plugin retained |
| Google preferred-source badge | `google.com/preferences/source?q=https://9hdigital.com` | Active original footer outbound link | Removed |

No separate confirmed GA4 property ID or Meta Pixel ID was found. CSS class fragments resembling `g-*` are not analytics IDs. Schema.org and SVG XML namespace URLs are vocabulary identifiers, not script endpoints.

## New files and assets

- `src/lib/site.ts`: Manasflow facts and proposed canonical origin; direct email contact.
- `src/components/manasflow/`: new home, navigation/footer, services interaction and legal layout.
- `src/app/globals.css`: new palette and layout; local font variables supplied by `next/font/local`.
- `src/app/contact/`, `privacy/`, `terms/`, `cookies/`: new pages; local legal aliases; new branded 404, robots and sitemap.
- `public/brand/`: original vector artwork, generated favicon/app/social assets, self-hosted fonts and licences. `scripts/generate-brand-assets.mjs` reproduces derived assets.
- `docs/research/manasflow/`: fresh rendering and audit evidence; no source business content used in the new visual assets.

## Quarantine controls

`quarantine/9hdigital/` contains original components, all downloaded assets, app snapshots, source/reference HTML/CSS/JSON, screenshots, client material and clone tooling. Its original materials are intentionally unchanged. Do not publish or import them.

The archive is outside `src/app/` and `public/`, excluded from TypeScript and ESLint, excluded from Docker/Vercel upload contexts, and explicitly excluded from Next runtime tracing. Old public asset URLs and guessed archive URLs are checked for 404 responses. Git history, browser caches, external deployments and existing third-party accounts are separate from this working tree and have not been erased.

The template’s required MIT copyright/licence and third-party font/software licences are retained as attribution. They are not representations that those authors own or operate Manasflow. Non-runtime template documentation outside the source-specific clone is not a business affiliation.

## Legal basis for the drafts

Privacy coverage was checked against GDPR Articles 5, 6, 12–22 and Chapter V, including controller details, purpose/basis, recipients, retention criteria, rights, complaints and transfers. Cookie text reflects the application’s actual absence of optional tracking. This is a draft matched to the implemented website, not a claim that unverified business operations are GDPR-compliant.

Sources: [GDPR, official EUR-Lex text](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng) and [Garante cookie/tracking guidelines](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876).

## Items that could not be confidently completed

- [ ] Confirm the full registered legal entity name, street address and any registration/VAT disclosures. Only “Manasflow, registered in Milan, Italy” was supplied.
- [ ] Confirm `info@manasflow.com` is provisioned and monitored, and whether a different privacy/DPO contact is required. No email was sent during testing.
- [ ] Confirm that `https://manasflow.com` is the production origin. It is inferred from the supplied email domain; no domain, DNS or hosting changes were made.
- [ ] Supply the analytics provider, property/container ID and consent requirements, if analytics is wanted. Tracking is disabled rather than using a fabricated or original-owner ID.
- [ ] Supply the actual form endpoint/provider and processing arrangements, if a web form is wanted. Email contact works; no backend receiver has been invented.
- [ ] Confirm hosting/email providers, subprocessors, processing locations, retention/deletion schedules, transfer safeguards and relevant processing agreements. Draft privacy wording identifies the unknowns.
- [ ] Review Privacy/Terms against the business’s actual practices and Italian legal requirements before publication. Drafts remain visibly labelled and noindexed; this task does not certify compliance.
- [ ] Approve the proposed service descriptions and new voice. The user supplied identity/location/contact, but not a verified capabilities list, trademark/brand guide or detailed offer.
- [ ] Confirm final Manasflow logo/trademark ownership and any preferred social profiles. A new original mark is supplied; no profiles or client relationships are guessed.
- [ ] If the previous clone was already deployed elsewhere, purge old CDN/social previews and replace that deployment. No external deployment was performed here.
- [ ] Existing returning browsers may retain the old inert `nine-h-consent` key or cached favicon. The new app does not read it; no cross-browser storage purge is possible from this workspace. Do not treat it as consent for new analytics.
- [ ] Keep quarantine excluded if deployment packaging changes. Repository history and any previously exported copies remain outside the scope of this change.

## Verification

Verification results and representative desktop/mobile renders are saved in `docs/research/manasflow/`. See `qa-results.json` for actual routes, interaction checks, metadata, network origins, storage and removed-asset responses. `build-audit.json` records the production bundle and quarantine hash checks.

- `npm run check`: **passed** (ESLint, strict TypeScript, production build).
- `git diff --check`: **passed**.
- Production browser audit: **passed** for `/`, `/contact`, `/privacy`, `/terms`, `/cookies` and both legal redirects; four service states, keyboard navigation and mobile menu actions verified.
- No horizontal overflow at **360, 390, 768, 1024, 1440 and 1920 px**; zero browser/console errors, external requests, cookies or browser storage in a fresh session.
- All **56 original public asset URLs returned 404**; archive URL returned 404; new favicon returned 200; new artwork and icon images decoded.
- **266 production files scanned**, zero original-identity matches. No quarantine/temp files found in standalone output. All **125 original inventory records verified by SHA-256** at their preserved locations.
- Render review: [desktop](docs/research/manasflow/home-desktop-1440.png), [mobile](docs/research/manasflow/home-mobile-390.png), [full page](docs/research/manasflow/home-desktop-full.png), [services state](docs/research/manasflow/services-connected.png), [contact](docs/research/manasflow/contact-mobile.png).

Preview during this task: http://127.0.0.1:3001. For development, run `npm run dev`. No external deployment was made.

## Full pre-change asset and identity-location appendix

The following appendix is generated from the immutable pre-change inventory. Paths describe where the originals were found; the files are now quarantined.

### All 56 original downloaded assets

| Original path | Bytes | SHA-256 prefix |
| --- | ---: | --- |
| `public/sites/9hdigital/1.gif` | 59480 | `9705f9b458e23858` |
| `public/sites/9hdigital/100x100-79.jpg` | 5381 | `6c4ac4e1dcfc7a15` |
| `public/sites/9hdigital/100x100-80.jpg` | 5224 | `f8c2a5cfcee23995` |
| `public/sites/9hdigital/100x100.jpg` | 4707 | `e49cd86a1102c2fa` |
| `public/sites/9hdigital/12-1024x576.png` | 586105 | `048ff195702c1b9b` |
| `public/sites/9hdigital/15-1024x576.png` | 586918 | `5743e8658fc81407` |
| `public/sites/9hdigital/1516507715381-2.jpeg` | 4209 | `e6edd64065d9418f` |
| `public/sites/9hdigital/17-1024x576.png` | 531725 | `e32860ee518c953e` |
| `public/sites/9hdigital/18-1024x576.png` | 676288 | `846bb9820962b16d` |
| `public/sites/9hdigital/2.gif` | 40080 | `0456a76d24b38a87` |
| `public/sites/9hdigital/21-1024x576.png` | 655645 | `11f85e1aa1d57bcb` |
| `public/sites/9hdigital/28-1024x576.png` | 592702 | `26527d8999587d0e` |
| `public/sites/9hdigital/3.gif` | 41639 | `766a750ff93d1eaa` |
| `public/sites/9hdigital/9H-logo.svg` | 1947 | `ed758911de8299db` |
| `public/sites/9hdigital/ai-automations.svg` | 956 | `247937e6fa323c25` |
| `public/sites/9hdigital/Al-Balad-main-2.jpg` | 209288 | `00b458e76d78a234` |
| `public/sites/9hdigital/blue-fw-gradient-Ce1kZF6R.png` | 779656 | `a6cd3e2646bcbce4` |
| `public/sites/9hdigital/brand-building.svg` | 824 | `72d69869072e1c38` |
| `public/sites/9hdigital/Cairo-Regular-CvRCENXA.ttf` | 94480 | `44786a38e27c5826` |
| `public/sites/9hdigital/cropped-Favicon-1-180x180.png` | 7429 | `939dd552ab7842b2` |
| `public/sites/9hdigital/cropped-Favicon-1-192x192.png` | 7773 | `42db6f4e3f1b806a` |
| `public/sites/9hdigital/cropped-Favicon-1-270x270.png` | 14106 | `987204fa65e7f1a5` |
| `public/sites/9hdigital/cropped-Favicon-1-32x32.png` | 1120 | `e769401b98b65c6f` |
| `public/sites/9hdigital/Crosscraft-Main-Banner-1.png` | 92701 | `074a3fa1e0cdf6e9` |
| `public/sites/9hdigital/custom-web-apps.svg` | 956 | `1c05c30dca539808` |
| `public/sites/9hdigital/facebook.svg` | 1043 | `8ac0592b7a37ab26` |
| `public/sites/9hdigital/footer-bg-XyJ6H1x5.png` | 435269 | `8bd29deb81ccd4da` |
| `public/sites/9hdigital/gradient-blue-auyAehDj.png` | 421833 | `4f55f2182c1417a1` |
| `public/sites/9hdigital/gradient-green-DLQWrdj_.png` | 100477 | `ad8fc0c2cc2028d2` |
| `public/sites/9hdigital/gradient-purple-eY59ryug.png` | 434694 | `22fe235b4959a0d4` |
| `public/sites/9hdigital/gradient-red-CLvd3sr4.png` | 116123 | `2606bc3e7c1f0046` |
| `public/sites/9hdigital/gradient-yellow-B5TN-y7N.png` | 648202 | `6be6c6816562f936` |
| `public/sites/9hdigital/green-fw-gradient-DwXSrXRQ.png` | 782668 | `1770e0817ac399c6` |
| `public/sites/9hdigital/hero-placeholder-DOL305-B.png` | 59995 | `edfcc9a211fda0e0` |
| `public/sites/9hdigital/HubotSans-DVOGjEo-.ttf` | 369104 | `405b13a0edfab1fe` |
| `public/sites/9hdigital/Insinet-main.jpg` | 78786 | `4027d85a5250de44` |
| `public/sites/9hdigital/instagram.svg` | 808 | `1403d80e625c305b` |
| `public/sites/9hdigital/integrations.svg` | 994 | `6c8a3ed598c3181a` |
| `public/sites/9hdigital/James.jpg` | 8550 | `fc77912495d3955c` |
| `public/sites/9hdigital/Kindred-Main.jpg` | 90385 | `a8051c254253b883` |
| `public/sites/9hdigital/linkedin.svg` | 840 | `a6365a2435caa50f` |
| `public/sites/9hdigital/looping-mobile-BtnwhDf1.gif` | 2680654 | `535f1dabdf4cc337` |
| `public/sites/9hdigital/looping-video-e-PUQuDR.mp4` | 1249677 | `149d7d35f4eb96f9` |
| `public/sites/9hdigital/MFSA-main.jpg` | 260002 | `c3865ba4f9ceb50b` |
| `public/sites/9hdigital/MGA-main.jpg` | 80295 | `a4a3cebbebdb4eee` |
| `public/sites/9hdigital/misk.png` | 97730 | `fb253959a0692c02` |
| `public/sites/9hdigital/Og.png` | 3615 | `e0b5bcc8bfa77955` |
| `public/sites/9hdigital/play.svg` | 2442 | `7ced35c3a6418cdd` |
| `public/sites/9hdigital/quote.svg` | 1658 | `5335a4f19143a9d2` |
| `public/sites/9hdigital/red-fw-gradient-CzjXW7fQ.png` | 795403 | `0942e7cde5439ba6` |
| `public/sites/9hdigital/Screenshot-2025-03-24-at-13.50.54.png` | 191699 | `d82cea69e157e1ac` |
| `public/sites/9hdigital/Screenshot-2025-11-27-at-12.34.17.png` | 58802 | `eb26fe387b845bab` |
| `public/sites/9hdigital/Tim-Landscape-1.jpg` | 112226 | `98342a30c3504400` |
| `public/sites/9hdigital/Tim.jpg` | 10592 | `7d254c7a7ce8bd26` |
| `public/sites/9hdigital/vitel.png` | 199834 | `89b53ef88e85d46f` |
| `public/sites/9hdigital/yellow-fw-gradient-OeBIeiso.png` | 768332 | `fc05f0c2ef278fe7` |

### All matched text files and exact source line locations

- `src/app/layout.tsx` ? lines 5, 8.
- `src/app/page.tsx` ? lines 1, 4.
- `src/components/sites/9hdigital/content.json` ? lines 6, 10, 14, 18, 22, 26, 30, 34, 41, 45, 49, 53, 57, 61, 65, 72, 76, 80, 84, 88, 92, 96, 100, 107, 111, 115, 119, 123, 127, 131, 135, 139, 143, 147, 155, 156, 158, 164, 172, 174, 180, 181, 188, 190, 196, 197, 198, 201, 202, 203, 206, 207, 208, 212, 213, 216, 217, 218, 224, 225, 229, 230, 234, 235, 239, 240, 244, 245, 249, 250.
- `src/components/sites/9hdigital/experience.tsx` ? lines 13, 137, 151, 171, 172, 312, 326.
- `src/components/sites/9hdigital/header.tsx` ? lines 81, 84, 85, 110, 111, 135.
- `src/components/sites/9hdigital/home.tsx` ? lines 19, 87, 153, 159, 164, 175, 185, 214, 220, 222.
- `src/components/sites/9hdigital/markets-data.ts` ? lines 6, 8, 9, 21, 23, 24, 31, 33, 34, 46, 55, 57, 58, 71, 72.
- `src/components/sites/9hdigital/nine-h.css` ? lines 2, 3, 16, 18, 24, 27, 28, 29, 30, 31, 34, 39, 43, 48, 52, 55, 56, 57, 92, 110, 134, 183, 192, 206, 276, 283, 391, 394, 397, 400, 831, 958, 960, 962, 972, 1226, 1230, 1298, 1308, 1312, 1319, 1325, 1329, 1330, 1333, 1334, 1338, 1397, 1401, 1973, 1974.
- `src/components/sites/9hdigital/shared.tsx` ? lines 3, 4, 49, 50, 54.
- `public/sites/9hdigital/9H-logo.svg` ? lines 3, 7.
- `public/sites/9hdigital/ai-automations.svg` ? lines 12.
- `public/sites/9hdigital/brand-building.svg` ? lines 10.
- `public/sites/9hdigital/custom-web-apps.svg` ? lines 13.
- `public/sites/9hdigital/facebook.svg` ? lines 2.
- `public/sites/9hdigital/instagram.svg` ? lines 4.
- `public/sites/9hdigital/linkedin.svg` ? lines 2, 4.
- `docs/research/9hdigital/asset-map.json` ? lines 3, 4, 10, 11, 17, 18, 24, 25, 31, 32, 38, 39, 45, 46, 52, 53, 59, 60, 66, 67, 73, 74, 80, 81, 87, 88, 94, 95, 101, 102, 108, 109, 115, 116, 122, 123, 129, 130, 136, 137, 143, 144, 150, 151, 157, 158, 164, 165, 171, 172, 178, 179, 185, 186, 192, 193, 199, 200, 206, 207, 213, 214, 220, 221, 227, 228, 234, 235, 241, 242, 248, 249, 255, 256, 262, 263, 269, 270, 276, 277, 283, 284, 290, 291, 297, 298, 304, 305, 311, 312, 318, 319, 325, 326, 332, 333, 339, 340, 346, 347, 353, 354.
- `docs/research/9hdigital/body-reference.html` ? lines 1, 5, 18, 19, 33, 46, 54, 56, 59, 63, 66, 68, 70, 84, 91, 136, 143, 182, 189, 234, 241, 293, 306, 307, 328, 338, 359, 360, 373, 385, 387, 410, 412, 432, 434, 457, 459, 488, 494, 496, 499, 503, 506, 508, 510, 516, 533, 536, 557, 583, 609, 645, 661, 663, 699, 715, 717, 750, 772, 774, 810, 826, 828, 866, 869, 873, 1067, 1070, 1071, 1085, 1112, 1115, 1116, 1130, 1149, 1152, 1153, 1167, 1194, 1197, 1198, 1212, 1239, 1242, 1243, 1257, 1288, 1291, 1292, 1306, 1309, 1362, 1363, 1371, 1426, 1427, 1435, 1482, 1483, 1491, 1546, 1547, 1555, 1610, 1611, 1619, 1678, 1679, 1687, 1690, 1719, 1808, 1818, 1823, 1864, 1912, 1917, 1958, 1959, 1962, 2004, 2009, 2037, 2039, 2058, 2060, 2079, 2081, 2100, 2102, 2121, 2123, 2142, 2144, 2190, 2267, 2277, 2279, 2281, 2282, 2330, 2335, 2337, 2338, 2347, 2352, 2354, 2355, 2364, 2369, 2371, 2372, 2381, 2388, 2389, 2398, 2403, 2407, 2432, 2438, 2443, 2454, 2455, 2462, 2464, 2468, 2472, 2476, 2478, 2480, 2485, 2514, 2520, 2526, 2532, 2547, 2559, 2565, 2580, 2586, 2592, 2598, 2604, 2620, 2629, 2631, 2820, 2822, 2825, 2828, 2830, 2833, 2838.
- `docs/research/9hdigital/content.json` ? lines 6, 10, 14, 18, 22, 26, 30, 34, 41, 45, 49, 53, 57, 61, 65, 72, 76, 80, 84, 88, 92, 96, 100, 107, 111, 115, 119, 123, 127, 131, 135, 139, 143, 147, 155, 156, 158, 163, 170, 172, 177, 178, 184, 186, 192, 193, 197, 198, 202, 203, 207, 208, 212, 213, 217, 218, 223, 224, 226, 227, 231, 232, 234, 235, 239, 240, 242, 243, 248, 250, 251, 255, 256, 259, 263.
- `docs/research/9hdigital/desktop-inspection.json` ? lines 2, 12, 22, 32, 42, 52, 62, 72, 82, 92, 102, 108, 112, 116, 124, 128, 132, 136, 140, 144, 148, 152, 160, 164, 168, 172, 176, 180, 184, 188, 192, 196, 200, 204, 208, 212, 216, 220, 224, 228, 232, 236, 240, 244, 248, 252, 256, 260, 264, 268, 272, 276, 280, 284, 288, 292, 296, 300, 304, 308, 312, 316, 320, 324, 328, 332, 336, 340, 344, 348, 352, 356, 360, 364, 368, 372, 376, 380, 384, 388, 392, 396, 400, 404, 408, 412, 416, 420, 424, 428, 432, 436, 440, 444, 448, 452, 456, 460, 464, 467, 468, 471, 472, 475, 476, 479, 480, 483, 484, 487, 488, 491, 492, 495, 496, 499, 500, 503, 504, 507, 508, 511, 512, 516, 520, 524, 528, 532, 536, 540, 544, 548, 552, 556, 560, 564, 568, 572, 576, 580, 584, 588, 592, 596, 600, 604, 608, 612, 616, 620, 623, 624, 629, 634, 652, 653, 657, 662, 667, 672, 677, 678, 682, 683, 687, 692, 697, 702, 707, 711, 715, 720, 725, 730, 735, 740, 745, 750, 755, 756, 760, 761, 765, 766, 770, 771, 775, 776, 780, 781, 785, 786, 790, 791, 795, 796, 800, 801, 805, 806, 810, 811, 815, 820, 825, 830, 831, 835, 840, 845, 850, 855, 860, 865, 866, 873, 887, 889, 905, 919, 921, 935, 937, 951, 953, 967, 969, 983, 985, 999, 1001, 1015, 1017, 1031, 1033, 1047, 1049, 1063, 1065, 1079, 1081, 1095, 1097, 1111, 1113, 1129, 1145, 1161, 1175, 1177.
- `docs/research/9hdigital/final-qa.json` ? lines 96, 141, 196, 216, 231, 241, 286.
- `docs/research/9hdigital/mobile.html` ? lines 1, 6, 12, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 584, 585, 586, 587, 588, 589, 590, 591, 592, 595, 596, 597, 598, 599, 630, 631, 632, 634, 648, 656, 658, 682, 685, 686, 687, 688, 689, 708, 710, 803, 804, 805, 817, 823, 824, 833, 845, 846, 859, 872, 879, 881, 883, 887, 890, 892, 894, 912, 919, 963, 970, 1009, 1016, 1060, 1067, 1114, 1127, 1128, 1154, 1165, 1190, 1191, 1206, 1221, 1224, 1249, 1252, 1274, 1277, 1302, 1305, 1335, 1342, 1344, 1346, 1350, 1353, 1355, 1357, 1364, 1379, 1382, 1402, 1427, 1452, 1483, 1504, 1508, 1548, 1569, 1573, 1610, 1638, 1642, 1682, 1703, 1707, 1747, 1750, 1756, 1932, 1936, 1950, 1980, 1984, 1998, 2020, 2024, 2038, 2068, 2072, 2086, 2116, 2120, 2134, 2168, 2172, 2186, 2190, 2249, 2251, 2263, 2322, 2324, 2336, 2387, 2389, 2401, 2460, 2462, 2474, 2533, 2535, 2547, 2610, 2612, 2624, 2628, 2660, 2712, 2723, 2727, 2769, 2817, 2821, 2863, 2866, 2909, 2913, 2937, 2957, 2977, 2997, 3017, 3037, 3078, 3152, 3161, 3163, 3198, 3204, 3206, 3207, 3216, 3222, 3224, 3225, 3234, 3240, 3242, 3243, 3252, 3260, 3261, 3270, 3276, 3279, 3305, 3312, 3316, 3325, 3326, 3332, 3334, 3337, 3341, 3345, 3347, 3349, 3354, 3381, 3386, 3391, 3396, 3410, 3420, 3425, 3439, 3444, 3449, 3454, 3459, 3475, 3484, 3487, 3495, 3496, 3498, 3501, 3502, 3504, 3509, 3704.
- `docs/research/9hdigital/README.md` ? lines 1, 9, 10, 18, 31, 47, 55.
- `docs/research/9hdigital/source-main.css` ? lines 1.
- `docs/research/9hdigital/source.html` ? lines 2, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 34, 35, 36, 37, 38, 39, 40, 41, 42, 45, 46, 47, 48, 49, 80, 81, 82, 84, 98, 106, 108, 132, 136, 137, 138, 139, 158, 160, 164, 176, 177, 190, 203, 210, 212, 214, 218, 221, 223, 225, 243, 252, 301, 310, 353, 362, 411, 420, 473, 486, 487, 509, 520, 545, 546, 561, 576, 579, 604, 607, 629, 632, 657, 660, 690, 697, 699, 701, 705, 708, 710, 712, 719, 734, 737, 758, 784, 810, 841, 862, 866, 907, 929, 933, 971, 1000, 1004, 1045, 1067, 1071, 1112, 1115, 1121, 1352, 1357, 1358, 1373, 1403, 1408, 1409, 1424, 1446, 1451, 1452, 1467, 1497, 1502, 1503, 1518, 1548, 1553, 1554, 1569, 1603, 1608, 1609, 1624, 1628, 1695, 1697, 1709, 1776, 1778, 1790, 1849, 1851, 1863, 1930, 1932, 1944, 2011, 2013, 2025, 2096, 2098, 2110, 2114, 2146, 2241, 2253, 2258, 2305, 2359, 2364, 2411, 2412, 2415, 2463, 2468, 2497, 2499, 2520, 2522, 2543, 2545, 2566, 2568, 2589, 2591, 2612, 2614, 2663, 2737, 2747, 2749, 2751, 2752, 2801, 2807, 2809, 2810, 2819, 2825, 2827, 2828, 2837, 2843, 2845, 2846, 2855, 2863, 2864, 2873, 2879, 2882, 2908, 2915, 2919, 2929, 2930, 2936, 2938, 2941, 2945, 2949, 2951, 2953, 2958, 2986, 2992, 2998, 3004, 3019, 3031, 3037, 3052, 3058, 3064, 3070, 3076, 3092, 3101, 3104, 3263, 3264, 3266, 3269, 3270, 3272, 3277.
- `docs/research/9hdigital/verification.json` ? lines 51.
- `scripts/download-9h.cjs` ? lines 4, 10, 15, 21, 28.
- `scripts/final-9h-qa.cjs` ? lines 2, 5, 27, 33, 49, 69, 89.
- `scripts/inspect-9h-states.cjs` ? lines 2, 12, 15, 20, 27, 31, 33, 35, 38, 88, 92, 94, 105.
- `scripts/inspect-9h.cjs` ? lines 2, 13, 15, 61, 72, 76, 78, 85, 88.
- `scripts/prepare-9h-data.cjs` ? lines 4, 6, 25, 28, 38, 41, 44, 48.
- `scripts/verify-9h.cjs` ? lines 2, 11, 27, 31, 61, 104, 111, 146, 152, 158.

Full original matching text and untruncated SHA-256 values are in `quarantine/9hdigital/inventory-before.json`.
