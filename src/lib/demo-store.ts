"use client";
import { useSyncExternalStore } from "react";
import { initialState, type DemoState } from "./demo";
const key = "easement-prototype-v1";
const fallback = JSON.stringify(initialState);
let memory = fallback;
function snapshot() {
  try {
    return localStorage.getItem(key) ?? memory;
  } catch {
    return memory;
  }
}
function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("easement-demo", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("easement-demo", cb);
  };
}
export function useDemo() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => fallback);
  let state: DemoState;
  try {
    state = { ...initialState, ...JSON.parse(raw) };
  } catch {
    state = initialState;
  }
  return [
    state,
    (update: (s: DemoState) => DemoState) => {
      let current;
      try {
        current = { ...initialState, ...JSON.parse(snapshot()) };
      } catch {
        current = initialState;
      }
      memory = JSON.stringify(update(current));
      try {
        localStorage.setItem(key, memory);
      } catch {
        /* In-memory mode when browser storage is unavailable. */
      }
      window.dispatchEvent(new Event("easement-demo"));
    },
  ] as const;
}
function subscribeRoute(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}
export function useRoute() {
  return useSyncExternalStore(
    subscribeRoute,
    () => window.location.hash.slice(1) || "explore",
    () => "explore",
  );
}
