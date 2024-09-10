import { Suspense } from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";

import type { PageCommonProps } from "@app/utils";
import { LoadingPage, UserProfilePage } from "@app/ui";
import { genders, initTranslation, t } from "@app/utils";

import { api, HydrateClient } from "~/trpc/server";

export default async function HomePage({ params: { lng } }: PageCommonProps) {
  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch();

  const user = await api.auth.getUser();
  console.log("lng", lng);
  await initTranslation(lng);
  const translation = {
    firstName: t("userProfile", "firstName"),
    lastName: t("userProfile", "lastName"),
    email: t("userProfile", "email"),
    gender: t("userProfile", "gender"),
    aboutMe: t("userProfile", "aboutMe"),
    actionEdit: t("userProfile", "actions.edit"),
    actionView: t("userProfile", "actions.view"),
    actionSubmit: t("userProfile", "actions.submit"),
    actionCancel: t("userProfile", "actions.cancel"),
    errorFirstName: t("userProfile", "errors.firstName"),
    errorLastName: t("userProfile", "errors.lastName"),
    errorEmail: t("userProfile", "errors.email"),
  };
  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            {t("userProfile", "title")}
          </h1>
          <div className="w-full max-w-2xl overflow-y-scroll">
            <Suspense fallback={<LoadingPage />}>
              <UserProfilePage
                userId={user.id}
                actorUserId={user.id}
                lng={lng}
                ns="userProfile"
                translations={translation}
                user={{
                  firstName: user.firstName ?? "",
                  lastName: user.lastName ?? "",
                  email: user.email ?? "",
                  gender: user.gender ?? genders[0],
                  aboutMe: user.aboutMe ?? "",
                }}
              />
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
