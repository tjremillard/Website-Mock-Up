"use client";
import { useState } from "react";
const homes = [
  {
    name: "The garden house",
    location: "Portland, ME",
    price: "$625,000",
    detail: "3 beds · 2 baths · 1,850 sq ft",
    color: "bg-[#d9dfce]",
  },
  {
    name: "A quieter kind of city living",
    location: "Boston, MA",
    price: "$845,000",
    detail: "2 beds · 2 baths · 1,420 sq ft",
    color: "bg-[#ded3c1]",
  },
  {
    name: "Room to put down roots",
    location: "Burlington, VT",
    price: "$495,000",
    detail: "3 beds · 2 baths · 2,100 sq ft",
    color: "bg-[#cddad8]",
  },
];
export default function Home() {
  const [query, setQuery] = useState("");
  const filtered = homes.filter((home) =>
    `${home.name} ${home.location}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 sm:px-12">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#183c34]/20 pb-6">
        <a href="#" className="text-2xl font-semibold tracking-tight">
          easement<span className="text-sm font-normal"> / real estate</span>
        </a>
        <nav aria-label="Main navigation" className="flex gap-6 text-sm">
          <a href="#homes" className="underline-offset-4 hover:underline">
            Explore homes
          </a>
          <a href="#about" className="underline-offset-4 hover:underline">
            Our approach
          </a>
        </nav>
      </header>
      <section className="py-20 sm:py-28">
        <p className="mb-6 text-xs uppercase tracking-[0.25em]">
          A little more possibility
        </p>
        <h1 className="max-w-3xl font-serif text-6xl leading-[1.05] sm:text-8xl">
          Find room for your next chapter.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-[#426158]">
          A thoughtful approach to finding a place that feels like you. Explore
          homes, discover possibilities, and make your next move with
          confidence.
        </p>
        <a
          href="#homes"
          className="mt-9 inline-block rounded-full bg-[#183c34] px-7 py-4 text-white hover:bg-[#2b574a]"
        >
          Find your place ↓
        </a>
      </section>
      <section
        id="homes"
        className="scroll-mt-8 border-t border-[#183c34]/20 py-12"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest">
              Places with potential
            </p>
            <h2 className="font-serif text-4xl">Explore homes</h2>
          </div>
          <label className="flex flex-col gap-2 text-sm">
            Search by city or home name
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Portland"
              className="rounded-lg border border-[#183c34]/40 bg-white px-4 py-3 text-base"
            />
          </label>
        </div>
        <p className="mb-5 text-sm">
          Illustrative listings for this prototype. These homes are not offered
          for sale.
        </p>
        <p role="status" className="mb-4 text-sm">
          {filtered.length} sample {filtered.length === 1 ? "home" : "homes"}{" "}
          found
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {filtered.map((home) => (
            <article
              key={home.name}
              className="overflow-hidden rounded-xl border border-[#183c34]/15 bg-white"
            >
              <div
                aria-hidden="true"
                className={`${home.color} flex h-48 items-center justify-center`}
              >
                <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
                  <path
                    d="M10 40 50 10 90 40M22 32v46h56V32M43 78V51h16v27"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="p-6">
                <p className="text-sm">{home.location}</p>
                <h3 className="mt-2 font-serif text-2xl">{home.name}</h3>
                <p className="mt-5 text-xl">{home.price}</p>
                <p className="mt-2 text-sm text-[#426158]">{home.detail}</p>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="rounded-xl bg-white p-8">
            No sample homes match your search. Try another city or clear the
            search.
          </p>
        )}
      </section>
      <section
        id="about"
        className="my-10 rounded-2xl bg-[#e5e9dc] p-8 sm:p-12"
      >
        <p className="text-xs uppercase tracking-widest">
          The Easement approach
        </p>
        <h2 className="mt-4 font-serif text-4xl">
          Good moves begin with understanding.
        </h2>
        <p className="mt-5 max-w-2xl leading-7">
          Your home is more than an address. We believe the search should begin
          with what matters to you: your everyday routines, your community, and
          the life you want to build.
        </p>
      </section>
      <footer className="flex flex-wrap justify-between gap-4 border-t border-[#183c34]/20 py-8 text-sm">
        <span>Easement Real Estate</span>
        <span>Prototype · Sample content</span>
      </footer>
    </main>
  );
}
