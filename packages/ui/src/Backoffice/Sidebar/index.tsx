"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "flowbite-react";

import { ClickOutside } from "@app/ui";

import type { MenuGroup, SidebarProps } from "./type";

export * from "./type";
export const SidebarArea = ({
  sidebarOpen,
  setSidebarOpen,
  items,
}: SidebarProps) => {
  const renderSideItemNoCollapsed = (item: MenuGroup) => (
    <Sidebar.Item href={item.route} icon={item.icon}>
      {item.label}
    </Sidebar.Item>
  );
  const renderSideItemWithChildren = (item: MenuGroup) => (
    <Sidebar.Collapse icon={item.icon} label={item.label}>
      {item.items.map((t) => (
        <Sidebar.Item href={t.route}>{t.label}</Sidebar.Item>
      ))}
    </Sidebar.Collapse>
  );
  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`z-9999 w-72.5 border-stroke dark:border-stroke-dark dark:bg-gray-dark absolute left-0 top-0 flex h-screen flex-col overflow-y-hidden border-r bg-white lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="py-5.5 lg:py-6.5 flex items-center justify-between gap-2 px-6 xl:py-10">
          <Link href="/">
            <Image
              width={176}
              height={32}
              src={"/images/logo/logo-dark.svg"}
              alt="Logo"
              priority
              className="dark:hidden"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              width={176}
              height={32}
              src={"/images/logo/logo.svg"}
              alt="Logo"
              priority
              className="hidden dark:block"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
            title="Toggle Sidebar"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <Sidebar aria-label="Default sidebar example">
          <Sidebar.Items>
            {items.map((group, groupIndex) => (
              <Sidebar.ItemGroup>
                {group.items.length === 0 && renderSideItemNoCollapsed(group)}
                {group.items.length > 0 && renderSideItemWithChildren(group)}
              </Sidebar.ItemGroup>
            ))}
          </Sidebar.Items>
        </Sidebar>
      </aside>
    </ClickOutside>
  );
};
