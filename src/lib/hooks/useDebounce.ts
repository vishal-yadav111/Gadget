"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useDebounce hook
 * Debounces a fast-changing state value (e.g. search query, date input) by delayMs.
 */
export function useDebounce<T>(value: T, delayMs: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * useDebouncedCallback hook
 * Returns a memoized debounced function that delays invoking callback until after delayMs have elapsed.
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delayMs: number = 350
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delayMs);
    },
    [delayMs]
  );
}

export default useDebounce;
