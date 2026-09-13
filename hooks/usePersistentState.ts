"use client";

import { useCallback, useSyncExternalStore } from "react";

function read<T>(key: string, initial: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? (JSON.parse(stored) as T) : initial;
  } catch {
    return initial;
  }
}

const eventName = (key: string) => `persistent-state:${key}`;

function subscribe(key: string) {
  return (onChange: () => void) => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) onChange();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(eventName(key), onChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(eventName(key), onChange);
    };
  };
}

export function usePersistentState<T>(key: string, initial: T) {
  const value = useSyncExternalStore(
    subscribe(key),
    () => read(key, initial),
    () => initial,
  );

  const set = useCallback(
    (next: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ignore
      }
      window.dispatchEvent(new Event(eventName(key)));
    },
    [key],
  );

  return [value, set] as const;
}
