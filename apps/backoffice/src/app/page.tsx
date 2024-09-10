import { redirect } from "next/navigation";

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below

  // void api.post.all.prefetch();
  redirect("/en");
}
