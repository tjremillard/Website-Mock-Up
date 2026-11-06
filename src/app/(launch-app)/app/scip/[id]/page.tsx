import { notFound } from "next/navigation";
import { properties } from "@/data/air";
import type { SCIP } from "@/lib/air/types";
import { Badge, PageHeading, ButtonLink } from "@/components/air/brand";
import { ViewEvent } from "@/components/air/editorial";
export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = properties.find((p) => p.id === id);
  if (!p) notFound();
  const scip: SCIP = {
    id: `scip-${id}`,
    propertyId: id,
    status: "draft",
    ownerApproved: false,
    sections: [
      {
        title: "Overview",
        fields: { Property: p.address, Type: p.propertyType, Ownership: null },
      },
      {
        title: "Property location",
        fields: {
          Municipality: p.city,
          State: "Massachusetts",
          Coordinates: `${p.lat.toFixed(3)}, ${p.lng.toFixed(3)} — synthetic`,
        },
      },
      {
        title: "Existing infrastructure context",
        fields: {
          Coverage: "Illustrative nearby wireless markers only",
          Verification: null,
        },
      },
      {
        title: "Site characteristics",
        fields: Object.fromEntries(p.signals.map((s) => [s.label, s.value])),
      },
      {
        title: "Available documents",
        fields: {
          "Structural survey": null,
          "Zoning documentation": null,
          "Property plans": null,
        },
      },
      {
        title: "Owner-approved contact method",
        fields: { Contact: null, Consent: null },
      },
      {
        title: "Data sources",
        fields: {
          Source: "AIR synthetic prototype dataset",
          Observed: "November 6, 2026 — demo fixture date",
        },
      },
    ],
  };
  return (
    <main id="main-content" className="air-container air-section">
      <ViewEvent event="scip_previewed" id={id} />
      <PageHeading
        eyebrow="Site Candidate Information Packet"
        title={`SCIP / ${p.address}`}
      >
        Draft preview · Demo data · Not published · Owner approval not provided
      </PageHeading>
      <Badge>Verification required</Badge>
      <div className="air-card-grid air-scip-grid">
        {scip.sections.map((s) => (
          <section className="air-card" key={s.title}>
            <h2>{s.title}</h2>
            <dl className="air-facts">
              {Object.entries(s.fields).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v ?? "Not provided"}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <div className="air-card">
        <h2>Publication is unavailable</h2>
        <p>
          Production verification, owner approval and billing are required
          before publication. No packet is hosted or marketed by this demo.
        </p>
        <button disabled aria-describedby="publish-reason">
          Publish — unavailable
        </button>
        <p id="publish-reason" className="air-fine">
          AIR Pro hosting and marketing are planned features.
        </p>
        <ButtonLink href="/pricing" secondary>
          Compare AIR Pro →
        </ButtonLink>
      </div>
    </main>
  );
}
