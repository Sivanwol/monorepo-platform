import type { Metadata, Viewport } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { AdminTheme, cn } from "@app/ui";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { ThemeProvider } from "@mui/material/styles";

import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      env.VERCEL_URL!
      : "http://localhost:3001",
  ),
  title: "Backoffice of Sabu Platform",
  description: "Backoffice of Sabu Platform For both mobile and web app",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={AdminTheme}>
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
