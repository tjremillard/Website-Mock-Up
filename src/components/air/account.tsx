"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDemo, updateDemo } from "@/lib/air/demo-store";
import { properties } from "@/data/air";
import { trackEvent } from "@/lib/air/analytics";
import { PageHeading, ButtonLink, Badge } from "./brand";
export function DemoNotice() {
  const { storageAvailable } = useDemo();
  return (
    <div className="air-demo-notice">
      Demo Mode · Fictional data · Browser-only state
      {!storageAvailable &&
        " · Storage unavailable: changes last only for this session"}
    </div>
  );
}
function safeReturn(value: string | null) {
  if (!value) return "/app";
  try {
    const url = new URL(value, "https://air.invalid");
    return url.origin === "https://air.invalid" &&
      /^\/app(?:\/|\?|$)/.test(url.pathname + url.search)
      ? url.pathname + url.search
      : "/app";
  } catch {
    return "/app";
  }
}
export function DemoAuth({ signIn = false }: { signIn?: boolean }) {
  const { state } = useDemo();
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const returnTo = safeReturn(params.get("returnTo"));
  return (
    <div className="air-auth-card">
      <Badge>Demo Mode · No production authentication</Badge>
      <PageHeading
        eyebrow="Your AIR workspace"
        title={signIn ? "Welcome back." : "A clearer view starts here."}
      >
        {signIn
          ? "Sign in to the demo profile saved in this browser."
          : "Create a free demo profile to save properties and request verification."}
      </PageHeading>
      <p className="air-fine">
        Use fictional details. Your name and email stay in this browser; no
        password, email verification or real account is created.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          const f = new FormData(e.currentTarget);
          const email = String(f.get("email")).trim().toLowerCase();
          const name = String(f.get("name") ?? "").trim();
          if (signIn && (!state.profile || state.profile.email !== email)) {
            setError(
              "No matching demo profile in this browser. Create a free demo account first.",
            );
            return;
          }
          setPending(true);
          trackEvent("signup_started");
          const match = returnTo.match(/^\/app\/property\/([^?]+)/);
          const intent = new URL(
            returnTo,
            "https://air.invalid",
          ).searchParams.get("intent");
          updateDemo((s) => ({
            ...s,
            profile: signIn ? s.profile : { name, email },
            signedIn: true,
            saved:
              intent === "save" && match && !s.saved.includes(match[1])
                ? [...s.saved, match[1]]
                : s.saved,
          }));
          trackEvent("signup_completed_demo");
          if (intent === "save" && match)
            trackEvent("property_saved", { id: match[1] });
          router.push(returnTo);
        }}
      >
        {!signIn && (
          <label>
            Name
            <input
              name="name"
              required
              maxLength={80}
              autoComplete="off"
              placeholder="Demo Property Owner"
            />
          </label>
        )}
        <label>
          Email
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="off"
            placeholder="owner@example.test"
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button disabled={pending} type="submit">
          {pending
            ? "Opening demo workspace…"
            : signIn
              ? "Sign in to demo"
              : "Create free demo account"}
        </button>
      </form>
      <p className="air-fine">
        <Link
          href={`${signIn ? "/sign-up" : "/sign-in"}?returnTo=${encodeURIComponent(returnTo)}`}
        >
          {signIn
            ? "Create a free demo account"
            : "Already have a demo profile? Sign in"}
        </Link>
      </p>
    </div>
  );
}
export function SavedProperties({ claims = false }: { claims?: boolean }) {
  const { state } = useDemo();
  const list = properties.filter((p) =>
    claims
      ? state.claims.some((c) => c.propertyId === p.id)
      : state.saved.includes(p.id),
  );
  return (
    <>
      <PageHeading
        eyebrow={claims ? "My Properties" : "Saved Properties"}
        title={
          claims ? "Your property workspace." : "Keep your research together."
        }
      >
        Demo data saved locally. Claims remain pending and do not verify
        ownership.
      </PageHeading>
      {!state.signedIn ? (
        <div className="air-card">
          <h2>Sign in to your demo workspace</h2>
          <ButtonLink
            href={`/sign-in?returnTo=${encodeURIComponent(claims ? "/app/my-properties" : "/app/saved")}`}
          >
            Sign in →
          </ButtonLink>
        </div>
      ) : list.length ? (
        <div className="air-card-grid">
          {list.map((p) => (
            <section className="air-card" key={p.id}>
              <Badge>
                {claims ? "Verification required" : "Saved · Demo data"}
              </Badge>
              <h2>{p.address}</h2>
              <p>
                {p.city} · {p.propertyType}
              </p>
              {claims && <p>Pending demo claim · Nothing has been verified.</p>}
              <ButtonLink href={`/app/property/${p.id}`} secondary>
                View property →
              </ButtonLink>
              {claims ? (
                <p className="air-fine">
                  <Link href={`/app/scip/${p.id}`}>Preview SCIP</Link>
                </p>
              ) : (
                <button
                  className="outline"
                  onClick={() =>
                    updateDemo((s) => ({
                      ...s,
                      saved: s.saved.filter((id) => id !== p.id),
                    }))
                  }
                >
                  Remove saved property
                </button>
              )}
            </section>
          ))}
        </div>
      ) : (
        <div className="air-card">
          <h2>
            {claims ? "No claimed properties yet." : "No saved properties yet."}
          </h2>
          <p>Explore a demo property to get started.</p>
          <ButtonLink href="/app">Explore properties →</ButtonLink>
        </div>
      )}
    </>
  );
}
export function Account() {
  const { state } = useDemo();
  const [message, setMessage] = useState("");
  return (
    <>
      <PageHeading
        eyebrow="Account / Demo Mode"
        title={
          state.signedIn
            ? `Welcome, ${state.profile?.name ?? "property owner"}.`
            : "Your AIR account."
        }
      >
        Manage local demo preferences. AIR Pro is not active; no billing is
        connected.
      </PageHeading>
      {!state.signedIn ? (
        <ButtonLink href="/sign-up?returnTo=%2Fapp%2Faccount">
          Create a free demo account →
        </ButtonLink>
      ) : (
        <div className="air-price-grid">
          <section className="air-card">
            <h2>Markets you follow</h2>
            <Badge>Massachusetts Wireless</Badge>
            <p className="air-fine">Launch coverage only.</p>
            <label className="air-checkbox">
              <input
                type="checkbox"
                checked={state.notifications}
                onChange={(e) => {
                  updateDemo((s) => ({
                    ...s,
                    notifications: e.target.checked,
                  }));
                  setMessage(
                    "Preference saved locally. No notifications will be sent.",
                  );
                }}
              />
              Demo notification preference
            </label>
            <p className="air-fine">No emails or alerts are sent.</p>
            <button
              className="outline"
              onClick={() => updateDemo((s) => ({ ...s, signedIn: false }))}
            >
              Sign out of demo
            </button>
          </section>
          <section className="air-card">
            <Badge>Future premium preview</Badge>
            <h2>AIR Pro</h2>
            <p>Subscription: Free demo. Pro price TBD.</p>
            <p>
              Enhanced analytics, SCIP hosting and active marketing are planned.
              Publication requires verified ownership, owner approval and
              billing.
            </p>
            <button
              onClick={() => {
                updateDemo((s) => ({ ...s, proInterest: true }));
                setMessage(
                  "Pro interest saved in this browser only. You have not joined a live waitlist; no request was sent.",
                );
                trackEvent("pro_cta_clicked");
              }}
            >
              {state.proInterest
                ? "Pro interest saved locally"
                : "Save demo interest in Pro"}
            </button>
            <p className="air-fine">
              This is a local interest preview, not a live waitlist.
            </p>
          </section>
        </div>
      )}
      {message && <p role="status">{message}</p>}
    </>
  );
}
