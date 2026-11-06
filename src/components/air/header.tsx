"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./brand";
export function Header({
  app = false,
  vision = false,
}: {
  app?: boolean;
  vision?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = vision
    ? [
        ["/vision/app/intelligence", "Intelligence"],
        ["/vision/app/explore", "Explore"],
        ["/vision/app/portfolio", "My Portfolio"],
        ["/vision/app?view=pro", "AIR Pro"],
      ]
    : app
      ? [
          ["/app", "Search"],
          ["/app/saved", "Saved"],
          ["/app/my-properties", "My Properties"],
          ["/intelligence", "Intelligence"],
          ["/app/account", "Account"],
        ]
      : [
          ["/app", "Explore"],
          ["/intelligence", "Intelligence"],
          ["/how-it-works", "How It Works"],
          ["/pricing", "Pricing"],
          ["/about", "About"],
        ];
  return (
    <header className="air-header">
      <div className="air-header-inner">
        <Logo href={vision ? "/vision" : "/"} />
        {app && <span className="air-product-name">Explore</span>}
        {vision && <span className="air-badge">Vision Prototype</span>}
        <button
          className="air-menu"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="air-nav"
        >
          {open ? "Close" : "Menu"} ☰
        </button>
        <nav
          id="air-nav"
          className={open ? "is-open" : ""}
          aria-label={vision ? "Vision" : app ? "Explore" : "Main"}
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          {!app && !vision && <Link href="/sign-in">Sign In</Link>}
          <Link
            className="air-button"
            href={
              vision ? "/vision/app" : app ? "/pricing" : "/app?intent=search"
            }
            onClick={() => setOpen(false)}
          >
            {vision
              ? "Open Vision App"
              : app
                ? "Upgrade to Pro"
                : "Explore Your Property"}{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
