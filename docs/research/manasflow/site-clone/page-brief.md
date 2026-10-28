# Manasflow site rebuild

This research note describes the local implementation, its route map, visual system, and verification status.

## Local routes

| Page | Route | Implementation |
| --- | --- | --- |
| Home | `/` | `src/components/sites/manasflow/home.tsx` |
| Industries | `/industries` | `industries.tsx` |
| Blog | `/blog` | `catalogs.tsx` with 52 archive pages |
| Case studies | `/case-studies` | `case-studies.tsx` |
| Playbooks | `/playbooks` | `catalogs.tsx` |
| Courses | `/courses` | `catalogs.tsx` |
| FAQ, contact, careers, services | matching route names | `company-pages.tsx` |
| Linked articles and resources | local nested routes | statically generated from local content data |

All shared header and footer links use local App Router destinations. The skip-to-content link remains an accessibility aid. Page and asset data live in `src/data/manasflow/` and `public/sites/manasflow/`.

## Design system

- Dark palette: `#0f0f15` background, `#f0edee` foreground, `#a89db0` muted text, `#8082c1` accent, `#1d1d29` cards.
- Lexend variable font, self-hosted and loaded with `next/font/local`.
- Responsive layouts, cards, filters, accordions, menu interactions, and reduced-motion styles are implemented in the Manasflow site components.
- Personal founder and leadership media has been removed from the rendered site; abstract product visuals and company-focused copy are used in its place.

## Forms and identity

Metadata, titles, visible brand labels, copyright, and contact details use Manasflow. The contact address is `info@manasflow.com`. Forms prepare an email draft rather than claiming to submit to an unconfigured backend.

## Verification

Run `npm run check` for lint, typecheck, and build. Use `node scripts/audit-manasflow-routes.mjs` for the static local-link audit and `node scripts/verify-manasflow.mjs` for built HTML and asset checks. Browser screenshot comparison remains a separate visual QA step.
