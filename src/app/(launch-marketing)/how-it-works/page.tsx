import { PageHeading, ButtonLink } from "@/components/air/brand";
export default function Page() {
  return (
    <main id="main-content" className="air-container air-section">
      <PageHeading
        eyebrow="How AIR works"
        title="Understand. Organize. Explore."
      >
        Start free, learn about your property, and decide what information to
        share.
      </PageHeading>
      <div className="air-card-grid">
        {[
          [
            "01 / Explore free",
            "Search Massachusetts demo properties and browse illustrative wireless context without an account.",
          ],
          [
            "02 / Create a free account",
            "The prototype saves your preferences in this browser only. Demo Mode is not production authentication.",
          ],
          [
            "03 / Claim your property",
            "Tell us your relationship to the property and request verification. No ownership is verified in this prototype.",
          ],
          [
            "04 / Prepare a SCIP",
            "A Site Candidate Information Packet organizes location, characteristics, sources, documents and owner-approved contact details.",
          ],
          [
            "05 / AIR Pro — planned",
            "Paid SCIP hosting and marketing are planned. Pricing is TBD; publication and checkout are unavailable.",
          ],
          [
            "06 / Make informed decisions",
            "Marketing does not establish carrier interest, structural suitability, zoning approval or a guaranteed lease.",
          ],
        ].map(([title, body]) => (
          <section className="air-card" key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
      </div>
      <div className="air-actions">
        <ButtonLink href="/app">Explore Your Property →</ButtonLink>
        <ButtonLink href="/pricing" secondary>
          Compare Free & Pro
        </ButtonLink>
      </div>
    </main>
  );
}
