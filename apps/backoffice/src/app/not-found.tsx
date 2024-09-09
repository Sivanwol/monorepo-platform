"use client";

import React from "react";
import Link from "next/link";
import { CssBaseline } from "@mui/material";

import "./globals.css";

// Error boundaries must be Client Components
function ArrowRightIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <title>404 - Not Found</title>
        <CssBaseline />
      </head>
      <body>
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <div className="relative h-48 w-48 overflow-hidden rounded-full bg-primary">
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-6xl font-bold text-primary-foreground">
                  404
                </h1>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-32 w-32 animate-spin rounded-full border-4 border-primary-foreground border-t-transparent" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Oops, something went wrong!
            </h2>
            <p className="mt-4 text-muted-foreground">
              We couldn't find the page you were looking for. Don't worry, you
              can try going back to the homepage.
            </p>
            <div className="mt-6">
              <Link
                href="/en/platform"
                className="mt-4 inline-flex animate-bounce items-center rounded-md bg-secondary-foreground px-3 py-2 text-sm font-medium text-secondary shadow-sm transition-colors hover:bg-secondary-foreground/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                prefetch={false}
              >
                Go Home
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
