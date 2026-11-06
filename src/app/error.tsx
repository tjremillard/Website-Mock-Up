"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="air">
      <main className="air-container air-section">
        <p className="air-eyebrow">AIR / Loading issue</p>
        <h1>This page couldn’t load.</h1>
        <p>Please try again. No payment or publication has occurred.</p>
        <button onClick={reset}>Try again</button>
      </main>
    </div>
  );
}
