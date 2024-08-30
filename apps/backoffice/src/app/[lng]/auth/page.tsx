import type { Metadata } from "next";
import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { session } from "@descope/nextjs-sdk/server";

import { LoadingSpinner, Signin } from "@app/ui";

export const metadata: Metadata = {
  title: "monorepo backoffice Login Page",
  description: "This is Next.js Login Page NextAdmin Dashboard Kit",
};

export default function SignInPage() {
  const curSession = session();
  console.log("auth session", curSession);
  if (curSession) {
    redirect("/en/platform/dashboard");
  }
  return (
    <div className="relative h-full min-h-screen w-full py-40">
      {/* <Breadcrumb pageName="Sign In" /> */}

      <div className="bg-blueGray-800 bg-full absolute top-0 h-full w-full bg-no-repeat">
        <div className="container mx-auto h-full px-4">
          <div className="flex h-full content-center items-center justify-center">
            <div className="w-full px-4 lg:w-4/12">
              <div className="bg-blueGray-200 relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">
                <Suspense fallback={<LoadingSpinner />}>
                  <Signin />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
