import { Suspense } from "react";

import type { PageCommonProps } from "@app/utils";
import { LoadingPage, SupportAndHelp } from "@app/ui";
import { initTranslation, t } from "@app/utils";

import { api, HydrateClient } from "~/trpc/server";
import { AuditManagement } from "@descope/nextjs-sdk";

export const runtime = "edge";
export default async function HomePage({ params: { lng } }: PageCommonProps) {
  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch();
  // const user = await api.auth.getUser();
  // const aduit = await api.user.securityAudit(user.id);
  console.log("lng", lng);
  await initTranslation(lng);
  return (
    <HydrateClient>
      <main className="container h-screen py-16 w-full" style={{ zIndex: -1 }}>
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            {t("support", "title")}
          </h1>
          <div className="w-full max-w-2xl overflow-y-scroll">
            <Suspense fallback={<LoadingPage />}>
              <AuditManagement
                tenant="T2lLM64ZZh1o1nAjWuWmSw1iA1Mu"
                widgetId="audit-management-widget"
              />
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
