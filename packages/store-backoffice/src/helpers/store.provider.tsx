"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

interface StoreProviderProps<T> {
  createStore: () => T;
  context: React.Context<T | undefined>;
  children: ReactNode;
}

export const StoreProvider = <T,>({
  createStore,
  context,
  children,
}: StoreProviderProps<T>) => {
  const storeRef = useRef<T>();
  if (!storeRef.current) {
    storeRef.current = createStore();
  }

  return (
    <context.Provider value={storeRef.current}>{children}</context.Provider>
  );
};
