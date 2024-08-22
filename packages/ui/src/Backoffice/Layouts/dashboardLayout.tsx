"use client";

import React, { useState } from "react";

import { Header, SidebarArea } from "@app/ui";

import type { DashboardLayoutProps } from "./type";

export function DashboardLayout({
  children,
  sideMenuItems,
  notifications,
  user,
  lng,
  blockActions,
  translations
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  console.log("translations", translations);
  return (
    <>
      {/* <!-- ===== Page Wrapper Star ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Star ===== --> */}
        <SidebarArea
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          lng={lng}
          items={sideMenuItems}
          translations={translations}
        />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Star ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Star ===== --> */}
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            lng={lng}
            notifications={notifications}
            blockActions={blockActions}
            user={user}
            translations={translations}
          />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Star ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
