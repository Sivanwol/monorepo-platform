import type { Metadata } from "next";
import { Suspense, useState } from "react";
import { redirect } from "next/navigation";
import { session } from "@descope/nextjs-sdk/server";
import type { MenuGroup } from "@app/ui"
import { DashboardLayout, LoadingPage } from "@app/ui";
import { api, HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
};

const menuGroups: MenuGroup[] = [
  {
    label: "Dashboard",
    icon: "HiViewBoards",
    route: "/en/platform/dashboard",
    items: [],
  },
  {
    label: "Subscriptions",
    icon: "HiShoppingBag",
    items: [
      { label: "Plans", route: "/en/platform/subscriptions/plans", icon: null },
      {
        label: "Products",
        route: "/en/platform/subscriptions/products",
        icon: null,
      },
      {
        label: "Transactions",
        route: "/en/platform/subscriptions/transactions",
        icon: null,
      },
    ],
  },
  {
    label: "Reports",
    icon: "HiChartPie",
    items: [
      { label: "Overview", route: "/en/platform/reports", icon: null },
      { label: "Analytics", route: "/en/platform/reports/analytics", icon: null },
      { label: "Sales", route: "/en/platform/reports/sales", icon: null },
    ],
  },
];
export default async function PlatformLayout({ children }: { children: any }) {
  const currSession = session();
  console.log("layout session", currSession);
  if (!currSession) {
    redirect("/en/auth");
  }
  let maintenance = false;
  const taskedCheckerMaintenance = () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(() => checkMaintenance(), 50000);
  };
  const checkMaintenance = async () => {
    try {
      const res = await api.settings.checkMaintenanceStatus();
      maintenance = res.status || false;
      if (maintenance) {
        taskedCheckerMaintenance();
      }
    } catch (error) {
      console.error("Error fetching maintenance status", error);
      taskedCheckerMaintenance();
    }
  };
  await checkMaintenance();
  let maintenceRenderer = <></>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (maintenance) {
    maintenceRenderer = <div className="flex flex-col rounded-md bg-gray-100">
      <div className="rounded-t-md bg-gray-200 p-4 font-bold">
        Platform on Maintenance Mode please contact the platform admin
      </div>
    </div>
  }
  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch();
  const userData = await api.auth.getUser();
  console.log(userData)
  return (
    <HydrateClient>
      <Suspense fallback={<LoadingPage />}>
        <DashboardLayout
          sideMenuItems={maintenance ? [] : menuGroups}
          notifications={[]}
          user={{
            userAvatar: "https://ui-avatars.com/api/?format=png",
            fullname: `${userData?.firstName} ${userData?.lastName}`,
            profileLink: "en/platform/user/me",
            settingsLink: "en/platform/user/settings"
          }}
        >
          {maintenance ? maintenceRenderer : children}
        </DashboardLayout>
      </Suspense>
    </HydrateClient>
  );
}
