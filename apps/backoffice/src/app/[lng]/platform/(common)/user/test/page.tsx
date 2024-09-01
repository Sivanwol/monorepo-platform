import type { Metadata } from "next";
import { Suspense } from "react";

import type { ColumnTableProps, PageCommonProps } from "@app/utils";
import { LoadingPage, SortByProvider, UserTestPage } from "@app/ui";
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
  console.log("lng", lng);
  await initTranslation(lng);
  const columns: ColumnTableProps[] = [
    {
      id: "firstName",
      title: "First Name",
      type: "string",
      group: false,
    },
    {
      id: "lastName",
      title: "Last Name",
      type: "string",
      group: false,
    },
    {
      id: "age",
      title: "Age",
      type: "number",
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
              <SortByProvider>
                <UserTestPage columns={columns} />
              </SortByProvider>
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
