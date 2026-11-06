import Link from "next/link";
export default function NotFound() {
  return (
    <div className="air">
      <main className="air-container air-section">
        <p className="air-eyebrow">AIR / 404</p>
        <h1>We couldn’t find that page.</h1>
        <p>Check the address or return to a known starting point.</p>
        <Link className="air-button" href="/">
          Return to AIR
        </Link>
      </main>
    </div>
  );
}
