import { Suspense } from "react";

import type { ColumnTableProps, PageCommonProps } from "@app/utils";
import { LoadingPage, UserTestPage } from "@app/ui";
import { initTranslation, t } from "@app/utils";

import { api, HydrateClient } from "~/trpc/server";

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
    },
    {
      id: "lastName",
      title: "Last Name",
      type: "string",
    },
    {
      id: "age",
      title: "Age",
      type: "number",
    },
    {
      id: "status",
      title: "Status",
      type: "string",
    },
  ];
  return (
    <HydrateClient>
      <main className="container h-screen w-full py-16" style={{ zIndex: -1 }}>
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            {t("support", "title")}
          </h1>
          <div className="w-full overflow-y-scroll">
            <Suspense fallback={<LoadingPage />}>
              <UserTestPage columns={columns} />
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
