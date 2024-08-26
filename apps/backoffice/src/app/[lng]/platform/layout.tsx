

import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { session } from "@descope/nextjs-sdk/server";
import type { MenuGroup } from "@app/ui"
import { DashboardLayout, LoadingPage } from "@app/ui";
import { api, HydrateClient } from "~/trpc/server";
import type { LayoutCommonProps } from "@app/utils";
import { t, initTranslation } from "@app/utils";
import type { NotificationModel } from "@app/db/client";

export const metadata: Metadata = {
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
};

export default async function PlatformLayout({
  children,
  params: { lng },
}: LayoutCommonProps) {
  const menuGroups: MenuGroup[] = [
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
        { label: "Plans", route: `/${lng}/platform/subscriptions/plans`, icon: null },
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
        { label: "Analytics", route: `/${lng}/platform/reports/analytics`, icon: null },
        { label: "Sales", route: `/${lng}/platform/reports/sales`, icon: null },
      ],
    },
  ];
  const currSession = session();
  await initTranslation(lng);
  const currentNS = 'dashboardLayout';
  console.log("layout session", currSession);
  if (!currSession) {
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
  let maintenanceRenderer = <></>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (maintenance) {
    maintenanceRenderer = <div className="flex flex-col rounded-md bg-gray-100">
      <div className="rounded-t-md bg-gray-200 p-4 font-bold">
        Platform on Maintenance Mode please contact the platform admin
      </div>
    </div>
  }
  let notifications: NotificationModel[] = [];
  if (!maintenance) {
    try {
      const res: { items: NotificationModel[] } = await api.notifications.getLastNotification();

      notifications = res.items ?? [];
    } catch (error) {
      // Handle the error case
      console.error("Error fetching notifications:", error);
      notifications = []; // or any other default value
    }
  }
  const translations = {
    title: t(currentNS, 'title'),
    dashboard: t(currentNS, 'dashboard'),
    shortTitle: t(currentNS, 'shortTitle'),
    support: t(currentNS, 'support'),
    "toggleSidebar": t(currentNS, 'toggle-sidebar'),
    "userSettings": t(currentNS, 'user.settings'),
    "userProfile": t(currentNS, 'user.profile'),
    "userLogout": t(currentNS, 'user.logout'),
    "notificationsTitle": t(currentNS, 'notifications.title'),
    "notificationsMarkAll": t(currentNS, 'notifications.mark-all'),
    "notificationsViewAll": t(currentNS, 'notifications.view-all'),
    "notificationsEmpty": t(currentNS, 'notifications.empty'),
    "notificationsNew": t(currentNS, 'notifications.new', { count: notifications.length }),
  }
  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch();
  const userData = await api.auth.getUser();
  return (
    <HydrateClient>
      <Suspense fallback={<LoadingPage />}>
        <DashboardLayout
          sideMenuItems={maintenance ? [] : menuGroups}
          notifications={notifications}
          lng={lng}
          translations={translations}
          blockActions={maintenance ? [] : maintenance}
          user={{
            userAvatar: "https://ui-avatars.com/api/?format=png",
            fullname: `${userData?.firstName} ${userData?.lastName}`,
            profileLink: "en/platform/user/me",
            settingsLink: "en/platform/user/settings"
          }}
        >
          {maintenance ? maintenanceRenderer : children}
        </DashboardLayout>
      </Suspense>
    </HydrateClient>
  );
}
