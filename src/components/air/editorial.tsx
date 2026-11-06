"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { articles } from "@/data/air";
import type { IntelligenceArticle } from "@/lib/air/types";
import { trackEvent } from "@/lib/air/analytics";
export function ArticleCards({
  items = articles.slice(0, 3),
}: {
  items?: IntelligenceArticle[];
}) {
  return (
    <div className="air-card-grid">
      {items.map((a, i) => (
        <Link
          className="air-editorial"
          key={a.id}
          href={`/intelligence/${a.slug}`}
        >
          <div className={`air-editorial-art art-${i % 3}`} aria-hidden="true">
            <svg
              viewBox="0 0 64 64"
              className="air-editorial-icon"
              aria-hidden="true"
            >
              {i % 3 === 0 ? (
                <>
                  <path d="M12 50L50 12M16 12H50V46" />
                  <circle cx="30" cy="32" r="22" />
                </>
              ) : i % 3 === 1 ? (
                <>
                  <path d="M32 54V24M24 54H40M20 18a18 18 0 0 1 24 0M12 10a30 30 0 0 1 40 0" />
                  <circle cx="32" cy="22" r="3" />
                </>
              ) : (
                <>
                  <path d="M10 54V20L32 10 54 20V54ZM10 30H54M22 25V54M34 25V54M46 25V54" />
                </>
              )}
            </svg>
            <span>FIELD NOTES / {String(i + 1).padStart(2, "0")}</span>
          </div>
          <div className="air-card-body">
            <p className="air-eyebrow">{a.type} · Demo content</p>
            <h3>{a.title}</h3>
            <p>{a.dek}</p>
            <span className="air-read">
              Read perspective <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function IntelligenceFeed() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const found = articles.filter(
    (a) =>
      (type === "all" || a.type === type) &&
      `${a.title} ${a.dek}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <div className="air-filter-bar">
        <label>
          Search intelligence
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search wireless topics"
          />
        </label>
        <label>
          Geography
          <select defaultValue="Massachusetts">
            <option>Massachusetts</option>
          </select>
        </label>
        <label>
          Content type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All content</option>
            <option value="analysis">AIR Analysis</option>
            <option value="brief">News Brief</option>
          </select>
        </label>
      </div>
      <p className="air-fine">
        {found.length} sample articles · Wireless · Demo content · November 6,
        2026
      </p>
      {found.length ? (
        <ArticleCards items={found} />
      ) : (
        <p role="status">
          No articles match. Try another topic or content type.
        </p>
      )}
    </>
  );
}
export function ViewEvent({
  event,
  id,
}: {
  event:
    "homepage_view" | "article_opened" | "scip_previewed" | "property_selected";
  id?: string;
}) {
  useEffect(() => trackEvent(event, { id }), [event, id]);
  return null;
}
