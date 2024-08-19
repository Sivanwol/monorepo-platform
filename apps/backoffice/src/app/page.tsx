
import { useTranslation } from "./i18n/client";
import { redirect } from "next/navigation";


// export const runtime = "edge";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below

  // void api.post.all.prefetch();
  redirect('/en')
}
