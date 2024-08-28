import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  params: {
    lng: string;
  };
}

export default function RootLayout({ children }: Props) {
  return children;
}
