"use client";

import { useEffect, useState } from "react";

/**
 * Delays propagating a rapidly changing value. Used by the employees search
 * box so that typing does not fire a request per keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
