"use client";
import { useState } from "react";
import { useDemo } from "@/lib/demo-store";
import {
  generatePrototypeScores,
  type FeasibilityScore,
} from "@/lib/feasibility";
import { LinkButton } from "./ui";

function FeasibilityDial({ category, percentage }: FeasibilityScore) {
  // HSL hue interpolates continuously from red through yellow to green.
  const color = `hsl(${percentage * 1.2}, 72%, 42%)`;
  return (
    <article className="feasibility-card">
      <div
        className="feasibility-dial"
        role="meter"
        aria-label={category}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="dial-track" cx="60" cy="60" r="50" />
          <circle
            cx="60"
            cy="60"
            r="50"
            pathLength="100"
            stroke={color}
            strokeDasharray={`${percentage} 100`}
          />
        </svg>
        <strong aria-hidden="true">{percentage}%</strong>
      </div>
      <h2>{category}</h2>
    </article>
  );
}

export function Explore() {
  const [state, set] = useDemo();
  const [address, setAddress] = useState(
    state.address === "123 Main Street" ? "" : state.address,
  );
  const [result, setResult] = useState<{
    address: string;
    scores: FeasibilityScore[];
    submission: number;
  } | null>(null);
  return (
    <>
      <section className={result ? "page explore-search" : "landing"}>
        <p className="eyebrow">Your property. A clearer picture.</p>
        <h1>
          What’s possible
          <br />
          at your property?
        </h1>
        <p className="muted">
          Enter an address to receive our Easement Marketing Feasibility
          Analysis.
        </p>
        <form
          className="address-search"
          onSubmit={(e) => {
            e.preventDefault();
            const submittedAddress = address.trim();
            if (!submittedAddress) return;
            const scores = generatePrototypeScores();
            setResult((previous) => ({
              address: submittedAddress,
              scores,
              submission: (previous?.submission ?? 0) + 1,
            }));
            set((s) => ({ ...s, address: submittedAddress }));
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
          <button type="submit">Explore Property</button>
        </form>
        {!result && (
          <>
            <div className="steps">
              <span>01　Find your property</span>
              <span>02　Preview tenant interest</span>
              <span>03　Explore marketing services</span>
            </div>
            <p className="fine">
              Complimentary feasibility preview · no registration required
            </p>
          </>
        )}
      </section>
      {result && (
        <section
          className="page feasibility-results"
          aria-label="Feasibility preview"
        >
          <div aria-live="polite" aria-atomic="true">
            <p className="eyebrow">Your property</p>
            <h2 className="submitted-address">{result.address}</h2>
            <p>
              These scores indicate your property’s potential to attract
              interest from infrastructure tenants.
            </p>
            <div className="feasibility-grid" key={result.submission}>
              {result.scores.map((score) => (
                <FeasibilityDial key={score.category} {...score} />
              ))}
            </div>
          </div>
          <p className="feasibility-scale">
            0% · Low interest <span>50% · Moderate interest</span> 100% · High
            interest
          </p>
          <p className="fine prototype-score-notice">
            Prototype preview: these scores are randomly generated for
            demonstration purposes.
          </p>
          <div className="feasibility-cta">
            <LinkButton to="owner/pricing">
              Subscribe to get the full report and receive Easement Real
              Estate’s Marketing Services!
            </LinkButton>
          </div>
        </section>
      )}
    </>
  );
}
