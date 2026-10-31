"use client";
import { useState } from "react";
import { useDemo } from "@/lib/demo-store";
import { Heading, LinkButton } from "./ui";
export function Explore({ map = false }: { map?: boolean }) {
  const [state, set] = useDemo();
  const [address, setAddress] = useState(
    state.address === "123 Main Street" ? "" : state.address,
  );
  const [layers, setLayers] = useState([true, true, true]);
  if (!map)
    return (
      <section className="landing">
        <p className="eyebrow">Your property. A clearer picture.</p>
        <h1>
          What’s possible
          <br />
          at your property?
        </h1>
        <p className="muted">
          Enter an address to explore nearby wireless infrastructure and
          available property services.
        </p>
        <form
          className="address-search"
          onSubmit={(e) => {
            e.preventDefault();
            set((s) => ({ ...s, address: address.trim() }));
            location.hash = "map";
          }}
        >
          <label className="sr-only" htmlFor="address">
            Enter your property address
          </label>
          <input
            id="address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your property address"
          />
          <button>Explore property →</button>
        </form>
        <a
          href="#map"
          onClick={() =>
            set((s) => ({ ...s, address: "9 Summer St, Franklin, MA" }))
          }
        >
          Try a sample property
        </a>
        <div className="steps">
          <span>01　Find your property</span>
          <span>02　Explore the area</span>
          <span>03　Choose a product</span>
        </div>
        <p className="fine">Interactive concept · illustrative content only</p>
      </section>
    );
  return (
    <>
      <div className="property-bar">
        <div>
          <p className="eyebrow">Your property</p>
          <strong>{state.address}</strong>
          <p className="fine">
            Sample map for interface preview · not a geocoded result
          </p>
        </div>
        <LinkButton to="explore" secondary>
          Change address
        </LinkButton>
      </div>
      <div className="map-layout">
        <aside>
          <Heading eyebrow="Products" title="What’s your goal?" />
          <LinkButton to="product/relocation" secondary>
            Relocation Analysis
            <br />
            <small>Existing Wireless Sites Only · $499 →</small>
          </LinkButton>
          <LinkButton to="product/scip" secondary>
            SCIP Marketing
            <br />
            <small>Recurring property marketing · from $499/year →</small>
          </LinkButton>
          <hr />
          <p className="eyebrow">Map layers</p>
          {[
            "FCC Database",
            "Proprietary Cell Site Structures",
            "Deadzone Complaints",
          ].map((l, i) => (
            <label className="check" key={l}>
              <input
                type="checkbox"
                checked={layers[i]}
                onChange={() =>
                  setLayers((v) => v.map((x, j) => (j === i ? !x : x)))
                }
              />
              <span className={"legend layer-" + i}>●</span>
              {l}
            </label>
          ))}
          <p className="fine">
            Explore these sample layers with either product.
          </p>
        </aside>
        <div
          className="map-canvas"
          role="region"
          aria-label="Illustrative property map with toggleable sample infrastructure markers"
        >
          {layers.map(
            (on, i) =>
              on &&
              [0, 1].map((n) => (
                <span
                  key={i + "-" + n}
                  className={"map-marker layer-" + i}
                  style={{
                    left: `${18 + i * 21 + n * 13}%`,
                    top: `${20 + n * 27 + i * 6}%`,
                  }}
                >
                  {i === 0 ? "●" : i === 1 ? "◆" : "▲"}
                </span>
              )),
          )}
          <span className="map-note">
            Map placeholder · sample markers only
          </span>
          <span className="map-property">⌖ Your property</span>
          <div className="map-card">
            <p className="eyebrow">Property explorer</p>
            <h3>Lease Checkup</h3>
            <p className="fine">
              Explore the layers, or visit Services &amp; Pricing for
              expert-reviewed site assessments.
            </p>
            <LinkButton to="services" secondary>
              Explore services →
            </LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}
