/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SidebarDropdown = ({ items }: any) => {
  const pathname = usePathname();

  return (
    <>
      <ul className="my-2 flex flex-col gap-1.5 pl-9">
        {items.map((item: any, index: number) => (
          <li key={index}>
            <Link
              href={item.route}
              className={`relative flex rounded-[7px] px-3.5 py-2 font-medium duration-300 ease-in-out ${
                pathname === item.route
                  ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
                  : "text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              {item.label}
              {item.pro && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-primary px-1.5 py-px text-[10px] font-medium leading-[17px] text-white">
                  Pro
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
