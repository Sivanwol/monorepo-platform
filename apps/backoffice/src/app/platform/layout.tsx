import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { session } from "@descope/nextjs-sdk/server";

import type { MenuGroup } from "@app/ui";
import { DefaultLayout, LoadingPage } from "@app/ui";

import { env } from "~/env";
import { api, HydrateClient } from "~/trpc/server";
import useTimeout from "@app/ui";

export const metadata: Metadata = {
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
};

const menuGroups: MenuGroup[] = [
  {
    label: "Dashboard",
    icon: "HiViewBoards",
    route: "/platform/dashboard",
    items: [],
  },
  {
    label: "Subscriptions",
    icon: "HiShoppingBag",
    items: [
      { label: "Plans", route: "/platform/subscriptions/plans", icon: null },
      { label: "Products", route: "/platform/subscriptions/products", icon: null },
      { label: "Transactions", route: "/platform/subscriptions/transactions", icon: null },
    ],
  },
  {
    label: "Reports",
    icon: "HiChartPie",
    items: [
      { label: "Overview", route: "/platform/reports", icon: null },
      { label: "Analytics", route: "/platform/reports/analytics", icon: null },
      { label: "Sales", route: "/platform/reports/sales", icon: null },
    ],
  },
];
export default async function PlatformLayout({ children }: { children: any }) {
  const currSession = session();
  console.log("layout session", currSession);
  // api.
  if (!currSession) {
    redirect("/auth");
  }
  let maintenance = false;
  const taskedCheckerMaintenance = () => {
    setTimeout(checkMaintenance, 5000);
  }
  const checkMaintenance = async () => {
    try {
      const res = await api.settings?.maintenanceStatus();
      maintenance = res.status;
      if (maintenance) {
        taskedCheckerMaintenance()
      }
    } catch (error) {
      console.error("Error fetching maintenance status", error);
      taskedCheckerMaintenance()
    };
  }
  await checkMaintenance();
  if (maintenance) {
    return (
      <HydrateClient>
        <div className="flex flex-col rounded-md bg-gray-100">
          <div className="rounded-t-md bg-gray-200 p-4 font-bold">
            Platform on Maintenance Mode please contact the platform admin
          </div>
        </div>
      </HydrateClient>)
  }
  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<LoadingPage />}>
        <DefaultLayout
          sideMenuItems={menuGroups}
          notifications={[]}
          user={{
            userAvatar: "https://ui-avatars.com/api/?format=png",
            fullname: "John Doe",
            profileLink: "/platform/user/me",
            settingsLink: "/platform/user/settings",
            logoutLink: "/platform/user/logout",
          }}
        >
          {children}
        </DefaultLayout>
      </Suspense>
    </HydrateClient>
  );
}
