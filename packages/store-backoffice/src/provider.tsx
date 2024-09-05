import type { FC, ReactNode } from "react";

import { StoreProvider } from "./helpers";
import {
  createFetcherStore,
  createTableStore,
  FetcherStoreContext,
  TableStoreContext,
} from "./stores";

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
