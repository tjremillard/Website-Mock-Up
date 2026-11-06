import Link from "next/link";
import type { ReactNode } from "react";
export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link className="air-logo" href={href} aria-label="AIR home">
      <span className="air-mark">
        AIR
        <svg viewBox="0 0 30 30" aria-hidden="true">
          <path d="M4 26a22 22 0 0 0 0-22M4 20a14 14 0 0 0 0-14M4 14a6 6 0 0 0 0-6" />
        </svg>
      </span>
      <span>
        ALTERNATIVE
        <br />
        INFRASTRUCTURE REALTY
      </span>
    </Link>
  );
}
export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link href={href} className={`air-button${secondary ? " outline" : ""}`}>
      {children}
    </Link>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  return <span className="air-badge">{children}</span>;
}
export function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="air-page-heading">
      <p className="air-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <p className="air-lead">{children}</p>}
    </div>
  );
}
export function Footer() {
  return (
    <footer className="air-footer">
      <div className="air-container">
        <div className="air-footer-top">
          <Logo />
          <p>
            Real estate intelligence.
            <br />
            Infrastructure possibilities.
          </p>
          <div>
            <Link href="/about">About AIR</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/pricing">Free & AIR Pro</Link>
          </div>
        </div>
        <div className="air-footer-bottom">
          <span>
            © 2026 Alternative Infrastructure Realty · Formerly Easement Real
            Estate
          </span>
          <span>Contact, privacy & terms: pending launch review</span>
        </div>
        <small>
          Prototype brand mark. Demo content is illustrative. AIR is independent
          and is not affiliated with Starlink, SpaceX, or any wireless carrier.
          No demand, revenue or lease is guaranteed.
        </small>
      </div>
    </footer>
  );
}
