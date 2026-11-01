"use client";
import { useState } from "react";
import {
  developerTypes,
  type DeveloperType,
  type DeveloperProperty,
  type BuildingType,
} from "@/lib/developer-catalog";

export function CommercialBuildingArt({ type }: { type: BuildingType }) {
  const warehouse = type === "Warehouse";
  const office = type === "Office";
  return (
    <div
      className={`commercial-building ${warehouse ? "warehouse" : office ? "office" : "residential"}`}
      role="img"
      aria-label={`Illustration of a sample ${type.toLowerCase()} building`}
    >
      <svg viewBox="0 0 400 210" aria-hidden="true">
        <rect width="400" height="210" fill="#dce9ec" />
        <circle cx="325" cy="38" r="22" fill="#faf5dd" />
        <path d="M0 150H400V210H0Z" fill="#c7d4bd" />
        <path d="M0 190H400V210H0Z" fill="#b7c1be" />
        <path
          d={
            warehouse
              ? "M35 92L305 70L370 98V184H35Z"
              : "M65 53L275 35L342 63V184H65Z"
          }
          fill={office ? "#71929c" : "#b5a48c"}
        />
        <path
          d={warehouse ? "M305 70L370 98V184H305Z" : "M275 35L342 63V184H275Z"}
          fill="#7e8985"
        />
        <path
          d={
            warehouse
              ? "M35 92L305 70L370 98L100 118Z"
              : "M65 53L275 35L342 63L132 81Z"
          }
          fill="#e3e5de"
        />
        {(warehouse ? [0] : [0, 1, 2]).map((row) =>
          [0, 1, 2, 3, 4, 5].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={warehouse ? 52 + col * 39 : 80 + col * 31}
              y={warehouse ? 123 : 85 + row * 28}
              width={warehouse ? 24 : 18}
              height="17"
              fill="#d7e8e9"
              stroke="#647e85"
              strokeWidth="2"
            />
          )),
        )}
        {warehouse ? (
          [0, 1, 2].map((i) => (
            <rect
              key={i}
              x={55 + i * 77}
              y="150"
              width="56"
              height="34"
              fill="#e1e3df"
              stroke="#798984"
            />
          ))
        ) : (
          <rect x="160" y="155" width="28" height="29" fill="#465f63" />
        )}
        {type === "Mixed-use" && (
          <>
            <path d="M65 149H275V157H65Z" fill="#24553f" />
            <path d="M80 160H140V184H80ZM205 160H260V184H205Z" fill="#d7e8e9" />
          </>
        )}
        <path d="M15 184H385" stroke="#657c70" strokeWidth="3" />
        {[28, 365].map((x) => (
          <g key={x}>
            <path d={`M${x} 179V137`} stroke="#6e7d68" strokeWidth="4" />
            <circle cx={x} cy="136" r="17" fill="#7c9c80" />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function DeveloperMap({
  type,
  properties,
  selected,
  onSelect,
}: {
  type: DeveloperType;
  properties: DeveloperProperty[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const config = developerTypes[type];
  const [enabled, setEnabled] = useState<string[]>([...config.layers]);
  return (
    <section
      className="developer-map-section"
      aria-label={`${config.label} sample map`}
    >
      <div className="developer-map-heading">
        <div>
          <p className="eyebrow">Sample market · Greater Boston</p>
          <h2>Infrastructure &amp; available properties</h2>
        </div>
        <span className="badge">Illustrative map</span>
      </div>
      <div className="developer-map-canvas">
        <svg
          viewBox="0 0 900 330"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect width="900" height="330" fill="#e9ede7" />
          <path
            d="M700 -20Q580 100 740 190T690 360"
            fill="none"
            stroke="#c4dce3"
            strokeWidth="55"
          />
          {[70, 200, 330, 460, 590, 820].map((x) => (
            <path
              key={x}
              d={`M${x} 0L${x - 80} 330`}
              stroke="white"
              strokeWidth="12"
            />
          ))}
          {[65, 160, 260].map((y) => (
            <path
              key={y}
              d={`M0 ${y}L900 ${y - 30}`}
              stroke="white"
              strokeWidth="15"
            />
          ))}
          <path d="M0 310L900 40" stroke="#d5d8cf" strokeWidth="28" />
          <path d="M0 310L900 40" stroke="#fff9e6" strokeWidth="19" />
          <rect x="310" y="65" width="90" height="52" rx="8" fill="#c9daba" />
        </svg>
        <span className="sample-map-label">FRANKLIN / SAMPLE MARKET</span>
        {config.layers.map(
          (layer, index) =>
            enabled.includes(layer) &&
            [0, 1, 2].map((n) => (
              <span
                key={`${layer}-${n}`}
                className={`infrastructure-marker infrastructure-marker-${index}`}
                style={{
                  left: `${12 + n * 28 + index * 7}%`,
                  top: `${20 + index * 19 + n * 8}%`,
                }}
                role="img"
                aria-label={`${layer} sample marker`}
                title={`${layer} · sample`}
              >
                {index === 0 ? "◆" : index === 1 ? "●" : "▲"}
              </span>
            )),
        )}
        {properties.map((property, index) => (
          <button
            key={property.id}
            className={`developer-property-pin ${selected === property.id ? "selected" : ""}`}
            style={{
              left: `${20 + (index % 3) * 27}%`,
              top: `${45 + Math.floor(index / 3) * 27}%`,
            }}
            aria-label={`View ${property.address} on map`}
            aria-pressed={selected === property.id}
            onClick={() => onSelect(property.id)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <fieldset className="developer-map-layers">
        <legend>Map layers · {config.label}</legend>
        {config.layers.map((layer, index) => (
          <label className="check" key={layer}>
            <input
              type="checkbox"
              checked={enabled.includes(layer)}
              onChange={() =>
                setEnabled((current) =>
                  current.includes(layer)
                    ? current.filter((item) => item !== layer)
                    : [...current, layer],
                )
              }
            />
            <span
              className={`infrastructure-key infrastructure-marker-${index}`}
              aria-hidden="true"
            >
              {index === 0 ? "◆" : index === 1 ? "●" : "▲"}
            </span>
            {layer}
          </label>
        ))}
      </fieldset>
      <p className="fine">
        Prototype preview: all properties, infrastructure markers, locations,
        and attributes are fabricated samples. No live map or dataset is
        connected.
      </p>
    </section>
  );
}
