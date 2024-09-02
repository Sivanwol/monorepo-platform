import type { Metadata } from "next";
import { Suspense } from "react";

import type { ColumnTableProps, PageCommonProps } from "@app/utils";
import { LoadingPage, TableProvider, UserTestPage } from "@app/ui";
import { initTranslation, t } from "@app/utils";

import { api, HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Backoffice of monorepo Platform - User Test",
  description: "Backoffice of monorepo Platform For both mobile and web app",
};

// export const runtime = "edge";
export default async function HomePage({ params: { lng } }: PageCommonProps) {
  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch();
  const ns = "table";
  console.log("lng", lng, ns);
  await initTranslation(lng);
  const translations = {
    title: t(ns, "title"),
    rowsPerPage: t(ns, "rawPerPage"),
    export: t(ns, "export"),
    rowActions: t(ns, "rowActions"),
    actions: t(ns, "actions"),
    reload: t(ns, "reload"),
    noData: t(ns, "noData"),
  };
  const columns: ColumnTableProps[] = [
    {
      id: "firstName",
      title: "First Name",
      type: "string",
      sort: true,
      group: false,
    },
    {
      id: "lastName",
      title: "Last Name",
      type: "string",
      sort: true,
      group: false,
    },
    {
      id: "age",
      title: "Age",
      type: "number",
      sort: true,
      group: false,
    },
    {
      id: "status",
      title: "Status",
      type: "string",
      group: false,
    },
  ];
  return (
    <HydrateClient>
      <main className="container h-screen w-full py-16" style={{ zIndex: -1 }}>
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            {t("userTest", "title")}
          </h1>
          <div className="w-full overflow-y-scroll">
            <Suspense fallback={<LoadingPage />}>
              <TableProvider>
                <UserTestPage
                  columns={columns}
                  lng={lng}
                  ns="table"
                  translations={translations}
                />
              </TableProvider>
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
