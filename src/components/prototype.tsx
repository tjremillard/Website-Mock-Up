"use client";
import { useEffect } from "react";
import { useRoute } from "@/lib/demo-store";
import { services, type ServiceKey } from "@/lib/demo";
import { Explore } from "./explore";
import { EasementIncome } from "./income";
import { Services, Product } from "./services";
import { Owner } from "./owner";
import { Account, Developer } from "./developer";
import { ReviewForm, Checkout, Submitted, Report } from "./reviews";
const nav = [
  ["explore", "Explore"],
  ["income", "Easement Income"],
  ["owner/overview", "Property Owners"],
  ["developer", "Infrastructure Developers"],
];
export function Prototype() {
  const route = useRoute();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);
  const [screen, arg] = route.split("/");
  const service =
    arg && Object.hasOwn(services, arg) ? (arg as ServiceKey) : undefined;
  let content;
  switch (screen) {
    case "explore":
      content = <Explore />;
      break;
    case "map":
      content = <Explore />;
      break;
    case "income":
      content = <EasementIncome />;
      break;
    case "services":
      content = <Services />;
      break;
    case "product":
      content = service ? <Product key={service} service={service} /> : null;
      break;
    case "review":
      content = service ? <ReviewForm key={service} service={service} /> : null;
      break;
    case "checkout":
      content = <Checkout />;
      break;
    case "submitted":
      content = <Submitted id={arg} />;
      break;
    case "report":
      content = <Report id={arg} />;
      break;
    case "owner":
      if (arg === "pricing") {
        content = (
          <section className="page">
            <p className="eyebrow">Property Owners</p>
            <h1>Marketing Services pricing</h1>
            <p>Pricing and subscription details are coming soon.</p>
            <a href="#explore">Return to Explore</a>
          </section>
        );
        break;
      }
      content = (
        <Owner
          tab={
            ["overview", "documents", "reviews", "services"].includes(arg)
              ? arg
              : "overview"
          }
        />
      );
      break;
    case "developer":
      content = <Developer tab={arg === "pending" ? "pending" : "featured"} />;
      break;
    case "account":
      content = <Account />;
      break;
  }
  return (
    <div className="prototype-shell">
      <a
        className="skip"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="#explore"
          aria-label="Easement Real Estate home"
        >
          WRA<span>/</span>
          <small>EASEMENT REAL ESTATE</small>
        </a>
        <nav aria-label="Main navigation">
          {nav.map(([to, label]) => {
            const active =
              screen === to.split("/")[0] ||
              (to === "explore" && screen === "map") ||
              (to === "income" &&
                [
                  "services",
                  "product",
                  "review",
                  "checkout",
                  "submitted",
                  "report",
                ].includes(screen));
            return (
              <a
                key={to}
                className={active ? "active" : ""}
                aria-current={active ? "page" : undefined}
                href={"#" + to}
              >
                {label}
              </a>
            );
          })}
        </nav>
      </header>
      <div className="concept-banner">
        INTERACTIVE CONCEPT{" "}
        <span>
          · Sample properties, documents, payments, and review results ·
          Browser-only demo
        </span>
      </div>
      <main id="main-content" tabIndex={-1}>
        {content ?? (
          <div className="page">
            <h1>Page not found</h1>
            <a href="#explore">Return to Explore</a>
          </div>
        )}
      </main>
      <footer className="site-footer">
        <span>
          Easement Real Estate <span className="muted">/ WRA</span>
        </span>
        <span>Design &amp; copy prototype · no live warehouse connection</span>
      </footer>
    </div>
  );
}
