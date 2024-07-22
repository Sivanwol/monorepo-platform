// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Signin } from "@app/ui";

export const metadata: Metadata = {
  title: "Next.js Login Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Login Page NextAdmin Dashboard Kit",
};

export default function SignIn() {
  return (
    <>
      {/* <Breadcrumb pageName="Sign In" /> */}

      <div className="shadow-1 dark:bg-gray-dark rounded-[10px] bg-white dark:shadow-card">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="sm:p-12.5 xl:p-15 w-full p-4">
              <Signin />
            </div>
          </div>

          <div className="p-7.5 hidden w-full xl:block xl:w-1/2">
            <div className="custom-gradient-1 px-12.5 pt-12.5 dark:!bg-dark-2 overflow-hidden rounded-2xl dark:bg-none">
              <Link className="mb-10 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/logo.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo-dark.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
              </Link>
              <p className="text-dark mb-3 text-xl font-medium dark:text-white">
                Sign in to your account
              </p>

              <h1 className="text-dark sm:text-heading-3 mb-4 text-2xl font-bold dark:text-white">
                Welcome Back!
              </h1>

              <p className="text-dark-4 dark:text-dark-6 w-full max-w-[375px] font-medium">
                Please sign in to your account by completing the necessary
                fields below
              </p>

              <div className="mt-31">
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Logo"
                  width={405}
                  height={325}
                  className="mx-auto dark:opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
