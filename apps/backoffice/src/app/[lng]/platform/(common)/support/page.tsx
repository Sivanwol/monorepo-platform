import { Suspense } from "react";

import { LoadingPage, SupportAndHelp } from "@app/ui";
import { HydrateClient } from "~/trpc/server";
import { t, initTranslation, translationsLoaded } from "@app/utils";
import type { PageCommonProps } from "@app/utils";

export const runtime = "edge";
export default async function HomePage({
  params: { lng },
}: PageCommonProps) {
  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch();

  console.log("lng", lng);
  await initTranslation(lng, 'support');
  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            {t('title')}
          </h1>
          <div className="w-full max-w-2xl overflow-y-scroll">
            <Suspense
              fallback={<LoadingPage />}
            >
              {translationsLoaded ? <SupportAndHelp lng={lng} /> : <LoadingPage />}
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
