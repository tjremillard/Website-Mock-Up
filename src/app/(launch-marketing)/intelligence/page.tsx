import { PageHeading } from "@/components/air/brand";
import { IntelligenceFeed } from "@/components/air/editorial";
export const metadata = { title: "AIR Intelligence | Massachusetts Wireless" };
export default function Page() {
  return (
    <main id="main-content" className="air-container air-section">
      <PageHeading
        eyebrow="AIR Intelligence / Massachusetts Wireless"
        title="Context before commitment."
      >
        Independent perspectives on wireless infrastructure and real estate.
        Every article below is illustrative demo content.
      </PageHeading>
      <IntelligenceFeed />
    </main>
  );
}
