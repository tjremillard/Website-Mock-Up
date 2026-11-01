"use client";
import { useState } from "react";
import { useDemo } from "@/lib/demo-store";
import { Card, Heading, LinkButton } from "./ui";
import {
  developerTypes,
  getDeveloperProperties,
  type DeveloperType,
} from "@/lib/developer-catalog";
import { CommercialBuildingArt, DeveloperMap } from "./developer-map";
import { Account } from "./account";

export function Developer({
  tab = "featured",
  type = "wireless",
  propertyId,
}: {
  tab?: string;
  type?: DeveloperType;
  propertyId?: string;
}) {
  const [state, set] = useDemo();
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const properties = getDeveloperProperties(type);
  const property = state.developerSignedIn
    ? properties.find((item) => item.id === propertyId)
    : undefined;
  const propertyRoute = (id: string) =>
    `${state.developerSignedIn ? "developer" : "account/developer"}/${type}/${id}`;
  if (propertyId && !state.developerSignedIn)
    return (
      <Account
        audience="developer"
        returnTo={`developer/${type}/${propertyId}`}
      />
    );
  return (
    <div className="page developer-page">
      <div className="spread developer-header">
        <Heading
          eyebrow="Infrastructure workspace"
          title="Infrastructure Developer Portal"
        >
          {state.developerSignedIn && state.account
            ? `Welcome, ${state.account.name}. Find the right place for your next project.`
            : "Discover properties. Connect with owners. Build what’s next."}
        </Heading>
        <div className="developer-type-control">
          <label htmlFor="developer-type">Infrastructure Developer Type</label>
          <select
            id="developer-type"
            value={type}
            onChange={(e) => {
              location.hash = `developer/${e.target.value}`;
            }}
          >
            {Object.entries(developerTypes).map(([value, config]) => (
              <option key={value} value={value}>
                {config.label}
              </option>
            ))}
          </select>
          {state.developerSignedIn ? (
            <button
              className="secondary"
              onClick={() => {
                set((s) => ({ ...s, developerSignedIn: false }));
                location.hash = `developer/${type}`;
              }}
            >
              Log out of demo
            </button>
          ) : (
            <LinkButton to="account/developer" secondary>
              Log in or create a Free Account
            </LinkButton>
          )}
        </div>
      </div>
      <p className="fine">
        Free for infrastructure developers. Log in or create a free account to
        browse property details.
      </p>
      <nav className="tabs" aria-label="Developer workspace">
        <a
          className={tab === "featured" ? "active" : ""}
          href={`#developer/${type}`}
        >
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
          {state.inquiries.map((inquiry, index) => (
            <Card key={inquiry.property + index} className="pending-row">
              <div>
                <p className="eyebrow">Awaiting owner response · demo</p>
                <h3>{inquiry.property}</h3>
                <p>
                  Inquiry sent{" "}
                  {new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(
                    new Date(inquiry.date + "T12:00:00Z"),
                  )}
                </p>
                {inquiry.message && <p className="muted">{inquiry.message}</p>}
              </div>
              <LinkButton to="developer" secondary>
                Browse featured properties
              </LinkButton>
            </Card>
          ))}
        </>
      ) : (
        <div className="developer-listings">
          {property ? (
            <Card className="property-detail">
              <a href={`#developer/${type}`} className="back">
                ← Browse properties
              </a>
              <CommercialBuildingArt type={property.buildingType} />
              <h2>{property.address}</h2>
              <p>
                {property.city} · {property.type} · {property.area}
              </p>
              <p className="muted">
                Initial outreach is facilitated through the platform. The
                property and availability shown here are illustrative.
              </p>
              {state.inquiries.some(
                (inquiry) => inquiry.property === property.address,
              ) ? (
                <p className="notice">
                  An inquiry for this property is already in Pending Offers.{" "}
                  <a href="#developer/pending">View pending inquiries →</a>
                </p>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!message.trim()) return;
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
          ) : (
            <>
              <DeveloperMap
                key={type}
                type={type}
                properties={properties}
                selected=""
                onSelect={(id) => {
                  location.hash = propertyRoute(id);
                }}
              />
              <div className="spread catalog-title">
                <div>
                  <h2>Property Listing</h2>
                  <p className="fine" role="status">
                    {properties.length} sample commercial properties ·{" "}
                    {developerTypes[type].label}
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
              <div className={view === "grid" ? "property-grid" : "stack"}>
                {properties.map((item) => (
                  <article
                    key={item.id}
                    className={`property-card ${view === "list" ? "horizontal" : ""}`}
                  >
                    <a
                      className="property-card-open"
                      href={`#${propertyRoute(item.id)}`}
                      aria-label={`View ${item.address}`}
                    >
                      <CommercialBuildingArt type={item.buildingType} />
                      <div className="property-content">
                        <span className="badge">Sample property</span>
                        <h3>{item.name}</h3>
                        <p className="property-address">{item.address}</p>
                        <p className="muted">{item.city}</p>
                        <p>
                          {item.type} · {item.area}
                        </p>
                        <span className="button secondary full">
                          View property
                        </span>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
