import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebunceValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebunceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
