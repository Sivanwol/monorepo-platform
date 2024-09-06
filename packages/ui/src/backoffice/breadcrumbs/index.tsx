"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { BreadcrumbProps } from "@app/utils";

export const Breadcrumb = ({ homepageTitle }: BreadcrumbProps) => {
  const pathname = usePathname();
  const BreadcrumbsArray = pathname.split("/");
  BreadcrumbsArray.shift();
  console.log(BreadcrumbsArray);
  return (
    <div className="m-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <nav>
        <ol className="flex items-center gap-2" key="breadcrumbs_root">
          {BreadcrumbsArray.map((item, index) => {
            const href = "/" + BreadcrumbsArray.slice(0, index + 1).join("/");
            if (index === 0) {
              return;
            }
            return (
              <>
                <li key={index}>
                  <Link className="font-medium" href={href}>
                    {item === "platform" ? homepageTitle : item}
                  </Link>
                </li>
                <li className="font-medium text-primary" key={index + "_space"}>
                  {index < BreadcrumbsArray.length - 1 && <h4> {">"} </h4>}
                </li>
              </>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};
