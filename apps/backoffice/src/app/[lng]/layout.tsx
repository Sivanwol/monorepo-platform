import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@descope/nextjs-sdk";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Analytics } from "@vercel/analytics/react";
import { ThemeModeScript } from "flowbite-react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { AdminTheme, cn } from "@app/ui";

import { TRPCReactProvider } from "~/trpc/react";

import "./globals.css";

import { env } from "~/env";
import type { LayoutCommonProps } from "@app/utils";

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


export default async function RootLayout({
  children,
  params: { lng },
}: LayoutCommonProps) {
  console.log("system lang", lng);
  return (
    <html lang={lng} suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <AuthProvider projectId={env.NEXT_PUBLIC_AUTH_DESCOPE_ID}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={AdminTheme}>
              <CssBaseline />
              <TRPCReactProvider>
                {children}
              </TRPCReactProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </AuthProvider>
      </body>
      <Analytics />
    </html>
  );
}