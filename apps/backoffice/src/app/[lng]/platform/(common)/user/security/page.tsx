import { Suspense } from "react";

import type { ColumnTableProps, PageCommonProps } from "@app/utils";
import { LoadingPage, UserHistoryPage } from "@app/ui";
import { initTranslation, t } from "@app/utils";

import { api, HydrateClient } from "~/trpc/server";

// export const runtime = "edge";
export default async function HomePage({ params: { lng } }: PageCommonProps) {
  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch();
  const user = await api.auth.getUser();
  console.log("lng", lng);
  const ns = "table";
  console.log("lng", lng, ns);
  await initTranslation(lng);
  const res = await api.user.securityAudit(user.id);
  const translations = {
    rowsPerPage: t(ns, "rawPerPage"),
    export: t(ns, "export"),
    rowActions: t(ns, "rowActions"),
    loading: t(ns, "loading"),
    actions: t(ns, "actions"),
    reload: t(ns, "reload"),
    noData: t(ns, "noData"),
  };
  const columns: ColumnTableProps[] = [
    {
      id: "device",
      title: "Device",
      type: "string",
      sort: false,
      group: false,
    },
    {
      id: "browser",
      title: "Browser",
      type: "string",
      sort: false,
      group: false,
    },
    {
      id: "os",
      title: "OS",
      type: "string",
      sort: false,
      group: false,
    },
    {
      id: "remoteAddress",
      title: "IP Address",
      type: "string",
      sort: false,
      group: false,
    },
    {
      id: "occurred",
      title: "Occurred",
      type: "date",
      dateFormat: "MM/dd/yyyy HH:mm:ss",
      sort: false,
      group: false,
    },
  ];
  return (
    <HydrateClient>
      <main className="container h-screen w-full py-16" style={{ zIndex: -1 }}>
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            {t("userHistory", "title")}
          </h1>
          <div className="w-full overflow-y-scroll">
            <Suspense fallback={<LoadingPage />}>
              <UserHistoryPage
                columns={columns}
                data={res?.entities ?? []}
                totalRecords={res?.total ?? 0}
                lng={lng}
                ns="table"
                translations={translations}
                userId={user.id}
              />
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
