"use client";
import { useState } from "react";
import { services, type ServiceKey } from "@/lib/demo";
import { useDemo } from "@/lib/demo-store";
import { Card, Heading, LinkButton } from "./ui";
export function Services() {
  return (
    <div className="page">
      <Heading
        eyebrow="Services & Pricing"
        title="Know your lease. Understand your options."
      >
        Expert-reviewed answers for wireless site owners. Purchase individual
        reviews when you need them. SCIP Marketing is our only recurring
        service.
      </Heading>
      <Card className="flagship two-col">
        <div>
          <span className="badge">Comprehensive review</span>
          <h2>Lease Checkup</h2>
          <p className="muted">Uncover the questions you didn’t know to ask.</p>
          <ul className="muted">
            <li>Plain-English lease summary</li>
            <li>Market rent assessment with relevant comparables</li>
            <li>Review of premises, utilities, taxes, and potential issues</li>
            <li>Document references and information gaps</li>
            <li>Recommended next steps, reviewed by a WRA expert</li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Market Rent Review included</p>
          <div className="price">$999</div>
          <p className="fine">One-time payment · one site</p>
          <LinkButton to="review/checkup">Start my Lease Checkup →</LinkButton>
          <p className="fine">AI-assisted analysis. Human-reviewed delivery.</p>
        </div>
      </Card>
      <h2 className="section-title">Focused reviews</h2>
      <div className="three-col">
        {(["rent", "relocation", "question"] as ServiceKey[]).map((k) => (
          <Card key={k}>
            <p className="eyebrow">{services[k].tag}</p>
            <h3>{services[k].name}</h3>
            <p className="muted">{services[k].description}</p>
            <div className="small-price">${services[k].price}</div>
            <p className="fine">
              {k === "relocation"
                ? "One-time review"
                : "Proposed price · one-time review"}
            </p>
            <LinkButton to={"product/" + k} secondary>
              {k === "relocation"
                ? "Explore relocation analysis"
                : k === "rent"
                  ? "Choose rent review"
                  : "Ask a question"}
            </LinkButton>
          </Card>
        ))}
      </div>
      <Card className="marketing-strip">
        <div>
          <p className="eyebrow">Recurring service</p>
          <h3>SCIP Marketing</h3>
          <p className="muted">{services.scip.description}</p>
          <p>
            <strong className="green">$499/year, paid up front</strong> · or
            $49/month (proposed monthly rate)
          </p>
          <p className="fine">
            Separate ~5% commission on base-term rent if a lease is executed.
          </p>
        </div>
        <LinkButton to="product/scip" secondary>
          Explore SCIP Marketing →
        </LinkButton>
      </Card>
      <div className="two-col footnotes">
        <div>
          <h3>Talk through your findings</h3>
          <p className="fine">
            Expert consultation · proposed $249 / 45 minutes. Available after
            your review.
          </p>
        </div>
        <div>
          <h3>Want help negotiating?</h3>
          <p className="fine">
            A separate, optional representation agreement, scoped and priced
            after assessing your needs.
          </p>
        </div>
      </div>
    </div>
  );
}
export function Product({ service }: { service: ServiceKey }) {
  const [state, set] = useDemo();
  const [billing, setBilling] = useState<"annual" | "monthly">("annual");
  const item = services[service];
  const scip = service === "scip";
  return (
    <div className="page">
      <a href="#map" className="back">
        ← Back to property map
      </a>
      <p className="eyebrow">Property services / {item.name}</p>
      <div className="two-col product-detail">
        <div>
          <span className="badge">{item.tag}</span>
          <h1>{item.name}</h1>
          <p className="lead">
            {scip
              ? "Get your property in front of the existing carriers and emerging wireless infrastructure providers like Starlink Mobile for marketing on a regular and consistent basis."
              : service === "relocation"
                ? "Have you been receiving rent reduction letters from Verizon, AT&T, and T-Mobile?"
                : item.description}
          </p>
          {service === "relocation" && (
            <p className="muted">
              Use WRA’s data warehouse of competitive structures and lease
              comparables, and zoning software to help determine the legitimacy
              of your tenant’s threat.
            </p>
          )}
          <hr />
          <p>
            {scip
              ? "A recurring service to keep your property in front of wireless infrastructure providers."
              : "Every analysis is reviewed by a WRA industry expert before being delivered to you."}
          </p>
          {scip && (
            <>
              <hr />
              <p className="eyebrow">If a lease is executed</p>
              <h3>WRA earns ~5% of the base lease term.</h3>
              <p className="muted">
                Separate from your recurring marketing service fee.
              </p>
              <Card>
                <p className="eyebrow">Example lease</p>
                <p>$1,500/month × 12 × 5 years = $90,000 base rent</p>
                <p>
                  $90,000 × ~5% = <strong>~$4,500 commission</strong>
                </p>
              </Card>
            </>
          )}
        </div>
        <Card>
          <p className="eyebrow">{scip ? "Choose your billing" : item.name}</p>
          {scip ? (
            <fieldset className="billing">
              <legend className="sr-only">Billing plan</legend>
              {(["annual", "monthly"] as const).map((b) => (
                <label key={b} className={billing === b ? "selected" : ""}>
                  <input
                    type="radio"
                    name="billing"
                    checked={billing === b}
                    onChange={() => setBilling(b)}
                  />
                  <span>
                    <strong className="small-price">
                      ${b === "annual" ? 499 : 49}
                    </strong>
                    /{b === "annual" ? "year" : "month"}
                    <small>
                      {b === "annual"
                        ? "Pay up front · billed annually"
                        : "Proposed · $588 over 12 months"}
                    </small>
                    {b === "annual" && (
                      <span className="badge green">Save $89/year</span>
                    )}
                  </span>
                </label>
              ))}
            </fieldset>
          ) : (
            <>
              <div className="price">${item.price}</div>
              <p className="fine">
                {service === "rent" || service === "question"
                  ? "Proposed price · "
                  : ""}
                One analysis for your selected property
              </p>
            </>
          )}
          <hr />
          <p className="eyebrow">Property</p>
          <h3>{state.address}</h3>
          {!scip && (
            <ul className="muted">
              <li>Available documents and relevant context</li>
              <li>Information gaps and next steps</li>
              <li>WRA expert review before delivery</li>
            </ul>
          )}
          <a
            className="button full"
            href={"#review/" + service}
            onClick={() =>
              set((s) => ({
                ...s,
                draft: {
                  service,
                  address: s.address,
                  question: "",
                  documents: s.documents.map((d) => d.id),
                  billing,
                },
              }))
            }
          >
            {scip
              ? `Continue · $${billing === "annual" ? "499/year" : "49/month"}`
              : `Start review · $${item.price}`}{" "}
            →
          </a>
          <p className="fine center">
            {scip
              ? `Renews ${billing === "annual" ? "annually at $499" : "monthly at $49 (proposed)"}.`
              : "Checkout preview · no charges"}
          </p>
        </Card>
      </div>
    </div>
  );
}
