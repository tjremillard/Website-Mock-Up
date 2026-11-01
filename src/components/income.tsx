import { Card, LinkButton } from "./ui";

const categories = [
  [
    "Connectivity",
    "Cellular and satellite communications equipment that supports wireless networks.",
  ],
  [
    "Energy Generation",
    "Rooftop solar installations that use available space to produce electricity.",
  ],
  [
    "Energy Storage",
    "Battery energy storage systems (BESS) that store electricity for later use.",
  ],
  [
    "Advertising",
    "Rooftop billboards and other outdoor advertising installations that connect brands with audiences.",
  ],
];

export function EasementIncome() {
  return (
    <article className="page income-page">
      <header className="income-intro">
        <p className="eyebrow">Easement Income</p>
        <h1>Your property’s potential goes beyond its traditional tenants.</h1>
        <p className="income-lead">
          Real estate plays an essential role in how we connect, generate and
          store energy, and reach consumers.
        </p>
        <p>
          Apartment buildings, offices, warehouses, shopping centers, and other
          properties can support more than their primary use. Their rooftops and
          other available spaces can host infrastructure—and create an
          additional source of income for owners.
        </p>
        <p>
          Infrastructure developers need access to the right real estate to
          deploy their projects and expand their operating footprint. Property
          owners need a clearer way to understand that demand, evaluate
          opportunities, and make informed leasing decisions.
        </p>
        <p>
          <strong>Easement Exchange brings these two sides together.</strong>
        </p>
      </header>

      <section
        className="income-section income-reading"
        aria-labelledby="income-definition"
      >
        <h2 id="income-definition">What is easement income?</h2>
        <p>
          At Easement Exchange, we use “easement income” to describe revenue
          property owners earn by granting infrastructure providers rights to
          use a defined part of their property.
        </p>
        <p>
          These arrangements may take the form of a lease, license, or easement,
          depending on the project. A legal easement is a specific property
          right; not every opportunity on our platform requires one.
        </p>
        <p>
          The common idea is simple:{" "}
          <strong>
            your property can support infrastructure while continuing to serve
            its primary purpose.
          </strong>
        </p>
      </section>

      <section className="income-section" aria-labelledby="income-categories">
        <h2 id="income-categories">
          Four categories. More ways to put your property to work.
        </h2>
        <div className="income-categories">
          {categories.map(([title, description]) => (
            <Card key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section
        className="income-section income-reading"
        aria-labelledby="income-market"
      >
        <h2 id="income-market">
          Why every property owner should understand this market
        </h2>
        <p>
          You do not need an existing infrastructure tenant to start
          understanding your property’s potential.
        </p>
        <p>
          Knowing what developers look for can help you recognize an
          opportunity, ask better questions, and assess how a proposed
          installation fits your building’s operations and long-term plans.
        </p>
        <p>
          For owners with existing agreements, understanding the market can also
          inform decisions about renewals, expansions, and future leasing.
        </p>
        <p>
          Not every property will qualify for every use. Location, physical
          characteristics, access, utilities, permitting, and developer demand
          all influence what is possible.
        </p>
      </section>

      <section
        className="income-section income-audiences"
        aria-label="Explore Easement Exchange"
      >
        <Card>
          <h2>For property owners: understand the opportunity.</h2>
          <p>
            Easement Exchange combines a marketplace with data and analytics to
            help owners showcase available space, connect with infrastructure
            developers, and make more informed leasing decisions.
          </p>
          <p>
            Understand your opportunities. Evaluate your options. Generate more
            value from your real estate.
          </p>
          <LinkButton to="explore">
            Explore Your Property’s Potential
          </LinkButton>
        </Card>
        <Card>
          <h2>For infrastructure developers: find your next site.</h2>
          <p>
            Site acquisition starts with identifying properties that fit your
            project—and owners willing to explore an agreement.
          </p>
          <p>
            Easement Exchange helps developers discover available sites, review
            property information, and connect with participating owners across
            connectivity, solar, energy storage, and advertising.
          </p>
          <p>
            Explore opportunities in your target markets and focus your outreach
            on properties that warrant further evaluation.
          </p>
          <p>
            <strong>Free for infrastructure developers.</strong>
          </p>
          <LinkButton to="developer">Find Sites</LinkButton>
        </Card>
      </section>
      <p className="income-closing">
        <strong>
          We make infrastructure real estate easier to understand, lease, and
          manage.
        </strong>
      </p>
    </article>
  );
}
