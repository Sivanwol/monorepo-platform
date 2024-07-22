import React from "react";
import { redirect } from "next/navigation";

import { auth } from "@app/auth";
import { Signin } from "@app/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sabu backoffice Login Page",
  description: "This is Next.js Login Page NextAdmin Dashboard Kit",
};

export default async function SignInPage() {
  const session = await auth();
  console.log("session", session);
  if (session) redirect("/platform/dashboard");
  return (
    <>
      {/* <Breadcrumb pageName="Sign In" /> */}

      <div className="shadow-1 dark:bg-gray-dark rounded-[10px] bg-white dark:shadow-card">
        <div className="flex w-full flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="sm:p-12.5 xl:p-15 w-full p-4">
              <Signin />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
