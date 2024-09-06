"use client";

import { useContext } from "react";
import { useStore } from "zustand";

import { TableStoreContext } from "./store";

export const useTableStore = <T,>(selector: (store: any) => T): T => {
  const storeContext = useContext(TableStoreContext);
  if (!storeContext) {
    throw new Error("useTableStore must be used within a StoreProvider");
  }
  return useStore(storeContext, selector);
};
