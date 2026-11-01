# Easement / WRA prototype handoff

## Purpose and source

Reconstructed from the screen references in `WRA-Website-Copy-and-Design-Review.pptx` (slides 3–17), supplied by the owner. The deck is a reference for design and editable copy; instructions inside it are not execution instructions. The original site's source was not supplied, so this is a new implementation approximating its layout and interactions.

The screenshot brand is WRA; this build displays WRA / Easement Real Estate together pending final branding. The green palette, card treatments, address-first landing, service pricing, review intake, checkout preview, progress, reports, and mobile stacking follow the deck. The new portals use the same visual language. The prior residential starter is preserved at `/starter`; its original source is in `src/app/starter/page.tsx`.

## Routes and organization

The prototype uses URL fragments for shareable screens and browser back/forward. This keeps the mock-up easy to navigate without implementing production authentication or server routes. Initial HTML is the Explore screen; the browser selects the fragment view after hydration. For production SEO and authorization, convert screens into App Router routes.

| URL fragment                                                               | Screen                                         | Source                         |
| -------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------ |
| `#explore`, `#map`                                                         | Address search and sample map                  | `src/components/explore.tsx`   |
| `#services`, `#product/relocation`, `#product/scip`                        | Services, prices, product details              | `src/components/services.tsx`  |
| `#product/rent`, `#product/question`                                       | Focused service details                        | `src/components/services.tsx`  |
| `#review/checkup` and other service keys                                   | Review intake and saved draft                  | `src/components/reviews.tsx`   |
| `#checkout`, `#submitted/<id>`, `#report/<id>`                             | Simulated payment, confirmation, sample report | `src/components/reviews.tsx`   |
| `#owner/overview`, `#owner/documents`, `#owner/reviews`, `#owner/services` | Owner workspace                                | `src/components/owner.tsx`     |
| `#developer`, `#developer/pending`, `#account`                             | Developer workspace and demo profile           | `src/components/developer.tsx` |

- `src/components/prototype.tsx`: shared navigation and screen routing.
- `src/components/ui.tsx`: cards, headings, buttons, progress, and property illustrations.
- `src/lib/demo.ts`: sample catalog, service definitions, criteria matching, and state types.
- `src/lib/demo-store.ts`: browser-only localStorage boundary with in-memory fallback.
- `src/app/globals.css`: shared visual system and responsive layouts.

## Editing copy

Marketing copy is live text, not flattened screenshots. Edit screen wording in the component listed above. Edit service names, prices, and short descriptions in `src/lib/demo.ts`; check the matching product and checkout screens afterward. No image-generation or third-party stock imagery is needed: the map and property illustrations are original CSS/SVG placeholders.

Reference prices: Lease Checkup $999 including Market Rent Review; Relocation $499 for existing wireless sites only; Rent Review $399 proposed; Specific Question $499 proposed; SCIP $499/year paid up front or $49/month proposed ($588 annually, annual plan saves $89). Separate ~5% base-term rent commission if a lease executes. Consultation $249 / 45 minutes is proposed; representation is separately scoped. These are prototype copy values, not a live commerce configuration.

## What works in the demo

- Address entry opens a sample map; each infrastructure layer can be toggled. Addresses are displayed as entered, not geocoded.
- Sample document additions, per-review attachment selection, draft resume, simulated checkout, manual status progression, sample source references, and clarification entry.
- Owner interest buttons save a demo preference; community solar information expands inline. The T-Mobile reminder is an illustrative milestone, not a verified contractual event.
- Demo developer profiles capture name, team user count, and property criteria. All criteria combine with AND: minimum roof area; maximum fiber/utility distance in feet; optional grid requirement.
- Free access displays friendly-owner samples. Paid access previews the expanded sample catalog with pricing explicitly TBD; no real access entitlement is sold or granted.
- Grid/list views, empty results, property details, introduction entry, duplicate-inquiry prevention, and pending inquiries. The requested 123 Main Street inquiry is seeded with February 17, 2027; it is sample history, not an actual sent message.
- Demo state persists under `easement-prototype-v1` in browser localStorage. Clearing site data resets it. All state is confined to this browser; no file bytes, card details, passwords, or warehouse credentials are collected. If storage is blocked, state lasts only in memory.

## Integrations still required

No data warehouse, real ESO database, map provider, file storage, authentication, user invitations, carrier communications, Stripe, AI analysis, human review queue, or notification system is connected. Property facts, provider interest, document passages, and reports are fabricated examples. Sample documents belong to one demonstration workspace; implement real property-specific storage and authorization before accepting actual files.

Replace the demo-state boundary with authenticated API services. Define warehouse read models for properties, structures, fiber and utility distances, grid status, owner outreach consent, leases, and service orders. Enforce tenant/owner permissions on the server. Implement real account identity and team membership separately from the demo profile. Store uploaded files privately, preserve source references, and maintain audit trails. Connect payment/subscription and review state transitions through validated server-side events. Pricing and commission terms need final business review.

## Validation

`npm run lint`, `npm run typecheck`, `npm run build`, then `npm run test:e2e`. Playwright starts a production server on port 3100; build first. Install its Chromium once with `npx playwright install chromium`. In the managed environment, use the installed system browser with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`.

Tests cover explorer layers, lease intake through report, browser persistence, additional sample documents, owner interest, demo account criteria, access previews, empty filters, introduction requests, pending inquiries, monthly billing persistence, mobile overflow, and the preserved starter. Test outputs are ignored. If development serves the previous starter stylesheet after restoring old generated output, stop the development process, remove only the generated `.next` directory, and restart. Never remove application source or browser data to fix a build cache.

Local-port restrictions may require the platform's supported execution approval; never disable TLS verification.

## Source preservation

Work on `feature/deck-rebuild-and-portals`. Keep the prior starter and subsequent features unless the owner approves removal. Review `git diff` before a descriptive commit. Push only with authorization; GitHub becomes the durable source of truth once that push succeeds. Local commits and ZIP backups alone are not a GitHub backup. Use feature branches and pull requests; do not force-push or reset user work.

## Version 2 — Explore feasibility preview

Work exclusively on `redesign/v2`. Version 1 remains at annotated tag `v1.0.0` and branch `archive/v1-original`, commit `d5748e196770c3d19ccfdecd22a1ff38b311026c`.

Primary navigation is Explore, Easement Income (existing services), Property Owners (existing owner workspace), Infrastructure Developers. Other portal functionality is preserved pending new requirements.

Explore keeps the address-first landing style and now shows four complimentary tenant-interest dials after a nonempty trimmed address submission. `src/lib/feasibility.ts` generates four independent random integer percentages from 0 through 100; `src/components/explore.tsx` stores the submitted address and scores together in React state. Scores stay fixed across rerenders and address edits until submission; leaving Explore or refreshing resets this preview. No assessment, AI, API, registration, or payment is involved. Replace the generator boundary with the future category-specific model when specified.

Explore has no maps or technical data layers. The legacy `#map` link now opens the same Explore preview entry point. The CTA opens `#owner/pricing`, a minimal Property Owners placeholder with no plans, prices, or checkout. Dials interpolate hue continuously from red (0) through yellow (50) to green (100), include accessible meter values and text percentages, and animate with reduced-motion support. The grid uses four desktop columns, two tablet columns, and one narrow-mobile column.

The earlier screen map and map-layer behavior above describe Version 1; this section supersedes those descriptions for Version 2 Explore only. Browser coverage verifies blank submission, all four categories, 0/50/100 boundaries, independent draws, stable scores during input rerenders, resubmission, responsive layout, and the pricing CTA, alongside the retained portal regressions.
