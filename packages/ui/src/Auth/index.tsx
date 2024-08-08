"use client";

import React from "react";
import { SignUpOrInFlow } from '@descope/nextjs-sdk';

export function Signin() {
  return (
    <div className="flex flex-col items-center rounded-md p-24">
      <SignUpOrInFlow
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
