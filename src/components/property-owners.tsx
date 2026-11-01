"use client";
import { useState } from "react";
import { useDemo } from "@/lib/demo-store";
import { generatePrototypeScores } from "@/lib/feasibility";
import { Card, Heading, LinkButton } from "./ui";
import { Account } from "./account";

export function PropertyOwners() {
  const [state] = useDemo();
  return (
    <div className="page owner-services-page">
      <Heading
        eyebrow="Property Owners"
        title="Put your property’s potential to work."
      >
        Explore your portfolio’s potential, then choose the marketing service
        that fits.
      </Heading>
      <div className="owner-services-toolbar">
        <LinkButton
          to={state.ownerSignedIn ? "owner/analyses" : "account/owner"}
          secondary
        >
          {state.ownerSignedIn ? "Saved analyses" : "Create a Free Account"}
        </LinkButton>
        <a href="#owner/workspace">Owner workspace</a>
      </div>
      {state.ownerSignedIn && state.ownerPlan && (
        <p className="notice" role="status">
          Your service selection is saved for this prototype. No subscription
          has been activated or payment collected.
        </p>
      )}
      <section aria-labelledby="owner-services-title">
        <h2 id="owner-services-title">Services</h2>
        <div className="owner-plan-grid">
          <Card>
            <h3>Free</h3>
            <p className="owner-plan-price">Complimentary</p>
            <p>
              Receive a complimentary Easement Marketing Feasibility Analysis
              for your entire portfolio to understand if there&apos;s
              opportunity to lease your unused space in your building or parcel
              to an easement-based real estate tenant.
            </p>
            <LinkButton
              to={state.ownerSignedIn ? "owner/analyses" : "account/owner"}
              secondary
            >
              Get started for free
            </LinkButton>
          </Card>
          <Card>
            <h3>Baseline</h3>
            <p className="owner-plan-price">
              $499<span>/year</span>
            </p>
            <p>One property marketed.</p>
            <LinkButton to="account/owner/baseline" secondary>
              Choose Baseline
            </LinkButton>
          </Card>
          <Card>
            <h3>Mid-Market</h3>
            <p className="owner-plan-price">
              $499<span>/year</span>
            </p>
            <p>2–9 properties marketed.</p>
            <p>+ $99/year for every additional property.</p>
            <LinkButton to="account/owner/mid-market" secondary>
              Choose Mid-Market
            </LinkButton>
          </Card>
          <Card className="recommended-plan">
            <span className="badge">Recommended</span>
            <h3>Portfolio Marketing</h3>
            <p className="owner-plan-price">
              $499<span>/year</span>
            </p>
            <p>+ $49/year for every additional property.</p>
            <LinkButton to="account/owner/portfolio">
              Choose Portfolio Marketing
            </LinkButton>
          </Card>
        </div>
      </section>
      <p className="fine">
        Prototype service selection only · no checkout or payments.
        Complimentary feasibility previews use random demonstration scores, not
        real assessments.
      </p>
    </div>
  );
}

export function OwnerAnalyses() {
  const [state, set] = useDemo();
  const [addresses, setAddresses] = useState("");
  const [error, setError] = useState("");
  if (!state.ownerSignedIn) return <Account audience="owner" />;
  return (
    <div className="page owner-services-page">
      <Heading
        eyebrow="Property Owners · Free"
        title="Your complimentary feasibility analyses"
      >
        {`Welcome, ${state.ownerAccount?.name ?? "property owner"}. Review saved previews and explore your entire portfolio.`}
      </Heading>
      <div className="owner-services-toolbar">
        <LinkButton to="owner/pricing" secondary>
          Marketing services
        </LinkButton>
        <button
          className="secondary"
          onClick={() => {
            set((s) => ({ ...s, ownerSignedIn: false }));
            location.hash = "account/owner/login";
          }}
        >
          Log out of demo
        </button>
      </div>
      <Card>
        <h2>Explore your portfolio</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const list = [
              ...new Set(
                addresses
                  .split("\n")
                  .map((value) => value.trim())
                  .filter(Boolean),
              ),
            ];
            if (!list.length) {
              setError("Enter at least one property address.");
              return;
            }
            const previews = list.map((address, index) => ({
              address,
              scores: generatePrototypeScores(),
              submission: index + 1,
            }));
            set((s) => ({
              ...s,
              savedAnalyses: [
                ...(s.savedAnalyses ?? []).filter(
                  (item) => !list.includes(item.address),
                ),
                ...previews,
              ],
            }));
            setAddresses("");
            setError("");
          }}
        >
          <label>
            Property addresses · one per line
            <textarea
              required
              value={addresses}
              onChange={(e) => setAddresses(e.target.value)}
              placeholder={"123 Main Street\n25 Commerce Avenue"}
            />
          </label>
          {error && <p role="alert">{error}</p>}
          <button>Preview portfolio feasibility</button>
        </form>
      </Card>
      <p className="fine">
        Prototype preview: these scores are randomly generated for demonstration
        purposes. Previews are saved only in this browser; no real assessment
        has occurred.
      </p>
      <h2>Saved analyses</h2>
      <div className="stack" aria-live="polite">
        {!state.savedAnalyses?.length && (
          <p>
            No analyses saved yet. Enter your portfolio addresses above, or save
            a preview from Explore.
          </p>
        )}
        {state.savedAnalyses?.map((analysis) => (
          <Card key={analysis.address} className="saved-analysis">
            <h3>{analysis.address}</h3>
            <dl className="saved-score-grid">
              {analysis.scores.map((score) => (
                <div key={score.category}>
                  <dt>{score.category}</dt>
                  <dd>{score.percentage}%</dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
    </div>
  );
}
