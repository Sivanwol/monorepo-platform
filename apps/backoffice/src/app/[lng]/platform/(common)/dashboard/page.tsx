import { Suspense } from "react";

import useTranslations from "~/app/i18n";
import { LoadingPage } from "@app/ui";
import { HydrateClient } from "~/trpc/server";

export const runtime = "edge";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch();

  const { t } = await useTranslations('en', 'home');
  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-primary">T3</span> Turbo
          </h1>
          <div className="w-full max-w-2xl overflow-y-scroll">
            <Suspense
              fallback={<LoadingPage />}
            >

              {t('title')}
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
