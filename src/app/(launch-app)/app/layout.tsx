import { Suspense } from "react";
import { Header } from "@/components/air/header";
import { DemoNotice } from "@/components/air/account";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="air">
      <a className="air-skip" href="#main-content">
        Skip to content
      </a>
      <Header app />
      <DemoNotice />
      <Suspense
        fallback={
          <div className="air-map-loading" role="status">
            Loading AIR workspace…
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
