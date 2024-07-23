import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { session } from "@descope/nextjs-sdk/server";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";

import type { DropdownUserProps, MenuGroup } from "@app/ui";
import { DefaultLayout, LoadingPage } from "@app/ui";

import { env } from "~/env";
import { api, HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
};

const menuGroups: MenuGroup[] = [
  {
    label: "Dashboard",
    icon: <HiViewBoards />,
    route: "/platform/dashboard",
    items: [],
  },
  {
    label: "Subscriptions",
    icon: <HiShoppingBag />,
    items: [
      { label: "Plans", route: "/platform/subscriptions/plans" },
      { label: "Products", route: "/platform/subscriptions/products" },
      { label: "Transactions", route: "/platform/subscriptions/transactions" },
    ],
  },
  {
    label: "Reports",
    icon: <HiChartPie />,
    items: [
      { label: "Overview", route: "/platform/reports" },
      { label: "Analytics", route: "/platform/reports/analytics" },
      { label: "Sales", route: "/platform/reports/sales" },
    ],
  },
];
export default function PlatformLayout({ children }: { children: any }) {
  const currSession = session();
  console.log("layout session", currSession);
  if (!currSession) {
    redirect("/auth");
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
          <div className="flex flex-col rounded-md bg-gray-100">
            <div className="rounded-t-md bg-gray-200 p-4 font-bold">
              Current Session
            </div>
            <pre className="whitespace-pre-wrap break-all px-4 py-6">
              {JSON.stringify(currSession, null, 2)}
            </pre>
          </div>
          {children}
        </DefaultLayout>
      </Suspense>
    </HydrateClient>
  );
}
