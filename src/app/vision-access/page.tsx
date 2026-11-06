import { Suspense } from "react";
import { VisionAccess } from "@/components/air/vision-access";
import { PageHeading, Logo } from "@/components/air/brand";
export const metadata = {
  title: "AIR | Internal preview access",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <div className="air">
      <main className="air-container air-section">
        <div className="air-auth-card">
          <Logo />
          <PageHeading
            eyebrow="Private / Vision Prototype"
            title="Internal preview access."
          >
            This prototype is restricted to authorized reviewers.
          </PageHeading>
          <Suspense fallback={<p>Loading access form…</p>}>
            <VisionAccess />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
