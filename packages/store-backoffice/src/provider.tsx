import type { FC, ReactNode } from "react";
import {
  createFetcherStore,
  createTableStore,
  FetcherStoreContext,
  TableStoreContext,
} from "./stores";
import { StoreProvider } from "./helpers";

export const StoreBackofficeProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <StoreProvider createStore={createTableStore} context={TableStoreContext}>
        <StoreProvider
          createStore={createFetcherStore}
          context={FetcherStoreContext}
        >
          {children}
        </StoreProvider>
      </StoreProvider>
    </>
  );
};
