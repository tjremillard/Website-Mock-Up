"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  activities,
  visionArticles,
  visionCatalog,
  verticalNames,
} from "@/data/air";
import { filterMarket, inGeography } from "@/lib/air/selectors";
import { trackEvent } from "@/lib/air/analytics";
import type { Vertical, IntelligenceArticle } from "@/lib/air/types";
import { Badge, ButtonLink } from "./brand";
const Map = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => (
    <div className="air-map-loading" role="status">
      Loading national schematic…
    </div>
  ),
});
const verticals = Object.keys(verticalNames) as Vertical[];
const geographies = [
  "US",
  "Northeast",
  "Mid-Atlantic",
  "Massachusetts",
  "Pennsylvania",
  "New York",
  "California",
  "Texas",
];

export function VisionApp({
  view = "dashboard",
}: {
  view?: "dashboard" | "intelligence" | "explore" | "portfolio";
}) {
  const params = useSearchParams();
  const router = useRouter();
  const candidate = params.get("market") as Vertical;
  const market = verticals.includes(candidate) ? candidate : "wireless";
  const geography = geographies.includes(params.get("geography") ?? "")
    ? params.get("geography")!
    : "US";
  const status = params.get("status") ?? "all";
  const type = params.get("type") ?? "all";
  const [article, setArticle] = useState<IntelligenceArticle | null>(null);
  const [notice, setNotice] = useState("");
  const selected = params.get("property");
  const focus = activities.find((a) => a.id === params.get("activity"));
  const pro = params.get("view") === "pro";
  const marketplace = params.get("view") === "marketplace";
  const visibleActivities = activities.filter(
    (a) =>
      a.vertical === market &&
      inGeography([a.geography], geography) &&
      (status === "all" || a.status === status),
  );
  const feed = filterMarket(visionArticles, market, geography).filter(
    (a) =>
      (type === "all" || a.type === type) &&
      (status === "all" ||
        visibleActivities.some((activity) =>
          activity.relatedArticleIds.includes(a.id),
        )),
  );
  const properties = filterMarket(visionCatalog, market, geography)
    .map((record) => record.property)
    .filter(
      (p) =>
        status === "all" ||
        visibleActivities.some(
          (a) =>
            inGeography([a.geography], geography) &&
            visionCatalog
              .find((record) => record.property.id === p.id)
              ?.geographies.includes(a.geography),
        ),
    );

  const property = properties.find((p) => p.id === selected);
  function patch(values: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(values)) {
      if (v === null) next.delete(k);
      else next.set(k, v);
    }
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${next}`,
    );
    setArticle(null);
  }
  function change(key: string, value: string) {
    patch({ [key]: value, property: null, activity: null });
    if (key === "market")
      trackEvent("vision_market_changed", { vertical: value });
  }
  const linkQuery = `market=${market}&geography=${encodeURIComponent(geography)}`;
  return (
    <main id="main-content" className="air-vision-app">
      <aside className="air-vision-sidebar">
        <p className="air-eyebrow">AIR / Intelligence platform</p>
        <div className="air-workspace-avatar">
          AO{" "}
          <span>
            Alex / Illustrative owner
            <br />
            <small>Personal workspace · Demo</small>
          </span>
        </div>
        <nav aria-label="Vision workspace">
          <Link
            href="/vision/app"
            aria-current={view === "dashboard" ? "page" : undefined}
          >
            Overview
          </Link>
          <Link href={`/vision/app/intelligence?${linkQuery}`}>
            Intelligence
          </Link>
          <Link href={`/vision/app/explore?${linkQuery}`}>Explore</Link>
          <Link href={`/vision/app/explore?${linkQuery}#development-activity`}>
            → Development Activity
          </Link>
          <Link href={`/vision/app/portfolio?${linkQuery}`}>My Portfolio</Link>
          <Link href="/vision/app?view=marketplace">Marketplace / Future</Link>
          <Link href="/vision/app?view=pro">AIR Pro / Future</Link>
        </nav>
        <div className="air-sidebar-note">
          <Badge>Internal vision only</Badge>
          <p>
            All markets, activity, properties and transactions shown here are
            synthetic.
          </p>
          <Link href="/vision">← Vision overview</Link>
        </div>
      </aside>
      <div className="air-vision-main">
        <div className="air-vision-heading">
          <div>
            <p className="air-eyebrow">
              {view === "dashboard"
                ? "Your infrastructure briefing"
                : `AIR / ${view}`}
            </p>
            <h1>
              {pro
                ? "AIR Pro, a future preview."
                : marketplace
                  ? "A future meeting place for infrastructure."
                  : view === "portfolio"
                    ? "Your illustrative portfolio."
                    : view === "explore"
                      ? "See the market in context."
                      : view === "intelligence"
                        ? "Intelligence, connected to place."
                        : "Good morning, Alex."}
            </h1>
            <p>
              {pro
                ? "Enhanced research and property marketing. No subscription or checkout."
                : marketplace
                  ? "Landlords share approved packets. Developers discover sites for free."
                  : "A synthetic view of the markets, properties and infrastructure you follow."}
            </p>
          </div>
          <Badge>Illustrative demo / November 6, 2026</Badge>
        </div>
        {pro ? (
          <section className="air-card">
            <h2>Planned premium capabilities</h2>
            <div className="air-card-grid">
              {[
                "Enhanced property intelligence",
                "Owner-approved SCIP hosting",
                "Active property marketing",
              ].map((s) => (
                <div key={s}>
                  <Badge>Future vision</Badge>
                  <h3>{s}</h3>
                  <p>
                    Requires verified data, consent and a production service.
                  </p>
                </div>
              ))}
            </div>
            <p>
              Price: TBD. Developer browsing remains free. No transaction fees
              or brokerage promises.
            </p>
            <button
              onClick={() =>
                setNotice(
                  "Interest recorded for this demonstration session only. No request sent or subscription activated.",
                )
              }
            >
              Preview interest in AIR Pro
            </button>
            {notice && <p role="status">{notice}</p>}
          </section>
        ) : (
          <>
            <div className="air-market-tabs" aria-label="Infrastructure market">
              {verticals.map((v) => (
                <button
                  className={market === v ? "active" : ""}
                  key={v}
                  onClick={() => change("market", v)}
                  aria-pressed={market === v}
                >
                  {verticalNames[v]}
                </button>
              ))}
            </div>
            <div className="air-vision-filters">
              <label>
                Geography
                <select
                  value={geography}
                  onChange={(e) => change("geography", e.target.value)}
                >
                  {geographies.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </label>
              <label>
                Activity status
                <select
                  value={status}
                  onChange={(e) => change("status", e.target.value)}
                >
                  <option value="all">All statuses</option>
                  {[
                    "proposed",
                    "approved",
                    "under_construction",
                    "operational",
                    "unknown",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Content type
                <select
                  value={type}
                  onChange={(e) => change("type", e.target.value)}
                >
                  <option value="all">All content</option>
                  {[
                    ["analysis", "AIR Analysis"],
                    ["brief", "News Brief"],
                    ["development", "Development Activity"],
                    ["transaction", "Transaction"],
                    ["regulatory", "Regulatory"],
                  ].map(([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="air-metrics">
              <div>
                <span>Illustrative properties</span>
                <strong data-testid="vision-property-count">
                  {properties.length}
                </strong>
                <small>
                  {verticalNames[market]} · {geography}
                </small>
              </div>
              <div>
                <span>Synthetic development activity</span>
                <strong data-testid="vision-activity-count">
                  {visibleActivities.length}
                </strong>
                <small>No real projects asserted</small>
              </div>
              <div>
                <span>Sample intelligence</span>
                <strong data-testid="vision-feed-count">{feed.length}</strong>
                <small>Human review before publication</small>
              </div>
            </div>
            {view === "portfolio" ? (
              <section className="air-card">
                <h2>My Portfolio / Illustrative</h2>
                <p>
                  These example properties are not owned or claimed by a real
                  user.
                </p>
                <div className="air-table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Market coverage</th>
                        <th>Alert</th>
                        <th>SCIP status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.slice(0, 8).map((p) => (
                        <tr key={p.id}>
                          <td>
                            <Link
                              href={`/vision/app/explore?${linkQuery}&property=${p.id}`}
                            >
                              {p.address}
                            </Link>
                          </td>
                          <td>{verticalNames[market]} · Synthetic</td>
                          <td>Source review needed</td>
                          <td>Draft / verification required</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!properties.length && (
                  <p role="status">
                    No illustrative properties match these filters.
                  </p>
                )}
              </section>
            ) : (
              <div className="air-dashboard-grid">
                <div>
                  {view !== "intelligence" && (
                    <section className="air-dashboard-map air-card">
                      <div className="air-section-head">
                        <div>
                          <p className="air-eyebrow">
                            AIR Explore / Illustrative demo
                          </p>
                          <h2>
                            {verticalNames[market]} across{" "}
                            {geography === "US"
                              ? "the United States"
                              : geography}
                          </h2>
                        </div>
                        <Link href={`/vision/app/explore?${linkQuery}`}>
                          Explore map →
                        </Link>
                      </div>
                      <div className="air-vision-map-layers">
                        <label>
                          <input
                            type="checkbox"
                            checked={params.get("propertyLayer") !== "off"}
                            onChange={(e) =>
                              patch({
                                propertyLayer: e.target.checked ? "on" : "off",
                              })
                            }
                          />
                          Properties
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={params.get("activityLayer") !== "off"}
                            onChange={(e) =>
                              patch({
                                activityLayer: e.target.checked ? "on" : "off",
                              })
                            }
                          />
                          Synthetic {verticalNames[market]} activity
                        </label>
                      </div>
                      <Map
                        items={
                          params.get("propertyLayer") === "off"
                            ? []
                            : properties
                        }
                        sites={
                          params.get("activityLayer") === "off"
                            ? []
                            : visibleActivities.flatMap((a) =>
                                a.lat === undefined || a.lng === undefined
                                  ? []
                                  : [
                                      {
                                        id: a.id,
                                        vertical: a.vertical,
                                        lat: a.lat,
                                        lng: a.lng,
                                        label: a.title,
                                        status: a.status,
                                        provenance: a.provenance,
                                      },
                                    ],
                              )
                        }
                        selected={selected ?? undefined}
                        national
                        onSelect={(id) =>
                          patch({ property: id, activity: null })
                        }
                        focus={
                          focus?.lat !== undefined && focus.lng !== undefined
                            ? {
                                lat: focus.lat,
                                lng: focus.lng,
                                label: focus.title,
                              }
                            : undefined
                        }
                      />
                      {property && (
                        <div className="air-vision-property">
                          <Badge>Demo property — not a real listing</Badge>
                          <h3>{property.address}</h3>
                          <p>
                            {property.propertyType} · {property.city} · Unknown
                            ownership
                          </p>
                          <h3>Multi-vertical opportunity context</h3>
                          <p>
                            Research lens: {verticalNames[market]}. Other
                            verticals require separate evidence. Structural
                            suitability, available power, zoning and owner
                            consent: Unknown.
                          </p>
                          <p>
                            Future scoring:{" "}
                            <strong>Model not yet available</strong>
                          </p>
                          <button
                            className="outline"
                            onClick={() =>
                              setNotice(
                                `${property.address}: illustrative draft SCIP. Documents, owner-approved contact and verification are not provided; publication is unavailable.`,
                              )
                            }
                          >
                            Preview illustrative SCIP
                          </button>
                          <button
                            className="outline"
                            onClick={() => patch({ property: null })}
                          >
                            Close property
                          </button>
                          {notice && <p role="status">{notice}</p>}
                        </div>
                      )}
                    </section>
                  )}
                  <section className="air-card air-feed-section">
                    <div className="air-section-head">
                      <div>
                        <p className="air-eyebrow">AIR Intelligence</p>
                        <h2>
                          {marketplace
                            ? "Research-to-discovery loop"
                            : "Your market briefing"}
                        </h2>
                      </div>
                      <span className="air-fine">Demo content</span>
                    </div>
                    {feed.length ? (
                      feed.map((a) => (
                        <button
                          className="air-feed-card"
                          key={a.id}
                          onClick={() => setArticle(a)}
                        >
                          <div className="air-feed-icon" aria-hidden="true">
                            {a.type === "analysis" ? "→" : "≋"}
                          </div>
                          <div>
                            <span className="air-eyebrow">
                              {a.type} / {a.geographies.join(", ")}
                            </span>
                            <h3>{a.title}</h3>
                            <p>{a.dek}</p>
                            <small>
                              Sample · November 6, 2026 · AIR editorial
                              prototype
                            </small>
                          </div>
                          <span aria-hidden="true">→</span>
                        </button>
                      ))
                    ) : (
                      <p role="status">
                        No sample intelligence matches these filters. Try a
                        different market, geography or content type.
                      </p>
                    )}
                  </section>
                  <section className="air-card" id="development-activity">
                    <p className="air-eyebrow">
                      Development activity / Synthetic
                    </p>
                    <h2>Activity in context</h2>
                    <p className="air-fine">
                      All statuses below describe invented demonstration
                      records.
                    </p>
                    {visibleActivities.length ? (
                      visibleActivities.map((a) => (
                        <button
                          className="air-activity-row"
                          key={a.id}
                          onClick={() => {
                            patch({ activity: a.id, property: null });
                            document
                              .querySelector(".air-dashboard-map")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                        >
                          <span>
                            {a.title}
                            <small>
                              {a.geography} · {a.date}
                            </small>
                          </span>
                          <Badge>{a.status.replaceAll("_", " ")}</Badge>
                        </button>
                      ))
                    ) : (
                      <p role="status">
                        No synthetic activity matches these filters.
                      </p>
                    )}
                  </section>
                </div>
                <aside className="air-dashboard-rail">
                  <section className="air-card">
                    <p className="air-eyebrow">
                      Saved properties / Illustrative
                    </p>
                    {properties.slice(0, 3).map((p) => (
                      <button
                        className="air-rail-property"
                        key={p.id}
                        onClick={() => {
                          patch({ property: p.id, activity: null });
                          document
                            .querySelector(".air-dashboard-map")
                            ?.scrollIntoView();
                        }}
                      >
                        {p.address}
                        <small>
                          {p.city}, {p.state} · Synthetic
                        </small>
                      </button>
                    ))}
                    {!properties.length && (
                      <p>No demo properties in this selection.</p>
                    )}
                    <Link
                      className="air-text-link"
                      href={`/vision/app/portfolio?${linkQuery}`}
                    >
                      View portfolio →
                    </Link>
                  </section>
                  <section className="air-card">
                    <p className="air-eyebrow">Markets you follow</p>
                    <Badge>{verticalNames[market]}</Badge>
                    <p className="air-fine">
                      {geography} · Illustrative preferences
                    </p>
                  </section>
                  <section className="air-card">
                    <p className="air-eyebrow">Activity near your properties</p>
                    <p>
                      {visibleActivities.length} synthetic activities in the
                      selected geography.
                    </p>
                    <p className="air-fine">
                      Regional grouping only. No real proximity alerts are
                      generated.
                    </p>
                  </section>
                  <section className="air-card air-pro-card">
                    <Badge>Future vision</Badge>
                    <h3>A deeper property perspective.</h3>
                    <p>Enhanced intelligence and SCIP hosting with AIR Pro.</p>
                    <ButtonLink href="/vision/app?view=pro" secondary>
                      Preview AIR Pro →
                    </ButtonLink>
                  </section>
                </aside>
              </div>
            )}
          </>
        )}
        {article && (
          <div className="air-drawer-backdrop" onClick={() => setArticle(null)}>
            <dialog
              className="air-article-drawer"
              aria-label="Intelligence detail"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") setArticle(null);
              }}
              tabIndex={-1}
              ref={(el) => {
                if (el && !el.open) el.showModal();
              }}
              onCancel={() => setArticle(null)}
            >
              <button
                className="outline air-close"
                autoFocus
                onClick={() => setArticle(null)}
              >
                Close article ×
              </button>
              <Badge>Demo content · {article.type}</Badge>
              <h2>{article.title}</h2>
              <p>
                {article.author} · {article.publishedAt}
              </p>
              <p>{article.body}</p>
              <h3>Provenance</h3>
              <p>
                {article.sources[0].sourceName} ·{" "}
                {article.sources[0].observedAt}
              </p>
              <h3>Related activity</h3>
              {activities
                .filter((a) => a.relatedArticleIds.includes(article.id))
                .map((a) => (
                  <button
                    className="outline"
                    key={a.id}
                    onClick={() => {
                      patch({
                        market: a.vertical,
                        geography: a.geography,
                        activity: a.id,
                        property: null,
                      });
                      setArticle(null);
                      if (view === "intelligence")
                        router.push(
                          `/vision/app/explore?market=${a.vertical}&geography=${a.geography}&activity=${a.id}`,
                        );
                      else
                        document
                          .querySelector(".air-dashboard-map")
                          ?.scrollIntoView();
                    }}
                  >
                    {a.title} · {a.status}
                  </button>
                ))}
              <p className="air-fine">
                AI-assisted research requires source evidence and human approval
                before publication. No publication service is connected.
              </p>
            </dialog>
          </div>
        )}
      </div>
    </main>
  );
}
