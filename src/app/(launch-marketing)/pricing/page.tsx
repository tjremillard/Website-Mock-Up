import { PageHeading, ButtonLink, Badge } from "@/components/air/brand";
export default function Page() {
  return (
    <main id="main-content" className="air-container air-section">
      <PageHeading
        eyebrow="Free intelligence. Thoughtful next steps."
        title="Start free. Go deeper with AIR Pro."
      >
        AIR Pro is a future paid feature preview. No subscription, checkout or
        publication is activated here.
      </PageHeading>
      <div className="air-price-grid">
        <section className="air-card">
          <Badge>Available in Demo Mode</Badge>
          <h2>Free</h2>
          <p className="air-price">$0</p>
          <p>Explore and organize your property research.</p>
          <ul className="air-check-list">
            <li>Browse and search Massachusetts</li>
            <li>Read wireless intelligence</li>
            <li>Basic nearby context with provenance</li>
            <li>Save with a free demo account</li>
            <li>Request property verification</li>
          </ul>
          <ButtonLink href="/app">Explore free →</ButtonLink>
        </section>
        <section className="air-card air-pro-card">
          <Badge>Future premium preview</Badge>
          <h2>AIR Pro</h2>
          <p className="air-price">TBD</p>
          <p>Planned tools for enhanced property intelligence.</p>
          <ul className="air-check-list">
            <li>Advanced analytics — planned</li>
            <li>SCIP hosting and active marketing — planned</li>
            <li>Lease comparables where lawful and available — planned</li>
            <li>Verification required before publication</li>
          </ul>
          <ButtonLink href="/app/account?interest=pro">
            Preview Pro interest →
          </ButtonLink>
        </section>
      </div>
      <p className="air-fine">
        No transaction fees, brokerage promises, representation or guarantees of
        tenant demand. Developer browsing remains free in the future vision.
      </p>
    </main>
  );
}
