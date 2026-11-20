"use client";

import { useSyncExternalStore } from "react";
import type { Dispatch, SetStateAction } from "react";
import { readToolParam } from "@/lib/tool-url-state";

const stateEvent = "manasflow:tool-state";
function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener(stateEvent, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(stateEvent, listener);
  };
}
const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

export function useToolSearch() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// The native History API keeps forms in sync without a server navigation on edits.
// useSyncExternalStore supplies a stable SSR snapshot and handles Back/Forward.
export function useToolState<T>(key: string, fallback: T, restore?: (value: unknown) => T): [T, Dispatch<SetStateAction<T>>] {
  const search = useToolSearch();
  const value = readToolParam(search, key, fallback, restore);
  const setValue: Dispatch<SetStateAction<T>> = update => {
    const url = new URL(window.location.href);
    const current = readToolParam(url.search, key, fallback, restore);
    const next = typeof update === "function" ? (update as (previous: T) => T)(current) : update;
    if (JSON.stringify(next) === JSON.stringify(fallback)) url.searchParams.delete(key);
    else url.searchParams.set(key, JSON.stringify(next));
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new Event(stateEvent));
  };
  return [value, setValue];
}
