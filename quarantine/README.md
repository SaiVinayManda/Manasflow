# Original-owner material — quarantined

This directory is an audit archive, not Manasflow content. It intentionally preserves the original owner's identity, copy, imagery, people, clients, claims, integrations and inspection evidence. Do not import, serve, publish, or relabel this material as Manasflow work.

`9hdigital/inventory-before.json` contains every scanned file's original path, SHA-256 hash, matching text locations and original JSON-LD. `identity-locations.md` is its index. `assets/`, `components/`, `app-before/`, `research/` and `tooling/` preserve the originals separately from the replacement implementation.

This directory is outside `public/` and the app route tree. TypeScript and ESLint exclude it. Docker and Vercel upload contexts exclude it. Production runtime tracing must not include it. Keep this restriction if deployment tooling changes. Do not serve the repository root as static files.
