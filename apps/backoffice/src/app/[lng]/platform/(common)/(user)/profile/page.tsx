import { Suspense } from "react";

import type { PageCommonProps } from "@app/utils";
import { LoadingPage, SupportAndHelp } from "@app/ui";
import { initTranslation, t } from "@app/utils";

import { HydrateClient } from "~/trpc/server";

export const runtime = "edge";
export default async function HomePage({ params: { lng } }: PageCommonProps) {
  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch();

  console.log("lng", lng);
  await initTranslation(lng);
  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            {t("support", "title")}
          </h1>
          <div className="w-full max-w-2xl overflow-y-scroll">
            <Suspense fallback={<LoadingPage />}>
              <SupportAndHelp lng={lng} ns="support" />
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
