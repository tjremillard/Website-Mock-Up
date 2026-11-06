# Alternative Infrastructure Realty (AIR)

## Codex Implementation Specification — Four Experiences, One Next.js Repository

**Version:** 1.0 | **Status:** Build-ready prototype brief | **Initial beachhead:** Massachusetts wireless infrastructure

## 1. Objective and product rules

Build four coherent, responsive, interactive website prototypes in one Next.js App Router repository:

1. **Launch Marketing** (`/`) — public, focused on Massachusetts wireless leasing opportunity and free product acquisition.
2. **Launch Explore** (`/app`) — public browsing; account-gated saved-property features; property intelligence and SCIP conversion.
3. **Vision Marketing** (`/vision`) — internally protected, national multi-vertical category story.
4. **Vision Application** (`/vision/app`) — internally protected, personalized intelligence and national infrastructure explorer.

Prioritize the first two experiences. The latter two are demonstrable internal prototypes with synthetic content, not launch commitments. **Do not build four apps or four databases.** Use a single design system, shared domain models, reusable services, and route-specific layouts. Existing V1 must remain live while development proceeds on `redesign/v2` or an isolated feature branch; do not change production domains until approved.

**Positioning:** Alternative Infrastructure Realty (AIR) helps property owners understand, explore, and market their real estate for emerging infrastructure opportunities. Launch coverage is **Massachusetts wireless**. Starlink Mobile is a prominent editorial theme, alongside Verizon, AT&T, T-Mobile and other wireless infrastructure participants. Never imply AIR is authorized by, affiliated with, or receiving site requests from any carrier or SpaceX without evidence. Do not guarantee demand, revenue, eligibility, or leases.

**Business model:** Free intelligence + free basic map browsing; paid AIR Pro for enhanced property intelligence and SCIP hosting/marketing. No transaction fees, brokerage claims, or representation promises. SCIP = Site Candidate Information Packet. Developer browsing should remain free in the vision concept. Keep the future solar, BESS, EV charging, and out-of-home categories visible as an expansion roadmap, not live launch offerings.

## 2. Technology and repo structure

- Next.js App Router, TypeScript `strict`, Tailwind CSS, accessible UI primitives (e.g. shadcn/ui + Radix), Lucide icons.
- Use existing repository versions and conventions where possible; do not overwrite established working configurations.
- Use MapLibre GL JS with a compatible map tile source if a token-free source is available under its terms; otherwise use a clearly labeled schematic fallback. Do not scrape proprietary map tiles. Lazy-load map on client to avoid SSR issues.
- Use mock typed data and local browser state for prototypes. No fabricated real transactions or carrier deployments. Optional auth provider / database integration only if already configured; otherwise build a clearly labeled simulated sign-up flow, not fake production authentication.
- Keep real keys and server secrets out of client bundles. No paid external APIs required for prototype.

Suggested file tree:

```text
src/
  app/
    (launch-marketing)/
      layout.tsx
      page.tsx                      # /
      intelligence/page.tsx
      intelligence/[slug]/page.tsx
      how-it-works/page.tsx
      pricing/page.tsx
      about/page.tsx
    (launch-app)/
      app/layout.tsx
      app/page.tsx                  # /app
      app/property/[id]/page.tsx
      app/saved/page.tsx
      app/my-properties/page.tsx
      app/scip/[id]/page.tsx
      app/account/page.tsx
    (auth)/
      sign-in/page.tsx
      sign-up/page.tsx
    vision/
      layout.tsx                   # auth + noindex
      page.tsx                     # /vision
      app/page.tsx                 # /vision/app
      app/intelligence/page.tsx
      app/explore/page.tsx
      app/portfolio/page.tsx
    api/vision-auth/route.ts       # server-side password verification
    globals.css
    layout.tsx
    not-found.tsx
  components/
    ui/                             # base primitives
    brand/                          # AIR logo, masthead, footer
    marketing/                      # hero, feature cards, editorial cards, CTAs
    explore/                        # map, layers, search, markers, detail panel
    property/                       # property facts, evidence, claim, SCIP preview
    intelligence/                   # market filter, feed, activity cards
    auth/                           # signup, signin, onboarding
    vision/                         # vision-only sections
  data/
    mock-properties.ts
    mock-wireless-sites.ts
    mock-articles.ts
    mock-market-activity.ts
    mock-vision.ts
  lib/
    types.ts
    filters.ts
    geo.ts
    auth.ts
    analytics.ts
    feature-flags.ts
  tests/
    e2e/
    unit/
middleware.ts or proxy.ts          # per installed Next.js version
```

**Route-group note:** `(launch-marketing)` and `(launch-app)` are organizational groups, not URL segments. The `/vision` layout must protect every nested vision route. Use whichever Next.js middleware/proxy convention matches the installed version.

## 3. Design system

**Personality:** credible, institutional, analytical, modern, restrained. More real estate intelligence terminal than flashy startup landing page.

**Tokens:**

- Navy `#17365D` (primary), ink `#172334`, steel `#64748B`, sky `#EAF2FA`, white `#FFFFFF`, green `#16856A` (positive/verified only), amber `#B7791F` (uncertain/proposed), border `#DCE4EC`.
- Font: Geist or Inter for UI; optional editorial serif accent for article headlines only. Use locally available or standard web-safe fallback.
- 8px spacing scale; content max width 1200–1280px; article measure 720px; 12px cards / 16px panels; subtle shadows.
- Buttons: primary navy, secondary outline, tertiary text. Distinct hover/focus/disabled/loading states.
- Typography: large clear H1, restrained section headings, readable body (16–18px), minimum 14px for critical controls.
- Map colors: existing wireless infrastructure blue; proposed development amber; owner-listed sites green; neutral parcels slate. Legend always visible.
- Shared logo component: typographic AIR mark with subtle radio-wave motif; use placeholder SVG until approved brand asset is provided. Avoid representing placeholder as final logo.
- Desktop: top nav and two-column hero. Mobile: hamburger menu, stacked cards, full-screen map with bottom sheet; minimum 44px touch targets.
- WCAG AA-minded contrast, keyboard focus, semantic headings, descriptive form labels, reduced-motion preference.

## 4. Navigation and information architecture

### Launch marketing header

AIR logo | Explore | Intelligence | How It Works | Pricing | About | Sign In | **Explore Your Property**.

- Logo -> `/`
- Explore -> `/app`
- Intelligence -> `/intelligence`
- How It Works -> `/how-it-works`
- Pricing -> `/pricing`
- Sign In -> `/sign-in`
- Main CTA -> `/app?intent=search`

### Launch app header

AIR Explore | Search | Saved | My Properties | Intelligence | Account | Upgrade to Pro.

- Public users can search, browse map, view basic property details.
- Saved, claim, and SCIP creation require sign-in; after sign-in return to prior intent.
- Upgrade buttons go to pricing or a transparent **Pro preview**, not a working checkout.

### Vision marketing header

AIR | Intelligence | Explore | Marketplace | AIR Pro | **Vision Prototype** label.

- All links stay within `/vision` or `/vision/app`; never route public traffic into internal prototypes.

### Vision app header

AIR Intelligence | Explore | Development Activity | My Properties | AIR Pro | **Vision Prototype** label.

- Filters for market, geography, status and content type.

## 5. Experience 1: Launch marketing (`/`) — P0

### Homepage sections in order

1. **Announcement eyebrow:** `NOW EXPLORING MASSACHUSETTS WIRELESS INFRASTRUCTURE`.
2. **Hero:** `The next generation of wireless infrastructure starts with real estate.` Subhead: `AIR helps Massachusetts property owners explore wireless leasing potential and make their properties discoverable to infrastructure developers.` Primary CTA `Explore Your Property` -> `/app`; secondary `How AIR Works`.
3. **Inline property search:** Massachusetts address input with autocomplete-like local mock suggestions. Selecting a seeded address opens `/app/property/[id]`. Unknown address shows `We don't have this property in the prototype yet` and allows map browsing; do not fabricate a match.
4. **Why now:** editorial cards on satellite-to-cellular, network densification, and rooftop infrastructure; cautious language, clear dates/sources where factual.
5. **How it works:** `Explore free` -> `Create a free account` -> `Claim your property` -> `Publish a SCIP with AIR Pro`.
6. **AIR Explore preview:** map image/component and three free features (browse, discover, save with account).
7. **Starlink / wireless focus:** `New wireless architectures could create new site requirements` plus transparent disclaimer: AIR is independent and is not affiliated with Starlink or any wireless carrier.
8. **Intelligence preview:** three editorial cards, with `Read AIR Intelligence` link.
9. **Expansion roadmap:** `Starting with wireless in Massachusetts. Built to expand into solar, battery storage and other alternative infrastructure markets.` Avoid suggesting those are currently served.
10. **Final CTA:** `Explore a Massachusetts Property — Free`.
11. Footer: company info, contact placeholder, privacy/terms placeholders clearly marked until real pages exist; avoid publishing dead legal links.

### Supporting pages

- `/intelligence`: wireless-focused feed, Massachusetts filter preselected, category tags, search, featured editorial article, 6–8 illustrative cards. Mark samples as `Demo content` unless verified and sourced.
- `/intelligence/[slug]`: headline, category, geography, author, published date, source links, status labels, `What this means for landlords`, related properties CTA. Never invent attributed quotes or transactions.
- `/how-it-works`: explain free map, free account, property claim, SCIP, Pro; distinction between marketing and guaranteed tenant demand.
- `/pricing`: Free vs Pro comparison. Pro price is **TBD** unless product owner explicitly approves a figure. No checkout in prototype.
- `/about`: company mission, Massachusetts starting point, long-term alternative infrastructure ambition.

## 6. Experience 2: Launch Explore (`/app`) — P0

### Main layout

Desktop: 340px left search/filter sidebar, map center, 360px right detail panel on selection. Mobile: search top, full-width map, swipeable detail bottom sheet.

### Default state

- Massachusetts viewport; **Massachusetts wireless only**.
- Layers: `Properties`, `Existing wireless infrastructure`, `Illustrative development signals` (last one off by default and explicitly synthetic).
- Legend and `Data coverage` info popover. If map tiles unavailable, display a stylized map with visible mock markers and a notice; never show a blank map.
- Search by address or town from mock dataset. Search results and marker clicks select the same property state.

### Property panel

- Address, town, property type, approximate coordinates, data coverage status, source/verification labels.
- `Nearby infrastructure` list derived from seeded examples (distance computed with haversine; do not claim live coverage).
- `Site signals` as **observed attributes**, not a random eligibility score: roof type if known, parcel/building category, nearby infrastructure, and data completeness.
- `Unknown` is valid and preferred to invented data.
- Actions: `Save Property` (account-gated), `Claim Property` (account-gated, verification pending), `Preview SCIP`, `Upgrade to AIR Pro`.

### Saved / claimed / SCIP

- `/app/saved`: saved property list, empty state and remove action; persist locally for prototype with visible `Demo data` note.
- `/app/my-properties`: list claimed/demo properties; claim form asks relationship to property and contact info, then displays `Verification required` state. Never claim ownership was verified.
- `/app/scip/[id]`: SCIP preview with sections: overview, property location, existing infrastructure context, site characteristics, available documents, owner-approved contact method, and data sources. Show missing fields as `Not provided`. `Publish` is disabled with explanation until production verification and billing exist.
- `/app/account`: followed market `Massachusetts Wireless`, notification preferences, demo subscription status.

### Free / Pro boundary

| Feature                           | Free                 | AIR Pro (preview)                  |
| --------------------------------- | -------------------- | ---------------------------------- |
| Browse Massachusetts map          | Yes                  | Yes                                |
| Search property addresses         | Yes                  | Yes                                |
| Read wireless intelligence        | Yes                  | Yes                                |
| Save properties                   | Account required     | Yes                                |
| Claim property                    | Request verification | Yes                                |
| Basic nearby wireless context     | Yes, with provenance | Yes                                |
| Advanced analytics                | No                   | Planned                            |
| SCIP hosting and active marketing | No                   | Planned paid feature               |
| Lease comparables                 | No                   | Planned where lawful and available |

Do not blur the difference between a free account and a paid customer. No fake success states for subscription, verification, publication, or actual developer inquiries.

## 7. Experience 3: Vision marketing (`/vision`) — P1, protected

### Narrative

Hero: `Where real estate meets the next generation of infrastructure.` Subhead: `One intelligence and property discovery platform for connectivity, energy and emerging infrastructure.`

Sections:

1. Category thesis: fragmented infrastructure site discovery and landlord information.
2. Four product pillars: **AIR Intelligence**, **AIR Explore**, **AIR Marketplace**, **AIR Pro**.
3. Vertical tiles: Wireless, Solar, Battery Storage, EV Charging, Outdoor Advertising. All labeled `Future vision` where appropriate.
4. National map preview with cross-market filters.
5. Two-sided network: landlords list and manage properties; developers discover sites and express interest.
6. Intelligence-to-map loop: read news -> view development activity -> explore nearby properties -> save/claim -> SCIP.
7. AI-assisted research pipeline: discover -> extract -> classify -> draft -> human review -> publish. Never auto-publish.
8. Expansion roadmap by capability and geography (no invented delivery dates).
9. Internal-only `Explore Vision App` CTA.

## 8. Experience 4: Vision application (`/vision/app`) — P1, protected

### Default dashboard

- Personalized greeting, followed geographies and verticals.
- Market toggles: Wireless, Solar, Battery Storage, EV Charging, OOH.
- Geography selector: US, Northeast, Mid-Atlantic, Massachusetts, Pennsylvania, New York and additional seeded regions.
- Feed cards: `AIR Analysis`, `News Brief`, `Development Activity`, `Transaction`, `Regulatory`.
- Featured national map with market-specific layers and property counts clearly marked `Illustrative demo`.
- Right rail: `Saved Properties`, `Markets You Follow`, `Activity Near Your Properties`.

### Vision interactions

- Toggle market/geography -> update visible feed, map markers, counts and activity list from the same mock data.
- Click article -> detail drawer/page with provenance and related market activity.
- Click activity -> corresponding map location (if geocoded), with `Proposed/Approved/Under construction/Operational` status.
- Click property -> multi-vertical opportunity panel; **no fabricated predictive scores**. Future scoring card should display `Model not yet available`.
- `My Portfolio` -> illustrative multi-property table, alerts, SCIP status and market coverage.
- `AIR Pro` -> clearly labeled future premium feature preview.

## 9. Typed mock data contracts

```ts
type Vertical = "wireless" | "solar" | "bess" | "ev" | "ooh";
type ActivityStatus =
  "proposed" | "approved" | "under_construction" | "operational" | "unknown";
type VerificationStatus = "unverified" | "pending" | "verified";
type Provenance = {
  sourceName: string;
  sourceUrl?: string;
  observedAt?: string;
  isSynthetic: boolean;
};
type Property = {
  id: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  lat: number;
  lng: number;
  propertyType:
    "industrial" | "office" | "retail" | "multifamily" | "land" | "other";
  ownerDisplayName?: string; // do not invent real owner details
  claimedStatus: VerificationStatus;
  signals: Array<{
    label: string;
    value: string | null;
    provenance: Provenance;
  }>;
  isDemo: boolean;
};
type InfrastructureSite = {
  id: string;
  vertical: Vertical;
  lat: number;
  lng: number;
  label: string;
  status: ActivityStatus;
  provenance: Provenance;
};
type IntelligenceArticle = {
  id: string;
  slug: string;
  title: string;
  dek: string;
  type: "analysis" | "brief" | "development" | "transaction" | "regulatory";
  verticals: Vertical[];
  geographies: string[];
  publishedAt: string;
  author: string;
  body: string;
  sources: Provenance[];
  isDemo: boolean;
};
type MarketActivity = {
  id: string;
  title: string;
  vertical: Vertical;
  geography: string;
  status: ActivityStatus;
  date: string;
  lat?: number;
  lng?: number;
  relatedArticleIds: string[];
  provenance: Provenance;
};
type SCIP = {
  id: string;
  propertyId: string;
  status: "draft" | "pending_verification" | "published";
  ownerApproved: boolean;
  sections: Array<{ title: string; fields: Record<string, string | null> }>;
};
```

### Seed data

- **Launch:** 12–20 **fictional/demo** property records located in real Massachusetts municipalities (Boston, Cambridge, Somerville, Worcester, Springfield, Lowell, Quincy, Waltham, Framingham). Avoid invented street addresses that could be mistaken for real properties: use town-level fictional labels or explicitly `Demo property — not a real listing` unless addresses are verified and licensed.
- 15–25 illustrative infrastructure markers, all clearly synthetic; use synthetic coordinates without claiming actual carrier locations.
- 6–8 editorial **sample** articles on wireless leasing, Starlink strategy, densification, and site selection. No false recent news, contracts or transaction amounts.
- **Vision:** 40–60 synthetic properties distributed across selected US regions; 25–40 sample activities across five verticals; 15–20 illustrative articles.
- One source-of-truth mock dataset for shared entities. Use selectors to filter, not duplicate divergent content in each page.

## 10. Conversion flows and event instrumentation

### Flow A — cold visitor to free user

`Homepage -> Search Massachusetts address -> Explore property -> Save Property -> Sign Up -> Return to property -> Saved state`.

### Flow B — free user to potential Pro customer

`Explore -> Claim Property -> Verification Pending -> Preview SCIP -> AIR Pro feature comparison -> Join waitlist / Request access`.

### Flow C — intelligence to Explore

`Article -> Read What It Means for Landlords -> Explore Massachusetts Wireless -> Property search -> Sign Up`.

### Flow D — vision demonstration

`Protected /vision -> product pillar -> /vision/app -> toggle vertical and geography -> activity -> map -> property detail`.

Use a lightweight `trackEvent` abstraction, initially logging in development only. Define event names: `homepage_view`, `property_search`, `property_selected`, `map_layer_toggled`, `article_opened`, `signup_started`, `signup_completed_demo`, `property_saved`, `claim_started`, `claim_submitted_demo`, `scip_previewed`, `pro_cta_clicked`, `vision_market_changed`. Do not claim events are persisted server-side unless implemented. Never log full addresses, contact details, or sensitive user-entered content in production analytics without appropriate controls.

## 11. Authentication and vision protection

- Public browsing requires no login.
- For prototype account flows, use explicit **Demo Mode** and local state; do not suggest that client-only state is secure authentication.
- Vision routes **must be server-side protected**, not merely hidden from navigation or gated in client JS. Use environment variable `AIR_VISION_PASSWORD_HASH` or an existing identity provider; verify on server and set `HttpOnly`, `Secure` (in HTTPS), `SameSite=Lax` signed session cookie with expiry. Avoid plain-text password in source or client bundle.
- Protect `/vision` and all descendants through server layout/session validation and middleware/proxy where appropriate; avoid relying on layout alone if nested pages or endpoints could bypass it.
- Add `robots: { index: false, follow: false }`, `X-Robots-Tag: noindex, nofollow`, and exclude vision paths from sitemap. **Noindex is not access control.**
- Add basic rate limiting or hosting-level protection to password attempts. If secure password infrastructure is unavailable, use deployment-provider preview authentication instead of inventing a weak gate.

## 12. AI editorial future architecture (visual prototype only)

Display a clearly labeled internal workflow, without wiring an LLM into production:
`Source ingestion -> deduplication -> entity extraction -> geography/vertical tagging -> evidence-backed draft -> human review -> publish -> structured activity record`.

Data requirements: primary-source URLs, observed date, project status, entities, source confidence, editor approval timestamp, corrections/version history. **Human approval required before publication.** Never auto-publish, invent quotes, fabricate leases, or treat proposals as signed transactions. Separate verified facts from AIR opinion.

## 13. UX states and quality gates

Every interactive page must support loading, empty, error and success/demo states. All buttons and nav links must work or be explicitly labeled `Coming soon`; no inert CTA surfaces. Keep the URL/query state in sync for map selection and filters where feasible. Search and filters should be keyboard accessible and functional on mobile. Use skeleton loaders for map/cards and a friendly fallback if external tiles fail.

Performance: aim for Lighthouse 90+ accessibility/best practices on representative routes; avoid heavy map bundle on marketing pages; lazy-load below-fold media; optimize images; no layout shift in major hero elements.

Testing:

- Unit: market filters, property selectors, distance calculation, synthetic provenance badges.
- E2E: homepage -> Explore -> property selection; search unknown address; sign-up return intent; saved property; SCIP preview; pricing CTA; vision unauthenticated redirect; vision authenticated access; mobile menu and map bottom sheet.
- Verify every public route at 375px, 768px, 1440px.
- Typecheck, lint and production build must pass.

## 14. Codex execution sequence and acceptance criteria

### Pass 1 — Audit and foundation

Inspect existing repo, Next.js version, branch, design system and deployment. Preserve V1. Create types, tokens, route skeletons, shared navigation and mock data. Run typecheck/build.

### Pass 2 — Launch marketing

Implement full homepage and supporting pages. All CTAs route correctly. Wireless-only positioning is consistent. Starlink statements are framed as independent commentary. Responsive at three breakpoints.

### Pass 3 — Launch Explore

Implement map, search, filters, property panel, save, demo auth, claim pending, SCIP preview and Pro preview. Map fallback works without API keys. No invented feasibility scores or real-world activity claims.

### Pass 4 — Vision protection and prototypes

Implement secure vision gate, vision marketing and vision app, functional toggles and unified data filters. Clearly label prototypes and future capabilities.

### Pass 5 — QA and handoff

Run lint/typecheck/build/tests, fix failures, verify links and responsive layouts. Provide screenshots of all four main routes (desktop + mobile), summary of files changed, demo credentials setup instructions without printing secrets, and a prioritized production-integration backlog.

**Definition of done:** Four accessible routes/experiences render, public vs protected separation is enforced, launch journeys are fully clickable with mock data, vision filters actually work, data provenance is explicit, no false carrier affiliation or fabricated market claims appear, and V1 remains unaffected.

## 15. What NOT to build in this iteration

- Live payments or real subscription billing.
- Production identity verification or public property publication.
- Automated AI publishing.
- Live carrier demand feeds or implied carrier partnerships.
- Predictive 0–100% site feasibility scores without a validated model.
- A full nationwide data warehouse or external API integrations.
- Four standalone repositories, separate design systems or duplicate property schemas.
- Brokerage workflows, transaction fees or guarantees of lease placement.

## 16. First Codex instruction (copy/paste)

> You are working in the existing AIR Next.js repository. First inspect the repo, branch, current framework versions, design system and deployment assumptions. Do not overwrite or disrupt the live V1. Read `AIR_Codex_Implementation_Spec.md` and implement it in five passes, prioritizing P0 launch marketing and P0 Massachusetts wireless Explore. Use one App Router codebase, shared types/components, explicitly labeled synthetic data, and secure server-side protection for `/vision`. Before coding, summarize your intended file changes and flag any conflict with existing structure. Then implement Pass 1 and Pass 2, run typecheck/lint/build, and report results. Continue with subsequent passes only after the preceding pass builds successfully. Do not invent real wireless deployment data, affiliation with Starlink, validated AI scores, or production auth/payment functionality.
