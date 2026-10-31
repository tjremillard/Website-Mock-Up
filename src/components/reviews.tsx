"use client";
import { useState } from "react";
import { services, type ServiceKey, stages } from "@/lib/demo";
import { useDemo } from "@/lib/demo-store";
import { Card, Heading, LinkButton, Progress } from "./ui";
export function ReviewForm({ service }: { service: ServiceKey }) {
  const [state, set] = useDemo();
  const draft = state.draft?.service === service ? state.draft : undefined;
  const [address, setAddress] = useState(draft?.address ?? state.address);
  const [question, setQuestion] = useState(
    draft?.question ||
      "Please review my lease, assess market rent, and identify potential issues and recommended next steps.",
  );
  const [docs, setDocs] = useState(
    draft?.documents ?? state.documents.map((d) => d.id),
  );
  const item = services[service];
  const billing = draft?.billing ?? "annual";
  function save() {
    set((s) => ({
      ...s,
      address: address.trim(),
      draft: {
        service,
        address: address.trim(),
        question,
        documents: docs,
        billing,
      },
    }));
  }
  return (
    <div className="page">
      <a href="#services" className="back">
        ← Services &amp; Pricing
      </a>
      <p className="step-text">
        1 · Property &amp; documents　 2 · Pay &amp; submit　 3 · Track your
        review
      </p>
      <Heading
        eyebrow="One site · One defined scope"
        title={"Start your " + item.name}
      />
      <form
        className="two-col form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          save();
          location.hash = "checkout";
        }}
      >
        <div>
          <label>
            Property address
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <label>
            What would you like WRA to review?
            <textarea
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </label>
          <p className="fine">
            For a Lease Checkup, you don’t need to know what’s wrong. We’ll
            review the available information for potential issues.
          </p>
          <h3>Attach supporting documents</h3>
          {state.documents.map((d) => (
            <label className="document-check" key={d.id}>
              <input
                type="checkbox"
                checked={docs.includes(d.id)}
                onChange={(e) =>
                  setDocs((v) =>
                    e.target.checked
                      ? [...v, d.id]
                      : v.filter((id) => id !== d.id),
                  )
                }
              />
              <span>
                {d.name}
                <small>{d.type} · from property library</small>
              </span>
            </label>
          ))}
          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={() => {
                const id = crypto.randomUUID();
                set((s) => ({
                  ...s,
                  documents: [
                    ...s.documents,
                    {
                      id,
                      name: "Supporting Amendment.pdf",
                      type: "Lease / Amendment",
                    },
                  ],
                }));
                setDocs((v) => [...v, id]);
              }}
            >
              Add sample amendment
            </button>
            <a
              className="button secondary"
              href="#owner/documents"
              onClick={save}
            >
              Open document library
            </a>
          </div>
          <p className="fine scope-note">
            Your review is based on the information provided. Add supporting
            documents after submission at no extra charge for this site and
            scope. One round of clarification about the delivered analysis is
            included.
          </p>
          <div className="actions">
            <button>
              Continue to payment · $
              {service === "scip" && billing === "monthly" ? 49 : item.price}
              {service === "scip"
                ? billing === "annual"
                  ? "/year"
                  : "/month"
                : ""}{" "}
              →
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                save();
                location.hash = "owner/reviews";
              }}
            >
              Save and return to My Properties
            </button>
          </div>
        </div>
        <Card>
          <p className="eyebrow">Your review</p>
          <h2>{item.name}</h2>
          <div className="price">
            ${service === "scip" && billing === "monthly" ? 49 : item.price}
          </div>
          <p className="fine">
            {service === "scip"
              ? `Recurring ${billing} service`
              : "One-time payment at submission"}
          </p>
          <ul className="muted">
            <li>Lease summary</li>
            <li>Market rent assessment</li>
            <li>Potential issues and document references</li>
            <li>Information gaps and next steps</li>
            <li>WRA expert review</li>
          </ul>
          <p className="fine">
            Consultation and negotiation representation are available
            separately.
          </p>
        </Card>
      </form>
    </div>
  );
}
export function Checkout() {
  const [state, set] = useDemo();
  const draft = state.draft;
  if (!draft)
    return (
      <div className="page">
        <Heading
          eyebrow="Your review"
          title="Choose a service to get started"
        />
        <LinkButton to="services">Services &amp; Pricing</LinkButton>
      </div>
    );
  const item = services[draft.service];
  const price =
    draft.service === "scip" && draft.billing === "monthly" ? 49 : item.price;
  return (
    <div className="page">
      <a className="back" href={"#review/" + draft.service}>
        ← Back to {item.name}
      </a>
      <p className="notice">
        Checkout preview · no payment details collected or charges made
      </p>
      <div className="checkout two-col">
        <div>
          <p className="eyebrow">WRA / Order summary</p>
          <h2>{item.name}</h2>
          <div className="price">${price}</div>
          <hr />
          <p className="eyebrow">Property</p>
          <h3>{draft.address}</h3>
          <p className="muted">
            Pay and submit your review now. We work with the information
            provided. Add supporting documents within the original scope at no
            extra charge.
          </p>
          {draft.service === "scip" && (
            <p className="notice">
              ${price}/{draft.billing === "annual" ? "year" : "month"} · recurs{" "}
              {draft.billing === "annual" ? "annually" : "monthly"}. Separate
              ~5% commission if a lease is executed.
            </p>
          )}
          <hr />
          <div className="spread">
            <span>
              {draft.service === "scip"
                ? "Recurring service total"
                : "One-time total"}
            </span>
            <strong>${price}</strong>
          </div>
        </div>
        <Card>
          <div className="stripe">
            stripe <small>checkout preview</small>
          </div>
          <h2>Pay &amp; submit</h2>
          <div className="payment-placeholder">
            Payment details
            <p className="fine">Stripe checkout preview · no card required</p>
          </div>
          <button
            className="full"
            onClick={() => {
              const id = crypto.randomUUID();
              set((s) => ({
                ...s,
                reviews: [...s.reviews, { ...draft, id, stage: 0 }],
                draft: undefined,
              }));
              location.hash = "submitted/" + id;
            }}
          >
            Simulate payment &amp; submit · ${price}
          </button>
          <p className="fine center">Prototype only · no transaction</p>
          <LinkButton to={"review/" + draft.service} secondary>
            Cancel and return to product
          </LinkButton>
        </Card>
      </div>
    </div>
  );
}
export function Submitted({ id }: { id: string }) {
  const [state] = useDemo();
  const review = state.reviews.find((r) => r.id === id);
  return (
    <div className="page">
      <p className="notice">
        Prototype confirmation · no payment was processed
      </p>
      <Card className="confirmation">
        <p className="eyebrow">
          {review ? services[review.service].name : "Review"}
        </p>
        <h1>Your review is submitted.</h1>
        <p>{review?.address}</p>
        <hr />
        <p>Payment simulated</p>
        <Progress stage={0} />
        <p className="muted">
          Your analysis will be reviewed by a WRA industry expert before
          delivery. Supporting documents can be added without a new fee within
          this scope.
        </p>
        <LinkButton to="owner/reviews">Track in My Properties</LinkButton>
      </Card>
    </div>
  );
}
export function Report({ id }: { id: string }) {
  const [state, set] = useDemo();
  const review = state.reviews.find((r) => r.id === id);
  const [source, setSource] = useState(false);
  const [clarification, setClarification] = useState("");
  const [feedback, setFeedback] = useState("");
  if (!review)
    return (
      <div className="page">
        <h1>Review not found in this browser</h1>
        <LinkButton to="owner/reviews">Back to reviews</LinkButton>
      </div>
    );
  if (review.stage < 3)
    return (
      <div className="page">
        <Heading
          eyebrow="Review in progress"
          title="Your review is not complete yet"
        />
        <Progress stage={review.stage} />
        <LinkButton to="owner/reviews">Track in My Properties</LinkButton>
      </div>
    );
  return (
    <div className="page">
      <a href="#owner/reviews" className="back">
        ← Back to reviews
      </a>
      <Heading
        eyebrow="Completed review · Sample report"
        title={services[review.service].name}
      >
        {review.address}
      </Heading>
      <p className="notice">
        Illustrative report structure only. These are sample findings, not an
        analysis of this property or uploaded documents.
      </p>
      <div className="two-col form-grid">
        <div className="stack">
          <Card>
            <span className="badge">WRA review complete · demo</span>
            <h3>Your lease, in plain English</h3>
            <p className="muted">
              Your report summarizes the premises, lease term, escalation
              provisions, and key responsibilities in the documents reviewed.
            </p>
            <button
              className="secondary"
              onClick={() => setSource(!source)}
              aria-expanded={source}
            >
              View sample source reference
            </button>
            {source && (
              <blockquote>
                Sample reference · Original Lease.pdf, §4: “Tenant is
                responsible for separately metered electricity.” This passage is
                fabricated for interface review.
              </blockquote>
            )}
          </Card>
          <Card>
            <h3>Market rent assessment</h3>
            <p className="muted">
              Relevant lease comparables, with differences in site
              characteristics and lease terms explained.
            </p>
            <p className="notice">
              Comparable rent range and property rent would appear here once
              supported by the analysis. No rent estimate is generated in this
              mock-up.
            </p>
          </Card>
          <Card>
            <h3>Potential issues to investigate</h3>
            <p>
              <strong>Premises:</strong> Compare the leased area with available
              construction drawings and site documentation.
            </p>
            <p>
              <strong>Utilities:</strong> Confirm metering and reimbursement
              arrangements against the agreement.
            </p>
            <p>
              <strong>Taxes:</strong> Assess reimbursement provisions and
              supporting records.
            </p>
            <p className="fine">
              Illustrative review topics; no breach or entitlement is
              established here.
            </p>
          </Card>
          <Card>
            <h3>Missing information</h3>
            <p className="muted">
              Example: the current site plan or utility records may be needed to
              resolve an open question. Additional supporting documents can be
              added without a new review fee within the original scope.
            </p>
            <LinkButton to="owner/documents" secondary>
              Add supporting documents
            </LinkButton>
          </Card>
          <Card>
            <h3>Recommended next steps</h3>
            <p className="muted">
              Gather the missing information, clarify unresolved findings, and
              decide whether further discussion or representation would be
              useful.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                set((s) => ({
                  ...s,
                  reviews: s.reviews.map((r) =>
                    r.id === id ? { ...r, clarification } : r,
                  ),
                }));
                setFeedback(
                  "Demo clarification saved. Nothing was sent to WRA.",
                );
              }}
            >
              <label>
                Ask about your findings
                <textarea
                  placeholder="What would you like clarified?"
                  required
                  value={clarification}
                  onChange={(e) => setClarification(e.target.value)}
                />
              </label>
              <p className="fine">One clarification round is included.</p>
              <button className="secondary">
                Preview clarification request
              </button>
            </form>
            {review.clarification && (
              <p className="notice">
                Saved clarification: {review.clarification}
              </p>
            )}
            <p role="status">{feedback}</p>
          </Card>
        </div>
        <Card>
          <p className="eyebrow">Optional next steps</p>
          <h3>Talk through your findings</h3>
          <p className="muted">Expert consultation · 45 minutes</p>
          <div className="small-price">$249</div>
          <p className="fine">Proposed price · separate purchase</p>
          <button
            className="secondary"
            onClick={() =>
              setFeedback(
                "Consultation interest saved for this demo. Booking and payment are not connected.",
              )
            }
          >
            View consultation
          </button>
          <hr />
          <h3>Want us to negotiate?</h3>
          <p className="muted">
            Representation is separately scoped and priced. We’ll assess the
            findings and your goals first.
          </p>
          <button
            className="secondary"
            onClick={() =>
              setFeedback(
                "Representation interest noted in this demo. No agreement or message was sent.",
              )
            }
          >
            Explore representation
          </button>
          <p role="status">{feedback}</p>
        </Card>
      </div>
    </div>
  );
}
export function ReviewList() {
  const [state, set] = useDemo();
  return (
    <div className="stack">
      {state.draft && (
        <Card>
          <h3>Saved draft · {services[state.draft.service].name}</h3>
          <p>{state.draft.address}</p>
          <LinkButton to={"review/" + state.draft.service} secondary>
            Continue saved draft
          </LinkButton>
        </Card>
      )}
      {!state.reviews.length && (
        <Card>
          <h3>Your reviews will appear here</h3>
          <p className="muted">
            Start a review to preview submission, progress, and a completed
            report.
          </p>
          <LinkButton to="review/checkup">
            Start a Lease Checkup · $999
          </LinkButton>
        </Card>
      )}
      {state.reviews.map((r) => (
        <Card key={r.id}>
          <h2>
            {services[r.service].name}{" "}
            <span className="badge">{stages[r.stage]}</span>
          </h2>
          <p className="fine">{r.address} · payment simulated</p>
          <p>{r.question}</p>
          <Progress stage={r.stage} />
          <p className="fine">
            {r.documents.length} supporting documents attached. Add documents
            for this site and scope at no extra charge.
          </p>
          <div className="actions">
            <LinkButton to="owner/documents" secondary>
              Add supporting documents
            </LinkButton>
            {r.stage === 3 ? (
              <LinkButton to={"report/" + r.id}>
                Open reviewed report
              </LinkButton>
            ) : (
              <button
                className="secondary"
                onClick={() =>
                  set((s) => ({
                    ...s,
                    reviews: s.reviews.map((v) =>
                      v.id === r.id
                        ? { ...v, stage: Math.min(3, v.stage + 1) }
                        : v,
                    ),
                  }))
                }
              >
                Preview next stage: {stages[r.stage + 1]}
              </button>
            )}
          </div>
          <p className="fine">
            Prototype controls · stages are advanced manually, no analysis is
            performed.
          </p>
        </Card>
      ))}
    </div>
  );
}
