import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

import type { BaseCommonProps } from "@app/utils";
import { cn } from "@app/ui";

import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        env.VERCEL_URL!
      : "http://localhost:3001",
  ),
  title: "Backoffice of monorepo Platform",
  description: "Backoffice of monorepo Platform For both mobile and web app",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function DocsLayout({ children }: BaseCommonProps) {
  return (
    <html suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
