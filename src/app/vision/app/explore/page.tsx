import { Suspense } from "react";
import { VisionApp } from "@/components/air/vision";
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="air-map-loading">Loading internal workspace…</div>
      }
    >
      <VisionApp view="explore" />
    </Suspense>
  );
}
