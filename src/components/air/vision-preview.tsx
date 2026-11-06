"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import { visionCatalog, verticalNames } from "@/data/air";
import { filterMarket } from "@/lib/air/selectors";
import type { Vertical } from "@/lib/air/types";
const Map = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => (
    <div className="air-map-loading" role="status">
      Loading national schematic…
    </div>
  ),
});
export function VisionMapPreview() {
  const [market, setMarket] = useState<Vertical>("wireless");
  const [geography, setGeography] = useState("US");
  const [selected, setSelected] = useState<string>();
  const records = filterMarket(visionCatalog, market, geography);
  const property = records.find((r) => r.property.id === selected)?.property;
  return (
    <section
      className="air-national-preview"
      aria-label="National vision preview"
    >
      <div className="air-preview-filters">
        <label>
          Preview market
          <select
            value={market}
            onChange={(e) => {
              setMarket(e.target.value as Vertical);
              setSelected(undefined);
            }}
          >
            {Object.entries(verticalNames).map(([key, label]) => (
              <option value={key} key={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Preview geography
          <select
            value={geography}
            onChange={(e) => {
              setGeography(e.target.value);
              setSelected(undefined);
            }}
          >
            {[
              "US",
              "Massachusetts",
              "Pennsylvania",
              "New York",
              "California",
              "Texas",
            ].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="air-fine">
        National future vision · {records.length} synthetic properties
      </p>
      <Map
        national
        items={records.map((r) => r.property)}
        onSelect={setSelected}
        selected={selected}
      />
      <p className="air-fine">
        {property
          ? `${property.address} · Unknown ownership · No validated opportunity model`
          : "Select an illustrative property to inspect its context."}
      </p>
      <Link
        className="air-text-link"
        href={`/vision/app/explore?market=${market}&geography=${encodeURIComponent(geography)}${selected ? `&property=${selected}` : ""}`}
      >
        Open this view in Vision App →
      </Link>
    </section>
  );
}
