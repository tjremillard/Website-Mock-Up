"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { properties, infrastructure } from "@/data/air";
import { searchProperties, distanceKm } from "@/lib/air/selectors";
import { trackEvent } from "@/lib/air/analytics";
import { useDemo, updateDemo } from "@/lib/air/demo-store";
import type { Property } from "@/lib/air/types";
import { Badge, ButtonLink } from "./brand";
const Map = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => (
    <div className="air-map-loading" role="status">
      Loading schematic map…
    </div>
  ),
});
export function PropertyActions({ property: p }: { property: Property }) {
  const { state } = useDemo();
  const router = useRouter();
  const params = useSearchParams();
  const [claim, setClaim] = useState(params.get("intent") === "claim");
  const saved = state.saved.includes(p.id);
  const claimed = state.claims.some((c) => c.propertyId === p.id);
  function save() {
    if (!state.signedIn) {
      router.push(
        `/sign-up?returnTo=${encodeURIComponent(`/app/property/${p.id}?intent=save`)}`,
      );
      return;
    }
    updateDemo((s) => ({
      ...s,
      saved: s.saved.includes(p.id)
        ? s.saved.filter((id) => id !== p.id)
        : [...s.saved, p.id],
    }));
    trackEvent("property_saved", { id: p.id });
  }
  function startClaim() {
    trackEvent("claim_started", { id: p.id });
    if (!state.signedIn) {
      router.push(
        `/sign-up?returnTo=${encodeURIComponent(`/app/property/${p.id}?intent=claim`)}`,
      );
      return;
    }
    setClaim(true);
  }
  return (
    <>
      <div className="air-property-actions">
        <button onClick={save}>
          {saved ? "Remove saved property" : "Save Property"}
        </button>
        <button className="outline" onClick={startClaim}>
          {claimed ? "View pending claim" : "Claim Property"}
        </button>
        <ButtonLink href={`/app/scip/${p.id}`} secondary>
          Preview SCIP
        </ButtonLink>
        <Link
          href="/pricing"
          onClick={() => trackEvent("pro_cta_clicked", { id: p.id })}
        >
          Upgrade to AIR Pro →
        </Link>
      </div>
      {saved && state.signedIn && (
        <p role="status" className="air-fine">
          Saved in this browser · Demo data
        </p>
      )}
      {claim && state.signedIn && (
        <section className="air-claim-form">
          <h3>Request property verification</h3>
          {claimed ? (
            <p role="status">
              Verification required. Your demo claim is pending; ownership has
              not been verified.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                updateDemo((s) => ({
                  ...s,
                  claims: [
                    ...s.claims,
                    {
                      propertyId: p.id,
                      relationship: String(f.get("relationship")),
                      contact: String(f.get("contact")),
                    },
                  ],
                }));
                trackEvent("claim_submitted_demo", { id: p.id });
              }}
            >
              <p className="air-fine">
                Demo only. Use fictional contact details. Nothing is sent for
                verification.
              </p>
              <label>
                Relationship to property
                <select name="relationship" required>
                  <option value="">Select relationship</option>
                  <option>Owner</option>
                  <option>Authorized manager</option>
                  <option>Other representative</option>
                </select>
              </label>
              <label>
                Contact email
                <input
                  name="contact"
                  type="email"
                  required
                  placeholder="owner@example.test"
                />
              </label>
              <button type="submit">Submit demo claim</button>
            </form>
          )}
        </section>
      )}
    </>
  );
}
export function PropertyPanel({
  property: p,
  compact = false,
}: {
  property: Property;
  compact?: boolean;
}) {
  const nearby = infrastructure
    .map((s) => ({ ...s, distance: distanceKm(p, s) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);
  return (
    <section
      className={compact ? "air-property-panel" : "air-property-full"}
      aria-label="Property details"
    >
      <Badge>Demo property — not a real listing</Badge>
      <h2>{p.address}</h2>
      <p>
        {p.city}, Massachusetts · {p.propertyType}
      </p>
      <dl className="air-facts">
        <div>
          <dt>Approximate coordinates</dt>
          <dd>
            {p.lat.toFixed(3)}, {p.lng.toFixed(3)} · synthetic
          </dd>
        </div>
        <div>
          <dt>Data coverage</dt>
          <dd>Partial / illustrative / unverified</dd>
        </div>
        <div>
          <dt>Ownership</dt>
          <dd>Unknown · verification required</dd>
        </div>
      </dl>
      <h3>Site signals</h3>
      <p className="air-fine">
        Observed attributes in the demo dataset, not an eligibility score.
      </p>
      <dl className="air-facts">
        {p.signals.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>
              {s.value ?? "Unknown"}
              <small>{s.provenance.sourceName}</small>
            </dd>
          </div>
        ))}
      </dl>
      <h3>Nearby infrastructure</h3>
      <p className="air-fine">
        Distances calculated between synthetic coordinates; no live coverage is
        implied.
      </p>
      <ul className="air-nearby">
        {nearby.map((s) => (
          <li key={s.id}>
            {s.label}
            <small>
              {s.distance.toFixed(1)} km · {s.status} · Synthetic
            </small>
          </li>
        ))}
      </ul>
      <PropertyActions property={p} />
      {compact && (
        <Link className="air-text-link" href={`/app/property/${p.id}`}>
          Open full property record →
        </Link>
      )}
    </section>
  );
}
export function Explore() {
  const swipeStart = useRef(0);
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const selected = params.get("property") ?? undefined;
  useEffect(() => {
    if (selected && window.matchMedia("(max-width:800px)").matches)
      document
        .querySelector(".air-detail-sheet")
        ?.scrollIntoView({ block: "start" });
  }, [selected]);
  const showProperties = params.get("properties") !== "off";
  const existing = params.get("wireless") !== "off";
  const signals = params.get("signals") === "on";
  const matches = searchProperties(properties, query);
  const p = matches.find((p) => p.id === selected);
  function patch(values: Record<string, string | null>, push = false) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(values)) {
      if (v === null) next.delete(k);
      else next.set(k, v);
    }
    window.history[push ? "pushState" : "replaceState"](
      null,
      "",
      `/app?${next}`,
    );
  }
  function choose(id: string) {
    patch({ property: id }, true);
    trackEvent("property_selected", { id });
  }
  const sites = infrastructure.filter((s) =>
    s.status === "operational" ? existing : signals,
  );
  return (
    <main id="main-content" className="air-explorer">
      <aside className="air-search-sidebar">
        <p className="air-eyebrow">Massachusetts / Wireless</p>
        <h1>Explore your property.</h1>
        <p className="air-fine">Public browsing · Demo data</p>
        <label>
          Search address or town
          <input
            value={query}
            onChange={(e) => {
              patch({ q: e.target.value, property: null });
              trackEvent("property_search");
            }}
            placeholder="Try Boston or Cambridge"
            autoFocus={params.get("intent") === "search"}
          />
        </label>
        <fieldset className="air-layers">
          <legend>Map layers</legend>
          {[
            ["properties", "Properties", showProperties],
            ["wireless", "Existing wireless infrastructure", existing],
            ["signals", "Illustrative development signals", signals],
          ].map(([key, label, checked]) => (
            <label key={String(key)}>
              <input
                type="checkbox"
                checked={Boolean(checked)}
                onChange={(e) => {
                  patch({ [String(key)]: e.target.checked ? "on" : "off" });
                  trackEvent("map_layer_toggled", { layer: String(key) });
                }}
              />
              {label}
            </label>
          ))}
        </fieldset>
        <details>
          <summary>Data coverage</summary>
          <p className="air-fine">
            18 fictional Massachusetts properties and 21 synthetic
            infrastructure markers. Sources: AIR prototype dataset, November 6,
            2026. No parcel, zoning, structure or carrier facts are verified.
          </p>
        </details>
        <p className="air-fine">{matches.length} demo properties</p>
        <div className="air-search-results">
          {matches.length ? (
            matches.map((p) => (
              <button
                className={`air-result${selected === p.id ? " active" : ""}`}
                key={p.id}
                onClick={() => choose(p.id)}
                aria-pressed={selected === p.id}
              >
                <strong>{p.address}</strong>
                <small>{p.propertyType} · Not a real listing</small>
              </button>
            ))
          ) : (
            <div role="status">
              <p>We don&apos;t have this property in the prototype yet.</p>
              <button className="outline" onClick={() => patch({ q: null })}>
                Clear search
              </button>
            </div>
          )}
        </div>
      </aside>
      <div className="air-map-region">
        <div className="air-map-toolbar">
          <Badge>Massachusetts wireless only</Badge>
          <span>Illustrative prototype · No live coverage</span>
        </div>
        <Map
          items={showProperties ? matches : []}
          sites={sites}
          selected={selected}
          onSelect={choose}
        />
      </div>
      {p && (
        <aside className="air-detail-sheet">
          <button
            className="air-sheet-handle"
            aria-label="Swipe down or activate to close property details"
            onClick={() => patch({ property: null }, true)}
            onPointerDown={(e) => {
              swipeStart.current = e.clientY;
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerUp={(e) => {
              if (e.clientY - swipeStart.current > 60)
                patch({ property: null }, true);
            }}
          >
            <span />
          </button>
          <button
            className="air-close outline"
            onClick={() => patch({ property: null }, true)}
            aria-label="Close property details"
          >
            Close ×
          </button>
          <PropertyPanel key={p.id} property={p} compact />
        </aside>
      )}
    </main>
  );
}
