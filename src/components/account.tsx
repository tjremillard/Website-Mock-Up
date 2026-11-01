"use client";
import { useState } from "react";
import { useDemo } from "@/lib/demo-store";
import type { OwnerPlan } from "@/lib/demo";
import { Card, Heading } from "./ui";

export function Account({
  audience = "developer",
  context,
  returnTo = "developer",
}: {
  audience?: "owner" | "developer";
  context?: string;
  returnTo?: string;
}) {
  const [state, set] = useDemo();
  const owner = audience === "owner";
  const profile = owner ? state.ownerAccount : state.account;
  const [mode, setMode] = useState<"signup" | "login">(
    context === "login" ? "login" : "signup",
  );
  const [name, setName] = useState(profile?.name ?? "");
  const [users, setUsers] = useState(profile?.users ?? "1");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [error, setError] = useState("");
  const selectedPlan = ["baseline", "mid-market", "portfolio"].includes(
    context ?? "",
  )
    ? (context as OwnerPlan)
    : undefined;
  const planNames = {
    baseline: "Baseline",
    "mid-market": "Mid-Market",
    portfolio: "Portfolio Marketing",
  };
  const save = owner && context === "save";
  return (
    <div className="page account-page">
      <a className="back" href={owner ? "#owner/pricing" : "#developer"}>
        ← {owner ? "Property Owners" : "Infrastructure Developers"}
      </a>
      <Heading
        eyebrow={owner ? "Property Owners" : "Infrastructure Developers"}
        title={mode === "signup" ? "Create a Free Account" : "Log in"}
      >
        {owner
          ? save
            ? "Save your complimentary Easement Marketing Feasibility Analysis."
            : "Understand your portfolio’s potential with Easement Exchange."
          : "Create a free account or log in to browse properties and connect with owners."}
      </Heading>
      {selectedPlan && (
        <p className="notice">
          Selected service: {planNames[selectedPlan]}. No subscription is
          activated or payment collected in this prototype.
        </p>
      )}
      <Card>
        <div className="segmented account-modes" aria-label="Account options">
          <button
            type="button"
            aria-pressed={mode === "signup"}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Create a Free Account
          </button>
          <button
            type="button"
            aria-pressed={mode === "login"}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Log in
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const normalizedEmail = email.trim().toLowerCase();
            if (mode === "signup" && !name.trim()) {
              setError("Enter your name.");
              return;
            }
            if (
              mode === "login" &&
              (!profile?.email ||
                profile.email.toLowerCase() !== normalizedEmail)
            ) {
              setError(
                "No demo account with that email is saved in this browser. Create a free account to continue.",
              );
              return;
            }
            set((s) => {
              const account =
                mode === "login"
                  ? profile!
                  : {
                      name: name.trim(),
                      email: normalizedEmail,
                      ...(!owner ? { users } : {}),
                    };
              if (!owner) return { ...s, account, developerSignedIn: true };
              const analysis = save ? s.pendingAnalysis : undefined;
              return {
                ...s,
                ownerAccount: account,
                ownerSignedIn: true,
                ownerPlan: selectedPlan ?? s.ownerPlan,
                savedAnalyses: analysis
                  ? [
                      ...(s.savedAnalyses ?? []).filter(
                        (item) => item.address !== analysis.address,
                      ),
                      analysis,
                    ]
                  : s.savedAnalyses,
                pendingAnalysis: save ? undefined : s.pendingAnalysis,
              };
            });
            location.hash = owner
              ? selectedPlan
                ? "owner/pricing"
                : "owner/analyses"
              : returnTo;
          }}
        >
          {mode === "signup" && (
            <label>
              Name
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {!owner && mode === "signup" && (
            <label>
              Users on your team
              <input
                type="number"
                min="1"
                max="1000"
                required
                value={users}
                onChange={(e) => setUsers(e.target.value)}
              />
            </label>
          )}
          <p className="fine">
            Prototype account flow · profile and sign-in state are saved only in
            this browser. No secure authentication, email verification, or
            password collection is connected.
          </p>
          {error && <p role="alert">{error}</p>}
          <button type="submit">
            {mode === "signup" ? "Create Free Account" : "Log in to demo"}
          </button>
        </form>
      </Card>
    </div>
  );
}
