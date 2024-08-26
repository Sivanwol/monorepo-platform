import { Suspense } from "react";

import { LoadingPage } from "@app/ui";
import type { PageCommonProps } from "@app/utils";
import { t, initTranslation } from "@app/utils";


export const runtime = "edge";

export default async function HomePage({
  params: { lng },
}: PageCommonProps) {
  // You can await this here if you don't want to show Suspense fallback below
  await initTranslation(lng);
  // void api.post.all.prefetch();
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {t('home', 'title')}
        </h1>
        <div className="w-full max-w-2xl overflow-y-scroll">
          <Suspense fallback={<LoadingPage />}>
            {t('home', 'title')}
          </Suspense>
        </div>
      </div>
    </main>
  );
}
