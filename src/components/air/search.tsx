"use client";
import { useState } from "react";
import Link from "next/link";
import { properties } from "@/data/air";
import { searchProperties } from "@/lib/air/selectors";
import { trackEvent } from "@/lib/air/analytics";
export function PropertySearch() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const matches = query.trim()
    ? searchProperties(properties, query).slice(0, 5)
    : [];
  return (
    <div className="air-property-search">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(true);
          trackEvent("property_search");
        }}
      >
        <label htmlFor="air-property-address">
          Start with your Massachusetts property
        </label>
        <div className="air-input-row">
          <span aria-hidden="true">⌕</span>
          <input
            id="air-property-address"
            placeholder="Enter an address or town"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearched(false);
            }}
            required
            autoComplete="off"
          />
          <button type="submit">
            Explore property <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>
      {matches.length > 0 && (
        <ul className="air-suggestions" aria-label="Demo property suggestions">
          {matches.map((p) => (
            <li key={p.id}>
              <Link href={`/app/property/${p.id}`}>
                {p.address}
                <small>Demo property — not a real listing</small>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {searched && !matches.length && (
        <p role="status">
          We don&apos;t have this property in the prototype yet.{" "}
          <Link href="/app">Browse the Massachusetts map</Link>.
        </p>
      )}
      <p className="air-fine">
        Free to explore. No account required. Try “Boston” · All sample
        properties are fictional.
      </p>
    </div>
  );
}
