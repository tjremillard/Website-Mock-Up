import { Suspense } from "react";
import { Header } from "@/components/air/header";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="air">
      <Header />
      <main id="main-content" className="air-container air-section">
        <Suspense fallback={<p role="status">Loading demo account…</p>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
