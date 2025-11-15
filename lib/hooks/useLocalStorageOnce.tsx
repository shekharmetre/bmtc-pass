'use client'
import { useState } from "react";

export function useLocalStorageOnce<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T | null>(() => {
  
    // first visit?
    const loaded = sessionStorage.getItem(`__loaded_${key}`);

    if (!loaded) {
      // mark as loaded
      sessionStorage.setItem(`__loaded_${key}`, "yes");

      // load from localStorage ONLY once
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    }

    // if refreshed → return latest saved value (no reload)
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  });

  const save = (val: T) => {
    setValue(val);  
    localStorage.setItem(key, JSON.stringify(val)); // always save manually
  };

  return [value, save] as const;
}
