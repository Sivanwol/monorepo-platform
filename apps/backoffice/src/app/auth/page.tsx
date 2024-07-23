import type { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";
import { session } from "@descope/nextjs-sdk/server";

import { Signin } from "@app/ui";

export const metadata: Metadata = {
  title: "Sabu backoffice Login Page",
  description: "This is Next.js Login Page NextAdmin Dashboard Kit",
};

export default function SignInPage() {
  const curSession = session();
  console.log("auth session", curSession);
  if (curSession) {
    redirect("/platform/dashboard");
  }
  return (
    <div className="relative w-full h-full py-40 min-h-screen">
      {/* <Breadcrumb pageName="Sign In" /> */}

      <div className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full">
        <div className="container mx-auto px-4 h-full">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                <Signin />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
