import Link from "next/link";
import { PageHeading, ButtonLink, Badge } from "@/components/air/brand";
import { VisionMapPreview } from "@/components/air/vision-preview";
export default function Page() {
  return (
    <main id="main-content">
      <section className="air-container air-section air-split">
        <div>
          <Badge>Internal vision / Not a launch commitment</Badge>
          <PageHeading
            eyebrow="Alternative Infrastructure Realty"
            title="Where real estate meets the next generation of infrastructure."
          >
            One intelligence and property discovery platform for connectivity,
            energy and emerging infrastructure.
          </PageHeading>
          <ButtonLink href="/vision/app">Explore Vision App →</ButtonLink>
        </div>
        <VisionMapPreview />
      </section>
      <section className="air-section air-tinted">
        <div className="air-container">
          <p className="air-eyebrow">The category thesis</p>
          <h2>
            Fragmented information.
            <br />A connected perspective.
          </h2>
          <p className="air-lead">
            Infrastructure site discovery and landlord information often live
            apart. AIR’s future vision connects research, location and
            owner-approved property information in one workflow.
          </p>
          <div className="air-card-grid air-pillars">
            {[
              [
                "AIR Intelligence",
                "Evidence-backed market context",
                "intelligence",
              ],
              [
                "AIR Explore",
                "A geographic view of properties and development",
                "explore",
              ],
              [
                "AIR Marketplace",
                "Owner-approved discovery; free developer browsing",
                "?view=marketplace",
              ],
              [
                "AIR Pro",
                "Future enhanced intelligence and SCIP marketing",
                "?view=pro",
              ],
            ].map(([title, body, path]) => (
              <Link
                className="air-card air-pillar"
                key={title}
                href={
                  path.startsWith("?")
                    ? `/vision/app${path}`
                    : `/vision/app/${path}`
                }
              >
                <Badge>Future vision</Badge>
                <h3>{title}</h3>
                <p>{body}</p>
                <span>Explore concept →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="air-container air-section">
        <p className="air-eyebrow">A multi-vertical lens</p>
        <h2>Different infrastructure. Shared real estate.</h2>
        <div className="air-roadmap">
          {[
            "Wireless",
            "Solar",
            "Battery Storage",
            "EV Charging",
            "Outdoor Advertising",
          ].map((s, i) => (
            <Link
              key={s}
              href={`/vision/app/explore?market=${["wireless", "solar", "bess", "ev", "ooh"][i]}`}
            >
              <span>FUTURE NATIONAL VISION</span>
              <h3>{s}</h3>
            </Link>
          ))}
        </div>
      </section>
      <section className="air-container air-section air-split">
        <div>
          <p className="air-eyebrow">A two-sided network</p>
          <h2>Property knowledge meets site discovery.</h2>
          <p>
            Landlords organize and manage their property information. Developers
            browse freely and review owner-approved packets. Expressions of
            interest would require explicit consent and a production messaging
            service.
          </p>
          <ButtonLink href="/vision/app?view=marketplace">
            Preview marketplace concept →
          </ButtonLink>
        </div>
        <div className="air-card">
          <h3>The intelligence-to-map loop</h3>
          <ol className="air-workflow">
            <li>Read a sourced article</li>
            <li>View related development activity</li>
            <li>Explore nearby properties</li>
            <li>Save or request a property claim</li>
            <li>Prepare an owner-approved SCIP</li>
          </ol>
          <p className="air-fine">
            Illustrative workflow. No actual developer inquiries, verified
            ownership or publication.
          </p>
        </div>
      </section>
      <section className="air-section air-tinted">
        <div className="air-container">
          <p className="air-eyebrow">
            AI-assisted research / Visual prototype only
          </p>
          <h2>Evidence first. Human judgment always.</h2>
          <div className="air-pipeline">
            {[
              "Source ingestion",
              "Deduplication",
              "Entity extraction",
              "Geography & vertical tagging",
              "Evidence-backed draft",
              "Human review",
              "Publish",
              "Structured activity record",
            ].map((s, i) => (
              <div key={s}>
                <span>0{i + 1}</span>
                <strong>{s}</strong>
              </div>
            ))}
          </div>
          <p>
            Human approval is required before publication. No AI or
            auto-publishing service is connected.
          </p>
          <p className="air-fine">
            Future records require primary-source URLs, observed dates, project
            status, entities, confidence, editor approval timestamps and
            correction history. Separate verified facts from AIR opinion.
          </p>
        </div>
      </section>
      <section className="air-container air-section">
        <p className="air-eyebrow">
          Capability-led expansion / No delivery dates promised
        </p>
        <h2>Earn the right to expand.</h2>
        <div className="air-steps">
          {[
            [
              "Start focused",
              "Massachusetts wireless intelligence and property discovery.",
            ],
            [
              "Establish evidence",
              "Licensed sources, provenance, verification and owner consent.",
            ],
            [
              "Connect the workflow",
              "Durable accounts, approved SCIP hosting and useful research.",
            ],
            [
              "Expand carefully",
              "Additional geographies and infrastructure markets after validation.",
            ],
          ].map(([title, body]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <ButtonLink href="/vision/app">Explore Vision App →</ButtonLink>
      </section>
      <footer className="air-demo-notice">
        Internal-only synthetic prototype · Independent of all carriers · No
        revenue, eligibility or lease guarantees
      </footer>
    </main>
  );
}
