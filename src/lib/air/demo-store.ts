"use client";
import { useSyncExternalStore } from "react";
export type Claim = {
  propertyId: string;
  relationship: string;
  contact: string;
};
type DemoState = {
  profile: { name: string; email: string } | null;
  signedIn: boolean;
  saved: string[];
  claims: Claim[];
  notifications: boolean;
  proInterest: boolean;
};
const empty: DemoState = {
  profile: null,
  signedIn: false,
  saved: [],
  claims: [],
  notifications: false,
  proInterest: false,
};
const key = "air-demo-v1";
let snapshot = empty;
let rawCache: string | null = null;
let storageAvailable = true;
function read() {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== rawCache) {
      rawCache = raw;
      if (!raw) snapshot = empty;
      else {
        const p = JSON.parse(raw);
        snapshot = {
          profile:
            p.profile &&
            typeof p.profile.name === "string" &&
            typeof p.profile.email === "string"
              ? p.profile
              : null,
          signedIn: p.signedIn === true,
          saved: Array.isArray(p.saved)
            ? p.saved.filter((v: unknown) => typeof v === "string")
            : [],
          claims: Array.isArray(p.claims)
            ? p.claims.filter(
                (v: Claim) =>
                  v &&
                  typeof v.propertyId === "string" &&
                  typeof v.relationship === "string" &&
                  typeof v.contact === "string",
              )
            : [],
          notifications: p.notifications === true,
          proInterest: p.proInterest === true,
        };
      }
    }
  } catch {
    storageAvailable = false;
  }
  return snapshot;
}
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("air-demo-change", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("air-demo-change", listener);
  };
}
export function updateDemo(update: (state: DemoState) => DemoState) {
  snapshot = update(read());
  try {
    rawCache = JSON.stringify(snapshot);
    localStorage.setItem(key, rawCache);
  } catch {
    storageAvailable = false;
  }
  window.dispatchEvent(new Event("air-demo-change"));
}
export function useDemo() {
  const state = useSyncExternalStore(subscribe, read, () => empty);
  return { state, storageAvailable };
}
