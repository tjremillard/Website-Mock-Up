"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
export function VisionAccess() {
  const params = useSearchParams();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const password = String(new FormData(e.currentTarget).get("password"));
        setBusy(true);
        setMessage("");
        try {
          const response = await fetch("/api/vision-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              password,
              returnTo: params.get("returnTo"),
            }),
          });
          const data = await response.json();
          if (!response.ok) {
            setMessage(data.message);
            return;
          }
          window.location.assign(data.returnTo);
        } catch {
          setMessage(
            "Could not reach the internal access service. Please try again.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <label>
        Internal preview password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          maxLength={256}
        />
      </label>
      {message && <p role="alert">{message}</p>}
      <button disabled={busy}>
        {busy ? "Verifying access…" : "Open internal preview"}
      </button>
      <p className="air-fine">
        Server-verified access. If secrets have not been configured, the preview
        remains locked.
      </p>
    </form>
  );
}
