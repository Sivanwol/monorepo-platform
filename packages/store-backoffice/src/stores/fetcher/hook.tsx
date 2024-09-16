"use client";

import { useContext } from "react";
import { useStore } from "zustand";

import { FetcherStoreContext } from "./store";

export const useFetcherStore = <T,>(selector: (store: any) => T): T => {
  const storeContext = useContext(FetcherStoreContext);
  if (!storeContext) {
    throw new Error("useFetcherStore must be used within a StoreProvider");
  }
  return useStore(storeContext, selector);
};
