"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="air-container air-section">
      <h1>We couldn’t load this workspace.</h1>
      <p>Your browser’s demo data may still be available. Try again.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
