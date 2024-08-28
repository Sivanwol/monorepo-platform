/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { session } from "@descope/nextjs-sdk/server";

import type { NotificationModel, UserModel } from "@app/db/client";
import type { MenuGroup } from "@app/ui";
import type { LayoutCommonProps } from "@app/utils";
import { DashboardLayout, LoadingPage } from "@app/ui";
import { initTranslation, t } from "@app/utils";

import { api, HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
};

export default async function PlatformLayout({
  children,
  params: { lng },
}: LayoutCommonProps) {
  let menuGroups: MenuGroup[] = [
    {
      label: "Dashboard",
      icon: "HiViewBoards",
      route: `/${lng}/platform/dashboard`,
      items: [],
    },
    {
      label: "Subscriptions",
      icon: "HiShoppingBag",
      items: [
        {
          label: "Plans",
          route: `/${lng}/platform/subscriptions/plans`,
          icon: null,
        },
        {
          label: "Products",
          route: `/${lng}/platform/subscriptions/products`,
          icon: null,
        },
        {
          label: "Transactions",
          route: `/${lng}/platform/subscriptions/transactions`,
          icon: null,
        },
      ],
    },
    {
      label: "Reports",
      icon: "HiChartPie",
      items: [
        { label: "Overview", route: `/${lng}/platform/reports`, icon: null },
        {
          label: "Analytics",
          route: `/${lng}/platform/reports/analytics`,
          icon: null,
        },
        { label: "Sales", route: `/${lng}/platform/reports/sales`, icon: null },
      ],
    },
  ];
  const currSession = session();
  await initTranslation(lng);
  const currentNS = "dashboardLayout";
  const user = await api.auth.getUser();
  if (!currSession || !user) {
    redirect(`/${lng}/auth`);
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
  let maintenanceRenderer = <></>;

  if (maintenance) {
    maintenanceRenderer = (
      <div className="flex flex-col rounded-md bg-gray-100">
        <div className="rounded-t-md bg-gray-200 p-4 font-bold">
          Platform on Maintenance Mode please contact the platform admin
        </div>
      </div>
    );
    menuGroups = [];
  }
  let notifications: NotificationModel[] = [];
  if (!maintenance) {
    try {
      const res: { items: NotificationModel[] } =
        await api.notifications.getLastNotification();
      notifications = res.items;
    } catch (error) {
      // Handle the error case
      console.error("Error fetching notifications:", error);
      notifications = []; // or any other default value
    }
  }
  const translations = {
    title: t(currentNS, "title"),
    dashboard: t(currentNS, "dashboard"),
    shortTitle: t(currentNS, "shortTitle"),
    support: t(currentNS, "support"),
    toggleSidebar: t(currentNS, "toggle-sidebar"),
    userSettings: t(currentNS, "user.settings"),
    userProfile: t(currentNS, "user.profile"),
    userLogout: t(currentNS, "user.logout"),
    notificationsTitle: t(currentNS, "notifications.title"),
    notificationsMarkAll: t(currentNS, "notifications.mark-all"),
    notificationsViewAll: t(currentNS, "notifications.view-all"),
    notificationsEmpty: t(currentNS, "notifications.empty"),
    notificationsNew: t(currentNS, "notifications.new", {
      count: notifications.filter((n) => !n.read).length,
    }),
  };
  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch();
  return (
    <HydrateClient>
      <Suspense fallback={<LoadingPage />}>
        <DashboardLayout
          sideMenuItems={menuGroups}
          notifications={notifications}
          lng={lng}
          translations={translations}
          blockActions={maintenance ? false : maintenance}
          user={user}
        >
          {maintenance ? maintenanceRenderer : children}
        </DashboardLayout>
      </Suspense>
    </HydrateClient>
  );
}
