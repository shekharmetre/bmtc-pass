"use client";

import { useState, useEffect } from "react";

export function useLocalStorageOnce<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    if (typeof window === "undefined") return; // 🚀 prevent SSR crash

    // Check if loaded once per session
    const loaded = sessionStorage.getItem(`__loaded_${key}`);

    if (!loaded) {
      sessionStorage.setItem(`__loaded_${key}`, "yes");

      try {
        const raw = localStorage.getItem(key);
        setValue(raw ? JSON.parse(raw) : fallback);
      } catch {
        setValue(fallback);
      }
    } else {
      try {
        const raw = localStorage.getItem(key);
        setValue(raw ? JSON.parse(raw) : fallback);
      } catch {
        setValue(fallback);
      }
    }
  }, [key, fallback]);

  const save = (val: T) => {
    setValue(val);
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(val));
    }
  };

  return [value, save] as const;
}
