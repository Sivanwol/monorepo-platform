"use client";

import { Loader } from "../Loader";

export interface LoaderWidgetProps {
  showLoader: boolean;
  children: React.ReactNode;
}
export const LoaderWidget = ({ showLoader, children }: LoaderWidgetProps) => {
  return <>{showLoader ? <Loader /> : children}</>;
};
