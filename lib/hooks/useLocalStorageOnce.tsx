"use client";

import { useState, useEffect } from "react";

export function useLocalStorageOnce<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safe

    let initial: T = fallback;

    try {
      const loaded = window.sessionStorage.getItem(`__loaded_${key}`);

      if (!loaded) {
        // first time this session
        window.sessionStorage.setItem(`__loaded_${key}`, "yes");

        const raw = window.localStorage.getItem(key);
        initial = raw ? JSON.parse(raw) : fallback;
      } else {
        // already loaded once this session
        const raw = window.localStorage.getItem(key);
        initial = raw ? JSON.parse(raw) : fallback;
      }
    } catch {
      initial = fallback;
    }

    // Set only after reading to avoid flashing fallback value
    setValue(initial);

    // ⚠️ fallback removed from deps to prevent re-running effect
  }, [key]);

  const save = (val: T) => {
    setValue(val);

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(val));
      } catch {
        // ignore write errors
      }
    }
  };

  return [value, save] as const;
}
