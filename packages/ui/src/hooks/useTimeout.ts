'use client'
import { useEffect, useRef } from 'react';

export default function useTimeout(callback: () => void, delay: number | null) {
  const callbackRef = useRef<() => void>();

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!delay) {
      return () => { };
    }

    const timeout = setTimeout(() => {
      callbackRef.current && callbackRef.current();
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);
}
