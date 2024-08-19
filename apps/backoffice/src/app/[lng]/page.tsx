import { Suspense } from "react";

import { LoadingPage } from "@app/ui";

import { api, HydrateClient } from "~/trpc/server";
import useTranslations from "../i18n";


// export const runtime = "edge";

export default async function HomePage({ params: { lng } }: { params: { lng: string } }) {
  // You can await this here if you don't want to show Suspense fallback below

  // void api.post.all.prefetch();
  const { t } = await useTranslations('en', 'home');
  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            {t('title')}
          </h1>
          <div className="w-full max-w-2xl overflow-y-scroll">
            <Suspense fallback={<LoadingPage />}>
              <h1>{t('title')}</h1>11
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
