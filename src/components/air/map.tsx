"use client";
import type { Property, InfrastructureSite } from "@/lib/air/types";
export default function SchematicMap({
  items,
  sites = [],
  selected,
  onSelect,
  national = false,
  focus,
}: {
  items: Property[];
  sites?: InfrastructureSite[];
  selected?: string;
  onSelect: (id: string) => void;
  national?: boolean;
  focus?: { lat: number; lng: number; label: string };
}) {
  const bounds = national ? [-126, -66, 24, 50] : [-73.5, -69.8, 41.15, 43.05];
  function position(p: { lat: number; lng: number }) {
    return {
      left: `${8 + (84 * (p.lng - bounds[0])) / (bounds[1] - bounds[0])}%`,
      top: `${8 + (76 * (bounds[3] - p.lat)) / (bounds[3] - bounds[2])}%`,
    };
  }
  return (
    <div
      className={`air-interactive-map${national ? " national" : ""}`}
      aria-label={
        national ? "National schematic map" : "Massachusetts schematic map"
      }
    >
      <div className="air-map-grid" />
      <svg viewBox="0 0 800 600" preserveAspectRatio="none" aria-hidden="true">
        {national ? (
          <path d="M65 115L175 145 250 150 330 140 425 150 500 125 570 140 630 105 720 115 700 190 620 240 600 280 570 315 560 400 530 440 495 350 400 355 350 450 320 410 300 350 200 330 125 285 90 230Z" />
        ) : (
          <>
            <path d="M65 190L475 180 490 230 550 280 568 322 544 350 610 400 650 370 680 393 717 350 735 370 713 431 675 447 625 431 574 465 535 407 480 425 448 379 410 396 370 363 65 370Z" />
            <path
              className="roads"
              d="M80 315L240 290 370 320 460 260 550 310M370 320L350 200M460 260L430 400"
            />
          </>
        )}
      </svg>
      <span className="air-map-place place-one">
        {national ? "WESTERN US" : "WESTERN MASSACHUSETTS"}
      </span>
      <span className="air-map-place place-two">
        {national ? "NORTHEAST" : "GREATER BOSTON"}
      </span>
      {sites.map((s) => (
        <span
          key={s.id}
          style={position(s)}
          className={`air-infra-pin ${s.status !== "operational" ? "proposed" : ""}`}
          title={`${s.label} · Synthetic · ${s.status}`}
        >
          <span className="sr-only">
            {s.label}: {s.status}, synthetic
          </span>
        </span>
      ))}
      {items.map((p, i) => (
        <button
          key={p.id}
          className={`air-property-pin${selected === p.id ? " selected" : ""}`}
          style={position(p)}
          aria-label={`Select ${p.address}`}
          aria-pressed={selected === p.id}
          onClick={() => onSelect(p.id)}
        >
          <span>{i + 1}</span>
        </button>
      ))}
      {focus && (
        <div className="air-focus-pin" style={position(focus)}>
          <span aria-hidden="true">◎</span>
          <span>{focus.label} · Synthetic activity</span>
        </div>
      )}
      <div className="air-map-notice">
        Schematic fallback · Synthetic coordinates
        <br />
        No live map tiles or carrier locations
      </div>
      <div className="air-map-legend">
        <span>
          <i className="parcel" />
          Properties
        </span>
        <span>
          <i />
          {national ? "Infrastructure activity*" : "Existing wireless*"}
        </span>
        <span>
          <i className="proposed" />
          Proposed signals*
        </span>
        <span>
          <i className="listed" />
          Owner-listed (none)
        </span>
        <small>*Illustrative infrastructure only</small>
      </div>
    </div>
  );
}
