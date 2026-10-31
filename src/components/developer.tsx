"use client";
import { useState } from "react";
import { properties, matches, type Criteria } from "@/lib/demo";
import { useDemo } from "@/lib/demo-store";
import { Card, Heading, LinkButton, PropertyArt } from "./ui";
export function CriteriaFields({
  value,
  onChange,
}: {
  value: Criteria;
  onChange: (v: Criteria) => void;
}) {
  return (
    <>
      <label>
        Minimum rooftop size (sq ft)
        <input
          type="number"
          min="0"
          value={value.roof}
          onChange={(e) => onChange({ ...value, roof: e.target.value })}
          placeholder="Any size"
        />
      </label>
      <label>
        Maximum distance to fiber (feet)
        <input
          type="number"
          min="0"
          value={value.fiber}
          onChange={(e) => onChange({ ...value, fiber: e.target.value })}
          placeholder="Any distance"
        />
      </label>
      <label>
        Maximum distance to utilities (feet)
        <input
          type="number"
          min="0"
          value={value.utilities}
          onChange={(e) => onChange({ ...value, utilities: e.target.value })}
          placeholder="Any distance"
        />
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={value.grid}
          onChange={(e) => onChange({ ...value, grid: e.target.checked })}
        />
        Require access to the grid
      </label>
    </>
  );
}
export function Account() {
  const [state, set] = useDemo();
  const [name, setName] = useState(state.account?.name ?? "");
  const [users, setUsers] = useState(state.account?.users ?? "1");
  const [criteria, setCriteria] = useState(
    state.account?.criteria ?? state.criteria,
  );
  return (
    <div className="page">
      <a className="back" href="#developer">
        ← Infrastructure Developer Portal
      </a>
      <Heading eyebrow="Infrastructure developers" title="Create your account">
        Tell us about your team and the properties you’re looking for.
      </Heading>
      <div className="two-col form-grid">
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              set((s) => ({
                ...s,
                account: { name: name.trim(), users, criteria },
                criteria,
              }));
              location.hash = "developer";
            }}
          >
            <label>
              Name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </label>
            <label>
              Users on your team
              <input
                type="number"
                min="1"
                max="1000"
                required
                value={users}
                onChange={(e) => setUsers(e.target.value)}
              />
            </label>
            <h2>Property criteria</h2>
            <CriteriaFields value={criteria} onChange={setCriteria} />
            <button className="full">
              {state.account ? "Save demo account" : "Create demo account"} →
            </button>
            <p className="fine">
              Saved in this browser only. This creates a demo profile, not a
              secure login or real team accounts. Do not enter sensitive
              information.
            </p>
          </form>
        </Card>
        <Card>
          <p className="eyebrow">Built around your next site</p>
          <h2>Find properties that fit.</h2>
          <p className="muted">
            Match your requirements to sample properties and request an
            introduction through the platform.
          </p>
          <hr />
          <h3>Friendly owners · free</h3>
          <p className="muted">
            Initial outreach is facilitated through the platform.
          </p>
          <h3>Entire ESO database · paid</h3>
          <p className="muted">
            Pricing to be determined. Explore a simulated expanded catalog in
            this prototype.
          </p>
        </Card>
      </div>
    </div>
  );
}
export function Developer({ tab = "featured" }: { tab?: string }) {
  const [state, set] = useDemo();
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const visible = properties.filter(
    (p) =>
      (state.access === "entire" || p.friendly) && matches(p, state.criteria),
  );
  const property = properties.find((p) => p.id === selected);
  return (
    <div className="page">
      <div className="spread">
        <Heading
          eyebrow="Infrastructure workspace"
          title="Infrastructure Developer Portal"
        >
          {state.account
            ? `Welcome, ${state.account.name}. Find the right place for your next project.`
            : "Discover properties. Connect with owners. Build what’s next."}
        </Heading>
        <LinkButton to="account" secondary>
          {state.account ? "Edit demo account" : "Create your account"}
        </LinkButton>
      </div>
      <div className="two-col access-plans">
        <Card className={state.access === "friendly" ? "selected" : ""}>
          <p className="eyebrow">Start a conversation</p>
          <h2>Access to friendly owners</h2>
          <div className="small-price">Free</div>
          <p className="muted">
            Initial outreach facilitated through the platform. Explore owners
            open to infrastructure opportunities.
          </p>
          <button
            className={state.access === "friendly" ? "secondary" : "primary"}
            onClick={() => set((s) => ({ ...s, access: "friendly" }))}
          >
            {state.access === "friendly"
              ? "Viewing friendly owners"
              : "View friendly owners"}
          </button>
        </Card>
        <Card className={state.access === "entire" ? "selected" : ""}>
          <p className="eyebrow">Broaden your search</p>
          <h2>Access to entire ESO database</h2>
          <div className="small-price">
            Paid <span className="fine">· pricing TBD</span>
          </div>
          <p className="muted">
            Preview the expanded sample catalog. Real access and billing will be
            connected by your developer.
          </p>
          <button
            className="secondary"
            onClick={() => set((s) => ({ ...s, access: "entire" }))}
          >
            {state.access === "entire"
              ? "Previewing expanded sample catalog"
              : "Preview paid access · no charge"}
          </button>
        </Card>
      </div>
      <nav className="tabs" aria-label="Developer workspace">
        <a className={tab === "featured" ? "active" : ""} href="#developer">
          Featured Properties
        </a>
        <a
          className={tab === "pending" ? "active" : ""}
          href="#developer/pending"
        >
          Pending Offers <span className="count">{state.inquiries.length}</span>
        </a>
      </nav>
      {tab === "pending" ? (
        <>
          <h2>Pending Offers</h2>
          <p className="muted">
            Sample inquiries, not binding offers. No messages have been sent to
            real owners.
          </p>
          {state.inquiries.map((q, i) => (
            <Card key={q.property + i} className="pending-row">
              <div>
                <p className="eyebrow">Awaiting owner response · demo</p>
                <h3>{q.property}</h3>
                <p>
                  Inquiry sent{" "}
                  {new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(
                    new Date(q.date + "T12:00:00Z"),
                  )}
                </p>
                {q.message && <p className="muted">{q.message}</p>}
              </div>
              <LinkButton to="developer" secondary>
                Browse featured properties
              </LinkButton>
            </Card>
          ))}
        </>
      ) : (
        <div className="catalog">
          <aside className="card criteria">
            <p className="eyebrow">Refine your search</p>
            <h2>Property criteria</h2>
            <CriteriaFields
              value={state.criteria}
              onChange={(criteria) => set((s) => ({ ...s, criteria }))}
            />
            <button
              className="secondary full"
              onClick={() =>
                set((s) => ({
                  ...s,
                  criteria: { roof: "", fiber: "", utilities: "", grid: false },
                }))
              }
            >
              Clear criteria
            </button>
            <p className="fine">
              Distances and grid availability are fabricated sample attributes,
              not verified site assessments.
            </p>
          </aside>
          <div>
            <div className="spread catalog-title">
              <div>
                <h2>Featured Properties</h2>
                <p className="fine" role="status">
                  {visible.length} properties match your criteria ·{" "}
                  {state.access === "friendly"
                    ? "friendly owners"
                    : "expanded sample catalog"}
                </p>
              </div>
              <div className="segmented" aria-label="Property display">
                <button
                  className={view === "grid" ? "active" : ""}
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                >
                  Grid
                </button>
                <button
                  className={view === "list" ? "active" : ""}
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                >
                  List
                </button>
              </div>
            </div>
            {!visible.length && (
              <Card>
                <h3>No matching properties</h3>
                <p className="muted">
                  Try a smaller minimum rooftop size, a larger distance, or
                  clear your criteria.
                </p>
              </Card>
            )}
            <div className={view === "grid" ? "property-grid" : "stack"}>
              {visible.map((p) => (
                <article
                  key={p.id}
                  className={
                    "property-card " + (view === "list" ? "horizontal" : "")
                  }
                >
                  <PropertyArt tone={p.tone} />
                  <div className="property-content">
                    <span className="badge">
                      {p.friendly
                        ? "Friendly owner"
                        : "Expanded catalog · demo"}
                    </span>
                    <h3>{p.address}</h3>
                    <p className="muted">{p.city}</p>
                    <p>
                      {p.type} · {p.area}
                    </p>
                    <div className="property-stats">
                      <span>
                        Fiber <strong>{p.fiber} ft</strong>
                      </span>
                      <span>
                        Utilities <strong>{p.utilities} ft</strong>
                      </span>
                      <span>
                        Grid{" "}
                        <strong>{p.grid ? "Available" : "Unconfirmed"}</strong>
                      </span>
                    </div>
                    <button
                      className="secondary full"
                      onClick={() => {
                        setSelected(p.id);
                        setFeedback("");
                        setMessage("");
                      }}
                    >
                      View property &amp; request introduction
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {property && (
              <Card className="property-detail">
                <div className="spread">
                  <h2>{property.address}</h2>
                  <button className="secondary" onClick={() => setSelected("")}>
                    Close details
                  </button>
                </div>
                <p>
                  {property.city} · {property.type} · {property.area}
                </p>
                <p className="muted">
                  Initial outreach is facilitated through the platform. The
                  property and availability shown here are illustrative.
                </p>
                {state.inquiries.some(
                  (q) => q.property === property.address,
                ) ? (
                  <p className="notice">
                    An inquiry for this property is already in Pending Offers.{" "}
                    <a href="#developer/pending">View pending inquiries →</a>
                  </p>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const date = new Intl.DateTimeFormat("en-CA", {
                        timeZone: "America/New_York",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }).format(new Date());
                      set((s) => ({
                        ...s,
                        inquiries: [
                          ...s.inquiries,
                          {
                            property: property.address,
                            date,
                            message: message.trim(),
                          },
                        ],
                      }));
                      setFeedback(
                        "Demo inquiry saved to Pending Offers. No real message was sent.",
                      );
                    }}
                  >
                    <label>
                      Your project and introduction request
                      <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Briefly describe the infrastructure you’re interested in developing."
                      />
                    </label>
                    <button>Request introduction · demo</button>
                  </form>
                )}
                <p role="status">{feedback}</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
