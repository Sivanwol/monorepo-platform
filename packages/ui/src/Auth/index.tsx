"use client";

import React from "react";
import { Descope } from "@descope/nextjs-sdk";

export function Signin() {
  return (
    <div className="flex flex-col items-center rounded-md p-24">
      <Descope
        flowId="sign-up-or-in"
        onSuccess={(e) => {
          console.log("Logged in!", e);
        }}
        onError={(e) => console.log("Could not logged in!")}
        redirectAfterSuccess="/platform/dashboard"
        // redirectAfterError="/error-page"
      />
    </div>
  );
}
