import { PageHeading, ButtonLink } from "@/components/air/brand";
export default function Page() {
  return (
    <main id="main-content" className="air-container air-section">
      <div className="air-article">
        <PageHeading
          eyebrow="About AIR / Formerly Easement Real Estate"
          title="A new perspective on real estate."
        >
          Alternative Infrastructure Realty helps property owners understand,
          explore and market their real estate for emerging infrastructure
          opportunities.
        </PageHeading>
        <h2>Starting with Massachusetts wireless</h2>
        <p>
          We begin with a focused question: how can property owners better
          understand their real estate in the context of wireless
          infrastructure? AIR brings property discovery and intelligence into
          one coherent experience.
        </p>
        <h2>A broader ambition</h2>
        <p>
          Solar, battery storage, EV charging and outdoor advertising are future
          expansion categories. They are not live launch offerings. The launch
          website covers Massachusetts wireless only.
        </p>
        <h2>Evidence before expectations</h2>
        <p>
          AIR is independent. We do not imply carrier authorization or
          affiliation, guaranteed demand, lease placement or investment returns.
          Prototype records and editorial samples are clearly labeled.
        </p>
        <ButtonLink href="/app">Explore AIR →</ButtonLink>
      </div>
    </main>
  );
}
