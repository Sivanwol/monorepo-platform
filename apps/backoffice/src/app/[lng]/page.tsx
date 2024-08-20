import { Suspense } from "react";

import { LoadingPage } from "@app/ui";
import type { PageCommonProps } from "~/type";
import { t, initTranslation } from "~/locales/translations";


export const runtime = "edge";

export default async function HomePage({
  params: { lng },
}: PageCommonProps) {
  // You can await this here if you don't want to show Suspense fallback below
  await initTranslation(lng, 'home');
  // void api.post.all.prefetch();
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {t('title')}
        </h1>
        <div className="w-full max-w-2xl overflow-y-scroll">
          <Suspense fallback={<LoadingPage />}>
            {t('title')}11
          </Suspense>
        </div>
      </div>
    </main>
  );
}
