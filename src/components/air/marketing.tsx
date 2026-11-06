import { articles } from "@/data/air";
import Link from "next/link";
import { ButtonLink } from "./brand";
import { PropertySearch } from "./search";
import { ArticleCards, ViewEvent } from "./editorial";
export function MapPreview() {
  return (
    <div
      className="air-map-preview"
      role="img"
      aria-label="Schematic Massachusetts infrastructure map, synthetic locations"
    >
      <div className="air-map-grid" />
      <svg viewBox="0 0 600 450" aria-hidden="true">
        <path
          className="air-land"
          d="M55 100L390 90 402 137 445 172 463 205 448 230 490 258 516 235 539 247 558 222 573 232 560 279 534 292 498 284 464 303 431 264 392 281 368 248 340 260 310 235 55 239Z"
        />
        <path
          className="air-road"
          d="M65 195L160 183 235 205 305 170 386 180 442 216M235 205L215 125M305 170L324 110M386 180L360 251"
        />
        {[
          [160, 183],
          [235, 205],
          [305, 170],
          [386, 180],
          [324, 110],
          [360, 251],
          [215, 125],
          [442, 216],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="15" fill="#17365d" opacity=".09" />
            <circle cx={x} cy={y} r="5" fill="#17365d" />
          </g>
        ))}
        <text x="110" y="225">
          SPRINGFIELD
        </text>
        <text x="230" y="233">
          WORCESTER
        </text>
        <text x="395" y="166">
          BOSTON
        </text>
        <text x="300" y="80">
          MASSACHUSETTS
        </text>
      </svg>
      <div className="air-map-caption">
        <span>
          <i /> Illustrative property
        </span>
        <span>Schematic · Demo data</span>
      </div>
    </div>
  );
}
export function HomeMarketing() {
  return (
    <>
      <ViewEvent event="homepage_view" />
      <div className="air-announcement">
        NOW EXPLORING MASSACHUSETTS WIRELESS INFRASTRUCTURE{" "}
        <span aria-hidden="true">→</span>
      </div>
      <main id="main-content">
        <section className="air-hero air-container">
          <div>
            <p className="air-eyebrow">A new perspective on your property</p>
            <h1>
              The next generation of wireless infrastructure starts with{" "}
              <em>real estate.</em>
            </h1>
            <p className="air-lead">
              AIR helps Massachusetts property owners explore wireless leasing
              potential and make their properties discoverable to infrastructure
              developers.
            </p>
            <div className="air-actions">
              <ButtonLink href="/app">Explore Your Property →</ButtonLink>
              <ButtonLink href="/how-it-works" secondary>
                How AIR Works
              </ButtonLink>
            </div>
            <PropertySearch />
          </div>
          <div className="air-hero-visual">
            <div className="air-visual-label">
              <span>THE REAL ESTATE / INFRASTRUCTURE CONNECTION</span>
              <span>01 — MA</span>
            </div>
            <div className="air-city" aria-hidden="true">
              <div className="air-radio">
                <i />
                <i />
                <i />
                <b>⌁</b>
              </div>
              <div className="building one" />
              <div className="building two" />
              <div className="building three" />
              <div className="building four" />
              <div className="air-city-ground" />
            </div>
            <div className="air-visual-foot">
              <span>
                Built environments.
                <br />
                <strong>New possibilities.</strong>
              </span>
              <span className="air-badge">WIRELESS / MASSACHUSETTS</span>
            </div>
          </div>
        </section>
        <section className="air-section air-tinted">
          <div className="air-container">
            <div className="air-section-head">
              <div>
                <p className="air-eyebrow">Why now</p>
                <h2>
                  Connectivity is evolving.
                  <br />
                  Real estate remains essential.
                </h2>
              </div>
              <p>
                Understand the changing landscape before making decisions about
                your property.
              </p>
            </div>
            <ArticleCards />
          </div>
        </section>
        <section className="air-section air-container">
          <p className="air-eyebrow">A clear path forward</p>
          <h2>From curiosity to a better-informed property.</h2>
          <div className="air-steps">
            {[
              ["Explore free", "Browse Massachusetts wireless context."],
              [
                "Create a free account",
                "Save properties in your demo workspace.",
              ],
              [
                "Claim your property",
                "Request verification of your relationship.",
              ],
              [
                "Publish a SCIP with AIR Pro",
                "Planned hosting and marketing, after verification.",
              ],
            ].map(([title, body], i) => (
              <div key={title}>
                <span className="air-step-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <Link className="air-text-link" href="/how-it-works">
            See how AIR works →
          </Link>
        </section>
        <section className="air-section air-tinted">
          <div className="air-container air-split">
            <MapPreview />
            <div>
              <p className="air-eyebrow">AIR Explore / Free to browse</p>
              <h2>
                A place to start.
                <br />A new way to see your property.
              </h2>
              <p className="air-lead">
                Explore the relationship between real estate and wireless
                infrastructure, one property at a time.
              </p>
              <ul className="air-check-list">
                <li>Browse the Massachusetts property map</li>
                <li>Discover illustrative nearby infrastructure context</li>
                <li>Save properties with a free demo account</li>
              </ul>
              <ButtonLink href="/app">Open AIR Explore →</ButtonLink>
            </div>
          </div>
        </section>
        <section className="air-section air-container air-split">
          <div>
            <p className="air-eyebrow">The wireless horizon</p>
            <h2>
              New wireless architectures could create new site requirements.
            </h2>
          </div>
          <div>
            <p className="air-lead">
              From terrestrial densification to satellite-to-cellular concepts,
              the connectivity conversation is changing. AIR helps landlords ask
              informed questions about what may come next.
            </p>
            <Link
              className="air-text-link"
              href="/intelligence/starlink-mobile"
            >
              Read our Starlink Mobile perspective →
            </Link>
            <p className="air-fine">
              Independent commentary. AIR is not affiliated with Starlink,
              SpaceX, Verizon, AT&T, T-Mobile or any carrier. Technology
              developments do not establish demand for a particular property.
            </p>
          </div>
        </section>
        <section className="air-section air-tinted">
          <div className="air-container">
            <div className="air-section-head">
              <div>
                <p className="air-eyebrow">AIR Intelligence</p>
                <h2>Context before commitment.</h2>
              </div>
              <Link className="air-text-link" href="/intelligence">
                Read AIR Intelligence →
              </Link>
            </div>
            <ArticleCards items={articles.slice(3, 6)} />
          </div>
        </section>
        <section className="air-section air-container">
          <p className="air-eyebrow">The expansion roadmap</p>
          <h2>Focused today. Built for what comes next.</h2>
          <p className="air-lead">
            Starting with wireless in Massachusetts. Built to expand into solar,
            battery storage and other alternative infrastructure markets.
          </p>
          <div className="air-roadmap">
            {[
              "Wireless / Massachusetts",
              "Solar",
              "Battery Storage",
              "EV Charging",
              "Outdoor Advertising",
            ].map((s, i) => (
              <div key={s}>
                <span>{i === 0 ? "LAUNCH FOCUS" : "FUTURE VISION"}</span>
                <h3>{s}</h3>
              </div>
            ))}
          </div>
        </section>
        <section className="air-final">
          <div className="air-container">
            <p className="air-eyebrow">Your property. A new perspective.</p>
            <h2>Start with the real estate you know.</h2>
            <ButtonLink href="/app">
              Explore a Massachusetts Property — Free →
            </ButtonLink>
            <p>Free browsing. Clear context. No lease guarantees.</p>
          </div>
        </section>
      </main>
    </>
  );
}
