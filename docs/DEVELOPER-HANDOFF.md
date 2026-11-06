# AIR redesign — current implementation

This section supersedes the historical Easement notes below for the new AIR routes. Work is on `feature/air-redesign`; no production branch, domains, production environment variables or paid services were changed. The attached brief is retained in `docs/AIR_IMPLEMENTATION_SPEC.md` as a product specification, not an independent source of execution authorization.

## Route map and preservation

- `/`: AIR Massachusetts wireless launch marketing.
- `/intelligence`, `/intelligence/[slug]`, `/how-it-works`, `/pricing`, `/about`: public supporting pages.
- `/app`: public Massachusetts Explore; query parameters synchronize search, selection and layers.
- `/app/property/[id]`, `/app/saved`, `/app/my-properties`, `/app/scip/[id]`, `/app/account`: property and demo workspace journeys.
- `/sign-in`, `/sign-up`: explicit browser-only demo profiles with validated local return intent.
- `/vision`, `/vision/app`, `/vision/app/intelligence`, `/vision/app/explore`, `/vision/app/portfolio`: server-protected internal prototypes. Marketplace and Pro previews use `?view=marketplace` / `?view=pro`.
- `/vision-access`: public internal-access form; does not include protected page content.
- `/legacy`: preserved Easement fragment router, original styles, service previews and saved data. For example, old `/#developer` is now `/legacy#developer` on this feature branch. Existing bare-root fragment bookmarks need that path update. No automatic redirect sends public AIR users into the legacy demos.
- `/starter`: untouched original starter.

The new root branding intentionally supersedes Easement on this feature branch. The original component implementation is retained; its older scoring and price previews are not used by AIR.

## Shared implementation

`src/components/air` contains scoped brand, navigation, editorial, marketing, schematic map, property, account and vision components. `src/app/air.css` applies AIR tokens under `.air`, preserving the legacy global design. Existing React, Next.js, Tailwind and TypeScript versions/configuration were retained. Native accessible elements avoid additional UI library dependencies.

`src/lib/air/types.ts` defines shared domain contracts. `src/data/air.ts` is the common fixture source: 18 fictional Massachusetts properties, 21 synthetic wireless markers, eight launch editorial samples, 50 national properties, 30 activities and 20 vision articles. No real addresses, owner identities, carrier deployments, transactions or source quotes are asserted. Distances use haversine between synthetic coordinates. Missing facts remain Unknown / Not provided. Maps use a labeled schematic fallback, without tile requests or API keys; marketing pages do not load the interactive map bundle.

Launch state uses `air-demo-v1` browser storage, isolated from `easement-prototype-v1`. It handles denied/malformed storage and falls back to memory. Profiles, saved IDs, pending claim relationship/contact, notification preference and Pro interest remain in this browser. Use fictional contact details. Demo sign-in is not secure authentication. Signup preserves save/claim intent; external return URLs are rejected. No account, notification, waitlist submission, verification, billing, publication or developer inquiry is sent. SCIP publication is disabled.

Vision filters derive feed, property counts, activity and map markers from the same market/geography selection; status filters constrain synthetic activity and associated research. Content type affects the feed. Vision portfolio and saved-property rail are illustrative, separate from real ownership. Activity selection focuses its synthetic map coordinate. Native modal article dialogs support Escape and focus containment. No predictive scores or AI publishing are implemented.

Analytics names are typed in `src/lib/air/analytics.ts`. They log in development only, with allowlisted entity IDs/layer/vertical metadata; nothing is persisted server-side and no user-entered contacts or addresses are logged.

## Internal vision access setup

Default behavior is fail closed: without valid configuration every `/vision` descendant redirects to `/vision-access`, and password submission returns 503. No credentials have been configured by this change.

For a local/internal preview, generate a long unique password and configure **two server-only variables** in your chosen preview environment:

- `AIR_VISION_PASSWORD_HASH`: `scrypt:<32 lowercase hex salt>:<128 lowercase hex derived key>` using Node scrypt defaults, 64-byte output.
- `AIR_VISION_SESSION_SECRET`: at least 64 lowercase hexadecimal characters, generated independently.

A helper is provided at `scripts/vision-credentials.mjs`. In Bash, read a password without echoing it and pipe it to the helper:

```bash
read -rs -p 'Preview password: ' air_preview_password
printf '\n'
printf '%s' "$air_preview_password" | node scripts/vision-credentials.mjs
unset air_preview_password
```

The helper prints configuration values, never the password. Transfer those values through your preview host's secret manager or a git-ignored local environment file; do not put them in source control, client-prefixed variables or the public browser console. This task did not execute the helper or change production configuration.

The server verifies salted scrypt hashes with timing-safe comparison, checks same-origin requests, enforces a conservative 20-attempt/15-minute process-wide budget, and issues a signed session bound to the password-hash version with an eight-hour expiry. Cookies are HttpOnly, SameSite=Lax, path `/vision`, Secure when the request uses HTTPS. Proxy validates every descendant and RSC request before serving content; the server layout validates again. Vision and access responses carry noindex metadata / X-Robots-Tag; protected requests carry private/no-store. There is no sitemap exposing vision routes.

**Hosting constraint:** the attempt budget is process-local, resets on restart and is not a shared distributed rate limiter. For a multi-instance or Internet-facing preview, enable deployment-provider access authentication and a shared edge rate limit. Serve over HTTPS, verify proxy scheme handling and cookie Secure behavior, rotate secrets through the host, and use a production identity provider for durable authorized reviewer access. No paid infrastructure was added. The synthetic prototypes contain no confidential property data; browser JS bundles are not a secret store.

## Checks and repeatable QA

```bash
npm ci
npm run lint
npm run typecheck
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
AIR_E2E_VISION=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

The opt-in vision flag injects fresh random test-only hash/session credentials into the local Playwright server process, without environment-file changes. Test password `air-test-preview-only` exists only for this opt-in test server; it is not a production credential. Without the flag, tests verify the default locked state and skip authenticated-only cases. Screenshot capture additionally accepts `AIR_CAPTURE_OUTPUT=/absolute/output/path` and captures all four main routes on desktop/mobile, with 375/768/1440px overflow checks. Playwright uses port 3100 and a production build. The managed sandbox requires supported escalation for Turbopack's CSS-worker port and Chromium/local-server execution. A denied worker port can leave a cached build panic; remove only generated `.next` and retry with appropriate local execution permission.

Tests cover selectors, distance calculations, synthetic provenance, unknown search, account return intent, save/remove persistence, pending claims, disabled publication, pricing, layers, mobile navigation, all public route widths, unauthenticated nested/RSC access, cross-origin rejection, authenticated filters/dialog/map behavior and preserved legacy journeys. Screenshots are review artifacts, not evidence of Lighthouse scores; no Lighthouse 90+ claim is made.

## Final validation for this change

- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run format:check` and `git diff --check`: passed.
- Full production Chromium run with ephemeral vision credentials: **25 passed, 1 intentionally skipped** (the no-configuration test).
- Separate default/no-secrets gate run: **3 passed, 2 intentionally skipped** (authenticated access and configured rate limiting).
- All 13 preserved Easement regression tests passed at `/legacy`. Public and protected route checks include 375px, 768px and 1440px widths.
- Eight desktop/mobile screenshots captured and visually inspected in ignored QA scratch `work/air-screenshots`. The project's designated `/codex/.../output` directory is not mounted/writable by the attached cloud machine; captures remain workspace QA artifacts and were displayed during review. Regenerate with `AIR_CAPTURE_OUTPUT` pointing to an available export directory.
- No Lighthouse audit or real-service integration was claimed. No remote push, deployment, paid-service connection or production environment change was performed.

## Prioritized production backlog

1. Approve AIR logo, legal/privacy/terms/contact copy, launch positioning, licensed property sources and editorial source policy.
2. Configure preview-provider protection/shared rate limits; integrate real identity, owner/team authorization, ownership verification and server persistence before collecting genuine property/contact data.
3. Integrate licensed Massachusetts parcel/infrastructure datasets with provenance, update schedules, measured geospatial accuracy and a compliant map provider. Keep synthetic records separate.
4. Add private property documents, consent records and reviewed SCIP workflows; approve Pro pricing and billing before enabling hosting, publication or marketing.
5. Implement durable consented waitlist/notifications and validated event collection; no messages are sent by the prototype.
6. Test accessibility with assistive technology, run Lighthouse and an independent security review in the target host, add monitoring and shared rate limits, and validate multi-user isolation.
7. Validate future markets and human-reviewed editorial ingestion before any national launch, automated research service or predictive model.

---

# Historical Easement implementation notes

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

## Version 2 — Easement Income introduction

The Easement Income primary tab now opens `#income`, rendered by `src/components/income.tsx`. This educational page uses the owner's supplied Easement Exchange copy: market introduction, easement income definition and legal distinction, four infrastructure categories, owner considerations, and owner/developer invitations. The owner CTA routes to `#explore`; Find Sites routes to the existing `#developer` experience. The provided “Free for infrastructure developers” positioning is page copy; existing developer demo access previews remain unchanged pending their redesign.

The earlier services page and all product/review flows remain available at their existing routes, including `#services`; they are no longer the primary Easement Income destination. The new page reuses the existing cards, buttons, typography, and palette, with responsive category and audience grids. Tests cover navigation, key educational content, both CTA destinations, and mobile layout alongside the existing V2 and portal regression tests. No production configuration is changed.

## Version 2 — CRE developer map and catalog

The `#developer` workspace now leads with a commercial property map and listings, a top-right Infrastructure Developer Type selector, sidebar criteria, and grid/list controls. Catalog access previews remain in an expandable panel; accounts, criteria, expanded demo catalog, property details, saved inquiries, and pending offers are preserved. These existing access previews are not new pricing or a live paywall.

`src/lib/developer-catalog.ts` defines the four developer types, exact layer labels, and separate fabricated catalogs. Each selection displays multifamily, office, mixed-use, and warehouse samples; the expanded catalog adds a warehouse. Wireless retains the prior sample addresses for inquiry continuity. Other types have distinct sample addresses and IDs. Type selection clears the previously selected property's detail and draft message. Layer controls reset to enabled on a type change. Criteria and access selection continue to apply across types, so filters can produce an empty catalog.

`src/components/developer-map.tsx` renders an illustrative SVG map and original CRE building illustrations, with no external map or data dependency. Wireless offers FCC Database, Proprietary Cell Site Structures, and Deadzone Complaints. Solar offers Existing Solar Deployments; battery offers Existing BESS Deployments; advertising offers Existing billboard locations. Layer toggles affect only their infrastructure markers. Numbered property pins track the filtered listings and open the matching property details. All locations, markers, distances, availability, and property attributes are fabricated, with an explicit preview notice. The selector is session UI state, not a saved developer preference. No real site matching, assessment, or outreach takes place.

Browser coverage verifies all four catalog/layer combinations, independent layer toggling, pin/detail selection, matching filters/empty results, selection reset, and mobile layout, alongside retained inquiry, account, and other V2 regression coverage.

## Version 2 — owner services, saved previews, and free developer accounts

Explore now offers two result CTAs: Save Complimentary Easement Marketing Feasibility Analysis opens `#account/owner/save`; the subscription CTA opens `#owner/pricing`. The displayed address and random scores persist in the browser demo store and survive navigation, signup, and refresh without regeneration. Saving carries that exact preview into the free owner account and deduplicates saved entries by address. `#owner/analyses` lists saved previews and accepts one address per line for a complimentary portfolio demonstration, with independent random scores per property and an explicit prototype disclosure. No real feasibility assessment or full report generation occurs.

The Property Owners primary tab (`#owner/overview`) and `#owner/pricing` now show Free, Baseline ($499/year for one property), Mid-Market (2–9 properties; $499/year plus $99/year for each additional property), and Recommended Portfolio Marketing ($499/year plus $49/year for each additional property). No minimum size for Portfolio Marketing was specified or imposed. Plan buttons carry a selection into the owner account flow; no subscription is activated and no checkout or billing is connected. The previous owner opportunity workspace remains at `#owner/workspace`; document, review, and legacy service routes remain available.

Catalog access tiers and Property Criteria have been removed from the developer experience, including account criteria and filtering logic. Previously stored criteria/access values are ignored. Every developer type shows its full five-property sample CRE catalog, with the existing type-specific map layers. Whole property cards and map pins now lead signed-out visitors to `#account/developer/<type>/<id>` for signup/login, then return to `#developer/<type>/<id>` for the selected property. Direct property links also show the account prompt when signed out. Property details and sample introduction/pending inquiry workflows remain available after demo sign-in. Grid/list controls and the existing team-size field are retained.

`src/components/account.tsx` provides separate owner and developer profile flows. This is a browser-only demonstration: name/email and team size (developers) are saved locally; login matches the locally saved email; sign-in flags do not provide authentication or access security. No passwords, email verification, real accounts, API, or payment system are connected. Profiles are separate by audience. Production authentication, durable account storage, server-side authorization, saved reports, and subscriptions remain future integration work.

Browser verification covers both Explore CTAs, exact saved-score continuity through signup/login/reload, duplicate saves, portfolio entry, owner plan copy/selection, removed developer controls, full catalogs, signup/login and deep-link gating, return to selected properties, map layers, inquiries, mobile layout, and the other retained V2 experiences. This section supersedes earlier catalog access/criteria and pricing-placeholder descriptions. Work remains exclusively on `redesign/v2`.

## Version 2 — marketing site and customer-app navigation

This repository's public experience is the marketing website; the eventual customer workspace will live separately at `app.easementexchange.com`. The shared header now shows separate Log In and Create Free Account links on every primary tab, aligned right on desktop and retained beside the brand on mobile. Planned app URLs are centralized in `src/lib/customer-app.ts`: `https://app.easementexchange.com/login` and `https://app.easementexchange.com/signup`. These paths are placeholders for the future app's authentication routes, not verified live endpoints. The customer app is not implemented or deployed by this change.

Property Owners no longer shows the top account/saved-analyses shortcut or Owner workspace link; its service cards and pricing remain. The developer page no longer shows its local account/logout control, explanatory free-access sentence, or Featured Properties / Pending Offers tab bar. Its type selector, category-specific layers, map, and CRE listing remain. Prior owner workspace, saved analyses, local account/property-detail demos, and pending inquiries are retained at their existing direct routes for future app reuse; they were not deleted or linked into the marketing navigation. Context-specific prototype flows (such as saving an Explore preview) are unchanged pending the app integration.

Browser coverage verifies the shared app destinations on all four tabs, removed local controls, retained owner plans and developer content, right alignment, and no overflow at 390px and 320px, alongside existing V2 regressions. No production deployment or configuration change is part of this stage.
