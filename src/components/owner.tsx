"use client";
import { useState } from "react";
import { useDemo } from "@/lib/demo-store";
import { Card, Heading, LinkButton } from "./ui";
import { ReviewList } from "./reviews";
const types = [
  "Lease / Amendment",
  "Construction Drawing / Construction Plan",
  "Letter of Consent / Letter of Authorization",
  "Rent Reduction Request",
  "Other Carrier Outreach",
];
export function Owner({ tab = "overview" }: { tab?: string }) {
  const [state, set] = useDemo();
  const [community, setCommunity] = useState(false);
  const [type, setType] = useState(types[0]);
  const [preview, setPreview] = useState("");
  const [notice, setNotice] = useState("");
  return (
    <div className="page">
      <div className="spread">
        <Heading eyebrow="Owner workspace" title="Owner Portal">
          My Properties · documents, opportunities, and leases in one place.
        </Heading>
        <LinkButton to="services" secondary>
          Explore services
        </LinkButton>
      </div>
      <Card className="spread">
        <div>
          <p className="eyebrow">Selected property</p>
          <h2>{state.address}</h2>
          <p className="fine">Documents, reviews, and services in one place</p>
        </div>
        <LinkButton to="review/checkup">
          Start a Lease Checkup · $999
        </LinkButton>
      </Card>
      <nav className="tabs" aria-label="Owner workspace">
        {[
          ["overview", "Overview"],
          ["documents", "Documents"],
          ["reviews", "Reviews"],
          ["services", "Services"],
        ].map(([k, l]) => (
          <a
            key={k}
            className={tab === k ? "active" : ""}
            aria-current={tab === k ? "page" : undefined}
            href={"#owner/" + (k === "overview" ? "workspace" : k)}
          >
            {l}
          </a>
        ))}
      </nav>
      {tab === "overview" && (
        <>
          <div className="two-col">
            <Card>
              <p className="eyebrow">New leasing opportunities</p>
              <h2>123 Main Street</h2>
              <div className="opportunity">
                <span className="status-dot" />
                <div>
                  <h3>New interest from Community Solar Developer</h3>
                  <p className="muted">
                    A sample opportunity to explore solar infrastructure at your
                    property.
                  </p>
                  <button
                    className="text-button"
                    onClick={() => setCommunity(!community)}
                    aria-expanded={community}
                  >
                    Learn more about Community Solar →
                  </button>
                  {community && (
                    <div className="notice">
                      <h3>What is community solar?</h3>
                      <p>
                        A shared solar project can supply electricity credits to
                        participating subscribers. A developer may lease
                        suitable rooftop or land area from an owner.
                      </p>
                      <p>
                        Feasibility depends on site conditions, utility rules,
                        grid capacity, and local approvals. This sample interest
                        is not an offer or feasibility finding.
                      </p>
                    </div>
                  )}
                  <button
                    className="secondary"
                    disabled={state.interests.includes("solar")}
                    onClick={() =>
                      set((s) => ({
                        ...s,
                        interests: [...s.interests, "solar"],
                      }))
                    }
                  >
                    {state.interests.includes("solar")
                      ? "Interest saved in demo"
                      : "Express interest · demo"}
                  </button>
                </div>
              </div>
              <div className="opportunity">
                <span className="status-dot" />
                <div>
                  <h3>New interest from Starlink</h3>
                  <p className="muted">
                    Illustrative provider interest · no affiliation or actual
                    inquiry.
                  </p>
                  <button
                    className="secondary"
                    disabled={state.interests.includes("starlink")}
                    onClick={() =>
                      set((s) => ({
                        ...s,
                        interests: [...s.interests, "starlink"],
                      }))
                    }
                  >
                    {state.interests.includes("starlink")
                      ? "Interest saved in demo"
                      : "Express interest · demo"}
                  </button>
                </div>
              </div>
            </Card>
            <Card>
              <p className="eyebrow">Manage existing infrastructure leases</p>
              <h2>123 Main Street</h2>
              <span className="badge amber">Upcoming milestone</span>
              <h3>T-Mobile escalation coming up</h3>
              <p className="muted">
                Review the escalation provision in your lease and confirm the
                next rent adjustment with your tenant.
              </p>
              <p className="fine">
                Sample reminder · no escalation date or amount has been
                verified.
              </p>
              <div className="actions">
                <LinkButton to="owner/documents" secondary>
                  Review lease documents
                </LinkButton>
                <LinkButton to="review/question" secondary>
                  Ask WRA a question
                </LinkButton>
              </div>
            </Card>
          </div>
          <Card className="marketing-strip">
            <div>
              <p className="eyebrow">A clearer picture</p>
              <h2>Understand the lease you already have.</h2>
              <p className="muted">
                Start with your documents. Get a review when you’re ready.
              </p>
            </div>
            <LinkButton to="owner/documents" secondary>
              Open document library →
            </LinkButton>
          </Card>
        </>
      )}
      {tab === "documents" && (
        <div className="two-col form-grid">
          <div>
            <h2>Property document library</h2>
            <p className="muted">
              Add documents before purchasing. Attach them to a review whenever
              you’re ready.
            </p>
            {state.documents.map((d) => (
              <div className="document-row" key={d.id}>
                <div>
                  <strong>{d.name}</strong>
                  <small>{d.type} · Sample document</small>
                </div>
                <button
                  className="secondary"
                  onClick={() => setPreview(preview === d.id ? "" : d.id)}
                >
                  Preview {d.name}
                </button>
                {preview === d.id && (
                  <blockquote>
                    Sample document preview: {d.name}. This is an illustrative
                    placeholder; no real lease file is stored or analyzed.
                  </blockquote>
                )}
              </div>
            ))}
          </div>
          <Card>
            <h3>Add a document</h3>
            <div className="notice">
              <label>
                Document type
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  {types.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <button
                className="secondary"
                onClick={() => {
                  const id = crypto.randomUUID();
                  set((s) => ({
                    ...s,
                    documents: [
                      ...s.documents,
                      {
                        id,
                        name: `Sample ${type.split(" / ")[0]} ${s.documents.length + 1}.pdf`,
                        type,
                      },
                    ],
                    reviews: s.reviews.map((r) =>
                      r.address === s.address
                        ? { ...r, documents: [...r.documents, id] }
                        : r,
                    ),
                  }));
                  setNotice(
                    "Sample document added. Attached to existing reviews for this property at no extra charge.",
                  );
                }}
              >
                Add sample document
              </button>
              <p className="fine">
                Demo files only. No real documents are uploaded.
              </p>
              <p role="status">{notice}</p>
            </div>
          </Card>
        </div>
      )}
      {tab === "reviews" && <ReviewList />}
      {tab === "services" && (
        <Card>
          <h2>Property services</h2>
          <p className="muted">
            SCIP Marketing is available as a recurring service. Your submitted
            sample orders appear under Reviews.
          </p>
          <LinkButton to="product/scip">Explore SCIP Marketing</LinkButton>
        </Card>
      )}
    </div>
  );
}
