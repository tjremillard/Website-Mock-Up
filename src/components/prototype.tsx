"use client";
import { useEffect } from "react";
import { useRoute } from "@/lib/demo-store";
import { customerAppLinks } from "@/lib/customer-app";
import { services, type ServiceKey } from "@/lib/demo";
import { Explore } from "./explore";
import { EasementIncome } from "./income";
import { Services, Product } from "./services";
import { Owner } from "./owner";
import { Developer } from "./developer";
import { Account } from "./account";
import { PropertyOwners, OwnerAnalyses } from "./property-owners";
import { developerTypes, type DeveloperType } from "@/lib/developer-catalog";
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
  const [screen, arg, context, propertyId] = route.split("/");
  const selectedType =
    arg && Object.hasOwn(developerTypes, arg)
      ? (arg as DeveloperType)
      : undefined;
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
      if (!arg || arg === "overview" || arg === "pricing") {
        content = <PropertyOwners />;
        break;
      }
      if (arg === "analyses") {
        content = <OwnerAnalyses />;
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
      content = (
        <Developer
          key={route}
          tab={arg === "pending" ? "pending" : "featured"}
          type={selectedType}
          propertyId={context}
        />
      );
      break;
    case "account":
      content = (
        <Account
          key={route}
          audience={arg === "owner" ? "owner" : "developer"}
          context={context}
          returnTo={
            context && Object.hasOwn(developerTypes, context) && propertyId
              ? `developer/${context}/${propertyId}`
              : "developer"
          }
        />
      );
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
              (screen === "account" &&
                to.split("/")[0] ===
                  (arg === "owner" ? "owner" : "developer")) ||
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
        <div className="header-account-actions" aria-label="Customer account">
          <a className="button secondary" href={customerAppLinks.login}>
            Log In
          </a>
          <a className="button" href={customerAppLinks.signup}>
            Create Free Account
          </a>
        </div>
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
